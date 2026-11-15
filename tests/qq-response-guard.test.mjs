import test from 'node:test'
import assert from 'node:assert/strict'
import { responseProblem, messageProblem, guardResponse, recoveryRequest, recoverResponse } from '../modules/qq/lib/response-guard.mjs'

test('QQ output guard rejects transcript leakage and loops, preserving ordinary answers', () => {
  assert.equal(responseProblem('好。'), '')
  assert.equal(responseProblem('浪奔，浪流——本鱼就会这一句。'), '')
  assert.equal(messageProblem({ content: [{ type: 'reasoning', text: '好。'.repeat(100) }, { type: 'text', text: '唱不出来，给你吐个泡泡。' }] }), '')
  for (const text of ['好。\n\n'.repeat(12), '输出文本。'.repeat(12), '正常回答\nuser【QQ群 123】\n消息\n我应该这样回复', '（这条是从 QQ 转进来的：提示）', '<think>思考</think>回答']) assert.ok(responseProblem(text))
  assert.ok(responseProblem('想'.repeat(32001), true))
  assert.ok(responseProblem(Array.from({ length: 32001 }, (_, i) => String.fromCodePoint(0x10000 + i)).join(''), true))
})

test('stream protection catches split deltas, closes upstream without an automatic retry result', async () => {
  let closed = false, blocked = 0
  async function* source() {
    try {
      for (let i = 0; i < 100; i++) {
        yield { type: 'reasoning-delta', index: 0, text: '好' }
        yield { type: 'reasoning-delta', index: 0, text: '。\n\n' }
      }
    } finally { closed = true }
  }
  const chunks = []
  await assert.rejects(async () => {
    for await (const chunk of guardResponse(source(), () => blocked++)) chunks.push(chunk)
  }, { code: 'QQ_OUTPUT_BLOCKED' })
  assert.equal(closed, true)
  assert.equal(blocked, 1)
  assert.ok(chunks.length < 30)
  assert.ok(chunks.every(chunk => chunk.type !== 'finish'))
})

test('stream protection handles complete blocks and rejects leaked transcript before publishing it', async () => {
  for (const chunks of [
    [{ type: 'block-end', index: 0, block: { type: 'text', text: '好。'.repeat(12) } }],
    [{ type: 'text-delta', index: 1, text: '回答\nu' }, { type: 'text-delta', index: 1, text: 'ser【QQ群 123】' }],
  ]) {
    let reason = ''
    await assert.rejects(Array.fromAsync(guardResponse(chunks, value => { reason = value })), { code: 'QQ_OUTPUT_BLOCKED' })
    assert.ok(reason)
  }
})

