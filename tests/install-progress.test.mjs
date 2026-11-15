import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { Readable } from 'node:stream'
import { createSelfUpdate } from '../lib/selfupdate.mjs'
test('更新进度经过下载、宿主安装和完成，状态接口受管理鉴权保护', async t => {
  const home = mkdtempSync(join(tmpdir(), 'fish-install-progress-')), root = join(home, 'node_modules', 'dsh-big-fish-aio')
  mkdirSync(root, { recursive: true }); writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'dsh-big-fish-aio', version: '0.0.1' }))
  t.after(() => rmSync(home, { recursive: true, force: true }))
  const bytes = Buffer.from('test archive bytes'), routes = new Map()
  let stream, finishInstall, denied = false
  t.mock.method(globalThis, 'fetch', async url => {
    if (String(url).endsWith('/latest')) return Response.json({ name: 'dsh-big-fish-aio', version: '0.0.2', dist: { integrity: 'sha512-' + createHash('sha512').update(bytes).digest('base64') } })
    return new Response(new ReadableStream({ start(controller) { stream = controller; controller.enqueue(bytes.subarray(0, 5)) } }), { headers: { 'content-length': String(bytes.length) } })
  })
  const updater = createSelfUpdate({ packageRoot: root })
  updater.register({ effect: fn => fn(), webServer: { register: route => routes.set(route.path, route.handler) },
    get: name => name === 'connection' ? { requestRejection: () => denied ? 401 : null } : undefined,
    pluginManager: { installBundle: () => new Promise(resolve => { finishInstall = resolve }) },
  }, '/fish')
  const invoke = async (path, method = 'GET', body = {}) => {
    const req = Readable.from([JSON.stringify(body)])
    Object.assign(req, { method, url: path, headers: { host: 'localhost', 'content-type': 'application/json' } })
    let status, data
    await routes.get(path)(req, { writeHead(code) { status = code }, end(raw) { data = JSON.parse(raw) } })
    return { status, data }
  }
  const pending = invoke('/fish/install', 'POST', { operationId: 'job-1' })
  for (let i = 0; i < 100 && !stream; i++) await new Promise(setImmediate)
  assert.ok(stream)
  let status = await invoke('/fish/install-status')
  assert.equal(status.data.operationId, 'job-1'); assert.equal(status.data.active, true)
  assert.ok(status.data.progress >= 10 && status.data.progress < 70)
  stream.enqueue(bytes.subarray(5)); stream.close()
  for (let i = 0; i < 100 && !finishInstall; i++) await new Promise(setImmediate)
  assert.ok(finishInstall)
  status = await invoke('/fish/install-status'); assert.equal(status.data.progress, 80)
  assert.ok(!JSON.stringify(status).includes(home))
  finishInstall({ application: 'applied', changed: true }); assert.equal((await pending).data.ok, true)
  status = await invoke('/fish/install-status'); assert.equal(status.data.progress, 100); assert.equal(status.data.active, false)
  denied = true; assert.equal((await invoke('/fish/install-status')).status, 401)
  denied = false; assert.equal((await invoke('/fish/install-status', 'POST')).status, 405)
  assert.equal((await invoke('/fish/install', 'POST', { operationId: '../bad' })).status, 400)
})
