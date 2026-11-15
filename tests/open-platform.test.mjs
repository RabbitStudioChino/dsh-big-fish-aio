import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { createServer } from 'node:http'
import { createOpenPlatform, PLATFORM_PATH } from '../lib/open-platform.mjs'
import { checkSchema, validateValue } from '../lib/open-platform-schema.mjs'
import { riceApi } from '../lib/rice-api.mjs'

const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })
function fixture(config, apiConfig) {
  const home = mkdtempSync(join(tmpdir(), 'fish-open-')), previous = process.env.DSH_HOME
  process.env.DSH_HOME = home
  if (config !== undefined) writeFileSync(join(home, 'big-fish-open-platform.json'), config)
  if (apiConfig !== undefined) writeFileSync(join(home, 'big-fish-open-platform-apis.json'), apiConfig)
  const routes = new Map(), cleanups = [], events = new Map(), tools = new Map()
  const agents = ['private', 'group', 'foreign'].map(id => ({ id, session: { id }, ctx: { tools: { register(tool) {
    const key = id + ':' + tool.name
    assert.equal(tools.has(key), false)
    tools.set(key, tool)
    return () => tools.delete(key)
  } } } }))
  let rejection, balance = { status: 'ready', value: [{ currency: 'CNY', balance: '12.3400000000000000' }], bonusWallets: [{ currency: 'CNY', balance: '0E-16' }] }
  const calls = []
  const services = { connection: { requestRejection: () => rejection }, deepseekAccount: { async getBalance(client) { calls.push(client); return balance } } }
  const workspace = { id: 'bound', sessionIds: ['private', 'group'] }
  const registry = { get: id => id === workspace.id ? workspace : undefined, archivedSessionIds: [] }
  const bridgeConfig = { 工作区: 'bound', 绑定: [{ 会话: 'private', 类型: '私聊', 号码: '10001' }, { 会话: 'group', 类型: '群', 号码: '20001' }, { 会话: 'foreign', 类型: '群', 号码: '20002' }] }
  const writeBridge = () => writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify(bridgeConfig))
  writeBridge()
  const ctx = {
    provide(name, service) { services[name] = service }, get: name => services[name],
    workspaceRegistry: registry,
    agents: { list: () => agents }, effect(fn) { const off = fn(); if (off) cleanups.push(off) },
    on(name, fn) { events.set(name, fn) }, interval(fn) { events.set('tick', fn) },
    webServer: { register({ path, handler }) { assert.equal(routes.has(path), false); routes.set(path, handler); return () => routes.delete(path) } },
  }
  const platform = createOpenPlatform(ctx)
  const call = async (path, body, options = {}) => {
    const req = Readable.from([options.raw ?? JSON.stringify(body ?? {})])
    Object.assign(req, { method: body === undefined ? 'GET' : 'POST', headers: { host: 'localhost', 'content-type': 'application/json' }, ...options })
    let status, data
    await routes.get(PLATFORM_PATH + path)(req, { writeHead(code) { status = code }, end(text) { data = JSON.parse(text) } })
    return { status, data }
  }
  return { ctx, home, platform, call, tools, agents, events, calls, services, workspace, registry, bridgeConfig, writeBridge, reload() { cleanups.splice(0).reverse().forEach(off => off()); return createOpenPlatform(ctx) }, setBalance(value) { balance = value }, reject(code) { rejection = code }, close() {
    cleanups.reverse().forEach(off => off())
    process.env.DSH_HOME = previous ?? ''; if (previous === undefined) delete process.env.DSH_HOME
    rmSync(home, { recursive: true, force: true })
  } }
}
const memo = handler => ({ schemaVersion: 1, id: 'memo', version: '1.0.0', title: '备忘录', description: '备忘写入', operations: [{
  id: 'add', title: '添加备忘', description: '保存一条备忘', readOnly: false, example: { text: '买牛奶' }, inputSchema: object({ text: { type: 'string', minLength: 1, maxLength: 100 } }), outputSchema: object({ id: { type: 'string' } }), handler,
}] })

