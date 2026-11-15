import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { recordSource } from '../../qq/lib/memory-sources.mjs'
import { memorySlots } from '../lib/memory-binding.mjs'

const home = mkdtempSync(join(tmpdir(), 'mood-memory-'))
process.env.DSH_HOME = home
const { apply, __测试: helpers } = await import('../lib/index.js')
after(() => rmSync(home, { recursive: true, force: true }))
const flush = async () => { for (let i = 0; i < 12; i++) await new Promise(setImmediate) }
const write = (name, value) => writeFileSync(join(home, name), JSON.stringify(value))

function fixture(config) {
  mkdirSync(join(home, 'feiyu-mood'), { recursive: true })
  rmSync(join(home, 'feiyu-mood/config.json'), { force: true })
  if (config) write('feiyu-mood/config.json', config)
  helpers.存库({ moods: {}, lastActive: '' })
  const bridge = { NapCat: 'http://fixture', 令牌: '', 绑定: [
    { 类型: '私聊', 号码: '10001', 会话: 'owner', 称呼: '主人', 主人QQ: true },
    { 类型: '私聊', 号码: '10002', 会话: 'peer', 称呼: '朋友' },
    { 类型: '群', 号码: '20001', 会话: 'isolated', 称呼: '隔离群' },
    { 类型: '群', 号码: '20002', 会话: 'sharedA', 称呼: '普通群甲' },
    { 类型: '群', 号码: '20003', 会话: 'sharedB', 称呼: '普通群乙' },
    { 类型: '群', 号码: '20004', 会话: 'unknown' },
  ] }
  const settings = { qqIsolatedGroups: ['20001'] }
  write('qq-bridge-config.json', bridge)
  write('fish-memory-config.json', settings)
  write('qq-bridge-memory-sources.json', { sessions: {} })
  for (const row of bridge.绑定.slice(0, -1)) recordSource(home, bridge, '99999', row, row.会话, ['10001'])
  const routes = new Map(), effects = [], intervals = [], calls = [], listeners = new Map(), contexts = new Map(), hostEvents = new Map()
  const agents = bridge.绑定.map(row => {
    const sid = row.会话
    const events = new Map()
    listeners.set(sid, events)
    return { session: { id: sid, snapshotEvents: () => [
      { type: 'user/message', data: { id: sid, content: [{ type: 'text', text: '【新消息】\n甲：今天真开心\n乙：一起庆祝' }], source: { kind: 'qq' } } },
      { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '我也替你们开心' }] } } },
    ] }, options: { provider: 'fake', model: 'fixture' }, ctx: {
      on(name, fn) { events.set(name, fn); return () => events.delete(name) },
      systemPrompt: { context(item) { contexts.set(sid, item); return () => contexts.delete(sid) } },
    } }
  })
  const ctx = {
    get: name => name === 'connection' ? { requestRejection: () => undefined } : undefined,
    agents: { list: () => agents, roots: () => agents },
    effect(fn) { const off = fn(); if (typeof off === 'function') effects.push(off) },
    interval(fn) { intervals.push(fn); return () => {} },
    on(name, fn) { hostEvents.set(name, fn); return () => hostEvents.delete(name) },
    webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } },
    llm: { async *stream(input) {
      let release
      const pending = new Promise(resolve => { release = resolve })
      calls.push({ input, release })
      await pending
      yield { type: 'text-delta', text: JSON.stringify({ moodDelta: 9, dims: { happy: 6 }, reason: '甲分享了好消息，我当时也笑了', confidence: 95 }) }
    } },
  }
  apply(ctx)
  async function request(path, body) {
    const req = Readable.from(body ? [JSON.stringify(body)] : [])
    Object.assign(req, { method: body ? 'POST' : 'GET', url: path })
    let result
    await routes.get(path.split('?')[0])(req, { writeHead(code) { assert.equal(code, 200) }, end(raw) { result = JSON.parse(raw) } })
    return result
  }
  return { bridge, settings, calls, contexts, request,
    turn: sid => listeners.get(sid).get('agent/turn-stopping')?.(),
    tick: () => intervals.forEach(fn => fn()),
    settle: async i => { calls[i].release(); await flush() },
    close: () => effects.reverse().forEach(off => off()),
    saveSettings: () => write('fish-memory-config.json', settings),
    saveBridge: () => write('qq-bridge-config.json', bridge),
    receive(sid) {
      const row = bridge.绑定.find(b => b.会话 === sid)
      recordSource(home, bridge, '99999', row, sid, ['10001'])
      hostEvents.get('session/event')(agents.find(a => a.session.id === sid).session, { type: 'user/message' })
    },
  }
}

