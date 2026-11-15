import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

function fixture() {
  let plugin, syncing = true, serial = 0, disposed = false
  const attempted = [], selected = [], timers = new Map(), subscribers = new Set(), cleanups = [], registrations = []
  const storage = new Map([['big-fish-aio.reopen-after-update', String(Date.now())]])
  const React = { createElement: (type, props, ...children) => ({ type, props, children }), Fragment: 'fragment' }
  const sandbox = { setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { fn, delay }); return id }, clearTimeout: id => timers.delete(id),
    window: { localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
      __ModuleLoader__: { load: ({ factory }) => { plugin = factory(() => React) } } } }
  vm.runInNewContext(readFileSync(new URL('../client.js', import.meta.url), 'utf8'), sandbox)
  const readiness = { getSnapshot: () => ({ syncing }), subscribe: listener => { subscribers.add(listener); return () => subscribers.delete(listener) } }
  const services = {
    modules: { entries: { state: readiness } },
    slots: { inject: (_, fn) => { const cleanup = fn(); if (typeof cleanup === 'function') cleanups.push(cleanup) },
      register: (options, component) => { registrations.push({ options, component }); return () => {} } },
    layout: { selectPanel: id => { attempted.push(id); assert.equal(disposed, false, '卸载后不可操作布局'); assert.equal(syncing, false, '宿主热更新期间不可切页'); selected.push(id) } },
  }
  return { attempted, selected, timers, subscribers, storage, registrations,
    apply: () => plugin.apply({ get: name => services[name] }),
    ready: () => { syncing = false; subscribers.forEach(fn => fn()) },
    flush: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(timer => timer.fn()) },
    dispose: () => { disposed = true; cleanups.reverse().forEach(fn => fn()) },
  }
}

test('更新重开等宿主热重载结束后异步执行，成功只切页一次', () => {
  const env = fixture()
  env.apply()
  assert.equal(env.attempted.length, 0)
  assert.equal(env.selected.length, 0)
  env.flush(); assert.equal(env.selected.length, 0)
  env.ready(); env.flush()
  assert.deepEqual(env.selected, ['big-fish-aio'])
  env.flush(); assert.equal(env.selected.length, 1)
  assert.equal(env.storage.has('big-fish-aio.reopen-after-update'), false)
  env.dispose()
  assert.equal(env.timers.size, 0); assert.equal(env.subscribers.size, 0)
})

test('更新过程中卸载取消回调，即使旧回调迟到也不会操作新布局', () => {
  const env = fixture()
  env.apply()
  const stale = [...env.timers.values()]
  env.dispose()
  env.ready(); stale.forEach(timer => timer.fn())
  assert.equal(env.selected.length, 0)
  assert.equal(env.timers.size, 0); assert.equal(env.subscribers.size, 0)
})