test('技能库列出全部能力，区分启用与本会话授权，实时反映关闭和删除', async () => {
  const f = fixture()
  try {
    const definition = memo(() => ({ id: 'unused' }))
    definition.operations[0].example = { text: 'private-business-data' }
    f.platform.register(definition)
    const skills = f.platform.list().providers[1]
    assert.equal(skills.id, 'skills')
    assert.equal(skills.title, '大肥鱼技能库')
    assert.equal(skills.enabled, false)
    assert.equal((await f.call('/invoke/skills/list_capabilities', {})).data.ok, false)
    f.platform.connect({ providerId: 'skills', enabled: true, sessionIds: ['private', 'group'] })
    f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: ['group'] })
    const tool = f.tools.get('private:big_fish_skills_list_capabilities')
    const result = await tool.execute({})
    assert.equal(result.ok, true)
    assert.equal(result.data.sessionId, 'private')
    assert.equal(result.data.providerCount, 3)
    assert.equal(result.data.capabilityCount, 3)
    assert.equal(result.data.enabledCount, 2)
    assert.equal(result.data.callableCount, 1)
    const entry = id => result.data.capabilities.find(capability => capability.providerId === id)
    assert.equal(entry('memo').enabled, true)
    assert.equal(entry('memo').callable, false)
    assert.equal(entry('memo').unavailableReason, '当前会话未获授权')
    assert.equal(entry('dsh_account').enabled, false)
    assert.equal(entry('dsh_account').unavailableReason, '接入已关闭')
    assert.equal(JSON.stringify(result).includes('private-business-data'), false)
    const group = await f.tools.get('group:big_fish_skills_list_capabilities').execute({})
    assert.equal(group.data.callableCount, 2)
    const local = (await f.call('/invoke/skills/list_capabilities', {})).data
    assert.equal(local.data.sessionId, '')
    assert.equal(local.data.callableCount, 0)
    assert.equal((await tool.execute({ sessionId: 'group' })).ok, false)
    f.platform.connect({ providerId: 'memo', enabled: false, sessionIds: ['group'] })
    assert.equal((await tool.execute({})).data.enabledCount, 1)
    await f.call('/remove', { providerId: 'memo' })
    assert.equal((await tool.execute({})).data.capabilityCount, 2)
    f.platform.connect({ providerId: 'skills', enabled: false, sessionIds: ['private'] })
    assert.equal((await tool.execute({})).ok, false)
  } finally { f.close() }
})

