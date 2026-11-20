import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import vm from 'node:vm'
import { recordSource } from '../modules/qq/lib/memory-sources.mjs'

test('整合联调：搭话、记忆、心情、定时提醒与 QQ 出站', async t => {
  const home = mkdtempSync(join(tmpdir(), 'fish-aio-flow-'))
  const previous = process.env.DSH_HOME, originalFetch = globalThis.fetch
  const cleanups = [], outbound = [], modelCalls = [], events = [], contexts = new Map(), tools = new Map()
  const routes = new Map(), hostEvents = new Map(), agentEvents = new Map(), timers = []
  let onSend = () => {}
  const personaSections = new Map()
  const systemPrompt = {
    section(section) { personaSections.set(section.name, section); return () => personaSections.delete(section.name) },
    assemble: () => ({ sections: [...personaSections.values()] }),
  }
  let reminderPersona = ''
  const sid = 'session-aio-flow'
  const write = (path, data) => writeFileSync(join(home, path), JSON.stringify(data))
  const listen = (map, name, fn) => {
    const listeners = map.get(name) || new Set(); listeners.add(fn); map.set(name, listeners)
    return () => listeners.delete(fn)
  }
  const emit = async (map, name, ...args) => { for (const fn of map.get(name) || []) await fn(...args) }
  const flush = async () => { for (let n = 0; n < 15; n++) await new Promise(resolve => setImmediate(resolve)) }
  try {
    process.env.DSH_HOME = home
    mkdirSync(join(home, 'feiyu-mood'))
    write('feiyu-mood/config.json', { slots: [{ id: 'partner', sessions: [sid] }], autoJudge: true })
    write('fish-memory-config.json', { 全局开关: true, sessions: { [sid]: true }, policy: { autoExpand: false, queryGate: 0 } })
    write('speak-up-config.json', { 目标会话: [sid], 试运行: true, 安静起: 0, 安静止: 0, 触发文案: '想起你喜欢的茉莉花茶，来找你聊聊。' })
    const qqConfig = { 工作区: 'fish', 总开关: true, 试运行: false, NapCat: 'http://127.0.0.1:39991', 只回QQ唤醒: true, 自动触发也发: true, 按段发送: false, 绑定: [{ 类型: '私聊', 号码: '123456', 会话: sid, 主人QQ: true }] }
    write('qq-bridge-config.json', qqConfig)
    recordSource(home, qqConfig, '998877', qqConfig.绑定[0], 'verified-input', ['123456'])
    events.push({ type: 'user/message', data: { id: 'verified-input', role: 'user', content: [{ type: 'text', text: '我一直喜欢茉莉花茶' }], source: { kind: 'qq' } } })
    globalThis.fetch = async (url, options) => {
      assert.ok(String(url).startsWith('http://127.0.0.1:39991/'), '联调不得调用真实外部服务')
      outbound.push({ url: String(url), body: JSON.parse(options?.body || '{}') })
      if (String(url).endsWith('/send_private_msg')) onSend()
      return Response.json({ status: 'ok', retcode: 0, data: { user_id: 998877, nickname: 'test', message_id: 1 } })
    }
    const agent = {
      id: sid, status: 'idle', options: { provider: 'test', model: 'synthetic' },
      session: { id: sid, snapshotEvents: () => events },
      ctx: {
        get: key => key === 'systemPrompt' ? systemPrompt : undefined,
        on: (name, fn) => listen(agentEvents, name, fn),
        tools: { register: tool => { tools.set(tool.name, tool); return () => tools.delete(tool.name) } },
        systemPrompt: { context: item => { contexts.set(item.name, item); return () => contexts.delete(item.name) } },
      },
      async followup(message) {
        if (message.source.kind === 'big-fish-schedule') reminderPersona = [...personaSections.values()].map(section => section.text).join('\n')
        events.push({ type: 'user/message', data: message })
        await emit(agentEvents, 'agent/inbox/inserted', { message })
        await emit(hostEvents, 'session/event', this.session, events.at(-1))
      },
    }
    const ctx = {
      plugin: plugin => plugin.apply(ctx),
      agents: { list: () => [agent], roots: () => [agent], get: id => id === sid ? agent : undefined },
      sessions: { list: () => [agent.session], get: () => agent.session, flush: async () => {} },
      workspaceRegistry: { archivedSessionIds: [], list: () => [{ id: 'fish', path: home }], get: () => ({ id: 'fish', path: home, sessionIds: [sid, 'session-other'] }) },
      llm: { async *stream(input) { modelCalls.push(input); yield { type: 'text-delta', text: JSON.stringify({ moodDelta: 9, dims: { happy: 6 }, reason: '想起你喜欢的茉莉花茶，很开心', confidence: 95 }) } } },
      tools: agent.ctx.tools,
      webServer: { register: route => { assert.ok(!routes.has(route.path), '路由不冲突：' + route.path); routes.set(route.path, route.handler); return () => routes.delete(route.path) } },
      provide(name, value) { this[name] = value },
      inject(services, callback) {
        if (services.every(name => this[name])) callback(this)
      },
      interval: fn => { timers.push(fn); return () => {} },
      on: (name, fn) => listen(hostEvents, name, fn),
      effect: fn => { const off = fn(); if (typeof off === 'function') cleanups.push(off) },
      logger: { info() {}, warn() {} },
      get(name) { return name === 'connection' ? { requestRejection: () => undefined } : this[name] },
    }
    const host = await import('../index.js')
    host.apply(ctx)
    assert.deepEqual(ctx.bigFishOpenPlatform.list().providers.map(provider => provider.id), ['dsh_account', 'skills', 'rice', 'schedule'])
    assert.equal(ctx.bigFishOpenPlatform.list().providers[1].enabled, false)
    async function call(path, body) {
      const req = Readable.from(body ? [JSON.stringify(body)] : [])
      Object.assign(req, { method: body ? 'POST' : 'GET', url: path, headers: { host: 'localhost', 'content-type': 'application/json' } })
      let raw, status = 200
      const handler = routes.get(path.split('?')[0]); assert.ok(handler, path)
      await handler(req, { writeHead(code) { status = code }, setHeader() {}, end(data) { raw = data } })
      assert.equal(status, 200, String(raw))
      return { raw, json: () => JSON.parse(raw) }
    }
    for (const path of ['/dsh-qq-bridge/state', '/dsh-fish-memory/list', '/dsh-feiyu-mood/state', '/dsh-speak-up/state']) assert.equal((await call(path)).json().ok, true, path)
    assert.deepEqual([...routes.keys()].filter(p => /\/(update|install)$/.test(p)), ['/dsh-big-fish-aio/update', '/dsh-big-fish-aio/install'])
    assert.ok(tools.has('remember') && contexts.has('memory') && contexts.has('feiyu-mood'))
    const remembered = await tools.get('remember').execute({ text: '对方一直喜欢茉莉花茶', importance: 1, tags: ['茉莉花茶'] }, { agent })
    assert.notEqual(remembered.ok, false)
    assert.equal((await call('/dsh-fish-memory/list')).json().sessions[0].count, 1)
    await call('/dsh-speak-up/roll', { 模式: '演练' })
    assert.equal(events.length, 1, '演练不投递会话')
    await call('/dsh-speak-up/roll', { 模式: '真发' })
    assert.equal(events.length, 2)
    assert.equal(events.at(-1).data.source.kind, 'speak-up')
    const memory = contexts.get('memory').text()
    assert.ok(memory.includes('茉莉花茶'), '主动搭话回合复用真实记忆召回')
    const reply = { role: 'assistant', content: [{ type: 'text', text: '今天也想和你一起喝茉莉花茶。' }] }
    const response = { type: 'assistant/message', data: { turn: 1, message: reply } }
    events.push(response)
    await emit(hostEvents, 'session/event', agent.session, response)
    await emit(agentEvents, 'agent/turn-stopping')
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } })
    await flush()
    assert.equal(modelCalls.length, 1)
    assert.ok(modelCalls[0].system.includes('主动'), '心情使用自己搭话的判断口径')
    const state = (await call('/dsh-feiyu-mood/state')).json()
    assert.equal(state.timeline.length, 1)
    assert.equal(state.mood, 73)
    assert.ok(contexts.get('feiyu-mood').text().includes('茉莉花茶'))
    assert.equal(contexts.get('feiyu-mood').text(), '', '同一次心情只注入一次')
    assert.ok(outbound.some(r => r.url.endsWith('/send_private_msg') && JSON.stringify(r.body).includes('茉莉花茶')), '搭话回复经 QQ 策略转发')
    const before = outbound.length
    await emit(hostEvents, 'session/event', agent.session, { type: 'user/message', data: { source: { kind: 'user' } } })
    await emit(hostEvents, 'session/event', agent.session, { ...response, data: { ...response.data, turn: 2 } })
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 2, reason: { kind: 'completed' } } })
    await flush()
    assert.equal(outbound.length, before, 'DSH 本地发言仍受 QQ 出站策略保护')
    await call('/dsh-speak-up/save', { 总开关: false })
    await emit(hostEvents, 'session/event', agent.session, { type: 'user/message', data: { source: { kind: 'speak-up' } } })
    await emit(hostEvents, 'session/event', agent.session, { ...response, data: { ...response.data, turn: 3 } })
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 3, reason: { kind: 'completed' } } })
    await flush()
    assert.equal(outbound.length, before, '关闭搭话总开关后，已生成的搭话也不能转发 QQ')
    const hour = new Date().getHours()
    await call('/dsh-speak-up/save', { 总开关: true, 安静起: hour, 安静止: (hour + 1) % 24 })
    await emit(hostEvents, 'session/event', agent.session, { type: 'user/message', data: { source: { kind: 'speak-up' } } })
    await emit(hostEvents, 'session/event', agent.session, { ...response, data: { ...response.data, turn: 4 } })
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 4, reason: { kind: 'completed' } } })
    await flush()
    assert.equal(outbound.length, before, '安静时段拦截已生成的搭话 QQ 回复')
    await call('/dsh-speak-up/save', { 安静起: 0, 安静止: 0, 试运行: false })
    const beforeSplit = outbound.filter(r => r.url.endsWith('/send_private_msg')).length
    onSend = () => write('speak-up-config.json', { 总开关: false, 目标会话: [sid], 安静起: 0, 安静止: 0 })
    await emit(hostEvents, 'session/event', agent.session, { type: 'user/message', data: { source: { kind: 'speak-up' } } })
    const splitReply = { role: 'assistant', content: [{ type: 'text', text: '第一段\n\n第二段' }] }
    await emit(hostEvents, 'session/event', agent.session, { type: 'assistant/message', data: { turn: 5, message: splitReply } })
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 5, reason: { kind: 'completed' } } })
    await new Promise(resolve => setTimeout(resolve, 800))
    assert.equal(outbound.filter(r => r.url.endsWith('/send_private_msg')).length - beforeSplit, 1, '第一段发送后关闭开关，第二段不能发送')
    const afterSplit = outbound.length
    await call('/dsh-speak-up/save', { 总开关: true, 试运行: true })
    await emit(hostEvents, 'session/event', agent.session, { type: 'user/message', data: { source: { kind: 'speak-up' } } })
    await emit(hostEvents, 'session/event', agent.session, { ...response, data: { ...response.data, turn: 6 } })
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 6, reason: { kind: 'completed' } } })
    await flush()
    assert.equal(outbound.length, afterSplit, '试运行开启后拦截自动搭话的等待中回复')
    const schedulePath = '/dsh-big-fish-aio/open-platform/scheduled-messages'
    const reminderAt = Date.now() + 60_000
    const reminder = { at: new Date(reminderAt).toISOString(), repeat: 'once', message: '记得带雨伞' }
    assert.equal(tools.has('big_fish_schedule_create'), false)
    const pageTask = (await call(schedulePath + '/create', { ...reminder, message: '页面提醒', sessionId: sid })).json().task
    const otherTask = (await call(schedulePath + '/create', { ...reminder, message: '另一个会话的提醒', sessionId: 'session-other' })).json().task
    ctx.bigFishOpenPlatform.connect({ providerId: 'schedule', enabled: true, sessionIds: [sid] })
    const create = tools.get('big_fish_schedule_create').execute
    const disable = tools.get('big_fish_schedule_disable').execute
    const remove = tools.get('big_fish_schedule_remove').execute
    const list = tools.get('big_fish_schedule_list_sessions').execute
    assert.equal((await create(reminder, { agent })).ok, false, '自动搭话不能自行注册定时任务')
    assert.equal((await remove({ id: pageTask.id }, { agent })).ok, false, '自动搭话无权删除任务')
    assert.equal((await disable({ id: pageTask.id }, { agent })).ok, false, '自动搭话无权停用任务')
    assert.equal((await list({ includeTasks: true }, { agent })).ok, false, '自动搭话无权查看任务')
    events.push({ type: 'user/message', data: { id: 'verified-input', source: { kind: 'qq' } } })
    assert.equal((await list({}, { agent })).data.tasks, undefined)
    assert.deepEqual((await list({ includeTasks: true }, { agent })).data.tasks.map(task => task.id), [pageTask.id])
    assert.equal((await disable({ id: otherTask.id }, { agent })).ok, false, '禁止停用未授权目标的任务')
    assert.equal((await remove({ id: otherTask.id }, { agent })).ok, false, '禁止删除未授权目标的任务')
    assert.deepEqual((await disable({ id: pageTask.id }, { agent })).data, { id: pageTask.id, enabled: false })
    assert.equal((await call(schedulePath + '/enabled', { id: pageTask.id, enabled: true })).json().task.enabled, true)
    assert.deepEqual((await remove({ id: pageTask.id }, { agent })).data, { id: pageTask.id })
    await call(schedulePath + '/remove', { id: otherTask.id })
    assert.equal((await create({ ...reminder, sessionId: 'not-granted' }, { agent })).ok, false)
    const created = await create({ ...reminder, message: '记得带雨伞，用大肥鱼的口吻说一句，别太啰嗦。' }, { agent })
    assert.equal(created.ok, true, JSON.stringify(created))
    const storedReminder = (await call(schedulePath)).json().tasks[0]
    assert.equal(storedReminder.id, created.data.id)
    assert.equal(storedReminder.message, reminder.message)
    ctx.bigFishOpenPlatform.connect({ providerId: 'schedule', enabled: false, sessionIds: [sid] })
    assert.equal((await create(reminder, { agent })).ok, false, '关闭接入后旧工具句柄也不能创建')
    assert.equal((await disable({ id: created.data.id }, { agent })).ok, false)
    write('qq-bridge-config.json', { ...qqConfig, 人设开: true, 人设: '全局称呼小伙伴', 只发标记内: true, 绑定: [{ ...qqConfig.绑定[0], 人设: '这个会话叫对方小船长' }] })
    const nowMock = t.mock.method(Date, 'now', () => reminderAt)
    try { timers[0](); await flush() }
    finally { nowMock.mock.restore() }
    assert.equal(events.at(-1).data.source.kind, 'big-fish-schedule')
    assert.match(events.at(-1).data.content[0].text, /记得带雨伞/)
    assert.match(events.at(-1).data.content[0].text, /会话的人设、称呼和口吻/)
    assert.match(events.at(-1).data.content[0].text, /\[QQ\]/)
    assert.doesNotMatch(events.at(-1).data.content[0].text, /小船长/)
    assert.match(reminderPersona, /这个会话叫对方小船长/)
    assert.doesNotMatch(reminderPersona, /全局称呼小伙伴/)
    assert.equal((await call(schedulePath)).json().tasks[0].status, 'triggered')
    await emit(hostEvents, 'session/event', agent.session, { type: 'assistant/message', data: { turn: 7, message: { role: 'assistant', content: [{ type: 'text', text: '[QQ]小船长，记得带雨伞哦！[/QQ]' }] } } })
    await emit(hostEvents, 'session/event', agent.session, { type: 'turn/end', data: { turn: 7, reason: { kind: 'completed' } } })
    await flush()
    assert.ok(outbound.some(r => r.url.endsWith('/send_private_msg') && JSON.stringify(r.body).includes('小船长，记得带雨伞哦')), '人设化提醒沿用 QQ 标记转发')
    const table = []
    await emit(hostEvents, 'webserver/index-inject', table)
    await emit(hostEvents, 'webserver/index-inject', table)
    assert.equal(table.length, 1, '挂饰只注入一次')
    const widgetScript = (await call('/dsh-feiyu-mood/widget.js')).raw
    new vm.Script(widgetScript)
    assert.ok(widgetScript.includes('--fish-terminal-bg'), '独立挂饰脚本内置共用色库')
    for (const filename of ['welcome', 'sticker-book', 'sticker-chat', 'sticker-read', 'sticker-heart', 'sticker-wave', 'logo', 'update', 'feiyu', 'feiyu-great', 'feiyu-good', 'feiyu-worry', 'feiyu-sad', 'face-great', 'face-good', 'face-ok', 'face-worry', 'face-sad']) {
      const { raw } = await call('/dsh-feiyu-mood/' + filename + '.png')
      assert.equal(raw.subarray(1, 4).toString(), 'PNG')
    }
  } finally {
    for (const off of cleanups.reverse()) off()
    globalThis.fetch = originalFetch
    if (previous === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previous
    rmSync(home, { recursive: true, force: true })
  }
})