test('QQ bridge blocks the whole bad turn and lets the next valid turn through', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const home = mkdtempSync(join(tmpdir(), 'fish-output-guard-'))
  const oldHome = process.env.DSH_HOME, oldFetch = globalThis.fetch
  const offs = [], hooks = new Map(), sent = [], cancellations = []
  const agent = { session: { id: 'session-test' }, cancel: (...args) => cancellations.push(args) }
  try {
    process.env.DSH_HOME = home
    writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify({ 总开关: true, 试运行: false, 发图: false, 转私聊: true, 只回QQ唤醒: false, 拆段间隔毫秒: 0, NapCat: 'http://synthetic.invalid', 绑定: [{ 类型: '私聊', 号码: '123456', 会话: 'session-test', 主人QQ: true }] }))
    globalThis.fetch = async (url, options) => { sent.push(JSON.parse(options.body)); return Response.json({ status: 'ok', retcode: 0, data: { message_id: 1 } }) }
    const host = await import('../modules/qq/lib/host.js?response-guard-integration')
    const ctx = {
      effect(fn) { const off = fn(); if (off) offs.push(off) },
      on(name, fn) { hooks.set(name, fn); return () => {} }, interval: () => () => {},
      llm: { resolveModelInfo: async () => ({ reasoning: { efforts: [{ id: 'off' }] } }), stream: () => [{ type: 'text-delta', index: 0, text: '好。'.repeat(12) }] },
      agents: { list: () => [agent], get: () => agent }, sessions: { list: () => [] }, logger: { info() {} },
      webServer: { register: () => () => {} },
    }
    const bridge = host.apply(ctx)
    const event = (type, data) => bridge.收到事件(agent.session, { type, data })
    const reply = (turn, text) => event('assistant/message', { turn, message: { role: 'assistant', content: [{ type: 'text', text }] } })
    const end = turn => event('turn/end', { turn, reason: { kind: 'completed' } })
    event('turn/start', { turn: 1 })
    reply(1, '前面一条正常回复')
    reply(1, '回复\nuser【QQ群 123】\n模型分析')
    reply(1, '后面又一条正常回复')
    end(1)
    await new Promise(setImmediate)
    assert.equal(sent.length, 0)
    event('turn/start', { turn: 2 })
    const middleware = hooks.get('llm/stream')
    let nextCalls = 0
    const source = [{ type: 'reasoning-delta', index: 0, text: '好。'.repeat(12) }]
    await assert.rejects(Array.fromAsync(middleware({ sessionId: 'session-test', messages: [], signal: new AbortController().signal }, () => { nextCalls++; return source })), { code: 'QQ_OUTPUT_BLOCKED' })
    assert.equal(nextCalls, 1)
    assert.equal(cancellations.length, 1)
    assert.deepEqual(cancellations[0][1], { keepInbox: true })
    reply(2, '前一步留下的正常文本也不能发')
    end(2)
    assert.equal(sent.length, 0)
    const unbound = middleware({ sessionId: 'unbound' }, () => source)
    assert.equal(unbound, source)
    event('turn/start', { turn: 3 })
    reply(3, '好。')
    end(3)
    for (let i = 0; i < 20; i++) await new Promise(setImmediate)
    assert.equal(sent.length, 1)
    // A successful earlier tool result stays in the session and is only acknowledged.
    event('turn/start', { turn: 4 })
    agent.session.snapshotEvents = () => [{ type: 'turn/start' }, { type: 'tool/result' }]
    let recoveryCalls = 0
    const llm = {
      resolveModelInfo: async () => ({ reasoning: { efforts: [{ id: 'off' }] } }),
      stream(request) {
        recoveryCalls++
        assert.deepEqual(request.tools, [])
        return middleware(request, () => finalReply)
      },
    }
    // apply retains the context object, so exercise real middleware re-entry on its llm service.
    ctx.llm = llm
    const recovered = await Array.fromAsync(middleware({ sessionId: 'session-test', messages: [] }, () => source))
    assert.deepEqual(recovered, finalReply)
    assert.equal(recoveryCalls, 1)
    assert.equal(cancellations.length, 1)
    reply(4, '已经记下了。')
    end(4)
    for (let i = 0; i < 20; i++) await new Promise(setImmediate)
    assert.equal(sent.length, 2)
  } finally {
    for (const off of offs.reverse()) off()
    globalThis.fetch = oldFetch
    if (oldHome === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = oldHome
    rmSync(home, { recursive: true, force: true })
  }
})

const finalReply = [
  { type: 'block-start', index: 0, blockType: 'text' },
  { type: 'text-delta', index: 0, text: '已经记下了。' },
  { type: 'block-end', index: 0, block: { type: 'text', text: '已经记下了。' } },
  { type: 'finish', reason: { kind: 'stop' } },
]
const looping = [{ type: 'reasoning-delta', index: 0, text: '好。'.repeat(20) }]

test('recovery cleans historical contamination while preserving tool calls and results', () => {
  const options = Object.freeze({ messages: Object.freeze([
    { role: 'user', content: [{ type: 'text', text: '记下这件事' }] },
    { role: 'assistant', source: { kind: 'model', replayState: { signature: 'old' } }, content: [
      { type: 'reasoning', text: '好。'.repeat(100) },
      { type: 'text', text: 'user【QQ群 123】\n分析' },
      { type: 'tool-call', id: 'call-1', name: 'memo', arguments: '{}' },
    ] },
    { role: 'tool', toolCallId: 'call-1', content: [{ type: 'text', text: '{"ok":true}' }] },
    { role: 'assistant', content: [{ type: 'reasoning', text: '好。'.repeat(100) }] },
  ]), tools: [{ name: 'memo' }], reasoningEffort: 'high', maxTokens: 256000 })
  const snapshot = JSON.stringify(options)
  const request = recoveryRequest(options, true, new AbortController().signal)
  assert.equal(JSON.stringify(options), snapshot)
  assert.equal(request.messages[1].source.replayState, undefined)
  assert.deepEqual(request.messages[1].content.map(block => block.type), ['tool-call'])
  assert.equal(request.messages[2], options.messages[2])
  assert.equal(request.messages.length, 4)
  assert.deepEqual(request.tools, [])
  assert.equal(request.maxTokens, 8192)
  assert.equal(recoveryRequest(options, false).tools, options.tools)
})

