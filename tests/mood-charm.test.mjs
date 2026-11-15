import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, readdirSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { createServer } from 'node:http'
import { createCharmImages, MAX_CHARM_BYTES } from '../modules/mood/lib/charm-images.mjs'

const home = mkdtempSync(join(tmpdir(), 'mood-charm-'))
process.env.DSH_HOME = home
const { apply } = await import('../modules/mood/lib/index.js')
after(() => rmSync(home, { recursive: true, force: true }))
const png = readFileSync(new URL('../assets/mood/face/face-ok.png', import.meta.url))
const effects = [], routes = new Map()
let denied = false
const ctx = {
  agents: { list: () => [], roots: () => [] }, llm: {}, on: () => () => {}, interval: () => () => {},
  effect(fn) { const off = fn(); if (off) effects.push(off) },
  webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } },
  get: () => ({ requestRejection: () => denied ? 403 : undefined }),
}
apply(ctx)
after(() => effects.reverse().forEach(off => off()))
async function call(method, tier, bytes = Buffer.alloc(0)) {
  const req = Readable.from([bytes]); Object.assign(req, { method, url: '/dsh-feiyu-mood/charm-image?tier=' + encodeURIComponent(tier) })
  let status, data, headers
  await routes.get('/dsh-feiyu-mood/charm-image')(req, { writeHead(code, h) { status = code; headers = h }, end(raw) { data = raw } })
  return { status, data, headers }
}

test('五档上传与读取保留原始字节，重建后可恢复，替换后 URL 更新', async () => {
  const images = createCharmImages(home)
  assert.equal(images.list().ok.custom, false)
  for (const tier of ['great', 'good', 'ok', 'worry', 'sad']) {
    const uploaded = await call('POST', tier, png)
    assert.equal(uploaded.status, 200)
    const image = JSON.parse(uploaded.data).images[tier]
    assert.equal(image.custom, true)
    assert.match(image.url, new RegExp('tier=' + tier + '&kind=body&v='))
    const result = await call('GET', tier)
    assert.equal(result.headers['content-type'], 'image/png')
    assert.deepEqual(result.data, png)
    assert.deepEqual(createCharmImages(home).read(tier).bytes, png)
  }
  const before = images.list().ok.url
  await call('POST', 'ok', png)
  assert.equal(images.list().ok.url, before, '重复上传相同图片保持 URL 不变')
  const replacement = readFileSync(new URL('../assets/mood/face/face-good.png', import.meta.url))
  await call('POST', 'ok', replacement)
  assert.notEqual(images.list().ok.url, before)
})

test('图片上传拒绝路径穿越、非法内容、空文件与超限文件，失败保留原件', async () => {
  const before = createCharmImages(home).read('ok').bytes
  for (const [tier, bytes, status] of [
    ['../state', png, 400], ['__proto__', png, 400], ['ok', Buffer.from('<svg onload="alert(1)"/>'), 400],
    ['ok', Buffer.alloc(0), 400], ['ok', Buffer.alloc(MAX_CHARM_BYTES + 1), 413],
  ]) assert.equal((await call('POST', tier, bytes)).status, status)
  assert.deepEqual(createCharmImages(home).read('ok').bytes, before)
  assert.equal((await call('PUT', 'ok')).status, 405)
  denied = true
  assert.equal((await call('POST', 'ok', png)).status, 403)
  assert.equal((await call('GET', 'ok')).status, 403)
  denied = false
})

test('真实 HTTP 上传与超限响应可读，状态接口包含最新挂饰 URL', async () => {
  const server = createServer((req, res) => {
    routes.get(new URL(req.url, 'http://localhost').pathname)?.(req, res)
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = 'http://127.0.0.1:' + server.address().port
  try {
    let response = await fetch(base + '/dsh-feiyu-mood/charm-image?tier=good', { method: 'POST', body: png })
    assert.equal(response.status, 200)
    const uploaded = await response.json()
    response = await fetch(base + uploaded.images.good.url)
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), png)
    response = await fetch(base + '/dsh-feiyu-mood/charm-image?tier=good', { method: 'POST', body: Buffer.alloc(MAX_CHARM_BYTES + 1) })
    assert.equal(response.status, 413)
    assert.equal((await response.json()).ok, false)
    response = await fetch(base + '/dsh-feiyu-mood/state')
    assert.equal((await response.json()).charmImages.good.url, uploaded.images.good.url)
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) }
})


test('SHA-256 命名并跨档位和图片类型去重，重建后复用，恢复默认保留共享图片', t => {
  const root = mkdtempSync(join(tmpdir(), 'mood-charm-hash-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const directory = join(root, 'feiyu-mood', 'charm-images')
  const file = createHash('sha256').update(png).digest('hex') + '.png'
  const images = createCharmImages(root)
  images.save('good', png)
  const modified = statSync(join(directory, file), { bigint: true }).mtimeNs
  const firstUrl = images.list().good.url
  images.save('good', png)
  images.save('sad', png)
  images.save('ok', png, 'face')
  assert.deepEqual(readdirSync(directory).filter(name => name.endsWith('.png')), [file])
  assert.equal(statSync(join(directory, file), { bigint: true }).mtimeNs, modified)
  assert.equal(images.list().good.url, firstUrl)
  const reloaded = createCharmImages(root)
  assert.deepEqual(reloaded.read('ok', 'face').bytes, png)
  images.reset('good')
  assert.equal(images.list().good.custom, false)
  assert.deepEqual(images.read('sad').bytes, png)
  images.reset('sad')
  assert.deepEqual(images.read('ok', 'face').bytes, png)
  images.reset('ok', 'face')
  assert.deepEqual(readdirSync(directory), [])
})

test('旧版逐档图片迁移后内容去重，替换只清理已无引用的旧图片', t => {
  const root = mkdtempSync(join(tmpdir(), 'mood-charm-migrate-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const directory = join(root, 'feiyu-mood', 'charm-images')
  mkdirSync(directory, { recursive: true })
  for (const name of ['good.image', 'sad.image', 'face-ok.image']) writeFileSync(join(directory, name), png)
  const images = createCharmImages(root)
  assert.equal(readdirSync(directory).filter(name => name.endsWith('.image')).length, 0)
  assert.equal(readdirSync(directory).filter(name => name.endsWith('.png')).length, 1)
  for (const [tier, kind] of [['good', 'body'], ['sad', 'body'], ['ok', 'face']]) {
    assert.deepEqual(images.read(tier, kind).bytes, png)
  }
  const replacement = readFileSync(new URL('../assets/mood/face/face-good.png', import.meta.url))
  images.save('good', replacement)
  assert.equal(readdirSync(directory).filter(name => name.endsWith('.png')).length, 2)
  images.save('sad', replacement)
  assert.deepEqual(images.read('ok', 'face').bytes, png)
  images.save('ok', replacement, 'face')
  assert.equal(readdirSync(directory).filter(name => name.endsWith('.png')).length, 1)
  assert.deepEqual(images.read('good').bytes, replacement)
  writeFileSync(join(directory, 'good.image'), png)
  assert.deepEqual(createCharmImages(root).read('good').bytes, replacement, '迁移重试保留已提交的新引用')
  assert.equal(readdirSync(directory).includes('good.image'), false)
  writeFileSync(join(directory, 'good.json'), JSON.stringify({ file: '../outside.png' }))
  assert.throws(() => images.read('good'), /引用无效/)
  assert.throws(() => images.reset('good'), /引用无效/)
  assert.throws(() => images.save('good', png), /引用无效/)
})
