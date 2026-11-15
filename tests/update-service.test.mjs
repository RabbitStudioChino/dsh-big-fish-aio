import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { createSelfUpdate } from '../lib/selfupdate.mjs'
import { createUpdateReader, validateChangelog } from '../lib/update-service.mjs'
const sha = 'a'.repeat(40)
const log = (version = '1.0.0') => ({ schemaVersion: 1, releaseId: 'v' + version, version, channel: 'stable', title: '大肥鱼 ' + version, publishedAt: '2026-11-11T10:00:00+08:00',
  sections: [{ id: 'other', title: '新分类', items: [{ id: 'change', title: '<img onerror=alert(1)>', description: '第一行\n第二行', links: [{ label: '官网', url: 'https://bigfish.rabbitstudio.club/' }] }] }, { id: 'empty', title: '空分类', items: [] }] })
function fixture(t) {
  const home = mkdtempSync(join(tmpdir(), 'fish-release-')), root = join(home, 'node_modules', 'dsh-big-fish-aio')
  mkdirSync(root, { recursive: true })
  const metadata = version => writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'dsh-big-fish-aio', version }))
  const bundle = (version, extra = {}) => {
    mkdirSync(join(root, 'update'), { recursive: true })
    writeFileSync(join(root, 'update', 'changelog-v' + version + '.json'), JSON.stringify({ ...log(version), ...extra }))
  }
  metadata('1.0.0'); bundle('1.0.0')
  t.after(() => rmSync(home, { recursive: true, force: true }))
  return { home, root, metadata, bundle, updater: createSelfUpdate({ packageRoot: root }) }
}
function routes(updater, rejection) {
  const handlers = {}
  updater.register({ get: () => ({ requestRejection: () => rejection }), effect: fn => fn(), webServer: { register: route => { handlers[route.path] = route.handler } } }, '/fish')
  return async (action, body) => {
    const req = Readable.from(body ? [JSON.stringify(body)] : [])
    Object.assign(req, { method: body ? 'POST' : 'GET', url: '/fish/' + action, headers: { host: 'localhost', 'content-type': 'application/json' } })
    let status, data
    await handlers['/fish/' + action](req, { writeHead: code => { status = code }, end: text => { data = JSON.parse(text) } })
    return { status, data }
  }
}
test('日志结构、对应版本、HTTPS 链接与稳定唯一条目校验', () => {
  validateChangelog(log(), { releaseId: 'v1.0.0', version: '1.0.0' })
  assert.throws(() => validateChangelog(log('1.1.0'), { releaseId: 'v1.0.0' }), /对应/)
  const duplicate = log(); duplicate.sections[0].items.push(duplicate.sections[0].items[0]); assert.throws(() => validateChangelog(duplicate), /条目/)
  const unsafe = log(); unsafe.sections[0].items[0].links[0].url = 'javascript:alert(1)'; assert.throws(() => validateChangelog(unsafe), /HTTPS/)
})
test('增量日志允许任意单个分类，格式仍固定为 schemaVersion 1', () => {
  const delta = { ...log('1.1.1'), sections: [{ id: 'upload-fixes', title: '导入修复', items: [{ id: 'upload.stream', title: '修复大文件导入中断' }] }] }
  assert.equal(validateChangelog(delta, { releaseId: 'v1.1.1', version: '1.1.1' }), delta)
  validateChangelog({ ...delta, sections: [] })
  validateChangelog({ ...delta, sections: [{ id: 'legacy-empty', title: '旧版空分类', items: [] }] })
  assert.throws(() => validateChangelog({ ...delta, schemaVersion: 2 }), /schemaVersion/)
  assert.throws(() => validateChangelog({ ...delta, releaseId: 'v1.1.0' }), /releaseId/)
  assert.throws(() => validateChangelog({ ...delta, publishedAt: '2026-11-15' }), /publishedAt/)
})
test('任意分类仍拒绝缺字段、错误类型和重复编号，返回明确格式错误', () => {
  const cases = [
    data => { data.sections = null },
    data => { data.sections = [null] },
    data => { delete data.sections[0].title },
    data => { data.sections[0].items = {} },
    data => { data.sections[0].items = [null] },
    data => { data.sections[0].items[0].title = '  ' },
    data => { data.sections[0].items[0].description = {} },
    data => { data.sections[0].items[0].module = 1 },
    data => { data.sections[0].items[0].links = {} },
    data => { data.sections[0].items[0].links = [null] },
    data => { data.sections[0].items[0].links[0].url = ['https://example.test'] },
    data => { data.sections.push(structuredClone(data.sections[0])) },
    data => { data.sections[1].items = [structuredClone(data.sections[0].items[0])] },
  ]
  for (const invalidate of cases) {
    const data = log(); invalidate(data)
    assert.throws(() => validateChangelog(data), /更新数据无效/, invalidate.toString())
  }
})
test('ETag 与 304 复用、并发合并、大小限制、超时与请求取消', async t => {
  const read = createUpdateReader({ maxBytes: 1000, timeout: 10 }), calls = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push(options)
    return calls.length === 1 ? Response.json({ value: 1 }, { headers: { etag: '"one"' } }) : new Response(null, { status: 304 })
  })
  assert.deepEqual(await read('https://example.test/data'), { value: 1 })
  assert.deepEqual(await read('https://example.test/data'), { value: 1 }); assert.equal(calls.length, 1)
  await Promise.all([read('https://example.test/data', { force: true }), read('https://example.test/data', { force: true })])
  assert.equal(calls.length, 2); assert.equal(calls[1].headers['if-none-match'], '"one"')
  globalThis.fetch = async () => new Response('x'.repeat(1001))
  await assert.rejects(read('https://example.test/large'), /大小/)
  globalThis.fetch = async (url, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }))
  const keepAlive = setTimeout(() => {}, 1000)
  try {
    await assert.rejects(read('https://example.test/slow'), { name: 'TimeoutError' })
    const controller = new AbortController(), pending = read('https://example.test/cancel', { signal: controller.signal }); controller.abort()
    await assert.rejects(pending, { name: 'AbortError' })
  } finally { clearTimeout(keepAlive) }
})

