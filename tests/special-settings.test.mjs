import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { Readable } from 'node:stream'

let serial = 0
async function fixture() {
  const home = mkdtempSync(join(tmpdir(), 'fish-special-'))
  const prior = process.env.DSH_HOME, oldFetch = globalThis.fetch
  process.env.DSH_HOME = home
  const path = join(home, 'qq-bridge-config.json'), routes = new Map(), effects = [], agents = new Map()
  let tick
  const config = { 总开关: false, 人设开: true, 人设: '原有全局角色', 绑定: [
    { 类型: '私聊', 号码: '123456', 会话: 'session-private', 人设: '原有私聊角色' },
    { 类型: '群', 号码: '654321', 会话: 'session-group' },
  ] }
  writeFileSync(path, JSON.stringify(config))
  const addAgent = id => {
    const sections = new Map()
    const systemPrompt = {
      section(section) { sections.set(section.name, section); return () => sections.delete(section.name) },
      assemble: async () => ({ sections: [...sections.values()] }),
    }
    const agent = { id, session: { id }, sections, ctx: { get: name => name === 'systemPrompt' ? systemPrompt : null } }
    agents.set(id, agent)
    return agent
  }
  for (const binding of config.绑定) addAgent(binding.会话)
  globalThis.fetch = async () => Response.json({ status: 'ok', data: { user_id: 998877 } })
  const ctx = {
    agents: { get: id => agents.get(id), list: () => [...agents.values()] }, sessions: { list: () => [] },
    get: name => name === 'connection' ? { requestRejection: () => undefined } : null, on: () => () => {}, interval(fn) { tick = fn; return () => {} },
    effect(fn) { const off = fn(); if (off) effects.push(off) },
    webServer: { register({ path, handler }) { routes.set(path, handler); return () => routes.delete(path) } },
  }
  const host = await import('../modules/qq/lib/host.js?special=' + ++serial)
  host.apply(ctx)
  const call = async (action, body = {}) => {
    const req = Readable.from([JSON.stringify(body)])
    Object.assign(req, { method: 'POST', url: '/dsh-qq-bridge/' + action, headers: {} })
    let value
    await routes.get(req.url)(req, { setHeader() {}, end(text) { value = JSON.parse(text) } })
    return value
  }
  return { host, call, agents, addAgent,
    text: id => [...agents.get(id).sections.values()].map(section => section.text).join('\n'),
    read: () => JSON.parse(readFileSync(path, 'utf8')),
    async heartbeat() {
      await tick()
      for (let i = 0; i < 10; i++) await new Promise(setImmediate)
    },
    close() {
      effects.reverse().forEach(off => off())
      globalThis.fetch = oldFetch
      if (prior === undefined) delete process.env.DSH_HOME
      else process.env.DSH_HOME = prior
      rmSync(home, { recursive: true, force: true })
    },
  }
}

test('旧配置默认启用统一身份，独立会话与全局角色均保留并叠加特殊设定', async () => {
  const f = await fixture()
  try {
    const defaults = f.host.归一化(f.read())
    assert.equal(defaults.特殊设定开, true)
    assert.match(defaults.特殊设定, /有且仅有一条大肥鱼/)
    assert.match(defaults.特殊设定, /尚未调取或缺乏证据/)
    assert.equal((await f.call('persona-apply')).生效, 2)
    assert.ok(f.text('session-private').startsWith('原有私聊角色\n\n【特殊设定】'))
    assert.ok(f.text('session-group').startsWith('原有全局角色\n\n【特殊设定】'))
    for (const id of f.agents.keys()) assert.ok(f.text(id).includes(defaults.特殊设定))
    assert.equal(f.read().人设, '原有全局角色')
    assert.equal(f.read().绑定[0].人设, '原有私聊角色')
  } finally { f.close() }
})

test('两个开关独立生效，编辑持久保存，关闭后撤销旧文且保留原角色', async () => {
  const f = await fixture()
  try {
    await f.call('save', { 人设开: false, 特殊设定开: true, 特殊设定: '统一身份 {{原样保留}}' })
    assert.equal((await f.call('persona-apply')).生效, 2)
    for (const id of f.agents.keys()) {
      assert.match(f.text(id), /统一身份 \{\{原样保留\}\}/)
      assert.doesNotMatch(f.text(id), /原有全局角色|原有私聊角色/)
    }
    await f.call('save', { 人设开: true, 特殊设定开: false })
    assert.equal((await f.call('persona-apply')).生效, 2)
    assert.match(f.text('session-private'), /原有私聊角色/)
    assert.match(f.text('session-group'), /原有全局角色/)
    for (const id of f.agents.keys()) assert.doesNotMatch(f.text(id), /特殊设定|统一身份/)
    assert.equal(f.read().特殊设定, '统一身份 {{原样保留}}')
    await f.call('save', { 人设开: false })
    assert.equal((await f.call('persona-apply')).生效, 0)
  } finally { f.close() }
})

test('心跳在全局角色关闭时挂载特殊设定，重复执行幂等，替换 Agent 后重挂，清空后不恢复默认文', async () => {
  const f = await fixture()
  try {
    await f.call('save', { 人设开: false })
    await f.heartbeat()
    await f.heartbeat()
    assert.equal(f.agents.get('session-group').sections.size, 1)
    const old = f.agents.get('session-group')
    f.addAgent('session-group')
    await f.heartbeat()
    assert.equal(old.sections.size, 0)
    assert.match(f.text('session-group'), /有且仅有一条大肥鱼/)
    await f.call('save', { 特殊设定: '', 特殊设定开: false })
    await f.heartbeat()
    assert.doesNotMatch(f.text('session-group'), /特殊设定|有且仅有一条大肥鱼/)
    assert.equal(f.host.归一化(f.read()).特殊设定, '')
    assert.equal(f.host.归一化({ 特殊设定: '设'.repeat(20001) }).特殊设定.length, 20000)
  } finally { f.close() }
})
