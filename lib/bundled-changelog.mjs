import { readFileSync, statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { validateChangelog } from './update-service.mjs'

const releasePattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const maxBytes = 512 * 1024

export function readBundledRelease(packageRoot, action, releaseId, signal) {
  signal?.throwIfAborted()
  const version = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')).version
  const current = 'v' + version
  const read = (id, allowDraft = id === current) => {
    if (!releasePattern.test(id)) throw Error('无效的本地日志版本')
    const path = join(packageRoot, 'update', 'changelog-' + id + '.json')
    if (statSync(path).size > maxBytes) throw Error('本地更新日志超过大小限制')
    const text = readFileSync(path, 'utf8')
    if (Buffer.byteLength(text) > maxBytes) throw Error('本地更新日志超过大小限制')
    signal?.throwIfAborted()
    return validateChangelog(JSON.parse(text), { channel: 'stable', releaseId: id, version: id.slice(1) }, { allowDraft })
  }
  if (releaseId && !releasePattern.test(releaseId)) throw Error('无效的本地日志版本')
  try {
    if (action === 'changelog') {
      const changelog = read(releaseId || current)
      return { ok: true, status: 'ready', source: 'bundled', draft: changelog.publishedAt === '__PUBLISHED_AT__', changelog }
    }
    const ids = readdirSync(join(packageRoot, 'update'), { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.startsWith('changelog-') && entry.name.endsWith('.json'))
      .map(entry => entry.name.slice(10, -5)).filter(id => releasePattern.test(id))
    if (ids.length > 500) throw Error('本地历史版本过多')
    const releases = ids.map(id => read(id, true)).filter(log => log.publishedAt !== '__PUBLISHED_AT__')
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map(({ releaseId, version, channel, title, publishedAt, summary }) => ({ releaseId, version, channel, title, publishedAt, ...(summary ? { summary } : {}) }))
    return { ok: true, status: 'ready', source: 'bundled', releases }
  } catch (error) {
    signal?.throwIfAborted()
    return { ok: true, status: 'unavailable', source: 'bundled', message: error.code === 'ENOENT' ? '当前安装包未包含此版本的更新日志' : '随包更新日志无效，请重试或重新安装', releases: [] }
  }
}