test('吃大米饭排在技能库之后，仅按可信调用会话返回用量和缓存率', async () => {
  const f = fixture()
  let reads = 0
  const today = { input: 180, output: 20, cacheRead: 30, cacheWrite: 10, ragTokens: 100, total: 240, cost: 0.002 }
  const total = { input: 360, output: 40, cacheRead: 60, cacheWrite: 20, ragTokens: 200, total: 480, cost: 0.004 }
  const report = { 今天: '2026-11-10', days: [{ date: '2026-11-10', total: 9240, cost: 2 }], 全部: { total: 18480, cost: 4 }, 会话: [
    { id: 'private', 今天: today, 全部: total },
    { id: 'group', 今天: { total: 9000, cost: 1.998 }, 全部: { total: 18000, cost: 3.996 } },
  ] }
  try {
    f.platform.register(memo(() => ({ id: 'unused' })))
    f.platform.register(riceApi(() => { reads++; return report }))
    const providers = f.platform.list().providers
    assert.deepEqual(providers.map(provider => provider.id), ['dsh_account', 'skills', 'rice', 'memo'])
    const rice = providers.find(provider => provider.id === 'rice')
    assert.equal(rice.title, '吃大米饭')
    assert.equal(rice.enabled, false)
    assert.deepEqual(rice.sessionIds, [])
    assert.ok(rice.operations.every(operation => operation.readOnly))
    assert.ok(f.platform.openapi().paths[PLATFORM_PATH + '/invoke/rice/session_tokens'])
    assert.equal((await f.platform.invoke('rice', 'workspace_usage', {})).ok, false)
    assert.equal(reads, 0)

    f.platform.connect({ providerId: 'rice', enabled: true, sessionIds: ['private', 'group'] })
    const privateTool = f.tools.get('private:big_fish_rice_session_usage')
    const result = await privateTool.execute({})
    assert.equal(result.ok, true)
    assert.deepEqual(result.data, { date: report.今天, timeZone: 'Asia/Shanghai', sessionId: 'private', today: { totalTokens: 240, estimatedCostCny: 0.002 }, total: { totalTokens: 480, estimatedCostCny: 0.004 } })
    const readCount = reads
    assert.equal((await privateTool.execute({ sessionId: 'group' })).ok, false)
    assert.equal((await f.platform.invoke('rice', 'session_usage', {}, { source: 'model', sessionId: 'foreign' })).ok, false)
    assert.equal((await f.call('/invoke/rice/session_usage', {})).data.ok, false)
    assert.equal(reads, readCount)
    const own = await f.platform.invoke('rice', 'session_usage', {}, { source: 'model', sessionId: 'private', isOwner: true })
    assert.equal(own.data.total.totalTokens, 480)
    const group = await f.tools.get('group:big_fish_rice_session_usage').execute({})
    assert.equal(group.data.total.totalTokens, 18000)
    const details = await f.tools.get('private:big_fish_rice_session_tokens').execute({})
    assert.equal(details.ok, true)
    assert.deepEqual(details.data.today, { inputTokens: 120, uncachedInputTokens: 80, outputTokens: 20, cacheReadTokens: 30, cacheWriteTokens: 10, cacheTokens: 40, cacheHitRate: 0.25, ragTokens: 100 })
    assert.equal(details.data.total.cacheHitRate, 0.25)
    const workspace = await f.tools.get('private:big_fish_rice_workspace_usage').execute({})
    assert.deepEqual(workspace.data, { date: report.今天, timeZone: 'Asia/Shanghai', today: { totalTokens: 9240, estimatedCostCny: 2 }, total: { totalTokens: 18480, estimatedCostCny: 4 } })

    report.会话 = []; report.days = []; report.全部 = {}
    const empty = await f.tools.get('private:big_fish_rice_session_tokens').execute({})
    assert.equal(empty.ok, true)
    assert.ok(Object.values(empty.data.today).every(value => value === 0))
    const emptySummary = await privateTool.execute({})
    assert.deepEqual(emptySummary.data.total, { totalTokens: 0, estimatedCostCny: 0 })
    const emptyWorkspace = await f.tools.get('private:big_fish_rice_workspace_usage').execute({})
    assert.deepEqual(emptyWorkspace.data.today, { totalTokens: 0, estimatedCostCny: 0 })
    f.platform.connect({ providerId: 'rice', enabled: false, sessionIds: ['private'] })
    assert.equal((await privateTool.execute({})).ok, false)
  } finally { f.close() }
})

test('余额接入、HTTP 测试与会话工具共享调用，保留金额精度且不暴露额外字段', async () => {
  const f = fixture()
  try {
    assert.equal(f.tools.size, 0)
    f.services.sessionTitle = { get: session => ({ title: '会话 ' + session.id }) }
    assert.equal(f.platform.list().sessions[0].title, '会话 private')
    assert.equal((await f.call('/invoke/dsh_account/balance', {})).data.ok, false)
    const connected = await f.call('/connect', { providerId: 'dsh_account', enabled: true, sessionIds: ['private'] })
    assert.equal(connected.data.ok, true)
    assert.equal(f.tools.size, 1)
    assert.ok(!f.tools.has('group:big_fish_dsh_account_balance'))
    f.setBalance({ status: 'ready', value: [{ currency: 'CNY', balance: '12.3400000000000000', token: 'never-export' }], bonusWallets: [{ currency: 'CNY', balance: '0E-16' }] })
    const result = (await f.call('/invoke/dsh_account/balance', {})).data
    assert.equal(result.ok, true); assert.equal(result.data.wallets[0].balance, '12.3400000000000000'); assert.equal(result.data.bonusWallets[0].balance, '0E-16')
    assert.equal(JSON.stringify(result).includes('never-export'), false)
    assert.match(result.requestId, /^[a-f0-9-]{36}$/)
    const tool = f.tools.get('private:big_fish_dsh_account_balance')
    assert.deepEqual((await tool.execute({})).data, result.data)
    assert.equal((await tool.execute({}, { agent: f.agents[1] })).ok, false)
    assert.equal(f.calls[0].locale, 'zh-CN')
    await f.call('/connect', { providerId: 'dsh_account', enabled: false, sessionIds: [] })
    assert.equal(f.tools.size, 0); assert.equal((await tool.execute({})).ok, false)
  } finally { f.close() }
})

