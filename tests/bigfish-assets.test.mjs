import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { bigfishImages, bigfishImageUrl, registerBigfishAssets, reportBackgrounds, reportBackgroundUrl } from '../lib/bigfish-assets.mjs'

test('PNG 贴纸及 WebP 报告背景通过精确路由提供，并逐文件纳入安装包白名单', async () => {
  const routes = []
  registerBigfishAssets({ effect: fn => fn(), webServer: { register: route => { routes.push(route) } } })
  assert.deepEqual(bigfishImages, readdirSync(new URL('../assets/bigfish/', import.meta.url)).filter(name => name.startsWith('sticker-') && name.endsWith('.png')).sort())
  const files = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).files
  assert.equal(files.includes('assets'), false, '不要把目录中的未审查附带文件整体打包')
  for (const assets of Object.values(reportBackgrounds)) assert.equal(assets.length, 5)
  const stickers = bigfishImages.map(name => [bigfishImageUrl(name), 'bigfish/' + name])
  const backgrounds = Object.values(reportBackgrounds).flat().map(asset => [reportBackgroundUrl(asset), asset])
  for (const [url, asset] of [...stickers, ...backgrounds]) {
    assert.ok(files.includes('assets/' + asset), asset)
    const route = routes.find(route => route.path === url)
    assert.equal(route.kind, 'exact')
    await route.handler({}, {
      writeHead(status, headers) {
        assert.equal(status, 200)
        assert.equal(headers['content-type'], url.startsWith('/dsh-big-fish-aio/report-background/') ? 'image/webp' : 'image/png')
      },
      end(bytes) { assert.deepEqual(bytes, readFileSync(new URL('../assets/' + asset, import.meta.url))) },
    })
  }
})

test('根 assets 图片无重复内容，旧 exec 图片路由仍可读取原件', async () => {
  const paths = readdirSync(new URL('../assets/', import.meta.url), { recursive: true }).filter(path => /\.(png|webp)$/.test(path))
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
