import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { managementRejection } from '../lib/management-auth.mjs'

test('管理鉴权缺失、抛错、异步拒绝和未知返回值都不能放行', async () => {
  const request = { method: 'POST' }
  for (const ctx of [{}, { get() { throw Error('synthetic secret') } }, { get: () => ({}) },
    { get: () => ({ requestRejection() { throw Error('synthetic secret') } }) },
    { get: () => ({ requestRejection: async () => { throw Error('synthetic secret') } }) }]) {
    assert.equal(await managementRejection(ctx, request), 503)
  }
  for (const [value, expected] of [[undefined, 0], [null, 0], [false, 0], [0, 0], [401, 401], [403, 403], [500, 503], ['allow', 503]]) {
    assert.equal(await managementRejection({ get: () => ({ requestRejection: async req => { assert.equal(req, request); return value } }) }, request), expected)
  }
})

test('四模块的管理读写在鉴权不可用时返回 503，且不读取请求正文', async t => {
  const home = mkdtempSync(join(tmpdir(), 'bigfish-auth-'))
  const previous = process.env.DSH_HOME
  process.env.DSH_HOME = home
  t.after(() => { if (previous === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previous; rmSync(home, { recursive: true, force: true }) })
  for (const [module, entry, prefix, read, write] of [
    ['qq', 'host.js', '/dsh-qq-bridge', '/state', '/save'],
    ['memory', 'index.js', '/dsh-fish-memory', '/list', '/policy'],
    ['mood', 'index.js', '/dsh-feiyu-mood', '/state', '/config'],
    ['speak', 'host.js', '/dsh-speak-up', '/state', '/save'],
  ]) {
    const routes = new Map(), cleanups = []
    let connection
    const ctx = {
      get: name => name === 'connection' ? connection : undefined,
      effect(fn) { const cleanup = fn(); if (typeof cleanup === 'function') cleanups.push(cleanup) },
      on: () => () => {}, interval: () => () => {},
      webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } },
      agents: { list: () => [], roots: () => [] }, sessions: { list: () => [] },
    }
    const plugin = await import(`../modules/${module}/lib/${entry}`)
    plugin.apply(ctx)
    try {
      for (connection of [undefined, {}, { requestRejection() { throw Error('synthetic secret') } }, { requestRejection: async () => { throw Error('synthetic secret') } }]) {
        for (const path of [read, write]) {
          let status, body, consumed = false
          const response = { set statusCode(value) { status = value }, setHeader() {}, writeHead(value) { status = value }, end(value) { body = String(value) } }
          const handler = routes.get(prefix + path)
          assert.ok(handler, module + path)
          await handler({ method: path === read ? 'GET' : 'POST', url: prefix + path, headers: {},
            async *[Symbol.asyncIterator]() { consumed = true; yield '{"enabled":true}' } }, response)
          assert.equal(status, 503, module + path)
          assert.equal(consumed, false, module + path)
          assert.equal(body.includes('synthetic secret'), false)
        }
      }
    } finally { cleanups.reverse().forEach(fn => fn()) }
  }
})

test('共享鉴权实现随安装包分发', () => {
  assert.ok(JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).files.includes('lib/management-auth.mjs'))
})