test('官方服务缺失、退出登录和网络失败不会伪装成零余额', async () => {
  const f = fixture()
  try {
    f.platform.connect({ providerId: 'dsh_account', enabled: true, sessionIds: [] })
    for (const value of [null, { status: 'failed' }]) { f.setBalance(value); assert.equal((await f.platform.invoke('dsh_account', 'balance', {})).ok, false) }
    delete f.services.deepseekAccount
    assert.match((await f.platform.invoke('dsh_account', 'balance', {})).error.message, /未提供/)
    assert.equal((await f.platform.invoke('dsh_account', 'balance', { extra: 1 })).ok, false)
  } finally { f.close() }
})

test('第三方备忘录注册、OpenAPI、Schema 校验、权限撤销、卸载及重载授权', async () => {
  const f = fixture(); let writes = 0
  try {
    const definition = memo(async () => { writes++; return { id: 'memo-1' } })
    const off = f.platform.register(definition)
    assert.throws(() => f.platform.register(definition), /已注册/)
    assert.throws(() => f.platform.register({ ...definition, id: undefined }), /无效/)
    definition.id = 'changed'
    definition.operations[0].inputSchema.properties.text.type = 'number'
    f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: ['private'] })
    assert.equal(f.platform.openapi().paths[PLATFORM_PATH + '/invoke/memo/add'].post.requestBody.content['application/json'].schema.properties.text.type, 'string')
    assert.equal((await f.call('/invoke/memo/add', { text: '' })).data.ok, false)
    assert.equal((await f.call('/invoke/memo/add', { text: 'test', extra: true })).data.ok, false)
    assert.equal(writes, 0)
    assert.equal((await f.call('/invoke/memo/add', { text: 'test' })).data.data.id, 'memo-1')
    const oldTool = f.tools.get('private:big_fish_memo_add')
    f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: [] })
    assert.equal((await oldTool.execute({ text: 'test' })).ok, false); assert.equal(writes, 1)
    assert.throws(() => f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: ['unknown'] }), /不存在/)
    off(); off()
    assert.equal(f.platform.list().providers.some(provider => provider.id === 'memo'), false)
    assert.equal((await oldTool.execute({ text: 'test' })).ok, false)
    const bad = memo(async () => ({ id: 1 }))
    f.platform.register(bad)
    assert.equal(f.platform.list().providers.find(provider => provider.id === 'memo').enabled, true)
    assert.match((await f.platform.invoke('memo', 'add', { text: 'test' })).error.message, /output.id/)
  } finally { f.close() }
})

test('管理请求拒绝未鉴权、跨站、非法方法、超大体积及坏 JSON', async () => {
  const f = fixture()
  try {
    f.reject(401); assert.equal((await f.call('/catalog')).status, 401)
    f.reject(403); assert.equal((await f.call('/catalog')).status, 403)
    f.reject(undefined)
    assert.equal((await f.call('/catalog', undefined, { headers: { host: 'localhost', origin: 'https://evil.test' } })).status, 403)
    assert.equal((await f.call('/connect', undefined)).status, 405)
    assert.equal((await f.call('/connect', {}, { headers: { 'content-type': 'text/plain' } })).status, 415)
    assert.equal((await f.call('/connect', {}, { raw: '{' })).status, 400)
    assert.equal((await f.call('/connect', {}, { raw: ' '.repeat(65537) })).status, 413)
    delete f.services.connection
    assert.equal((await f.call('/catalog')).status, 503)
    assert.equal(f.calls.length, 0)
  } finally { f.close() }
  const broken = fixture('{')
  try {
    assert.match(broken.platform.list().warning, /配置无法读取/)
    assert.throws(() => broken.platform.connect({ providerId: 'dsh_account', enabled: true, sessionIds: [] }), /配置无法读取/)
    assert.equal(readFileSync(join(broken.home, 'big-fish-open-platform.json'), 'utf8'), '{')
  } finally { broken.close() }
})