test('版本直接查 GitHub，日志始终读安装包；断网与目标变化不显示未来日志', async t => {
  const { updater, bundle } = fixture(t)
  bundle('0.9.0')
  let remoteVersion = '1.1.0', commit = sha, installs = 0
  t.mock.method(globalThis, 'fetch', async url => {
    assert.ok(!String(url).includes('rabbitstudio.club'))
    return Response.json(String(url).includes('api.github.com') ? { sha: commit } : { name: 'dsh-big-fish-aio', version: remoteVersion })
  })
  const before = await updater.check(true, 'github')
  assert.equal(before.latest, '1.1.0')
  const params = new URLSearchParams('channel=github')
  assert.equal((await updater.releaseData('changelog', params)).changelog.version, '1.0.0')
  assert.equal((await updater.releaseData('releases', params)).releases.length, 2)
  assert.equal((await updater.releaseData('changelog', new URLSearchParams('releaseId=v0.9.0'))).changelog.version, '0.9.0')
  await assert.rejects(updater.releaseData('changelog', new URLSearchParams('releaseId=../../etc/passwd')), /无效/)
  remoteVersion = '1.2.0'; commit = 'b'.repeat(40)
  const ctx = { pluginManager: { installBundle: async () => { installs++; return { applied: true } } } }
  assert.equal((await updater.install(ctx, 'github', { expectedTarget: before.targetId, confirmSourceChange: true })).targetChanged, true)
  assert.equal(installs, 0)
  globalThis.fetch = async () => { throw Error('offline') }
  const childProcess = (await import('node:child_process')).default
  t.mock.method(childProcess, 'execFile', (command, args, options, done) => done(Error('offline'), '', ''))
  assert.equal((await updater.check(true, 'github')).ok, false)
  assert.equal((await updater.releaseData('changelog', params)).status, 'ready')
})
test('成功后持久记录、重载后提醒、关闭后去重；失败与旧实例不弹日志', async t => {
  const { updater, root, metadata, bundle } = fixture(t)
  t.mock.method(globalThis, 'fetch', async url => Response.json(String(url).includes('api.github.com') ? { sha } : { name: 'dsh-big-fish-aio', version: '1.1.0' }))
  const ctx = { pluginManager: { installBundle: async () => ({ applied: false }) } }
  assert.equal((await updater.install(ctx, 'github', { confirmSourceChange: true })).ok, false)
  assert.equal((await createSelfUpdate({ packageRoot: root }).version()).postUpdate, null)
  ctx.pluginManager.installBundle = async () => { metadata('1.1.0'); bundle('1.1.0'); return { applied: true } }
  assert.equal((await updater.install(ctx, 'github', { confirmSourceChange: true })).ok, true)
  assert.equal((await updater.version()).postUpdate, null)
  const reloaded = createSelfUpdate({ packageRoot: root }), info = await reloaded.version()
  assert.equal(info.postUpdate.latest, '1.1.0'); assert.equal(info.postUpdate.latestCommit, sha)
  await routes(reloaded)('reminder', { targetId: info.postUpdate.targetId })
  assert.equal((await createSelfUpdate({ packageRoot: root }).version()).postUpdate, null)
})
test('同版本内测新提交仍有更新，安装后无需网络或 Token 即可读本地日志', async t => {
  const { updater, home, root } = fixture(t)
  let betaCommit = sha
  writeFileSync(join(home, 'big-fish-update.json'), JSON.stringify({ channel: 'beta', token: 'github_pat_test_only_1234567890' }))
  const childProcess = (await import('node:child_process')).default
  t.mock.method(childProcess, 'execFile', (command, args, options, done) => {
    if (args.includes('archive')) writeFileSync(args[args.indexOf('-o') + 1], 'test package')
    done(null, args.includes('ls-remote') ? betaCommit + '\trefs/heads/main\n' : args.includes('show') ? JSON.stringify({ name: 'dsh-big-fish-aio', version: '1.0.0' }) : '', '')
  })
  t.mock.method(globalThis, 'fetch', async () => Response.json({ encoding: 'base64', content: Buffer.from(JSON.stringify({ name: 'dsh-big-fish-aio', version: '1.0.0' })).toString('base64') }))
  const before = await updater.check(true, 'beta')
  assert.equal(before.hasUpdate, true); assert.equal(before.latest, before.current)
  assert.equal((await updater.install({ pluginManager: { installBundle: async () => ({ applied: true }) } }, 'beta', { expectedTarget: before.targetId, confirmSourceChange: true })).ok, true)
  const info = await createSelfUpdate({ packageRoot: root }).version()
  assert.equal(info.postUpdate.latestCommit, sha)
  const reloaded = createSelfUpdate({ packageRoot: root })
  await routes(reloaded)('reminder', { targetId: info.postUpdate.targetId })
  betaCommit = 'b'.repeat(40)
  const savedBefore = JSON.parse(readFileSync(join(home, 'big-fish-update.json')))
  // 旧版安装前关闭日志的记录不能抑制安装后的成功提示。
  savedBefore.dismissedTargets.push('beta::' + betaCommit)
  writeFileSync(join(home, 'big-fish-update.json'), JSON.stringify(savedBefore))
  const next = await reloaded.check(true, 'beta')
  assert.equal(next.hasUpdate, true); assert.equal(next.current, next.latest)
  assert.equal((await reloaded.install({ pluginManager: { installBundle: async () => ({ applied: true }) } }, 'beta', { expectedTarget: next.targetId })).ok, true)
  assert.equal((await createSelfUpdate({ packageRoot: root }).version()).postUpdate.latestCommit, betaCommit)
  const saved = JSON.parse(readFileSync(join(home, 'big-fish-update.json'))); delete saved.token; writeFileSync(join(home, 'big-fish-update.json'), JSON.stringify(saved))
  globalThis.fetch = async () => { throw Error('不应联网') }
  assert.equal((await updater.releaseData('changelog', new URLSearchParams('channel=beta'))).changelog.version, '1.0.0')
})
test('随包日志处理草稿、缺失、错版、超限、取消，并沿用管理鉴权', async t => {
  const { updater, bundle, root } = fixture(t)
  bundle('1.0.0', { publishedAt: '__PUBLISHED_AT__' })
  bundle('1.1.0', { publishedAt: '__PUBLISHED_AT__' })
  assert.equal((await updater.releaseData('changelog', new URLSearchParams())).draft, true)
  const history = await updater.releaseData('releases', new URLSearchParams())
  assert.equal(history.status, 'ready')
  assert.equal(history.releases.length, 0, '保留的未来正式草稿不阻断本地历史，也不列入已发布版本')
  assert.equal((await updater.releaseData('changelog', new URLSearchParams('releaseId=v0.8.0'))).status, 'unavailable')
  bundle('1.0.0', { version: '9.0.0' })
  assert.equal((await updater.releaseData('changelog', new URLSearchParams())).status, 'unavailable')
  writeFileSync(join(root, 'update/changelog-v1.0.0.json'), 'x'.repeat(512 * 1024 + 1))
  assert.equal((await updater.releaseData('changelog', new URLSearchParams())).status, 'unavailable')
  const controller = new AbortController(); controller.abort()
  await assert.rejects(updater.releaseData('changelog', new URLSearchParams(), controller.signal), { name: 'AbortError' })
  for (const action of ['version', 'changelog', 'releases']) assert.equal((await routes(updater, 403)(action)).status, 403)
})

