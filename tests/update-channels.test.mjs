import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import childProcess from 'node:child_process'
import { gunzipSync } from 'node:zlib'
import { createSelfUpdate } from '../lib/selfupdate.mjs'

const REPOSITORY = 'CHINOSAMAAA/dsh-big-fish-aio-demo'
const TOKEN = 'github_pat_private_test_1234567890'
const COMMIT = 'd'.repeat(40)
const META = { name: 'dsh-big-fish-aio', version: '0.3.15', repositoryVersion: '0.5.1',
  repository: 'https://github.com/RabbitStudioChino/dsh-big-fish-aio' }

function fixture(t) {
  const home = mkdtempSync(join(tmpdir(), 'fish-update-channels-'))
  const root = join(home, 'node_modules', META.name)
  mkdirSync(root, { recursive: true })
  writeFileSync(join(root, 'package.json'), JSON.stringify(META))
  t.after(() => rmSync(home, { recursive: true, force: true }))
  return { home, root, config: join(home, 'big-fish-update.json'), updater: createSelfUpdate({ packageRoot: root }) }
}

function privateRemote(t) {
  const commands = [], requests = []
  let commit = COMMIT, remoteMeta = META
  let failure = false
  t.mock.method(childProcess, 'execFile', (command, args, options, callback) => {
    commands.push(args)
    assert.equal(command, 'git')
    assert.ok(!args.join(' ').includes(TOKEN))
    if (args.includes('ls-remote') || args.includes('fetch')) {
      assert.ok(args.includes(`https://github.com/${REPOSITORY}.git`))
      assert.equal(options.env.GIT_TERMINAL_PROMPT, '0')
      assert.equal(options.env.GIT_CONFIG_KEY_0, `http.https://github.com/${REPOSITORY}.git.extraHeader`)
      assert.match(options.env.GIT_CONFIG_VALUE_0, /^Authorization: Basic /)
      assert.equal(options.env.GIT_CONFIG_VALUE_1, 'false')
    }
    if (failure) return callback(Object.assign(new Error('secret ' + TOKEN), { killed: failure === 'timeout' }), '', TOKEN)
    if (args.includes('ls-remote')) {
      assert.equal(options.timeout, 45000)
      assert.equal(args.at(-1), 'refs/heads/main')
      assert.ok(!args.includes('HEAD') && !args.includes('refs/heads/dev'))
      return callback(null, commit + '\trefs/heads/main\n', '')
    }
    if (args.includes('show')) return callback(null, JSON.stringify(remoteMeta), '')
    if (args.includes('archive')) writeFileSync(args[args.indexOf('-o') + 1], 'private archive')
    callback(null, '', '')
  })
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push(String(url))
    assert.equal(url, `https://api.github.com/repos/${REPOSITORY}/contents/package.json?ref=${commit}`)
    assert.equal(options.headers.authorization, 'Bearer ' + TOKEN)
    assert.equal(options.redirect, 'error')
    return Response.json({ encoding: 'base64', content: Buffer.from(JSON.stringify(remoteMeta)).toString('base64') })
  })
  return { commands, requests, setVersion: version => { remoteMeta = { ...META, repositoryVersion: version } }, fail: (timeout = false) => { failure = timeout ? 'timeout' : true }, advance: () => { commit = 'e'.repeat(40) } }
}

function routes(updater, rejection) {
  const handlers = {}
  const services = { connection: { requestRejection: async () => rejection } }
  const ctx = { get: name => services[name], effect: fn => fn(),
    webServer: { register: route => { handlers[route.path] = route.handler } } }
  updater.register(ctx, '/fish')
  const invoke = async (path, { body, method = 'POST', headers = {} } = {}) => {
    const request = Readable.from(body === undefined ? [] : [typeof body === 'string' ? body : JSON.stringify(body)])
    Object.assign(request, { method, url: path, headers: { host: 'localhost', 'content-type': 'application/json', ...headers } })
    let status, result
    await handlers[path.split('?')[0]](request, { writeHead: code => { status = code }, end: text => { result = JSON.parse(text) } })
    return { status, result }
  }
  return { invoke, services, ctx }
}