test('卸载中止进行中的调用，关闭和重开会话后工具重新挂载', async () => {
  const f = fixture(); let started
  try {
    const began = new Promise(resolve => { started = resolve })
    const off = f.platform.register(memo(async (_, { signal }) => { started(); await new Promise(resolve => signal.addEventListener('abort', resolve)); return { id: 'late' } }))
    f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: ['private'] })
    const pending = f.platform.invoke('memo', 'add', { text: 'test' })
    await began; off()
    assert.equal((await pending).ok, false)
    f.platform.connect({ providerId: 'dsh_account', enabled: true, sessionIds: ['private'] })
    const agent = f.agents.shift(); f.events.get('tick')(); assert.equal(f.tools.size, 0)
    f.agents.push(agent); f.events.get('agent/created')(); assert.equal(f.tools.size, 1)
  } finally { f.close() }
})

test('Schema 拒绝未实现的约束及恶意字段，支持嵌套数组与必填', () => {
  assert.throws(() => checkSchema({ ...object({}), allOf: [] }), /不支持/)
  assert.throws(() => checkSchema({ type: 'object', properties: {} }), /additionalProperties/)
  assert.throws(() => checkSchema({ type: 'array' }), /Schema/)
  assert.throws(() => validateValue(object({}), JSON.parse('{"__proto__":{}}')), /未声明/)
  const schema = object({ items: { type: 'array', items: object({ count: { type: 'integer' } }) } })
  checkSchema(schema); validateValue(schema, { items: [{ count: 2 }] })
  assert.throws(() => validateValue(schema, { items: [{ count: 2.3 }] }), /integer/)
})

test('授权仅允许绑定工作区的 QQ 映射，迁出、归档、解除绑定和切换工作区立即阻止调用', async () => {
  const f = fixture()
  try {
    assert.deepEqual(f.platform.list().sessions.map(({ id, type }) => [id, type]), [['private', '私聊'], ['group', '群']])
    assert.throws(() => f.platform.connect({ providerId: 'dsh_account', enabled: true, sessionIds: ['foreign'] }), /绑定工作区/)
    f.platform.connect({ providerId: 'dsh_account', enabled: true, sessionIds: ['private', 'group'] })
    const privateTool = f.tools.get('private:big_fish_dsh_account_balance')
    f.workspace.sessionIds = ['group']
    assert.equal((await privateTool.execute({})).ok, false)
    assert.deepEqual(f.platform.list().providers[0].sessionIds, ['group'])
    f.events.get('tick')(); assert.equal(f.tools.size, 1)
    f.workspace.sessionIds.push('private')
    f.registry.archivedSessionIds.push('private')
    assert.equal((await privateTool.execute({})).ok, false)
    f.registry.archivedSessionIds.length = 0
    f.bridgeConfig.绑定 = f.bridgeConfig.绑定.filter(binding => binding.会话 !== 'private'); f.writeBridge()
    assert.equal((await privateTool.execute({})).ok, false)
    f.bridgeConfig.工作区 = 'other'; f.writeBridge()
    assert.deepEqual(f.platform.list().sessions, [])
    assert.equal((await f.platform.invoke('dsh_account', 'balance', {}, { sessionId: 'group' })).ok, false)
    f.events.get('tick')(); assert.equal(f.tools.size, 0)
    assert.equal(f.calls.length, 0)
  } finally { f.close() }
})


const httpApi = url => ({ schemaVersion: 1, id: 'http_echo', title: '回声 API', description: '测试手动 HTTP 接入', version: '1.0.0', operations: [{
  id: 'echo', title: '回声', description: '返回输入', readOnly: true, url, headers: { Authorization: 'Bearer synthetic-secret' },
  inputSchema: object({ text: { type: 'string' } }), outputSchema: object({ reply: { type: 'string' } }), example: { text: 'hello' },
}] })

