// 派生自 Yuuyuko-uu/dsh-qq-link；RabbitStudio 修改：整合包更新、来源校验、安装串行和鉴权。
// 国内渠道获取本项目 npm 发布包；GitHub 渠道追踪 repository 对应仓库的 main。
// 检测失败如实报告；本地开发副本禁止自动安装，避免覆盖工作目录。
import { readFileSync, mkdtempSync, writeFileSync, rmSync, existsSync, statSync, mkdirSync, chmodSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { createHash, randomUUID } from 'node:crypto'
import { join, dirname } from 'node:path'
import childProcess from 'node:child_process'
import { writeFileAtomicSync } from '../modules/qq/lib/atomic-file.mjs'

const TTL = 5 * 60000
// 失败结果只缓存一分钟：网络恢复后下一次打开面板就能重试，不用等六小时。
const FAIL_TTL = 60 * 1000
const TIMEOUT = 8000
const BETA_GIT_TIMEOUT = 45000
const MIRROR = 'https://registry.npmmirror.com'
// 当前整合包约 18 MB，保留有界下载并覆盖现有资源体积。
const MAX_PACKAGE_BYTES = 32 * 1024 * 1024
const LEGACY_VERSION = '1.5.1-1'
import { STABLE_REPOSITORY, BETA_REPOSITORY, createUpdateReader, updateTarget } from './update-service.mjs'
import { readBundledRelease } from './bundled-changelog.mjs'
const BETA_URL = `https://github.com/${BETA_REPOSITORY}.git`
const 是提交号 = value => /^[a-f0-9]{40}$/.test(String(value || ''))
const errorText = e => {
  const raw = String((e && (e.stderr || e.message)) || e || '').trim()
  if (/timeout|timed out|ETIMEDOUT/i.test(raw)) return '连接更新服务超时，请检查网络或切换更新渠道'
  const line = raw.split('\n').map(x => x.trim()).find(Boolean) || '未知错误'
  return line.length > 180 ? line.slice(0, 180) + '…' : line
}
const channelOf = value => {
  if (!['mirror', 'github', 'beta'].includes(value)) throw new Error('未知更新渠道')
  return value
}
const validVersion = v => /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/.test(v)

function parseVer(v) {
  const s = String(v || '').trim().replace(/^v/i, '').split('+')[0]
  const cut = s.indexOf('-')
  const core = cut >= 0 ? s.slice(0, cut) : s
  const pre = cut >= 0 ? s.slice(cut + 1) : ''
  const nums = core.split('.').map((x) => Number(x) || 0)
  return { nums: [nums[0] || 0, nums[1] || 0, nums[2] || 0], pre }
}

// 1.2.3 / v1.2.3 / 1.2.3-beta.1 都认
export function cmpVer(a, b) {
  const x = parseVer(a)
  const y = parseVer(b)
  for (let i = 0; i < 3; i++) {
    if (x.nums[i] !== y.nums[i]) return x.nums[i] > y.nums[i] ? 1 : -1
  }
  if (x.pre === y.pre) return 0
  if (!x.pre) return 1   // 正式版比预发布新
  if (!y.pre) return -1
  const left = x.pre.split('.'), right = y.pre.split('.')
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === undefined) return -1
    if (right[i] === undefined) return 1
    if (left[i] === right[i]) continue
    const aNum = /^\d+$/.test(left[i]), bNum = /^\d+$/.test(right[i])
    if (aNum && bNum) return BigInt(left[i]) > BigInt(right[i]) ? 1 : -1
    if (aNum !== bNum) return aNum ? -1 : 1
    return left[i] > right[i] ? 1 : -1
  }
  return 0
}

