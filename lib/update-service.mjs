// 固定更新来源、随包日志校验及 npm / GitHub 有界 JSON 读取。
export const STABLE_REPOSITORY = 'RabbitStudioChino/dsh-big-fish-aio'
export const BETA_REPOSITORY = 'CHINOSAMAAA/dsh-big-fish-aio-demo'
export const UPDATE_PACKAGE = 'dsh-big-fish-aio'
export const UPDATE_REGISTRY = 'https://registry.npmmirror.com'
export const fullCommit = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value)
const stableVersion = value => typeof value === 'string' && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)
const assert = (condition, message) => { if (!condition) throw Error('更新数据无效：' + message) }
const text = (value, limit = 16000) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit
export function httpsUrl(value) {
  if (typeof value !== 'string') return false
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}
function identity(data, channel = 'stable', allowDraft = false) {
  assert(data && data.schemaVersion === 1 && data.channel === channel, 'schemaVersion 或 channel')
  assert(channel === 'beta' ? fullCommit(data.releaseId) && (data.version === null || stableVersion(data.version))
    : stableVersion(data.version) && data.releaseId === 'v' + data.version, 'releaseId 与 version')
  assert(allowDraft && data.publishedAt === '__PUBLISHED_AT__' || text(data.publishedAt, 64) && /(?:Z|[+-]\d{2}:\d{2})$/.test(data.publishedAt) && Number.isFinite(Date.parse(data.publishedAt)), 'publishedAt 必须包含时区')
}
export function validateChangelog(data, expected, { allowDraft = false } = {}) {
  identity(data, expected?.channel || 'stable', allowDraft)
  assert(!expected || data.releaseId === expected.releaseId && (expected.version === undefined || data.version === expected.version), '日志与版本不对应')
  assert(text(data.title, 300) && Array.isArray(data.sections) && data.sections.length <= 30, 'title 或 sections')
  assert(data.summary === undefined || typeof data.summary === 'string' && data.summary.length <= 16000, 'summary')
  const sections = new Set(), items = new Set()
  for (const section of data.sections) {
    assert(section && text(section.id, 100) && !sections.has(section.id) && text(section.title, 300) && Array.isArray(section.items), '分类')
    sections.add(section.id)
    for (const item of section.items) {
      assert(item && text(item.id, 100) && !items.has(item.id) && items.size < 1000 && text(item.title, 500), '条目 id 或 title')
      items.add(item.id)
      for (const field of ['module', 'description']) assert(item[field] === undefined || typeof item[field] === 'string' && item[field].length <= 16000, field)
      assert(item.links === undefined || Array.isArray(item.links) && item.links.length <= 20, 'links')
      for (const link of item.links || []) assert(link && text(link.label, 300) && httpsUrl(link.url), '链接必须使用 HTTPS')
    }
  }
  return data
}

// 缓存只保存通过读取上限和 JSON 解析的响应，调用方每次仍核验对应版本。
export function createUpdateReader({ timeout = 10000, maxBytes = 512 * 1024, ttl = 30 * 60000 } = {}) {
  const cache = new Map(), pending = new Map()
  return async function read(url, { force = false, signal, headers = {}, validate = value => value } = {}) {
    if (!httpsUrl(url)) throw Error('更新地址必须使用 HTTPS')
    signal?.throwIfAborted()
    const key = url + JSON.stringify(headers)
    const previous = cache.get(key)
    if (!force && previous && Date.now() - previous.at < ttl) return validate(previous.data)
    // 带独立取消信号的请求不与其他调用共用取消生命周期。
    if (!signal && pending.has(key)) return validate(await pending.get(key))
    const operation = (async () => {
      const response = await fetch(url, { redirect: 'error', cache: 'no-store', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(timeout)]) : AbortSignal.timeout(timeout),
        headers: { accept: 'application/json', ...headers, ...(previous?.etag ? { 'if-none-match': previous.etag } : {}) } })
      let data
      if (response.status === 304) {
        if (!previous) throw Error('更新服务返回 304，但没有本地缓存')
        data = previous.data
      } else {
        if (!response.ok) throw Object.assign(Error('更新服务 HTTP ' + response.status), { status: response.status })
        if (Number(response.headers?.get('content-length')) > maxBytes) throw Error('更新响应超过大小限制')
        const chunks = []; let size = 0
        if (response.body) {
          for await (const chunk of response.body) {
            signal?.throwIfAborted()
            size += chunk.length
            if (size > maxBytes) throw Error('更新响应超过大小限制')
            chunks.push(Buffer.from(chunk))
          }
          data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        } else {
          // 兼容旧宿主的 fetch 适配器，真实网络响应走上面的流式限制。
          data = await response.json()
          if (Buffer.byteLength(JSON.stringify(data)) > maxBytes) throw Error('更新响应超过大小限制')
        }
      }
      signal?.throwIfAborted()
      validate(data)
      cache.set(key, { data, at: Date.now(), etag: response.headers?.get('etag') || previous?.etag })
      return data
    })()
    if (!signal) pending.set(key, operation)
    try { return validate(await operation) }
    catch (error) { if (previous) previous.at = 0; throw error }
    finally { if (!signal) pending.delete(key) }
  }
}
export function updateTarget(update) {
  return update?.ok ? [update.channel, update.channel === 'beta' ? '' : update.latest, update.latestCommit || ''].join(':') : null
}