test('由旧安装器完成的更新在新实例中补展示，已阅状态独立持久化', async t => {
  const { root, home } = fixture(t)
  const targetId = 'github:1.0.0:' + sha
  writeFileSync(join(home, 'big-fish-update.json'), JSON.stringify({ installed: { channel: 'github', version: '1.0.0', npmVersion: '1.0.0', commit: sha }, dismissedTargets: [targetId] }))
  const updater = createSelfUpdate({ packageRoot: root })
  assert.equal((await updater.version()).postUpdate.targetId, targetId)
  await routes(updater)('reminder', { targetId })
  assert.equal((await createSelfUpdate({ packageRoot: root }).version()).postUpdate, null)
})


test('历史扫描只读取合法的单层日志文件，文件名与内容必须对应', async t => {
  const { updater, root } = fixture(t)
  mkdirSync(join(root, 'update', 'v0.9.0'), { recursive: true })
  writeFileSync(join(root, 'update', 'v0.9.0', 'changelog.json'), JSON.stringify(log('0.9.0')))
  mkdirSync(join(root, 'update', 'changelog-v2.0.0.json'))
  writeFileSync(join(root, 'update', 'notes.json'), 'not a changelog')
  writeFileSync(join(root, 'update', 'changelog-v01.0.0.json'), 'invalid filename')
  const history = await updater.releaseData('releases', new URLSearchParams())
  assert.equal(history.status, 'ready')
  assert.deepEqual(history.releases.map(release => release.releaseId), ['v1.0.0'])
  writeFileSync(join(root, 'update', 'changelog-v1.1.0.json'), JSON.stringify(log('1.2.0')))
  assert.equal((await updater.releaseData('releases', new URLSearchParams())).status, 'unavailable')
})
