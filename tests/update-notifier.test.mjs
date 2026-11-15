import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import vm from 'node:vm'
import { createSelfUpdate } from '../lib/selfupdate.mjs'

const source = readFileSync(new URL('../src/update-notifier.js', import.meta.url), 'utf8')
const flush = () => new Promise(resolve => setImmediate(resolve))

test('自动检查启动、随机轮询、退避、安装后目标去重与取消清理', async () => {
  let cleanup, time = 1000000, calls = 0, notice, failed = false, pending, installed = null
  const timers = new Map(), windowEvents = new Map(), documentEvents = new Map()
  let serial = 0
  const events = map => ({ addEventListener: (name, fn) => map.set(name, fn), removeEventListener: name => map.delete(name) })
  let result = { ok: true, channel: 'beta', latest: '0.5.27', latestCommit: 'a'.repeat(40), hasUpdate: true }
  const sandbox = {
    React: { useEffect: effect => { cleanup = effect() } }, Date: { now: () => time }, Math: { random: () => .5, min: Math.min }, AbortController,
    fishNotify: text => { notice = text },
    request: async (url, options) => {
      if (url.endsWith('/version')) return { postUpdate: installed }
      calls++; assert.equal(url, '/dsh-big-fish-aio/update')
      if (pending) return new Promise(resolve => { pending.resolve = resolve; pending.signal = options.signal })
      if (failed) throw Error('offline')
      return result
    },
    setTimeout: (fn, delay) => { timers.set(++serial, { fn, delay }); return serial }, clearTimeout: id => timers.delete(id),
    window: events(windowEvents), document: { ...events(documentEvents), visibilityState: 'visible' },
  }
  vm.createContext(sandbox)
  const logs = readFileSync(new URL('../src/update-log.js', import.meta.url), 'utf8')
  vm.runInContext(logs + '\n' + source + '\nglobalThis.Component = UpdateNotifier; globalThis.state = FISH_UPDATE; globalThis.queue = FISH_LOG', sandbox)
  sandbox.Component(); await flush()
  assert.equal(sandbox.queue.pending, null, '发现新版本不提前弹出日志')
  assert.equal([...timers.values()].at(-1).delay, 30 * 60000)
  sandbox.queue.pending = null
  time += 60000; windowEvents.get('focus')(); await flush(); assert.equal(calls, 1)
  time += 30 * 60000; await [...timers.values()].at(-1).fn(); assert.equal(sandbox.queue.pending, null)
  result = { ...result, latestCommit: 'b'.repeat(40) }
  time += 30 * 60000; await [...timers.values()].at(-1).fn()
  assert.equal(sandbox.queue.pending, null, '同版本新提交尚未安装，不弹日志')
  installed = { ...result, postInstall: true, hasUpdate: false }
  windowEvents.get('focus')(); await flush()
  assert.equal(sandbox.queue.pending.target.latestCommit, result.latestCommit)
  sandbox.queue.pending = null
  windowEvents.get('focus')(); await flush(); assert.equal(sandbox.queue.pending, null, '同一已安装目标不重复排队')
  installed = null
  sandbox.queue.pending = null
  result = { ...result, latestCommit: 'c'.repeat(40), reminderDismissed: true }
  time += 30 * 60000; await [...timers.values()].at(-1).fn(); assert.equal(sandbox.queue.pending, null)
  failed = true; time += 30 * 60000; await [...timers.values()].at(-1).fn()
  assert.match(notice, /失败/); assert.equal([...timers.values()].at(-1).delay, 2 * 60000)
  time += 3 * 60000; await [...timers.values()].at(-1).fn(); assert.equal([...timers.values()].at(-1).delay, 4 * 60000)
  failed = false; pending = {}; time += 30 * 60000
  const running = [...timers.values()].at(-1).fn(); cleanup()
  assert.equal(pending.signal.aborted, true)
  pending.resolve({ ...result, reminderDismissed: false }); await running
  assert.equal(sandbox.queue.pending, null); assert.equal(windowEvents.size, 0); assert.equal(documentEvents.size, 0)
})

test('版本重设期间不提示升级回历史编号，旧系列可识别新系列迁移', async () => {
  const home = mkdtempSync(join(tmpdir(), 'fish-series-'))
  const originalFetch = globalThis.fetch
  try {
    const create = version => {
      const root = join(home, version); mkdirSync(root)
      writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'dsh-big-fish-aio', version }))
      return createSelfUpdate({ packageRoot: root })
    }
    let version = '1.5.1-1'
    globalThis.fetch = async () => Response.json({ name: 'dsh-big-fish-aio', version, dist: { integrity: 'sha512-' + 'a'.repeat(86) + '==' } })
    const current = create('0.0.1')
    const oldMirror = await current.check(true)
    assert.equal(oldMirror.hasUpdate, false); assert.equal(oldMirror.legacyRelease, true)
    version = '0.0.1'
    assert.equal((await create('1.5.1-1').check(true)).hasUpdate, true)
    assert.equal((await current.check(true)).hasUpdate, false)
    version = '0.0.2'
    assert.equal((await current.check(true)).hasUpdate, true)
  } finally { globalThis.fetch = originalFetch; rmSync(home, { recursive: true, force: true }) }
})


test('重载早于成功记录写入时短轮询补查，取消后不再打开日志', async () => {
  const saved = new Map()
  const timers = new Map()
  let serial = 0, cleanup, reads = 0
  const target = { ok: true, postInstall: true, channel: 'github', latest: '1.1.0', latestCommit: 'b'.repeat(40) }
  const sandbox = {
    React: { useEffect: effect => { cleanup = effect() } }, Date, Math, AbortController,
    fishNotify() {},
    request: async url => url.endsWith('/version') ? { postUpdate: ++reads > 1 ? target : null } : { ok: true, hasUpdate: true, latest: '1.1.0', channel: 'github' },
    setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { delay, fn: () => { timers.delete(id); return fn() } }); return id },
    clearTimeout: id => timers.delete(id),
    window: { localStorage: { getItem: () => String(Date.now()) }, sessionStorage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value), removeItem: key => saved.delete(key) }, addEventListener() {}, removeEventListener() {} },
    document: { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} },
  }
  vm.createContext(sandbox)
  const logs = readFileSync(new URL('../src/update-log.js', import.meta.url), 'utf8')
  vm.runInContext(logs + '\n' + source + '\nglobalThis.queue = FISH_LOG', sandbox)
  sandbox.UpdateNotifier(); await flush()
  assert.equal(sandbox.queue.pending, null)
  await [...timers.values()].find(timer => timer.delay === 1000).fn()
  assert.equal(sandbox.queue.pending.target, target)
  assert.equal(saved.has('big-fish:await-update-log'), false)
  cleanup(); assert.equal(timers.size, 0)
})