export function createSelfUpdate({ packageRoot, diag }) {
  const instanceId = randomUUID()
  const noop = () => {}
  const log = typeof diag === 'function' ? diag : noop

  let meta = {}
  try {
    meta = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
  } catch (e) {
    log('读自己的 package.json 失败：' + (e && e.message))
  }

  const current = String(meta.version || '')
  const repositoryCurrent = String(meta.repositoryVersion || current)
  const repo = 'https://github.com/' + STABLE_REPOSITORY
  const repoUrl = repo

  // 装在自己的 node_modules 里 = 正常安装；不在 = 本地 link 的开发副本
  const 是开发副本 = !/[\\/]node_modules[\\/]/.test(String(packageRoot))

  const caches = new Map()
  let installStatus = { operationId: null, active: false, progress: 0, message: '' }
  const reportInstall = (progress, message) => { installStatus = { ...installStatus, progress, message } }
  let installing = false

  const github = STABLE_REPOSITORY
  const readUpdate = createUpdateReader()
  const inFlight = new Map()
  const 安装记录 = join(packageRoot, '.dsh-installed-commit.json')
  // 保存在 profile 外层，包替换及 pnpm 提交目录变化后仍能读取来源和凭据。
  const stateRoot = packageRoot.split(/[\\/]node_modules[\\/]/)[0] === packageRoot
    ? process.env.DSH_HOME || join(homedir(), '.dsh')
    : packageRoot.split(/[\\/]node_modules[\\/]/)[0]
  const statePath = join(stateRoot, 'big-fish-update.json')
  let state = {}, stateError = ''
  const readState = () => {
    try {
      const next = JSON.parse(readFileSync(statePath, 'utf8'))
      if (!next || typeof next !== 'object' || Array.isArray(next)) throw Error('配置必须为对象')
      if (JSON.stringify(next) !== JSON.stringify(state)) caches.clear()
      state = next
      stateError = ''
    } catch (error) {
      stateError = error.code === 'ENOENT' ? '' : '更新配置无法读取，请修复本机 big-fish-update.json'
      if (Object.keys(state).length) caches.clear()
      state = {}
    }
  }
  readState()
  const saveState = next => {
    if (stateError) throw Error(stateError)
    mkdirSync(stateRoot, { recursive: true })
    if (existsSync(statePath)) chmodSync(statePath, 0o600)
    writeFileAtomicSync(statePath, JSON.stringify(next))
    state = next
    caches.clear()
  }

  const 跑Git = (args, timeout = TIMEOUT, token) => new Promise((resolve, reject) => {
    childProcess.execFile('git', args, {
      timeout, maxBuffer: 65536, windowsHide: true,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...(token ? {
        GIT_CONFIG_COUNT: '3',
        GIT_CONFIG_KEY_0: `http.${BETA_URL}.extraHeader`,
        GIT_CONFIG_VALUE_0: 'Authorization: Basic ' + Buffer.from('x-access-token:' + token).toString('base64'),
        GIT_CONFIG_KEY_1: 'http.followRedirects', GIT_CONFIG_VALUE_1: 'false',
        GIT_CONFIG_KEY_2: 'credential.helper', GIT_CONFIG_VALUE_2: '',
      } : {}) },
    }, (failure, stdout, stderr) => failure
      ? reject(Object.assign(failure, { stderr: String(stderr || failure.stderr || '').trim() }))
      : resolve(String(stdout)))
  })

  // 从 pnpm-lock / .modules.yaml / package-lock 里找出当前装的是哪个提交。
  const 读到的提交 = (text, owner, name) => {
    const patterns = [
      new RegExp(`codeload\\.github\\.com/${owner}/${name}/tar\\.gz/([a-f0-9]{40})`, 'i'),
      new RegExp(`github:${owner}/${name}#([a-f0-9]{40})`, 'i'),
      new RegExp(`github\\.com/${owner}/${name}(?:\\.git)?#([a-f0-9]{40})`, 'i'),
    ]
    for (const pattern of patterns) {
      const found = pattern.exec(text)
      if (found) return found[1].toLowerCase()
    }
    return null
  }

  function 从安装记录读取提交() {
    if (!github) return null
    const files = ['pnpm-lock.yaml', '.modules.yaml', 'package-lock.json', join('node_modules', '.package-lock.json'), join('.pnpm', 'lock.yaml')]
    let dir = packageRoot
    for (let depth = 0; depth < 6; depth++) {
      for (const rel of files) {
        const file = join(dir, rel)
        try {
          if (!existsSync(file)) continue
          const text = readFileSync(file, 'utf8')
          for (const repository of [BETA_REPOSITORY, github]) {
            const [owner, name] = repository.split('/')
            const commit = 读到的提交(text, owner, name)
            if (commit) return { commit, channel: repository === BETA_REPOSITORY ? 'beta' : 'github', from: rel }
          }
        } catch (e) { log('读取安装记录失败：' + errorText(e)) }
      }
      const parent = dirname(dir)
      if (parent === dir) break
      dir = parent
    }
    return null
  }

  async function installation() {
    readState()
    const locked = 从安装记录读取提交()
    const local = await 本地提交()
    let declared
    try {
      const profile = JSON.parse(readFileSync(join(stateRoot, 'package.json'), 'utf8'))
      const spec = profile.dependencies?.[meta.name] || profile.devDependencies?.[meta.name]
      if (typeof spec === 'string') {
        if (/^(?:github:|git\+https:\/\/github\.com\/|https:\/\/github\.com\/)CHINOSAMAAA\/dsh-big-fish-aio-demo(?:\.git)?(?:#|$)/i.test(spec)) declared = 'beta'
        else if (/^(?:github:|git\+https:\/\/github\.com\/|https:\/\/github\.com\/)RabbitStudioChino\/dsh-big-fish-aio(?:\.git)?(?:#|$)/i.test(spec)) declared = 'github'
        else if (/^(?:[~^<>=*\dv]|latest|next|beta|npm:)/.test(spec)) declared = 'mirror'
      }
    } catch {}
    const channel = declared || state.installed?.channel || locked?.channel || (local ? 'github' : 'mirror')
    return { channel: channelOf(channel), commit: state.installed?.commit || locked?.commit || local?.commit || null }
  }

  async function version() {
    const latest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
    const installed = await installation()
    // 宿主可能延后重载，或仍由旧 pnpm 目录响应请求，已成功安装的记录优先。
    const saved = state.installed?.channel === installed.channel ? state.installed : null
    let version = String(latest.version || current)
    let repositoryVersion = String(latest.repositoryVersion || latest.version || repositoryCurrent)
    const savedNpm = installed.channel === 'mirror' ? saved?.version : saved?.npmVersion
    if (validVersion(savedNpm) && cmpVer(savedNpm, version) > 0) version = savedNpm
    if (installed.channel !== 'mirror' && validVersion(saved?.version) && cmpVer(saved.version, repositoryVersion) > 0) repositoryVersion = saved.version
    // 兼容由旧版安装器完成的更新，它只记录 installed 而没有 pendingLog。
    const previous = state.installed
    const pending = state.pendingLog || (previous && {
      targetId: updateTarget({ ok: true, channel: previous.channel, latest: previous.version, latestCommit: previous.commit }),
      channel: previous.channel, version: previous.npmVersion || previous.version, commit: previous.commit,
    })
    // 仅由重新加载后的插件展示，避免旧实例拿旧包日志冒充更新结果。
    const postUpdate = pending && pending.sourceInstance !== instanceId && latest.version === pending.version &&
      !state.viewedLogs?.includes(pending.targetId) ? {
        ok: true, postInstall: true, channel: pending.channel, current: pending.version, latest: pending.version,
        releaseId: 'v' + pending.version, latestCommit: pending.commit, targetId: pending.targetId,
      } : null
    return { ok: true, version, repositoryVersion, packageVersion: latest.version, postUpdate, installedChannel: installed.channel,
      displayVersion: installed.channel === 'beta' ? repositoryVersion : version,
      installedCommit: installed.channel !== 'mirror' && 是提交号(installed.commit) ? installed.commit : null,
      channel: state.channel || installed.channel, betaConfigured: Boolean(state.token), betaRepository: BETA_REPOSITORY }
  }

  async function fetchBeta(token = state.token) {
    if (!token) return { latest: null, error: '请先输入内测仓库的 GitHub Token' }
    let stage = 'Git 查询 main'
    try {
      const refs = await 跑Git(['ls-remote', '--exit-code', BETA_URL, 'refs/heads/main'], BETA_GIT_TIMEOUT, token)
      const sha = refs.trim().split(/\s+/)[0]
      if (!是提交号(sha)) throw Error('提交号无效')
      stage = 'GitHub 版本信息请求'
      const body = await readUpdate(`https://api.github.com/repos/${BETA_REPOSITORY}/contents/package.json?ref=${sha}`, {
        force: true, headers: { accept: 'application/vnd.github+json', authorization: 'Bearer ' + token },
      })
      if (body.encoding !== 'base64' || typeof body.content !== 'string' || body.content.length > 131072) throw Error('版本信息无效')
      const remote = JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'))
      if (remote.name !== meta.name || !validVersion(remote.version) || !validVersion(remote.repositoryVersion || remote.version)) throw Error('内测包名或版本无效')
      return { latest: remote.repositoryVersion || remote.version, npmVersion: remote.version, commit: sha, branch: 'main', from: 'GitHub 内测版' }
    } catch (error) {
      // Git stderr 可能包含鉴权内容，私有请求只返回固定错误。
      const timedOut = error.killed || ['TimeoutError', 'AbortError'].includes(error.name) || error.cause?.code === 'ETIMEDOUT'
      const reason = error.status ? ({ 401: 'Token 无效或已过期', 403: '访问被拒绝', 404: 'Token 无权读取指定仓库或提交' }[error.status] || 'GitHub 请求失败') + '（HTTP ' + error.status + '）' : timedOut ? `${stage}超时（${stage === 'Git 查询 main' ? BETA_GIT_TIMEOUT / 1000 : TIMEOUT / 1000} 秒），请检查网络后重试`
        : stage === 'Git 查询 main' ? 'Git 连接失败，请检查网络、Git 配置及仓库读取权限' : 'GitHub 版本信息读取或校验失败，请重试'
      return { latest: null, error: '无法读取内测仓库：' + reason }
    }
  }

  async function configureBeta(body) {
    if (!body || Object.keys(body).some(key => !['token', 'repository'].includes(key)) ||
        (body.repository !== undefined && body.repository !== BETA_REPOSITORY)) throw Error('内测仅支持 ' + BETA_REPOSITORY + '，拒绝其他仓库')
    if (typeof body.token !== 'string' || !/^[A-Za-z0-9_]{20,255}$/.test(body.token)) throw Error('请输入有效的 GitHub Token')
    if (installing) throw Error('已有更新操作正在进行')
    installing = true
    try {
      const result = await fetchBeta(body.token)
      if (!result.latest) throw Error(result.error)
      saveState({ ...state, token: body.token, channel: 'beta' })
      return { ok: true, repository: BETA_REPOSITORY, latest: result.latest }
    } finally { installing = false }
  }

  // 本地当前提交：开发副本读 Git HEAD；安装副本优先读上次安装留下的标记，再读锁文件。
  async function 本地提交() {
    if (existsSync(join(packageRoot, '.git'))) {
      try {
        const head = (await 跑Git(['-C', packageRoot, 'rev-parse', 'HEAD'])).trim()
        if (是提交号(head)) return { commit: head.toLowerCase(), from: 'git' }
      } catch (e) { log('读取本地 Git 提交失败：' + errorText(e)) }
    }
    if (state.installed?.channel !== 'mirror' && 是提交号(state.installed?.commit)) {
      return { commit: state.installed.commit.toLowerCase(), from: '安装来源记录' }
    }
    try {
      const saved = JSON.parse(readFileSync(安装记录, 'utf8'))
      if (是提交号(saved.commit)) return { commit: String(saved.commit).toLowerCase(), from: '安装记录' }
    } catch {}
    return 从安装记录读取提交()
  }

  // Git 副本里判断远端提交是否已经被本地包含（本地领先、还没推）。
  async function 本地包含(commit) {
    try {
      await 跑Git(['-C', packageRoot, 'merge-base', '--is-ancestor', commit, 'HEAD'])
      return true
    } catch { return false }
  }

  const get = url => readUpdate(url, { force: true })
  const 读远端元信息 = async sha => {
      const errors = []
      for (const url of [
        `https://raw.githubusercontent.com/${github}/${sha}/package.json`,
        `https://cdn.jsdelivr.net/gh/${github}@${sha}/package.json`,
      ]) {
        try { return await get(url) } catch (e) { errors.push(errorText(e)) }
      }
      try {
        const body = await get(`https://api.github.com/repos/${github}/contents/package.json?ref=${sha}`)
        if (body && body.encoding === 'base64' && typeof body.content === 'string') {
          return JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'))
        }
        throw new Error('接口返回格式异常')
      } catch (e) { errors.push(errorText(e)) }
      throw new Error('读取仓库 package.json 失败：' + errors.join('；'))
    }

  async function fetchLatest() {
    if (!github) return { latest: null, error: '未配置 GitHub 仓库地址，无法检查更新' }
    try {
      let commit, apiError
      // 只读 main 引用，避免首发根提交的完整 diff 超过响应大小限制。
      try {
        const ref = await get(`https://api.github.com/repos/${github}/git/ref/heads/main?t=${Date.now()}`)
        commit = { sha: ref.object?.sha }
      } catch (error) {
        // 公共出口易触发匿名 API 限流；Git 与宿主的 GitHub 安装使用同一代理环境。
        apiError = error
        try {
          const stdout = await 跑Git(['ls-remote', '--exit-code', `https://github.com/${github}.git`, 'refs/heads/main'])
          commit = { sha: String(stdout).trim().split(/\s+/)[0] }
        } catch (gitError) {
          throw new Error('查询 main 提交失败：GitHub API ' + errorText(apiError) + '；Git ' + errorText(gitError))
        }
      }
      const sha = 是提交号(commit && commit.sha) ? String(commit.sha).toLowerCase() : ''
      if (!sha) throw new Error('GitHub 未返回有效提交号')
      const remote = await 读远端元信息(sha)
      if (remote.name !== meta.name) throw new Error('远端包名与大肥鱼不一致，拒绝更新')
      if (!validVersion(remote.version)) throw new Error('远端版本号不符合 SemVer')
      const latest = remote.version
      if (!validVersion(latest)) throw new Error('远端仓库版本号不符合 SemVer')
      return { latest, npmVersion: remote.version, commit: sha, from: 'GitHub' }
    } catch (e) { return { latest: null, error: errorText(e) } }
  }

  async function check(force, channel) {
    const selected = channel || (await version()).channel
    const pending = inFlight.get(selected)
    if (pending) {
      if (!force || pending.force) return pending.operation
      await pending.operation
      return check(true, selected)
    }
    const operation = checkLatest(force, selected)
    const entry = { force, operation }
    inFlight.set(selected, entry)
    try { return await operation } finally { if (inFlight.get(selected) === entry) inFlight.delete(selected) }
  }

  async function checkLatest(force, channel) {
    const before = await version()
    channel = channel || before.channel
    channelOf(channel)
    const cache = caches.get(channel)
    if (!force && cache && cache.installedChannel === before.installedChannel &&
        cache.current === (channel === 'beta' ? before.repositoryVersion : before.version) && cache.localCommit === before.installedCommit &&
        Date.now() - cache.checkedAt < (cache.ok ? TTL : FAIL_TTL)) return { ...cache, cached: true, reminderDismissed: Boolean(state.dismissedTargets?.includes(cache.targetId)) }
    // GitHub 渠道同时跟踪 main 的提交：仓库版本没升也不能把新推送当成“已是最新”。
    const r = await (channel === 'mirror' ? fetchMirror() : channel === 'beta' ? fetchBeta() : fetchLatest())
    const info = await version()
    const current = channel === 'beta' ? info.repositoryVersion : info.version
    const local = channel === 'mirror' ? null : await 本地提交()
    const sourceChanged = info.installedChannel !== channel
    const switchRequired = (info.installedChannel === 'mirror') !== (channel === 'mirror')
    const legacyRelease = r.latest === LEGACY_VERSION
    const versionNewer = Boolean(channel !== 'beta' && r.latest && current && !legacyRelease && (current === LEGACY_VERSION || cmpVer(r.latest, current) > 0))
    const versionOlder = Boolean(channel !== 'beta' && r.latest && current && current !== LEGACY_VERSION && (legacyRelease || cmpVer(r.latest, current) < 0))
    const localAhead = Boolean(channel !== 'mirror' && local && local.from === 'git' && r.commit && r.commit !== local.commit && await 本地包含(r.commit))
    const ahead = Boolean(versionOlder || localAhead)
    const commitChanged = Boolean(channel !== 'mirror' && r.commit && (!local || local.commit !== r.commit))
    const commitUpdate = Boolean(commitChanged && !ahead && !r.error)
    const hasUpdate = Boolean(!r.error && !ahead && (versionNewer || (channel === 'beta' && commitUpdate)))
    const checked = {
      ok: Boolean(r.latest),
      current,
      repositoryCurrent: info.repositoryVersion,
      npmCurrent: info.version,
      latest: r.latest || null,
      releaseId: channel === 'beta' ? r.commit || null : (r.latest ? 'v' + r.latest : null),
      latestCommit: r.commit || null,
      npmLatest: r.npmVersion || r.latest || null,
      localCommit: local ? local.commit : null,
      localCommitFrom: local ? local.from : null,
      commitChanged,
      commitUpdate,
      integrity: r.integrity || null,
      channel,
      installedChannel: info.installedChannel,
      sourceChanged,
      switchRequired,
      branch: r.branch || (channel === 'github' ? 'main' : null),
      hasUpdate,
      legacyRelease,
      // 本机比仓库还新 —— 自己改过还没推，正常
      ahead,
      error: r.error || null,
      from: r.from || null,
      repoUrl: channel === 'beta' ? 'https://github.com/' + BETA_REPOSITORY : repoUrl || null,
      devCopy: 是开发副本,
      canInstall: !是开发副本,
      checkedAt: Date.now(),
      compatibility: meta.upstreamCompatibility || [],
    }
    const 本地说明 = channel === 'github' ? '（本地提交 ' + (local ? local.commit.slice(0, 7) + '/' + local.from : '未知') + '，远端提交 ' + (r.commit ? r.commit.slice(0, 7) : '未知') + '）' : ''
    log('查更新：当前 ' + current + ' / 最新 ' + (r.latest || '查不到') + (r.from ? '（' + r.from + '）' : '') + 本地说明 + (r.error ? '（' + r.error + '）' : ''))
    checked.targetId = updateTarget(checked)
    checked.reminderDismissed = Boolean(state.dismissedTargets?.includes(checked.targetId))
    caches.set(channel, checked)
    return checked
  }

  async function fetchMirror() {
    try {
      const remote = await readUpdate(`${MIRROR}/${encodeURIComponent(meta.name)}/latest`, { force: true })
      if (remote.name !== meta.name) throw new Error('远端包名与大肥鱼不一致，拒绝更新')
      if (!validVersion(remote.version)) throw new Error('远端版本号不符合 SemVer')
      if (!/^sha512-[A-Za-z0-9+/]{86}==$/.test(remote.dist?.integrity || '')) throw new Error('国内安装包缺少有效 SHA-512 校验信息')
      return { latest: remote.version, integrity: remote.dist.integrity, from: 'npmmirror 国内镜像' }
    } catch (e) { return { latest: null, error: e.status === 404 ? '国内镜像尚无本项目安装包，请等待正式发布' : errorText(e) } }
  }

  // 未在 inject 里声明 pluginManager 时，直接取 ctx.pluginManager 会被宿主拒绝；
  // ctx.get 是宿主给可选服务留的读取口，读不到再兼容旧宿主直接挂在 ctx 上的写法。
  function 取插件管理器(ctx) {
    if (!ctx) return null
    try {
      const found = typeof ctx.get === 'function' ? ctx.get('pluginManager') : null
      if (found) return found
    } catch (e) { log('读取插件管理接口失败：' + errorText(e)) }
    try { return ctx.pluginManager || null } catch { return null }
  }

  async function install(ctx, channel, options = {}) {
    channel = channel || state.channel || (await installation()).channel
    channelOf(channel)
    if (是开发副本) {
      return { ok: false, error: '这是本地开发副本（link: 进来的），一键更新会把你正在改的目录换成仓库里的版本 —— 要更新请在仓库里 git pull' }
    }
    const pm = 取插件管理器(ctx)
    if (!pm || typeof pm.installBundle !== 'function') {
      return { ok: false, error: '这版 DSH 没有插件管理接口，装不了；请手动更新' }
    }
    if (channel === 'github' && !github) return { ok: false, error: '未配置 GitHub 更新来源' }
    let spec, temp
    if (installing) return { ok: false, error: '已有更新正在安装，请稍后' }
    installing = true
    installStatus = { operationId: options.operationId || null, active: true, progress: 0, message: '正在检查更新来源…' }
    try {
      const latest = await check(true, channel)
      if (!latest.ok) return { ok: false, error: latest.error }
      if (options.expectedTarget && options.expectedTarget !== latest.targetId) return { ok: false, targetChanged: true, update: latest, error: '安装目标已变化，请确认最新版本后再次更新' }
      if (latest.switchRequired && options.confirmSourceChange !== true) return { ok: false, error: '是否切换项目拉取方式，可能会因为网络问题拉取失败', confirmationRequired: true }
      if (!latest.hasUpdate && !latest.sourceChanged) return { ok: false, error: '没有可安装的新版本' }
      reportInstall(10, '已确认更新版本，正在准备安装包…')
      // 每次解析 main 的提交，避免同名来源被宿主拒绝或包管理器命中旧缓存。
      if (channel === 'beta') {
        temp = mkdtempSync(join(tmpdir(), 'dsh-big-fish-beta-'))
        const args = ['-C', temp]
        try {
          await 跑Git([...args, 'init', '-q'])
          reportInstall(20, '正在拉取内测安装包…')
          await 跑Git([...args, 'fetch', '--quiet', '--depth=1', BETA_URL, latest.latestCommit], 60000, state.token)
          const remote = JSON.parse(await 跑Git([...args, 'show', latest.latestCommit + ':package.json']))
          if (remote.name !== meta.name || (remote.repositoryVersion || remote.version) !== latest.latest) throw Error('内测安装包元信息不匹配')
          reportInstall(65, '正在校验并打包内测版本…')
          spec = join(temp, `${meta.name}-${latest.latest}.tgz`)
          await 跑Git([...args, 'archive', '--format=tar.gz', '--prefix=package/', '-o', spec, latest.latestCommit], 60000)
          if (statSync(spec).size > MAX_PACKAGE_BYTES) throw Error('内测安装包超过 32 MB 限制')
        } catch { throw Error('内测安装包拉取或校验失败，请检查网络、Git 与 Token 权限') }
      } else if (channel === 'github') {
        const remote = await 读远端元信息(latest.latestCommit)
        if (remote.name !== meta.name || remote.version !== latest.latest) throw Error('正式安装包版本或包名与目标提交不匹配')
        spec = 'github:' + github + '#' + latest.latestCommit
      }
      else {
        const url = `${MIRROR}/${encodeURIComponent(meta.name)}/-/${meta.name}-${latest.latest}.tgz`
        const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
        if (!response.ok) throw new Error('国内安装包下载失败：HTTP ' + response.status)
        if (Number(response.headers.get('content-length')) > MAX_PACKAGE_BYTES) throw new Error('安装包超过 32 MB 限制')
        const total = Number(response.headers.get('content-length'))
        const chunks = []; let size = 0
        for await (const chunk of response.body) {
          size += chunk.length
          if (size > MAX_PACKAGE_BYTES) throw new Error('安装包超过 32 MB 限制')
          chunks.push(chunk)
          reportInstall(total > 0 ? Math.min(65, 10 + size / total * 55) : 10, '正在下载安装包…')
        }
        reportInstall(70, '正在校验安装包完整性…')
        const bytes = Buffer.concat(chunks)
        if ('sha512-' + createHash('sha512').update(bytes).digest('base64') !== latest.integrity) throw new Error('安装包完整性校验失败，已取消安装')
        temp = mkdtempSync(join(tmpdir(), 'dsh-big-fish-update-'))
        spec = join(temp, `${meta.name}-${latest.latest}.tgz`)
        writeFileSync(spec, bytes)
      }
      reportInstall(80, '正在由 DSH 安装并应用更新…')
      log('一键更新：开始装 ' + spec)
      const r = await pm.installBundle(spec, ...(channel === 'mirror' ? [{ registry: MIRROR }] : []))
      log('一键更新：' + JSON.stringify(r && (r.applied ?? r.application ?? r.reason ?? r)))
      if (!r || r.ok === false || r.applied === false || (r.application && !['applied', 'restart-required'].includes(r.application))) {
        return { ok: false, spec, result: r || null, error: r?.error?.message || r?.reason || (typeof r?.error === 'string' ? r.error : '宿主未应用更新：' + (r?.application || '未返回结果')) }
      }
      reportInstall(95, '安装已应用，正在记录更新结果…')
      readState()
      saveState({ ...state, channel, installed: { channel, commit: latest.latestCommit, version: latest.latest, npmVersion: latest.npmLatest },
        pendingLog: { targetId: latest.targetId, channel, version: latest.npmLatest, commit: latest.latestCommit, sourceInstance: instanceId } })
      // 记下本次装到的提交，供下一次检查判断有没有真正更新；锁文件被宿主改写时也能兜底。
      if (channel !== 'mirror' && 是提交号(latest.latestCommit)) {
        try { writeFileSync(安装记录, JSON.stringify({ commit: latest.latestCommit, installedAt: new Date().toISOString() })) }
        catch (e) { log('写入安装记录失败：' + errorText(e)) }
      }
      caches.clear()
      reportInstall(100, '整合包更新已完成')
      return { ok: true, spec, result: r || null, restartRequired: true }
    } catch (e) {
      log('一键更新失败：' + String((e && e.message) || e))
      return { ok: false, spec, error: String((e && e.message) || e) }
    } finally {
      try { if (temp) rmSync(temp, { recursive: true, force: true }) }
      finally {
        installing = false
        installStatus = { ...installStatus, active: false, ...(installStatus.progress < 100 ? { message: '更新未完成，请查看更新结果' } : {}) }
      }
    }
  }

  async function releaseData(action, params, signal) {
    return readBundledRelease(packageRoot, action, params.get('releaseId'), signal)
  }

  function register(ctx, route) {
    const send = (res, code, obj) => {
      res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      res.end(JSON.stringify(obj))
    }
    for (const action of ['version', 'update', 'install', 'beta', 'channel', 'install-status', 'releases', 'changelog', 'reminder']) {
      ctx.effect(() => ctx.webServer.register({
        kind: 'exact', path: route + '/' + action,
        handler: async (req, res) => {
          try {
            const mutation = !['version', 'update', 'install-status', 'releases', 'changelog'].includes(action)
            if (req.method !== (mutation ? 'POST' : 'GET')) return send(res, 405, { ok: false, error: '请求方法不允许' })
            const connection = ctx.get?.('connection')
            if (!connection?.requestRejection) return send(res, 503, { ok: false, error: '宿主鉴权接口不可用，请通过 DSH 插件管理器更新' })
            const rejection = await connection.requestRejection(req)
            if (rejection) return send(res, rejection, { ok: false, error: '管理鉴权失败' })
            const origin = req.headers?.origin
            if ((origin && new URL(origin).host !== req.headers?.host) || req.headers?.['sec-fetch-site'] === 'cross-site') return send(res, 403, { ok: false, error: '拒绝跨站管理请求' })
            if (mutation && !/^application\/json(?:;|$)/i.test(req.headers?.['content-type'] || '')) return send(res, 415, { ok: false, error: '只接受 JSON 请求' })
            let body = {}
            if (mutation && req[Symbol.asyncIterator]) {
              const chunks = []; let size = 0
              for await (const chunk of req) {
                size += Buffer.byteLength(chunk)
                if (size > 4096) return send(res, 413, { ok: false, error: '请求超过 4 KB' })
                chunks.push(Buffer.from(chunk))
              }
              try { body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') }
              catch { return send(res, 400, { ok: false, error: 'JSON 格式错误' }) }
              if (!body || typeof body !== 'object' || Array.isArray(body)) return send(res, 400, { ok: false, error: '请求必须为 JSON 对象' })
            }
            const url = new URL(req.url, 'http://localhost')
            if (url.searchParams.has('repository') || url.searchParams.has('repo') || url.searchParams.has('url')) throw Error('更新仅接受内置来源，拒绝其他仓库')
            if (action === 'version') return send(res, 200, await version())
            if (action === 'releases' || action === 'changelog') {
              const controller = new AbortController()
              const cancel = () => controller.abort()
              res.on?.('close', cancel)
              try { return send(res, 200, await releaseData(action, url.searchParams, controller.signal)) }
              finally { res.off?.('close', cancel) }
            }
            if (action === 'reminder') {
              if (Object.keys(body).some(key => key !== 'targetId') || typeof body.targetId !== 'string' || body.targetId.length > 200) throw Error('无效的提醒目标')
              readState()
              const dismissedTargets = [...new Set([...(state.dismissedTargets || []), body.targetId])]
              const viewedLogs = [...new Set([...(state.viewedLogs || []), body.targetId])]
              saveState({ ...state, dismissedTargets, viewedLogs, ...(state.pendingLog?.targetId === body.targetId ? { pendingLog: null } : {}) })
              return send(res, 200, { ok: true })
            }
            if (action === 'install-status') return send(res, 200, { ok: true, ...installStatus })
            if (action === 'beta') return send(res, 200, await configureBeta(body))
            if (action === 'channel') {
              const channel = channelOf(body.channel)
              if (Object.keys(body).some(key => key !== 'channel')) throw Error('更新渠道不接受自定义仓库')
              if (installing) throw Error('已有更新操作正在进行')
              if (channel === 'beta' && !state.token) throw Error('请先输入内测仓库的 GitHub Token')
              saveState({ ...state, channel })
              return send(res, 200, { ok: true, channel })
            }
            const channel = url.searchParams.get('channel') || state.channel || (await installation()).channel
            channelOf(channel)
            if (Object.keys(body).some(key => key !== 'confirmSourceChange' && !(action === 'install' && ['operationId', 'expectedTarget'].includes(key)))) throw Error('更新仅接受内置来源，拒绝其他仓库')
            if (body.operationId !== undefined && (typeof body.operationId !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(body.operationId))) throw Error('无效的更新任务标识')
            if (body.expectedTarget !== undefined && (typeof body.expectedTarget !== 'string' || body.expectedTarget.length > 200)) throw Error('无效的更新目标')
            const result = action === 'update'
              ? await check(url.searchParams.get('refresh') === '1', channel)
              : await install(ctx, channel, body)
            send(res, 200, result)
          } catch (e) {
            send(res, 400, { ok: false, error: String(e?.message || e) })
          }
        },
      }))
    }
  }

  return { current, repo, repoUrl, check, install, register, configureBeta, version, releaseData }
}
