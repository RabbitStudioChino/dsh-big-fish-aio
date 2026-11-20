import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createScheduledMessages } from '../lib/scheduled-messages.mjs'
import { nextScheduleAt } from '../lib/schedule-calendar.mjs'

test('重复规则以北京时间判定日期，法定工作日处理补班，节假日跨年等待官方日历', () => {
  const check = (repeat, at, expected, after) => assert.equal(nextScheduleAt(repeat, Date.parse(at), after && Date.parse(after)), expected ? Date.parse(expected) : 0, repeat)
  const start = '2027-01-01T00:15+08:00'
  check('daily', start, '2027-01-02T00:15+08:00', '2027-01-01T00:16+08:00')
  for (const [i, rule] of ['fri', 'sat', 'sun', 'mon', 'tue', 'wed', 'thu'].entries()) check(rule, start, `2027-01-0${i + 1}T00:15+08:00`)
  check('weekend', start, '2027-01-02T00:15+08:00')
  check('weekend', start, '2027-01-03T00:15+08:00', '2027-01-02T00:16+08:00')
  check('workday', start, '2027-01-04T00:15+08:00')
  check('workday', start, '2027-01-31T00:15+08:00', '2027-01-29T00:16+08:00')
  check('workday', '2026-01-01T09:00+08:00', '2026-01-04T09:00+08:00')
  check('holiday', start, '2027-02-05T00:15+08:00', '2027-01-01T00:16+08:00')
  check('holiday', '2026-12-31T09:00+08:00', '2027-01-01T09:00+08:00')
  check('holiday', start, null, '2027-10-03T00:16+08:00')
  check('workday', '2028-01-01T09:00+08:00', null)
})

test('定时任务保存、重启续跑、忙时等待、去重、过期和归档', async t => {
  const home = mkdtempSync(join(tmpdir(), 'fish-schedule-'))
  t.after(() => rmSync(home, { recursive: true, force: true }))
  let now = Date.parse('2030-06-01T01:00:00Z'), tick, stop
  t.mock.method(Date, 'now', () => now)
  const calls = []
  const agent = { session: { id: 'session-a' }, status: 'running', followup: message => { calls.push(message) } }
  const outside = { session: { id: 'session-foreign' }, status: 'idle', followup: () => assert.fail('不能投递其他工作区') }
  const workspaces = [{ id: 'bound', path: home, sessionIds: ['session-a', 'session-b'] }, { id: 'other', path: home, sessionIds: ['session-foreign'] }]
  const configPath = join(home, 'qq-bridge-config.json')
  writeFileSync(configPath, JSON.stringify({ 工作区: 'bound' }))
  const ctx = {
    agents: { list: () => [agent, outside], get: id => [agent, outside].find(row => row.session.id === id) },
    workspaceRegistry: { list: () => workspaces, get: id => workspaces.find(row => row.id === id), archivedSessionIds: [] },
    interval(fn) { tick = fn }, effect(fn) { stop = fn() }, get: () => undefined,
  }
  const input = { sessionId: 'session-a', at: '2030-06-01T09:01:00+08:00', repeat: 'daily', message: '上班记得带伞。' }
  const defaultStyle = '用大肥鱼的口吻说一句，别太啰嗦。'
  let tasks = createScheduledMessages(ctx, home)
  assert.throws(() => tasks.create({ ...input, at: '2030-06-01T10:01:00' }), /时区/)
  assert.throws(() => tasks.create({ ...input, at: '2031-02-29T10:01:00Z' }), /有效时间/)
  assert.throws(() => tasks.create({ ...input, sessionId: 'foreign' }), /会话/)
  const first = tasks.create(input)
  assert.equal(tasks.create({ ...input, message: input.message + ' ' + defaultStyle }).id, first.id)
  assert.throws(() => tasks.create({ ...input, message: defaultStyle }), /提醒内容/)
  assert.deepEqual(tasks.list().sessions.map(row => row.id), ['session-a', 'session-b'])
  const waiting = tasks.create({ ...input, repeat: 'holiday' })
  assert.equal(waiting.nextAt, 0)
  tasks.remove({ id: waiting.id })
  assert.equal(tasks.list().sessions.find(row => row.id === 'session-b').online, false)
  const path = join(home, 'big-fish-scheduled-messages.json')
  const { startAt, enabled, ...legacy } = first
  assert.equal(startAt, first.nextAt)
  assert.equal(enabled, true)
  writeFileSync(path, JSON.stringify([{ ...legacy, message: input.message + defaultStyle }]))
  stop()
  tasks = createScheduledMessages(ctx, home)
  assert.equal(tasks.list().tasks[0].id, first.id)
  assert.equal(tasks.list().tasks[0].message, input.message)
  assert.equal(tasks.list().tasks[0].enabled, true)
  tick()
  assert.equal(calls.length, 0)
  now = first.nextAt
  tick()
  assert.equal(calls.length, 0)
  agent.status = 'idle'
  tick(); tick()
  assert.equal(calls.length, 1)
  assert.equal(calls[0].source.kind, 'big-fish-schedule')
  assert.match(calls[0].content[0].text, /尽量用一句话/)
  assert.ok(calls[0].content[0].text.endsWith(JSON.stringify(input.message)))
  assert.throws(() => tasks.remove({ id: first.id }), /触发/)
  assert.throws(() => tasks.setEnabled({ id: first.id, enabled: false }), /触发/)
  await Promise.resolve()
  assert.equal(tasks.list().tasks[0].status, 'triggered')
  const next = tasks.list().tasks[0].nextAt
  assert.equal(next - first.nextAt, 86_400_000)
  tasks.setEnabled({ id: first.id, enabled: false })
  assert.throws(() => tasks.create({ ...input, at: new Date(next).toISOString() }), /相同的停用任务/)
  stop()
  tasks = createScheduledMessages(ctx, home)
  assert.equal(tasks.list().tasks[0].enabled, false)
  now = next
  tick()
  assert.equal(calls.length, 1, '停用任务跨重启后仍不会触发')
  const resumed = tasks.setEnabled({ id: first.id, enabled: true })
  assert.equal(resumed.nextAt, next + 86_400_000)
  now = resumed.nextAt + 16 * 60_000
  tick()
  assert.equal(tasks.list().tasks[0].status, 'missed')
  assert.equal(calls.length, 1)
  ctx.workspaceRegistry.archivedSessionIds.length = 0
  writeFileSync(configPath, JSON.stringify({ 工作区: 'other' }))
  now = tasks.list().tasks[0].nextAt
  tick()
  assert.equal(tasks.list().tasks[0].status, 'missed')
  assert.equal(calls.length, 1)
  assert.deepEqual(tasks.list().sessions.map(row => row.id), ['session-foreign'])
  ctx.workspaceRegistry.archivedSessionIds.push('a')
  now = tasks.list().tasks[0].nextAt
  tick()
  assert.equal(tasks.list().tasks[0].status, 'missed')
  assert.equal(calls.length, 1)
  tasks.remove({ id: first.id })
  assert.deepEqual(tasks.list().tasks, [])
  const once = tasks.create({ ...input, sessionId: 'session-foreign', repeat: 'once', at: new Date(now + 60_000).toISOString() })
  assert.throws(() => tasks.setEnabled({ id: once.id, enabled: 'false' }), /boolean/)
  tasks.setEnabled({ id: once.id, enabled: false })
  now = once.nextAt + 1
  assert.throws(() => tasks.setEnabled({ id: once.id, enabled: true }), /计划时间已过/)
  assert.equal(tasks.list().tasks[0].enabled, false)
})