test('默认按记忆写入库绑定，私聊和隔离群独立、普通群共享，未知来源不挂载', async () => {
  const f = fixture()
  try {
    assert.equal((await f.request('/dsh-feiyu-mood/config')).config.模式, 'memory')
    assert.equal(memorySlots(home).length, 4)
    assert.deepEqual(memorySlots(home).find(s => s.id.endsWith('_shared')).sessions, ['sharedA', 'sharedB'])
    assert.equal(f.contexts.has('unknown'), false)
    f.receive('unknown')
    assert.equal(f.contexts.has('unknown'), true, '首次核验来源后立即挂载，无需等待三秒')
    f.turn('sharedA'); await flush(); await f.settle(0)
    assert.match(f.calls[0].input.system, /多个人/)
    assert.doesNotMatch(f.calls[0].input.system, /是群成员的伴侣/)
    assert.match(f.calls[0].input.messages[0].content[0].text, /甲：今天真开心\n乙：一起庆祝/)
    f.turn('sharedB'); await flush(); await f.settle(1)
    const shared = await f.request('/dsh-feiyu-mood/state?key=sharedB')
    assert.equal(shared.key, 'qq_99999_shared')
    assert.equal(shared.mood, 76)
    assert.equal(shared.timeline.length, 2)
    assert.equal(shared.mountedSessions, 3)
    assert.match(f.contexts.get('sharedA').text(), /甲分享了好消息/)
    assert.equal(f.contexts.get('sharedB').text(), '', '同库心情仅注入一次')
    for (const sid of ['owner', 'peer', 'isolated']) {
      const state = await f.request('/dsh-feiyu-mood/state?key=' + sid)
      assert.equal(state.timeline.length, 0)
      assert.equal(f.contexts.get(sid).text(), '', '主人跨库读记忆不会合并心情')
    }
  } finally { f.close() }
})

test('隔离变更立即封住旧提示词和在飞判断，新库接续运行，原库保留', async () => {
  const f = fixture()
  try {
    f.turn('sharedA'); await flush(); await f.settle(0)
    f.turn('sharedA'); await flush()
    f.settings.qqIsolatedGroups.push('20002'); f.saveSettings()
    assert.equal(f.contexts.get('sharedA').text(), '', '不等待轮询也不能注入原共享库')
    await f.settle(1)
    assert.equal(helpers.读库().moods.qq_99999_shared.timeline.length, 1)
    f.tick(); f.turn('sharedA'); await flush(); await f.settle(2)
    const state = await f.request('/dsh-feiyu-mood/state?key=sharedA')
    assert.equal(state.key, 'qq_99999_group_20002')
    assert.equal(state.mood, 73)
    assert.equal(state.timeline.length, 1)
    assert.equal(helpers.读库().moods.qq_99999_shared.timeline.length, 1)
    f.bridge.绑定.find(b => b.会话 === 'sharedA').开 = false; f.saveBridge()
    assert.equal(f.contexts.get('sharedA').text(), '')
    f.tick(); assert.equal(f.contexts.has('sharedA'), false)
    f.bridge.绑定.push({ 类型: '群', 号码: '22222', 会话: 'sharedB' }); f.saveBridge(); f.tick()
    assert.equal(f.contexts.has('sharedB'), false, '歧义映射不挂载')
  } finally { f.close() }
})

test('自定义绑定、空绑定和关闭设置保持兼容，切换模式保留自定义份', async () => {
  for (const config of [{ slots: [{ id: 'custom', sessions: ['owner'] }] }, { slots: [] }, { autoJudge: false }]) {
    const f = fixture(config)
    try {
      const c = (await f.request('/dsh-feiyu-mood/config')).config
      assert.equal(c.模式, config.slots ? 'session' : 'memory')
      if (!config.slots) { f.turn('owner'); await flush(); assert.equal(f.calls.length, 0) }
      if (config.slots?.length) {
        await f.request('/dsh-feiyu-mood/config', { 模式: 'memory' })
        assert.equal(memorySlots(home).length, 4)
        const saved = await f.request('/dsh-feiyu-mood/config', { 模式: 'session' })
        assert.equal(saved.config.slots[0].id, 'custom')
        assert.deepEqual(saved.config.slots[0].sessions, ['owner'])
      }
    } finally { f.close() }
  }
})

test('旧单份心情保留在原默认库，不自动并入任何 QQ 分库', async () => {
  const f = fixture()
  try {
    write('feiyu-mood/state.json', { mood: 91, dims: { happy: 10 } })
    const state = await f.request('/dsh-feiyu-mood/state?key=owner')
    assert.equal(state.mood, 70)
    assert.equal(helpers.读库().moods.__default__.mood, 91)
    assert.equal(f.contexts.get('owner').text(), '')
  } finally { f.close() }
})

test('旧绑定接口显式设置会话时进入自定义模式', async () => {
  const f = fixture()
  try {
    const saved = await f.request('/dsh-feiyu-mood/config', { targetSession: 'owner' })
    assert.equal(saved.config.模式, 'session')
    const state = await f.request('/dsh-feiyu-mood/state')
    assert.deepEqual(state.slots[0].sessions, ['owner'])
    assert.equal(state.mountedSessions, 1)
  } finally { f.close() }
})
