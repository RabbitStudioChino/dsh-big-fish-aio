import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { Readable } from 'node:stream'
import { ownerQQ } from '../modules/qq/lib/memory-sources.mjs'

const privateRow = (号码 = '10001', extra = {}) => ({ 类型: '私聊', 号码, 会话: 'chat-' + 号码, ...extra })
let serial = 0
async function fixture(bindings, memory = { qqOwner: '10001', qqIsolatedGroups: ['20001'] }) {
  const home = mkdtempSync(join(tmpdir(), 'fish-owner-')), prior = process.env.DSH_HOME
  process.env.DSH_HOME = home
  const write = (name, value) => writeFileSync(join(home, name), JSON.stringify(value))
  const read = name => JSON.parse(readFileSync(join(home, name), 'utf8'))
  write('qq-bridge-config.json', { 总开关: false, 人设: '原有全局角色', 特殊设定: '原有特殊设定', 绑定: bindings })
  write('fish-memory-config.json', memory)
  const host = await import('../modules/qq/lib/host.js?owner=' + ++serial), routes = new Map(), effects = []
  const start = () => host.apply({
    get: name => name === 'connection' ? { requestRejection: () => undefined } : null, on: () => () => {}, interval: () => () => {},
    agents: { list: () => [] }, sessions: { list: () => [] },
    effect(fn) { const off = fn(); if (off) effects.push(off) },
    webServer: { register({ path, handler }) { routes.set(path, handler); return () => {} } },
  })
  start()
  return { host, start, read, write, async call(action, body) {
    const req = Readable.from([JSON.stringify(body)])
    Object.assign(req, { method: 'POST', headers: {}, url: '/dsh-qq-bridge/' + action })
    let value
    await routes.get(req.url)(req, { setHeader() {}, end(text) { value = JSON.parse(text) } })
    return value
  }, close() {
    effects.reverse().forEach(off => off())
    if (prior === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = prior
    rmSync(home, { recursive: true, force: true })
  } }
}

test('唯一主人只来自私聊映射布尔勾选，停用不抹去身份，歧义一律不授权', () => {
  const owner = privateRow('10001', { 主人QQ: true })
  assert.equal(ownerQQ({ 绑定: [owner] }), '10001')
  assert.equal(ownerQQ({ 绑定: [{ ...owner, 开: false }] }), '10001')
  for (const bindings of [[], [privateRow()], [{ ...owner, 主人QQ: 'true' }],
    [{ ...owner, 类型: '群' }], [{ ...owner, 号码: '123' }], [{ ...owner, 会话: '' }],
    [owner, privateRow('10002', { 主人QQ: true })], [owner, privateRow()],
    [owner, privateRow('10002', { 会话: owner.会话, 开: false })]]) {
    assert.equal(ownerQQ({ qqOwner: '10001', 绑定: bindings }), '')
  }
})

test('后端拒绝多个、群聊、无效或重复的主人映射，不能经保存和总开关绕过', async () => {
  const f = await fixture([privateRow('10001', { 主人QQ: false })], {})
  try {
    for (const bindings of [[privateRow('10001', { 主人QQ: true }), privateRow('10002', { 主人QQ: true })],
      [privateRow('10001', { 主人QQ: true }), privateRow('10002', { 主人QQ: true, 会话: '' })],
      [privateRow('10001', { 主人QQ: true, 类型: '群' })], [privateRow('123', { 主人QQ: true })],
      [privateRow('10001', { 主人QQ: true, 会话: '' })],
      [privateRow('10001', { 主人QQ: true }), privateRow()]]) {
      assert.throws(() => f.host.归一化({ 绑定: bindings }), /主人 QQ/)
      for (const action of ['save', 'power']) {
        const result = await f.call(action, action === 'power' ? { 开: false, 配置: { 绑定: bindings } } : { 绑定: bindings })
        assert.equal(result.ok, false); assert.match(result.说, /主人 QQ/)
      }
      assert.equal(ownerQQ(f.read('qq-bridge-config.json')), '')
    }
    const bindings = [privateRow('10001', { 主人QQ: true }), privateRow('10002', { 主人QQ: false })]
    assert.equal((await f.call('save', { 绑定: bindings })).ok, true)
    assert.equal(ownerQQ(f.read('qq-bridge-config.json')), '10001')
    bindings.forEach(row => { row.主人QQ = row.号码 === '10002' })
    assert.equal((await f.call('save', { 绑定: bindings })).ok, true)
    assert.equal(ownerQQ(f.read('qq-bridge-config.json')), '10002')
  } finally { f.close() }
})

test('旧设置唯一匹配时迁移并删除旧字段，角色、隔离群及其他私聊保持原值', async () => {
  const f = await fixture([privateRow(), privateRow('10002'), { 类型: '群', 号码: '10001', 会话: 'group' }])
  try {
    const config = f.read('qq-bridge-config.json')
    assert.equal(ownerQQ(config), '10001'); assert.equal(config.绑定.filter(row => row.主人QQ).length, 1)
    assert.equal(config.人设, '原有全局角色'); assert.equal(config.特殊设定, '原有特殊设定')
    assert.deepEqual(f.read('fish-memory-config.json'), { qqIsolatedGroups: ['20001'] })
    config.绑定[0].主人QQ = false; f.write('qq-bridge-config.json', config)
    f.write('fish-memory-config.json', { qqOwner: '10001' }); f.start()
    assert.equal(ownerQQ(f.read('qq-bridge-config.json')), '', '显式撤销后旧字段不能重新授予身份')
    assert.equal('qqOwner' in f.read('fish-memory-config.json'), false)
  } finally { f.close() }
})

test('旧设置无法唯一匹配时不猜测主人，显式新勾选优先于旧字段', async () => {
  for (const bindings of [[privateRow('10002')], [privateRow(), privateRow()],
    [privateRow(), privateRow('10002', { 会话: 'chat-10001' })],
    [privateRow('10001', { 主人QQ: false }), privateRow('10002', { 主人QQ: true })]]) {
    const f = await fixture(bindings)
    try {
      assert.equal(ownerQQ(f.read('qq-bridge-config.json')), bindings.at(-1).主人QQ === true ? '10002' : '')
      assert.equal('qqOwner' in f.read('fish-memory-config.json'), false)
    } finally { f.close() }
  }
})
