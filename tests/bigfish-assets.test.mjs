import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { bigfishImages, bigfishImageUrl, registerBigfishAssets } from '../lib/bigfish-assets.mjs'

test('全部贴纸插画均通过精确路由提供原 PNG，并逐文件纳入安装包白名单', async () => {
  const routes = []
  registerBigfishAssets({ effect: fn => fn(), webServer: { register: route => { routes.push(route) } } })
  assert.deepEqual(bigfishImages, readdirSync(new URL('../assets/bigfish/', import.meta.url)).filter(name => name.endsWith('.png')).sort())
  const files = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).files
  assert.equal(files.includes('assets'), false, '不要把目录中的未审查附带文件整体打包')
  for (const name of bigfishImages) {
    assert.ok(files.includes('assets/bigfish/' + name), name)
    const route = routes.find(route => route.path === bigfishImageUrl(name))
    assert.equal(route.kind, 'exact')
    await route.handler({}, {
      writeHead(status, headers) { assert.equal(status, 200); assert.equal(headers['content-type'], 'image/png') },
      end(bytes) { assert.deepEqual(bytes, readFileSync(new URL('../assets/bigfish/' + name, import.meta.url))) },
    })
  }
})

test('根 assets 图片无重复内容，旧 exec 图片路由仍可读取原件', async () => {
  const paths = readdirSync(new URL('../assets/', import.meta.url), { recursive: true }).filter(path => path.endsWith('.png'))
  const hashes = paths.map(path => createHash('sha256').update(readFileSync(new URL('../assets/' + path, import.meta.url))).digest('hex'))
  assert.equal(new Set(hashes).size, hashes.length)
  assert.equal(readdirSync(new URL('../modules/mood/assets/', import.meta.url)).some(path => path.endsWith('.png')), false)
  assert.equal(paths.some(path => path.includes('exec-')), false)
  const routes = []
  registerBigfishAssets({ effect: fn => fn(), webServer: { register: route => routes.push(route) } })
  const aliases = routes.filter(route => route.path.includes('/exec-'))
  assert.equal(aliases.length, 7)
  for (const route of aliases) await route.handler({}, {
    writeHead(status) { assert.equal(status, 200) },
    end(bytes) { assert.ok(hashes.includes(createHash('sha256').update(bytes).digest('hex'))) },
  })
})