test('one bad attempt recovers to a normal reply without publishing bad chunks or cancelling', async () => {
  const options = Object.freeze({ provider: 'p', model: 'm', messages: [], sessionId: 'bound', reasoningEffort: 'high' })
  let calls = 0, retries = 0, failures = 0
  const llm = {
    resolveModelInfo: async () => ({ reasoning: { efforts: [{ id: 'off' }] } }),
    stream(request) {
      calls++
      assert.equal(request.reasoningEffort, 'off')
      assert.equal(request.sessionId, 'bound')
      assert.deepEqual(request.tools, [])
      return finalReply
    },
  }
  const result = await Array.fromAsync(recoverResponse(options, () => looping, {
    llm, toolsCompleted: () => true, retry: () => retries++, failed: () => failures++,
  }))
  assert.deepEqual(result, finalReply)
  assert.equal(calls, 1)
  assert.equal(retries, 1)
  assert.equal(failures, 0)
  assert.equal(options.reasoningEffort, 'high')
})

test('recovery fails once on more repetition or unexpected tool calls and honours cancellation', async () => {
  for (const result of [looping, [{ type: 'finish', reason: { kind: 'stop' } }], [
    { type: 'block-start', index: 0, blockType: 'tool-call' }, { type: 'finish', reason: { kind: 'stop' } },
  ], [{ type: 'finish', reason: { kind: 'error', failure: { code: 'TEST', message: 'failed' } } }]]) {
    let calls = 0, failures = 0
    const llm = { resolveModelInfo: async () => ({}), stream(request) { calls++; assert.equal(request.reasoningEffort, undefined); return result } }
    await assert.rejects(Array.fromAsync(recoverResponse({ messages: [], reasoningEffort: 'high' }, () => looping, {
      llm, toolsCompleted: () => true, retry() {}, failed() { failures++ },
    })))
    assert.equal(calls, 1)
    assert.equal(failures, 1)
  }
  const controller = new AbortController()
  controller.abort()
  let called = false
  await assert.rejects(Array.fromAsync(recoverResponse({ signal: controller.signal }, () => looping, {
    llm: { stream() { called = true } }, retry() { called = true }, failed() { called = true },
  })))
  assert.equal(called, false)
})


test('normal generation retains its chunks and never starts recovery', async () => {
  assert.deepEqual(await Array.fromAsync(recoverResponse({}, () => finalReply, {
    llm: {}, toolsCompleted: assert.fail, retry: assert.fail, failed: assert.fail,
  })), finalReply)
})

test('recovery before any completed tool can still perform the requested operation once', async () => {
  const tools = [{ name: 'memo', parameters: { type: 'object' } }]
  const call = [
    { type: 'block-start', index: 0, blockType: 'tool-call' },
    { type: 'block-end', index: 0, block: { type: 'tool-call', id: 'one-call', name: 'memo', arguments: '{}' } },
    { type: 'finish', reason: { kind: 'stop' } },
  ]
  const result = await Array.fromAsync(recoverResponse({ messages: [], tools }, () => [...call.slice(0, 2), ...looping], {
    llm: { resolveModelInfo: async () => ({}), stream(request) { assert.equal(request.tools, tools); return call } },
    toolsCompleted: () => false, retry() {}, failed: assert.fail,
  }))
  assert.deepEqual(result, call)
  assert.equal(result.filter(chunk => chunk.block?.type === 'tool-call').length, 1)
})
