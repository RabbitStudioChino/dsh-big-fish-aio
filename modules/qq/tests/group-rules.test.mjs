import test from 'node:test'
import assert from 'node:assert/strict'
import { groupRules, effectiveGroupRules, groupSample } from '../lib/group-rules.mjs'
import { 归一化 } from '../lib/host.js'

test('group rule defaults, bounded input and per-group overrides survive config round trip', () => {
  const config = 归一化({ 绑定: [{ 类型: '群', 号码: '123', 会话: 'session-A' },
    { 类型: '群', 号码: '456', 会话: 'session-B', 读取间隔分: 15, 读取最多条: 10, 回复概率: 20, 点名必回: false, 门槛: true }] })
  const [a, b] = config.绑定
  assert.equal(a.读取间隔分, 10); assert.equal(a.读取最多条, 30); assert.equal(a.点名必回, true)
  assert.equal(b.读取间隔分, 15); assert.equal(b.读取最多条, 10); assert.equal(b.回复概率, 20); assert.equal(b.点名必回, false); assert.equal(b.门槛, true)
  assert.deepEqual(归一化(JSON.parse(JSON.stringify(config))).绑定, config.绑定)
  const bounded = groupRules({ 读取间隔分: -1, 读取最多条: 999, 回复概率: NaN, 点名必回: 'false' })
  assert.equal(bounded.读取间隔分, 0); assert.equal(bounded.读取最多条, 100); assert.equal(bounded.回复概率, 100); assert.equal(bounded.点名必回, false)
})

test('sampling picks the latest messages, bypasses named only when enabled and never repeats empty work', () => {
  const messages = [1, 2, 3, 4], named = n => n === 2, rules = groupRules({ 读取最多条: 2 })
  assert.deepEqual(groupSample(messages, rules, 1000, 2000, named).messages, [2])
  assert.deepEqual(groupSample(messages, { ...rules, 点名必回: false }, 1000, 2000, named).messages, [])
  assert.deepEqual(groupSample(messages, rules, 1000, 601000, named).messages, [3, 4])
  assert.deepEqual(groupSample([], rules, 1000, 601000, named).messages, [])
})


test('legacy shared rules migrate once into independent groups and interval switch bypasses filters', () => {
  const migrated = 归一化({ 逐群读取: false, 群聊统一规则: { 读取间隔分: 5, 读取最多条: 12, 门槛: true },
    绑定: [{ 类型: '群', 号码: '123', 会话: 'session-A' }, { 类型: '群', 号码: '456', 会话: 'session-B' }] })
  assert.equal(migrated.逐群读取, undefined); assert.equal(migrated.群聊统一规则, undefined)
  assert.equal(migrated.绑定[0].读取间隔分, 5); assert.equal(migrated.绑定[1].读取最多条, 12)
  migrated.绑定[0].读取间隔分 = 15
  assert.equal(effectiveGroupRules(migrated.绑定[0], migrated).读取间隔分, 15)
  assert.equal(effectiveGroupRules(migrated.绑定[1], migrated).读取间隔分, 5)
  const off = effectiveGroupRules({ 启用读取间隔: false, 读取间隔分: 15, 回复概率: 0, 点名必回: false, 门槛: true }, {})
  assert.equal(off.读取间隔分, 0); assert.equal(off.回复概率, 100); assert.equal(off.门槛, true)
  assert.deepEqual(归一化(JSON.parse(JSON.stringify(migrated))), migrated)
})