test('内测仅接受固定仓库，验证成功后以 0600 保存 Token，重建更新器仍恢复渠道', async t => {
  const { updater, root, config } = fixture(t)
  const remote = privateRemote(t)
  for (const repository of ['someone/dsh-big-fish-aio-demo', 'CHINOSAMAAA/other', 'https://github.com/' + REPOSITORY]) {
    await assert.rejects(updater.configureBeta({ token: TOKEN, repository }), /拒绝其他仓库/)
  }
  assert.equal(remote.commands.length, 0)
  await assert.rejects(updater.configureBeta({ token: TOKEN + '\n' }), /有效/)
  await updater.configureBeta({ token: TOKEN })
  assert.equal(JSON.parse(readFileSync(config, 'utf8')).token, TOKEN)
  if (process.platform !== 'win32') assert.equal(statSync(config).mode & 0o777, 0o600)
  const reloaded = createSelfUpdate({ packageRoot: root })
  const info = await reloaded.version()
  assert.equal(info.channel, 'beta')
  assert.equal(info.installedChannel, 'mirror', '选择渠道不会提前修改实际安装来源')
  assert.equal(info.displayVersion, META.version)
  assert.equal(info.installedCommit, null)
  assert.ok(!JSON.stringify(info).includes(TOKEN))
  const checked = await reloaded.check(true)
  assert.equal(checked.branch, 'main')
  assert.equal(checked.repoUrl, 'https://github.com/' + REPOSITORY)
  assert.equal(checked.switchRequired, true)
  assert.equal(checked.sourceChanged, true)
  assert.ok(remote.requests.every(url => url.startsWith('https://api.github.com/repos/' + REPOSITORY + '/')))
})

test('内测固定读取 main，失败鉴权保留原 Token 且不回显凭据', async t => {
  const { updater, config } = fixture(t)
  const remote = privateRemote(t)
  await updater.configureBeta({ token: TOKEN })
  assert.equal((await updater.check(true, 'beta')).branch, 'main')
  const before = readFileSync(config, 'utf8')
  remote.fail()
  await assert.rejects(updater.configureBeta({ token: 'github_pat_replacement_1234567890' }), error => {
    assert.ok(!error.message.includes(TOKEN))
    assert.match(error.message, /无法读取内测仓库/)
    return true
  })
  assert.equal(readFileSync(config, 'utf8'), before)
  remote.fail(true)
  const timeout = await updater.check(true, 'beta')
  assert.match(timeout.error, /Git 查询 main超时（45 秒）/)
  assert.ok(!timeout.error.includes(TOKEN))
})

test('内测安装固定提交、校验包并清理临时归档；来源跨重启保留，失败安装不修改来源', async t => {
  const { updater, root } = fixture(t)
  const remote = privateRemote(t)
  await updater.configureBeta({ token: TOKEN })
  let archive, accepted = false
  const ctx = { pluginManager: { installBundle: async path => {
    archive = path
    assert.equal(readFileSync(path, 'utf8'), 'private archive')
    return { applied: accepted }
  } } }
  assert.equal((await updater.install(ctx, 'beta')).confirmationRequired, true)
  assert.equal(remote.commands.filter(args => args.includes('fetch')).length, 0)
  assert.equal((await updater.install(ctx, 'beta', { confirmSourceChange: true })).ok, false)
  assert.equal(existsSync(archive), false)
  assert.equal((await updater.version()).installedChannel, 'mirror')
  accepted = true
  assert.equal((await updater.install(ctx, 'beta', { confirmSourceChange: true })).ok, true)
  assert.equal(existsSync(archive), false)
  const reloaded = createSelfUpdate({ packageRoot: root })
  const info = await reloaded.version()
  assert.equal(info.installedChannel, 'beta')
  assert.equal(info.displayVersion, META.repositoryVersion)
  assert.equal(info.installedCommit, COMMIT)
  rmSync(join(root, '.dsh-installed-commit.json'))
  const checked = await reloaded.check(true, 'beta')
  assert.equal(checked.localCommit, COMMIT)
  assert.equal(checked.localCommitFrom, '安装来源记录')
  assert.equal(checked.hasUpdate, false)
  remote.advance()
  const newer = await reloaded.check(true, 'beta')
  assert.equal(newer.latest, checked.latest)
  assert.equal(newer.commitUpdate, true)
  assert.equal(newer.hasUpdate, true)
  const fetches = remote.commands.filter(args => args.includes('fetch'))
  assert.ok(fetches.every(args => args.at(-1) === COMMIT))
})

