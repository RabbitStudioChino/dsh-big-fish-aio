import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { STABLE_REPOSITORY, UPDATE_PACKAGE, UPDATE_REGISTRY, validateChangelog } from '../lib/update-service.mjs'
import { assertFormalFiles, assertFormalHistory, assertFormalSource } from './release-policy.mjs'

const REGISTRY = 'https://registry.npmjs.org/'
const MODULES = ['qq', 'memory', 'mood', 'speak']
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const readJSON = path => JSON.parse(readFileSync(path, 'utf8'))
const writeJSON = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
const compare = (a, b) => {
  for (let i = 0; i < 3; i++) {
    const x = BigInt(a.split('.')[i]), y = BigInt(b.split('.')[i])
    if (x !== y) return x > y ? 1 : -1
  }
  return 0
}
const integrity = path => 'sha512-' + createHash('sha512').update(readFileSync(path)).digest('base64')

export function runCommand(command, args, { cwd, live = false } = {}) {
  const npm = command === 'npm' && process.env.npm_execpath
  const result = spawnSync(npm ? process.execPath : command, npm ? [npm, ...args] : args, {
    cwd, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    stdio: live ? 'inherit' : ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_NO_REPLACE_OBJECTS: '1' },
  })
  if (result.error || result.status !== 0) {
    const error = new Error(`${command} ${args[0]} 失败（${result.error?.code || result.status}）；修复后可重跑，不要删除已发布版本。`)
    Object.assign(error, { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '' })
    throw error
  }
  return (result.stdout || '').trim()
}

function missing(error, service) {
  if (service === 'github') return /\(HTTP 404\)/.test(error.stderr)
  for (const output of [error.stdout, error.stderr]) {
    try { if (JSON.parse(output).error?.code === 'E404') return true } catch {}
  }
  return false
}

export function releaseNotes(log) {
  return [log.summary || '', ...log.sections.filter(section => section.items.length).map(section =>
    `## ${section.title}\n\n` + section.items.map(item => `- **${item.title}**${item.description ? '：' + item.description : ''}` +
      (item.links?.length ? ' ' + item.links.map(link => `[${link.label}](${link.url})`).join(' ') : '')).join('\n'))].filter(Boolean).join('\n\n') + '\n'
}