test('手动接入持久保存并恢复，复用 HTTP 与模型工具，隐藏请求头并撤销权限', async () => {
  const calls = []
  const server = createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk
    calls.push({ method: req.method, headers: req.headers, body: JSON.parse(body) })
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ ok: true, data: { reply: JSON.parse(body).text } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const f = fixture()
  const definition = httpApi('http://127.0.0.1:' + server.address().port + '/echo')
  try {
    const added = await f.call('/apis', definition)
    assert.equal(added.status, 200)
    const provider = added.data.providers.find(item => item.id === definition.id)
    assert.equal(provider.enabled, false); assert.deepEqual(provider.sessionIds, [])
    assert.equal(provider.operations[0].inputSchema.type, 'object')
    assert.ok(!JSON.stringify(added).includes('synthetic-secret'))
    assert.ok(!JSON.stringify(f.platform.openapi()).includes('synthetic-secret'))
    const path = join(f.home, 'big-fish-open-platform-apis.json')
    assert.equal(JSON.parse(readFileSync(path, 'utf8'))[0].id, definition.id)
    if (process.platform !== 'win32') assert.equal(statSync(path).mode & 0o777, 0o600)
    assert.equal((await f.call('/invoke/http_echo/echo', { text: 'disabled' })).data.ok, false)
    f.platform.connect({ providerId: definition.id, enabled: true, sessionIds: ['private'] })
    assert.equal((await f.call('/invoke/http_echo/echo', { text: 'HTTP 测试' })).data.data.reply, 'HTTP 测试')
    const tool = f.tools.get('private:big_fish_http_echo_echo')
    assert.equal((await tool.execute({ text: '模型工具' })).data.reply, '模型工具')
    assert.equal(calls[0].method, 'POST'); assert.equal(calls[0].headers.authorization, 'Bearer synthetic-secret')
    assert.equal(calls[0].headers['content-type'], 'application/json')
    assert.equal((await tool.execute({ text: '越权' }, { agent: f.agents[1] })).ok, false)
    assert.equal(calls.length, 2)
    f.platform = f.reload()
    assert.equal(f.platform.list().providers.find(item => item.id === definition.id).enabled, true)
    assert.equal((await f.call('/invoke/http_echo/echo', { text: '重启恢复' })).data.data.reply, '重启恢复')
    f.platform.connect({ providerId: definition.id, enabled: false, sessionIds: ['private'] })
    assert.equal((await f.platform.invoke(definition.id, 'echo', { text: '关闭' })).ok, false)
    assert.equal(calls.length, 3)
    const before = readFileSync(path, 'utf8')
    assert.equal((await f.call('/apis', definition)).status, 400)
    assert.equal(readFileSync(path, 'utf8'), before)
  } finally { f.close(); await new Promise(resolve => server.close(resolve)) }
})

test('手动接入拒绝无效定义和越权管理，保存失败回滚，损坏配置不覆盖', async () => {
  const f = fixture()
  const definition = httpApi('https://example.test/echo')
  try {
    f.reject(401); assert.equal((await f.call('/apis', definition)).status, 401); f.reject(undefined)
    assert.equal(f.platform.list().providers.length, 2)
    for (const url of ['file:///etc/passwd', 'https://user:secret@example.test/', 'invalid', 'https://example.test/#fragment']) {
      const value = httpApi(url); assert.equal((await f.call('/apis', value)).status, 400)
    }
    for (const headers of [[], { Host: 'other' }, { 'X-Test': 'bad\r\nheader' }, { Authorization: 123 }]) {
      const value = httpApi('https://example.test/'); value.operations[0].headers = headers
      assert.equal((await f.call('/apis', value)).status, 400)
    }
    const invalid = httpApi('https://example.test/'); invalid.operations[0].inputSchema.additionalProperties = true
    assert.equal((await f.call('/apis', invalid)).status, 400)
    assert.equal(f.platform.list().providers.length, 2)
    const path = join(f.home, 'big-fish-open-platform-apis.json')
    assert.equal(existsSync(path), false)
    mkdirSync(path)
    assert.equal((await f.call('/apis', definition)).status, 400)
    assert.equal(f.platform.list().providers.length, 2)
    rmSync(path, { recursive: true })
    assert.equal((await f.call('/apis', definition)).status, 200)
  } finally { f.close() }
  for (const text of ['{', '{}', JSON.stringify([httpApi('https://example.test/'), httpApi('https://example.test/')])]) {
    const broken = fixture(undefined, text)
    try {
      assert.match(broken.platform.list().warning, /API 配置/)
      assert.equal(broken.platform.list().providers.length, 2)
      assert.equal((await broken.call('/apis', definition)).status, 400)
      assert.equal(readFileSync(join(broken.home, 'big-fish-open-platform-apis.json'), 'utf8'), text)
    } finally { broken.close() }
  }
  const stale = fixture(JSON.stringify({ http_echo: { enabled: true, sessionIds: ['private'] } }))
  try { assert.equal((await stale.call('/apis', definition)).status, 400); assert.equal(stale.tools.size, 0) }
  finally { stale.close() }
})