test('旧 npm、GitHub 锁文件与外部重新安装的声明决定版本展示和方式切换确认', async t => {
  const { root, home } = fixture(t)
  const github = 'RabbitStudioChino/dsh-big-fish-aio'
  writeFileSync(join(home, 'pnpm-lock.yaml'), `version: https://codeload.github.com/${github}/tar.gz/${COMMIT}\n`)
  let updater = createSelfUpdate({ packageRoot: root })
  assert.equal((await updater.version()).displayVersion, META.version)
  t.mock.method(globalThis, 'fetch', async () => Response.json({ ...META, dist: { integrity: 'sha512-' + 'a'.repeat(86) + '==' } }))
  const mirror = await updater.check(true, 'mirror')
  assert.equal(mirror.hasUpdate, false)
  assert.equal(mirror.sourceChanged, true)
  assert.equal(mirror.switchRequired, true)
  assert.equal((await updater.install({ pluginManager: { installBundle: async () => { throw Error('不应安装') } } }, 'mirror')).confirmationRequired, true)
  writeFileSync(join(home, 'package.json'), JSON.stringify({ dependencies: { [META.name]: META.version } }))
  updater = createSelfUpdate({ packageRoot: root })
  assert.equal((await updater.version()).installedChannel, 'mirror')
  assert.equal((await updater.version()).displayVersion, META.version)
})

test('凭据和渠道接口复用管理鉴权、同源、JSON 与大小校验，拒绝其他仓库参数', async t => {
  const { updater, root, config } = fixture(t)
  const remote = privateRemote(t)
  const { invoke } = routes(updater)
  assert.equal((await invoke('/fish/beta', { method: 'GET' })).status, 405)
  assert.equal((await invoke('/fish/beta', { body: { token: TOKEN }, headers: { origin: 'https://other.example' } })).status, 403)
  assert.equal((await invoke('/fish/beta', { body: { token: TOKEN }, headers: { 'content-type': 'text/plain' } })).status, 415)
  assert.equal((await invoke('/fish/beta', { body: 'x'.repeat(4097) })).status, 413)
  assert.equal((await invoke('/fish/beta', { body: '{' })).status, 400)
  assert.equal((await invoke('/fish/beta', { body: [] })).status, 400)
  assert.equal((await invoke('/fish/beta', { body: { token: TOKEN, repository: 'other/repository' } })).status, 400)
  assert.equal((await invoke('/fish/beta?repo=other', { body: { token: TOKEN } })).status, 400)
  assert.equal((await invoke('/fish/update?channel=beta&repository=other', { method: 'GET' })).status, 400)
  assert.equal((await invoke('/fish/channel', { body: { channel: 'github', repository: 'other' } })).status, 400)
  assert.equal(remote.commands.length, 0)
  const rejected = routes(updater, 401)
  assert.equal((await rejected.invoke('/fish/beta', { body: { token: TOKEN } })).status, 401)
  const connected = await invoke('/fish/beta', { body: { token: TOKEN } })
  assert.equal(connected.status, 200)
  assert.ok(!JSON.stringify(connected).includes(TOKEN))
  assert.equal((await invoke('/fish/channel', { body: { channel: 'github' } })).status, 200)
  assert.equal((await invoke('/fish/version', { method: 'GET' })).result.channel, 'github')
  const reloaded = routes(createSelfUpdate({ packageRoot: root }))
  const info = await reloaded.invoke('/fish/version', { method: 'GET' })
  assert.equal(info.result.betaConfigured, true)
  assert.ok(!JSON.stringify(info).includes(TOKEN))
  for (const channel of ['mirror', 'beta', 'github', 'beta']) {
    assert.equal((await reloaded.invoke('/fish/channel', { body: { channel } })).status, 200)
    assert.equal(JSON.parse(readFileSync(config, 'utf8')).token, TOKEN)
  }
  assert.equal(statSync(config).mode & 0o777, 0o600)
})