test('宿主在触发中退出时读取同一文件不会重复投递，坏数据不会被覆盖', t => {
  const home = mkdtempSync(join(tmpdir(), 'fish-schedule-restart-'))
  t.after(() => rmSync(home, { recursive: true, force: true }))
  let now = 1000, tick, stop, calls = 0
  t.mock.method(Date, 'now', () => now)
  const agent = { session: { id: 'a' }, followup() { calls++; return new Promise(() => {}) } }
  writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify({ 工作区: 'bound' }))
  const workspace = { id: 'bound', path: home, sessionIds: ['a'] }
  const ctx = { agents: { get: id => id === 'a' ? agent : undefined }, workspaceRegistry: { list: () => [workspace], get: () => workspace }, interval(fn) { tick = fn }, effect(fn) { stop = fn() }, get: () => undefined }
  const tasks = createScheduledMessages(ctx, home)
  const input = { sessionId: 'a', at: '1970-01-01T00:00:02Z', repeat: 'once', message: '提醒' }
  tasks.create(input)
  now = 2000
  tick()
  stop()
  const restored = createScheduledMessages(ctx, home)
  assert.equal(restored.list().tasks[0].status, 'interrupted')
  assert.equal(restored.list().tasks[0].enabled, false)
  tick()
  assert.equal(calls, 1)
  const path = join(home, 'big-fish-scheduled-messages.json')
  writeFileSync(path, '{')
  const broken = createScheduledMessages(ctx, home)
  assert.ok(broken.list().warning)
  assert.throws(() => broken.create({ ...input, at: '1970-01-01T00:00:03Z' }), /无法读取/)
  assert.equal(readFileSync(path, 'utf8'), '{')
})