test('手动 API 拒绝重定向、超大响应、非 JSON 和业务失败，输出仍受 Schema 校验', async () => {
  let mode = 'error', redirects = 0
  const server = createServer((req, res) => {
    if (req.url === '/redirected') { redirects++; res.end('{}'); return }
    if (mode === 'redirect') { res.writeHead(302, { Location: '/redirected' }); res.end(); return }
    if (mode === 'error') { res.writeHead(401); res.end('synthetic-secret'); return }
    if (mode === 'large') { res.end(' '.repeat(1048577)); return }
    if (mode === 'invalid') { res.end('synthetic-secret'); return }
    res.end(JSON.stringify(mode === 'business' ? { ok: false, error: { message: 'synthetic-secret' } } : { ok: true, data: { reply: 123 } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const f = fixture()
  try {
    assert.equal((await f.call('/apis', httpApi('http://127.0.0.1:' + server.address().port + '/echo'))).status, 200)
    f.platform.connect({ providerId: 'http_echo', enabled: true, sessionIds: [] })
    for (mode of ['error', 'redirect', 'large', 'invalid', 'business', 'schema']) {
      const result = await f.platform.invoke('http_echo', 'echo', { text: 'test' })
      assert.equal(result.ok, false, mode)
      assert.ok(!JSON.stringify(result).includes('synthetic-secret'), mode)
    }
    assert.equal(redirects, 0)
  } finally { f.close(); await new Promise(resolve => server.close(resolve)) }
})


test('一个手动提供方保存多个接口，校验失败不部分注册，重启恢复全部接口', async () => {
  const server = createServer(async (req, res) => {
    for await (const _chunk of req) { /* Drain the synthetic request before replying. */ }
    res.end(JSON.stringify({ ok: true, data: { reply: req.url } }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const f = fixture()
  try {
    const base = 'http://127.0.0.1:' + server.address().port
    const definition = httpApi(base + '/first')
    definition.operations.push({ ...definition.operations[0], id: 'other', title: '第二接口', url: base + '/second' })
    const duplicate = structuredClone(definition); duplicate.operations[1].id = 'echo'
    assert.equal((await f.call('/apis', duplicate)).status, 400)
    const invalid = structuredClone(definition); invalid.operations[1].outputSchema = { type: 'unsupported' }
    assert.equal((await f.call('/apis', invalid)).status, 400)
    assert.equal(f.platform.list().providers.length, 2)
    assert.equal(existsSync(join(f.home, 'big-fish-open-platform-apis.json')), false)
    assert.equal((await f.call('/apis', definition)).status, 200)
    assert.equal(f.platform.list().providers.find(item => item.id === 'http_echo').operations.length, 2)
    f.platform.connect({ providerId: 'http_echo', enabled: true, sessionIds: ['private'] })
    assert.equal((await f.tools.get('private:big_fish_http_echo_echo').execute({ text: 'test' })).data.reply, '/first')
    assert.equal((await f.tools.get('private:big_fish_http_echo_other').execute({ text: 'test' })).data.reply, '/second')
    f.platform = f.reload()
    const provider = f.platform.list().providers.find(item => item.id === 'http_echo')
    assert.equal(provider.operations.length, 2)
    assert.equal(provider.sessionIds[0], 'private')
    assert.ok(f.platform.openapi().paths[PLATFORM_PATH + '/invoke/http_echo/other'])
    assert.equal((await f.call('/invoke/http_echo/other', { text: 'test' })).data.data.reply, '/second')
  } finally { f.close(); await new Promise(resolve => server.close(resolve)) }
})

test('原生导入只查找已注册插件，不存 HTTP 凭据、不自动授权，可重复确认', async () => {
  const f = fixture()
  const reference = { schemaVersion: 1, transport: 'dsh', id: 'memo' }
  try {
    assert.equal((await f.call('/apis', reference)).status, 400)
    const off = f.platform.register(memo(async () => ({ id: 'native-note' })))
    for (let i = 0; i < 2; i++) {
      const result = await f.call('/apis', reference)
      assert.equal(result.status, 200)
      const provider = result.data.providers.find(item => item.id === 'memo')
      assert.equal(provider.enabled, false); assert.deepEqual(provider.sessionIds, [])
    }
    assert.equal(existsSync(join(f.home, 'big-fish-open-platform-apis.json')), false)
    assert.equal(f.tools.size, 0)
    f.reject(401); assert.equal((await f.call('/apis', reference)).status, 401); f.reject(undefined)
    assert.equal((await f.call('/apis', { ...reference, headers: {} })).status, 400)
    f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: ['private'] })
    assert.equal((await f.platform.invoke('memo', 'add', { text: '原生调用' }, { sessionId: 'private' })).data.id, 'native-note')
    off()
    assert.equal((await f.call('/apis', reference)).status, 400)
  } finally { f.close() }
})

test('同名旧 HTTP 接口被原生处理器接管，导入后移除旧凭据并保留授权', async () => {
  const definition = httpApi('https://example.test/echo')
  const f = fixture(JSON.stringify({ http_echo: { enabled: true, sessionIds: ['private'] } }), JSON.stringify([definition]))
  const path = join(f.home, 'big-fish-open-platform-apis.json')
  const reference = { schemaVersion: 1, transport: 'dsh', id: 'http_echo' }
  try {
    assert.equal((await f.call('/apis', reference)).status, 400)
    const manifest = { ...memo(async () => ({ id: 'native' })), id: 'http_echo' }
    const invalid = { ...manifest, operations: [{ ...manifest.operations[0], inputSchema: { type: 'bad' } }] }
    assert.throws(() => f.platform.register(invalid))
    assert.equal(f.platform.list().providers.find(item => item.id === 'http_echo').operations[0].id, 'echo')
    const originalRegister = f.ctx.webServer.register
    let failOnce = true
    f.ctx.webServer.register = route => {
      if (failOnce && route.path.endsWith('/http_echo/add')) { failOnce = false; throw Error('模拟路由注册失败') }
      return originalRegister(route)
    }
    assert.throws(() => f.platform.register(manifest), /模拟路由注册失败/)
    assert.equal(f.platform.list().providers.find(item => item.id === 'http_echo').operations[0].id, 'echo')
    f.ctx.webServer.register = originalRegister
    const off = f.platform.register(manifest)
    assert.equal((await f.platform.invoke('http_echo', 'add', { text: '同名迁移' }, { sessionId: 'private' })).data.id, 'native')
    assert.ok(readFileSync(path, 'utf8').includes('synthetic-secret'))
    assert.equal((await f.call('/apis', reference)).status, 200)
    assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')), [])
    const provider = f.platform.list().providers.find(item => item.id === 'http_echo')
    assert.equal(provider.enabled, true); assert.deepEqual(provider.sessionIds, ['private'])
    assert.throws(() => f.platform.register(manifest), /已注册/)
    off(); assert.equal((await f.call('/apis', reference)).status, 400)
    f.platform = f.reload()
    assert.equal(f.platform.list().providers.some(item => item.id === 'http_echo'), false)
  } finally { f.close() }
})


test('平台卸载主动清理原生路由，迟到的插件注销不会影响重新注册', async () => {
  const f = fixture()
  try {
    const oldOff = f.platform.register(memo(async () => ({ id: 'old' })))
    f.platform = f.reload()
    const newOff = f.platform.register(memo(async () => ({ id: 'new' })))
    oldOff()
    f.platform.connect({ providerId: 'memo', enabled: true, sessionIds: [] })
    assert.equal((await f.call('/invoke/memo/add', { text: '重载' })).data.data.id, 'new')
    newOff()
  } finally { f.close() }
})