test('损坏的更新配置拒绝覆盖，失败 Token 不落盘', async t => {
  const { root, config } = fixture(t)
  writeFileSync(config, '{invalid')
  const updater = createSelfUpdate({ packageRoot: root })
  privateRemote(t)
  await assert.rejects(updater.configureBeta({ token: TOKEN }), /更新配置无法读取/)
  assert.equal(readFileSync(config, 'utf8'), '{invalid')
})

test('真实 Git fetch 与 archive 生成可安装目录结构，固定提交排除未提交文件', async t => {
  const { updater, home } = fixture(t)
  const source = join(home, 'private-source')
  mkdirSync(source)
  const git = args => childProcess.execFileSync('git', ['-C', source, ...args], { stdio: 'pipe' }).toString().trim()
  git(['init', '-q', '--initial-branch=main'])
  git(['config', 'user.name', 'Update Test'])
  git(['config', 'user.email', 'test@example.invalid'])
  writeFileSync(join(source, 'package.json'), JSON.stringify(META))
  writeFileSync(join(source, 'client.js'), '// committed client')
  git(['add', '.'])
  git(['commit', '-qm', 'private version'])
  writeFileSync(join(source, 'uncommitted-secret.txt'), 'uncommitted-secret')
  const actualExec = childProcess.execFile
  t.mock.method(childProcess, 'execFile', (command, args, options, callback) => {
    assert.ok(!args.join(' ').includes(TOKEN))
    const localArgs = args.map(arg => arg === `https://github.com/${REPOSITORY}.git` ? source : arg)
    return actualExec(command, localArgs, options, (error, stdout, stderr) => {
      assert.ifError(error)
      callback(error, stdout, stderr)
    })
  })
  t.mock.method(globalThis, 'fetch', async () => Response.json({ encoding: 'base64', content: Buffer.from(JSON.stringify(META)).toString('base64') }))
  await updater.configureBeta({ token: TOKEN })
  const ctx = { pluginManager: { installBundle: async path => {
    const tar = gunzipSync(readFileSync(path)).toString('utf8')
    assert.ok(tar.includes('package/package.json'))
    assert.ok(tar.includes('package/client.js'))
    assert.ok(!tar.includes('uncommitted-secret'))
    return { application: 'restart-required' }
  } } }
  const result = await updater.install(ctx, 'beta', { confirmSourceChange: true })
  assert.equal(result.ok, true, result.error)
})

test('内测版本接口区分失效 Token、权限与不可访问提交，错误中不包含凭据', async t => {
  const { root, config } = fixture(t)
  writeFileSync(config, JSON.stringify({ token: TOKEN, channel: 'beta' }))
  const updater = createSelfUpdate({ packageRoot: root })
  t.mock.method(childProcess, 'execFile', (_, args, options, callback) => callback(null, COMMIT + '\trefs/heads/main\n', ''))
  let status = 401
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status }))
  for (const [code, message] of [[401, 'Token 无效或已过期'], [403, '访问被拒绝'], [404, 'Token 无权读取']]) {
    status = code
    const result = await updater.check(true, 'beta')
    assert.equal(result.ok, false)
    assert.ok(result.error.includes(message))
    assert.ok(result.error.includes('HTTP ' + code))
    assert.ok(!result.error.includes(TOKEN))
  }
})

test('内测跨版本更新后立即检查及重载均使用已安装版本', async t => {
  const { updater, root } = fixture(t)
  const remote = privateRemote(t)
  await updater.configureBeta({ token: TOKEN })
  remote.setVersion('0.5.20')
  const archives = []
  const ctx = { pluginManager: { installBundle: async path => {
    archives.push(path)
    return { applied: true }
  } } }
  assert.equal((await updater.install(ctx, 'beta', { confirmSourceChange: true })).ok, true)
  for (const instance of [updater, createSelfUpdate({ packageRoot: root })]) {
    assert.equal((await instance.version()).displayVersion, '0.5.20')
    const checked = await instance.check(true, 'beta')
    assert.equal(checked.current, '0.5.20')
    assert.equal(checked.hasUpdate, false)
    assert.equal((await instance.install(ctx, 'beta')).ok, false)
  }
  assert.equal(archives.length, 1)
})