export function runRelease(args = [], { root = resolve(dirname(fileURLToPath(import.meta.url)), '..'), run = runCommand, now = () => new Date(), report = console.log } = {}) {
  const [action = 'check', version, ...extra] = args
  assert.ok(['prepare', 'check', 'publish'].includes(action) && extra.length === 0 && (action === 'prepare' ? VERSION.test(version || '') : version === undefined),
    '用法：npm run release -- prepare <版本> | check | publish')
  const command = (name, argv, options) => run(name, argv, { cwd: root, ...options })
  const git = (...argv) => command('git', argv)
  const metaPath = join(root, 'package.json'), meta = readJSON(metaPath)
  assert.equal(meta.name, UPDATE_PACKAGE, '包名不对应')
  assert.ok(VERSION.test(meta.version), '根版本格式无效')
  assertFormalSource(root, version || meta.version)
  const logPath = join(root, 'update', `changelog-v${version || meta.version}.json`)
  const log = readJSON(logPath)
  validateChangelog(log, { channel: 'stable', version: version || meta.version, releaseId: 'v' + (version || meta.version) }, { allowDraft: action !== 'publish' })
  assert.ok(readFileSync(logPath).length <= 512 * 1024, '日志超过 512 KiB')
  assert.ok(log.sections.length && log.sections.every(section => section.items.length > 0), '仅保存本版有变化的非空分类，发布日志至少有一个条目')
  const lockPath = join(root, 'package-lock.json'), lock = readJSON(lockPath)
  const modules = MODULES.map(name => ({ path: join(root, 'modules', name, 'package.json'), data: readJSON(join(root, 'modules', name, 'package.json')) }))
  assert.ok(lock.packages?.[''], 'package-lock 缺少根包信息')
  for (const module of modules) assert.equal(module.data.private, true, '内置模块必须保持 private')
  if (action === 'prepare') {
    assert.ok(compare(version, meta.version) >= 0, '不允许降低版本或重写旧版日志')
    assert.equal(log.publishedAt, '__PUBLISHED_AT__', '只准备尚未发布的日志；已经填写日期的版本不可重新准备')
    log.publishedAt = now().toISOString()
    validateChangelog(log)
    meta.version = lock.version = lock.packages[''].version = version
    writeJSON(metaPath, meta)
    writeJSON(lockPath, lock)
    for (const module of modules) { module.data.version = version; writeJSON(module.path, module.data) }
    writeJSON(logPath, log)
    report(`已准备 v${version}；检查差异并提交后，从正式仓库的 main 执行 publish。未执行任何发布。`)
    return { action, version }
  }
  assert.equal(lock.version, meta.version, 'lockfile 版本不一致')
  assert.equal(lock.packages[''].version, meta.version, 'lockfile 根包版本不一致')
  for (const module of modules) assert.equal(module.data.version, meta.version, '内置模块版本不一致')
  const clean = () => assert.equal(git('status', '--porcelain'), '', '发布要求干净工作区，请先审查并提交改动')
  let sha
  if (action === 'publish') {
    clean()
    assert.ok(!process.env.GIT_GRAFT_FILE, '正式发布禁止 GIT_GRAFT_FILE 改写历史')
    assert.equal(existsSync(resolve(root, git('rev-parse', '--git-path', 'info/grafts'))), false, '正式发布禁止 info/grafts 改写历史')
    assert.equal(git('rev-parse', '--is-shallow-repository'), 'false', '正式发布需要完整历史，禁止浅克隆')
    sha = git('rev-parse', 'HEAD')
    assert.match(sha, /^[a-f0-9]{40}$/)
    assert.equal(git('branch', '--show-current'), 'main', '只允许从正式 main 发布')
    const allowed = new Set([`https://github.com/${STABLE_REPOSITORY}.git`, `https://github.com/${STABLE_REPOSITORY}`, `git@github.com:${STABLE_REPOSITORY}.git`])
    for (const flags of [[], ['--push']]) assert.ok(allowed.has(git('remote', 'get-url', ...flags, '--all', 'origin')), 'origin 的读取和推送地址都必须唯一且指向正式仓库；禁止推送内测历史')
  }
  command('npm', ['run', 'check'], { live: true })
  if (action === 'publish') { clean(); assert.equal(git('rev-parse', 'HEAD'), sha, '检查期间 HEAD 变化') }
  const temp = mkdtempSync(join(tmpdir(), 'bigfish-release-'))
  try {
    const [pack] = JSON.parse(command('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temp]))
    assert.equal(pack.name, meta.name)
    assert.equal(pack.version, meta.version)
    assertFormalFiles(meta.version, pack.files.map(file => file.path))
    assert.equal(basename(pack.filename), pack.filename, '非法包路径')
    const packed = join(temp, pack.filename)
    assert.equal(integrity(packed), pack.integrity, '打包校验失败')
    if (action === 'check') {
      report(`检查通过：${meta.name}@${meta.version}，${pack.integrity}；未执行网络发布。`)
      return { action, version: meta.version, integrity: pack.integrity }
    }
    const tag = 'v' + meta.version, repository = `repos/${STABLE_REPOSITORY}`
    const remoteRefs = () => new Map(git('ls-remote', 'origin', 'refs/heads/main', 'refs/tags/v1.0.0', 'refs/tags/v1.0.0^{}', `refs/tags/${tag}`, `refs/tags/${tag}^{}`)
      .split('\n').filter(Boolean).map(line => { const [commit, ref] = line.split(/\s+/); assert.match(commit, /^[a-f0-9]{40}$/); return [ref, commit] }))
    const refs = remoteRefs(), remoteMain = refs.get('refs/heads/main')
    assert.ok(remoteMain, '请先按独立历史规则初始化正式仓库 main；本脚本不初始化仓库')
    git('fetch', '--no-tags', 'origin', 'main')
    assert.equal(git('rev-parse', 'FETCH_HEAD'), remoteMain, '远端 main 已变化，请重新检查')
    git('merge-base', '--is-ancestor', remoteMain, sha)
    const roots = git('rev-list', '--max-parents=0', sha).split('\n')
    assert.equal(roots.length, 1, '正式历史必须只有一个独立根提交')
    assert.equal(/^parent /m.test(git('cat-file', 'commit', roots[0]).split('\n\n')[0]), false, '正式根提交仍有真实父提交，禁止伪造独立历史')
    const initial = JSON.parse(git('show', roots[0] + ':package.json'))
    assert.equal(initial.name, meta.name)
    assert.equal(initial.version, '1.0.0', '正式历史必须从 v1.0.0 独立快照开始，不能继承内测历史')
    const anchor = refs.get('refs/tags/v1.0.0^{}') || refs.get('refs/tags/v1.0.0')
    assert.ok(anchor === roots[0] || !anchor && tag === 'v1.0.0' && sha === roots[0], 'v1.0.0 必须指向正式独立根提交')
    assertFormalHistory(git, sha, meta.name)
    const previous = JSON.parse(git('show', remoteMain + ':package.json'))
    assert.ok(VERSION.test(previous.version) && (compare(meta.version, previous.version) > 0 || meta.version === previous.version && remoteMain === sha), '必须递增正式版本，同版本只允许重试同一提交')
    for (const path of git('ls-tree', '-r', '--name-only', remoteMain, 'update/').split('\n').filter(Boolean)) {
      if (!/^update\/changelog-v\d+\.\d+\.\d+\.json$/.test(path)) continue
      const original = git('show', remoteMain + ':' + path)
      if (JSON.parse(original).publishedAt !== '__PUBLISHED_AT__') assert.equal(git('hash-object', path), git('rev-parse', remoteMain + ':' + path), '已发布日志不可修改：' + path)
    }
    const tagSha = refs.get(`refs/tags/${tag}^{}`) || refs.get(`refs/tags/${tag}`)
    assert.ok(!tagSha || tagSha === sha, '远端版本标签已指向另一提交，禁止覆盖')
    const repo = JSON.parse(command('gh', ['api', repository]))
    assert.equal(repo.full_name, STABLE_REPOSITORY)
    assert.equal(repo.private, false, '正式仓库必须为公开仓库')
    assert.notEqual(repo.permissions?.push, false, '当前 GitHub 账号没有正式仓库写入权限')
    command('npm', ['whoami', '--registry', REGISTRY])
    const npmVersion = registry => {
      try { return JSON.parse(command('npm', ['view', `${meta.name}@${meta.version}`, '--json', '--registry', registry])) }
      catch (error) { if (missing(error, 'npm')) return null; throw error }
    }
    const githubRelease = () => {
      try { return JSON.parse(command('gh', ['api', `${repository}/releases/tags/${tag}`])) }
      catch (error) { if (missing(error, 'github')) return null; throw error }
    }
    const body = releaseNotes(log)
    const verifyRelease = value => {
      assert.equal(value.tag_name, tag)
      assert.equal(value.name, log.title, 'GitHub 标题与日志不一致')
      assert.equal(value.body?.replace(/\r\n/g, '\n').trim(), body.trim(), 'GitHub 更新说明与固定 JSON 不一致')
      assert.equal(value.draft, false)
      assert.equal(value.prerelease, false)
    }
    const published = npmVersion(REGISTRY), existingRelease = githubRelease()
    if (published) {
      assert.equal(published.name, meta.name, 'npm 包名不匹配')
      assert.equal(published.version, meta.version, 'npm 版本不匹配')
      assert.equal(published.dist?.integrity, pack.integrity, 'npm 已发布同名版本但内容不同，请使用新版本')
    }
    let versions = []
    try { versions = JSON.parse(command('npm', ['view', meta.name, 'versions', '--json', '--registry', REGISTRY])) }
    catch (error) { if (!missing(error, 'npm')) throw error }
    assert.ok([].concat(versions).every(value => !VERSION.test(value) || compare(value, meta.version) <= 0), 'npm 已有更高正式版本，禁止降级')
    let latest
    try { latest = JSON.parse(command('npm', ['view', meta.name, 'dist-tags', '--json', '--registry', REGISTRY])).latest }
    catch (error) { if (!missing(error, 'npm')) throw error }
    assert.ok(!latest || VERSION.test(latest) && compare(latest, meta.version) <= 0, 'npm latest 已有更新版本，禁止降级')
    if (existingRelease) verifyRelease(existingRelease)
    const artifactDir = join(root, 'local', 'releases', `${tag}-${sha}`)
    mkdirSync(artifactDir, { recursive: true })
    const artifact = join(artifactDir, pack.filename)
    if (existsSync(artifact)) assert.equal(integrity(artifact), pack.integrity, '保留包与当前构建不一致，禁止重新发布不同内容')
    else copyFileSync(packed, artifact)
    const notesPath = join(artifactDir, 'release-notes.md')
    writeFileSync(notesPath, body)
    writeJSON(join(artifactDir, 'manifest.json'), { version: meta.version, commit: sha, integrity: pack.integrity, repository: STABLE_REPOSITORY })
    // A cross-service transaction is impossible; every retry verifies already-published identities.
    clean(); assert.equal(git('rev-parse', 'HEAD'), sha, '发布期间 HEAD 变化')
    report(`固定发布：${tag} / ${sha}；归档 ${artifactDir}`)
    if (!published) command('npm', ['publish', artifact, '--ignore-scripts', '--access', 'public', '--tag', 'latest', '--registry', REGISTRY], { live: true })
    else if (latest !== meta.version) command('npm', ['dist-tag', 'add', `${meta.name}@${meta.version}`, 'latest', '--registry', REGISTRY], { live: true })
    const npmReadback = npmVersion(REGISTRY)
    assert.equal(npmReadback?.version, meta.version)
    assert.equal(npmReadback?.dist?.integrity, pack.integrity, 'npm 回读包内容不匹配')
    if (!tagSha) git('push', 'origin', `${sha}:refs/tags/${tag}`)
    if (!existingRelease) command('gh', ['release', 'create', tag, '--repo', STABLE_REPOSITORY, '--verify-tag', '--target', sha, '--title', log.title, '--notes-file', notesPath])
    verifyRelease(githubRelease())
    clean(); assert.equal(git('rev-parse', 'HEAD'), sha, '发布期间 HEAD 变化')
    assert.equal(remoteRefs().get('refs/heads/main'), remoteMain, '远端 main 在发布期间变化，请重新检查后重跑')
    if (remoteMain !== sha) git('push', 'origin', `${sha}:refs/heads/main`)
    const finalRefs = remoteRefs()
    assert.equal(finalRefs.get('refs/heads/main'), sha, 'GitHub main 回读不匹配')
    assert.equal(finalRefs.get(`refs/tags/${tag}^{}`) || finalRefs.get(`refs/tags/${tag}`), sha, 'GitHub tag 回读不匹配')
    const tags = JSON.parse(command('npm', ['view', meta.name, 'dist-tags', '--json', '--registry', REGISTRY]))
    assert.equal(tags.latest, meta.version, 'npm latest 回读不匹配')
    report('正式 GitHub 与 npm 已发布并回读；正在检查官方源和国内镜像的 latest 与实际下载。')
    for (const registry of [REGISTRY, UPDATE_REGISTRY]) {
      const registryTags = JSON.parse(command('npm', ['view', meta.name, 'dist-tags', '--json', '--registry', registry]))
      assert.equal(registryTags.latest, meta.version, registry + ' latest 尚未同步；正式发布已完成，镜像验收待完成，稍后重跑 publish')
      const value = npmVersion(registry)
      assert.equal(value?.version, meta.version, registry + ' 尚未同步；已发布内容保留，稍后重跑 publish 验证')
      assert.equal(value?.dist?.integrity, pack.integrity, registry + ' 包内容不匹配')
      const download = mkdtempSync(join(temp, 'verify-'))
      const [verified] = JSON.parse(command('npm', ['pack', `${meta.name}@${meta.version}`, '--ignore-scripts', '--json', '--registry', registry, '--cache', join(download, 'cache'), '--pack-destination', download]))
      assert.equal(basename(verified.filename), verified.filename)
      assert.equal(integrity(join(download, verified.filename)), pack.integrity, registry + ' 下载包校验失败')
    }
    report(`发布完成：${tag}；GitHub main/tag/Release、npm latest、官方源和国内镜像下载均已核验。`)
    return { action, version: meta.version, commit: sha, integrity: pack.integrity }
  } finally { rmSync(temp, { recursive: true, force: true }) }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { runRelease(process.argv.slice(2)) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
