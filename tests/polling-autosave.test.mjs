import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
test('保存消息轮询间隔后立即替换旧定时器，重复保存不重复注册', async () => {
  const home = mkdtempSync(join(tmpdir(), 'fish-polling-')), previous = process.env.DSH_HOME
  process.env.DSH_HOME = home
  const routes = new Map(), timers = [], cleanups = []
  const { apply } = await import('../modules/qq/lib/host.js?polling=' + home)
  try {
    apply({ effect(fn) { const off = fn(); if (off) cleanups.push(off) }, on: () => () => {},
      interval(fn, ms) { const timer = { ms, stopped: false }; timers.push(timer); return () => { timer.stopped = true } },
      agents: { list: () => [] }, sessions: { list: () => [] }, get: name => name === 'connection' ? { requestRejection: () => null } : null,
      webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } } })
    const initial = timers.find(timer => timer.ms === 2000)
    assert.ok(initial)
    const save = async () => {
      let data
      const request = Readable.from([JSON.stringify({ 总开关: false, 轮询间隔毫秒: 800 })])
      Object.assign(request, { method: 'POST', url: '/dsh-qq-bridge/save', headers: { 'content-type': 'application/json' } })
      await routes.get('/dsh-qq-bridge/save')(request, { writeHead() {}, end(raw) { data = JSON.parse(raw) } })
      assert.equal(data.ok, true)
    }
    await save(); assert.equal(initial.stopped, true)
    assert.equal(timers.filter(timer => timer.ms === 800).length, 1)
    await save(); assert.equal(timers.filter(timer => timer.ms === 800).length, 1)
  } finally {
    cleanups.reverse().forEach(fn => fn()); rmSync(home, { recursive: true, force: true })
    if (previous === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previous
  }
})
