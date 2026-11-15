import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'

const home = mkdtempSync(join(tmpdir(), 'speak-controls-'))
process.env.DSH_HOME = home
const host = await import('../modules/speak/lib/host.js')
const routes = new Map(), timers = [], cleanups = [], sent = []
let inspect = async () => ({ events: [] })
const member = { id: 'fish', path: home, sessionIds: ['session-A'], async attachSession(id) { this.sessionIds.push(id) } }
const other = { id: 'other', path: home, sessionIds: ['session-B'] }
const agents = ['A', 'B'].map(id => ({ id: 'session-' + id, status: 'idle', session: { id: 'session-' + id }, followup: async m => sent.push(m) }))
const write = (file, value) => writeFileSync(join(home, file), JSON.stringify(value))
write('qq-bridge-config.json', { 工作区: 'fish' })
write('speak-up-config.json', { 总开关: true, 试运行: false, 目标会话: ['session-A'], 安静起: 0, 安静止: 0, 峰时命中线: 100, 谷时命中线: 100, 搭话冷却分钟: 0 })
const ctx = {
  connection: { requestRejection: () => undefined },
  workspaceRegistry: { list: () => [member, other], get: id => id === 'fish' ? member : other, archivedSessionIds: [] },
  agents: { list: () => agents, get: id => agents.find(a => a.id === id) },
  sessions: { list: () => agents.map(a => a.session), get: id => agents.find(a => a.id === id)?.session },
  sessionController: { inspect: (...args) => inspect(...args), create: async options => { assert.equal(options.cwd, home); return { sessionId: 'session-new' } } },
  sessionTitle: { get: s => ({ title: s.id }) },
  webServer: { register: r => { routes.set(r.path, r.handler); return () => {} } },
  interval: cb => { timers.push(cb); return () => {} }, on: () => () => {},
  effect: fn => { const off = fn(); if (typeof off === 'function') cleanups.push(off) },
  logger: { info() {}, warn() {} }, get(name) { return this[name] },
}
host.apply(ctx)
async function call(path, body) {
  const req = Readable.from(body ? [JSON.stringify(body)] : [])
  Object.assign(req, { method: body ? 'POST' : 'GET', headers: {} })
  let result
  await routes.get('/dsh-speak-up/' + path)(req, { writeHead() {}, end(raw) { result = JSON.parse(raw) } })
  return result
}
const save = body => call('save', body)
const tick = async () => { timers.at(-1)(); await new Promise(resolve => setTimeout(resolve, 30)) }

test('主动搭话开关、所有输入、时区、工作区与发送前配置回归', async () => {
  try {
    assert.deepEqual((await call('state')).活着的会话.map(s => s.id), ['session-A'])
    assert.equal((await save({ 目标会话: ['session-B'] })).ok, false)
    assert.equal((await save({ 目标会话: 'A, session-A' })).配置.目标会话.length, 1)
    const numbers = { 间隔分钟: 7, 峰时命中线: 23, 谷时命中线: 61, 没中加成: 3, 加成上限: 37, 搭话冷却分钟: 9, 安静起: 23, 安静止: 7, 近阈值分钟: 18, 近因子: 0.2, 远阈值分钟: 420, 远因子: 1.6 }
    const saved = await save({ ...numbers, 峰谷时区: 'Asia/Shanghai', 触发文案: '来聊聊', 角色: 'user' })
    for (const [key, value] of Object.entries(numbers)) assert.equal(saved.配置[key], value, key)
    assert.equal(saved.配置.触发文案, '来聊聊')
    assert.equal((await save({ 间隔分钟: '' })).ok, false)
    assert.equal((await save({ 近因子: 'abc' })).ok, false)
    assert.equal((await save({ 峰谷时区: 'Invalid/Zone' })).ok, false)
    const config = (await call('state')).配置
    for (const hour of [23, 0, 6]) {
      const date = new Date(`2026-11-09T${String((hour + 16) % 24).padStart(2, '0')}:00:00Z`)
      assert.match(host.搭话拦截原因(ctx, 'A', config, date), /安静时段/)
    }
    assert.equal(host.搭话拦截原因(ctx, 'A', config, new Date('2026-11-08T23:00:00Z')), '') // 上海 7 点，结束边界
    assert.equal(host.搭话拦截原因(ctx, 'A', { ...config, 安静起: 7, 安静止: 7 }), '')
    assert.match(host.搭话拦截原因(ctx, 'A', { ...config, 试运行: true, 安静起: 0, 安静止: 0 }), /试运行/)
    assert.equal(host.搭话拦截原因(ctx, 'A', { ...config, 试运行: true, 安静起: 0, 安静止: 0 }, new Date(), true), '')
    await save({ 总开关: false })
    await call('roll', { 模式: '真发' }); assert.equal(sent.length, 0)
    await save({ 总开关: true, 试运行: true, 安静起: 0, 安静止: 0, 峰时命中线: 100, 谷时命中线: 100 })
    await tick(); assert.equal(sent.length, 0)
    await call('roll', { 模式: '演练' }); assert.equal(sent.length, 0)
    await save({ 角色: 'developer' }); await call('roll', { 模式: '真发' }); assert.equal(sent.length, 0)
    await save({ 角色: 'user', 试运行: false })
    member.sessionIds.push('session-C')
    agents.push({ ...agents[0], id: 'session-C', session: { id: 'session-C' } })
    await save({ 目标会话: ['session-C'] })
    let release
    inspect = () => new Promise(resolve => { release = resolve })
    await tick()
    assert.equal(typeof release, 'function')
    await save({ 总开关: false })
    release({ events: [] }); await new Promise(resolve => setTimeout(resolve, 30))
    assert.equal(sent.length, 0, '异步读取历史期间关闭开关，不能使用旧配置投递')
    await save({ 总开关: true, 目标会话: ['session-A'] })
    await call('roll', { 模式: '真发' }); assert.equal(sent.length, 1)
    ctx.workspaceRegistry.archivedSessionIds = ['A']
    assert.deepEqual((await call('state')).活着的会话.map(s => s.id), ['session-C'])
    await call('roll', { 模式: '真发' }); assert.equal(sent.length, 1)
    ctx.workspaceRegistry.archivedSessionIds = []
    write('qq-bridge-config.json', { 工作区: 'other' })
    assert.deepEqual((await call('state')).活着的会话.map(s => s.id), ['session-B'])
    await call('roll', { 模式: '真发' }); assert.equal(sent.length, 1)
    write('qq-bridge-config.json', { 工作区: 'fish' })
    const created = await call('new-session', { 设为目标: true, cwd: '/untrusted' })
    assert.equal(created.ok, true); assert.ok(member.sessionIds.includes('session-new'))
    write('qq-bridge-config.json', {})
    assert.deepEqual((await call('state')).活着的会话, [])
    assert.equal((await call('new-session', { 设为目标: true })).ok, false)
  } finally {
    for (const off of cleanups.reverse()) off()
    rmSync(home, { recursive: true, force: true })
  }
})
