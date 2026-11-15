import { mkdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFileAtomicSync } from '../modules/qq/lib/atomic-file.mjs'
import { checkSchema, validateValue } from './open-platform-schema.mjs'
import { httpManifest } from './open-platform-http.mjs'
import { nativeApiReference } from './open-platform-import.mjs'
import { latestUserId, qqScope } from '../modules/memory/lib/qq-scope.mjs'
import { ownerQQ } from '../modules/qq/lib/memory-sources.mjs'

export const PLATFORM_PATH = '/dsh-big-fish-aio/open-platform'
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })
const wallet = object({ currency: { type: 'string', enum: ['CNY', 'USD'], description: '钱包币种' }, balance: { type: 'string', description: '余额，保留原始十进制字符串' } })
const idPattern = /^[a-z][a-z0-9_]{0,23}$/
const sessionId = agent => String(agent.session?.id || agent.id)
const builtInOrder = new Map([['dsh_account', 0], ['skills', 1], ['rice', 2]])

export function createOpenPlatform(ctx, { readFeatures = () => [] } = {}) {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  const configPath = join(home, 'big-fish-open-platform.json')
  const apisPath = join(home, 'big-fish-open-platform-apis.json')
  let apis = [], apisError = ''
  let grants = {}, configError = ''
  try {
    const saved = JSON.parse(readFileSync(configPath, 'utf8'))
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw Error('授权配置必须是对象')
    grants = saved
  } catch (error) {
    if (error.code !== 'ENOENT') configError = '开放平台授权配置无法读取，请修复 ' + configPath
  }
  const providers = new Map(), mounted = new Map(), apiOffs = []
  let disposed = false
  const agents = () => ctx.agents?.list?.() || []
  const grantFor = id => Array.isArray(grants[id]?.sessionIds) ? grants[id] : { enabled: false, sessionIds: [] }
  const endpoint = (id, operation) => PLATFORM_PATH + '/invoke/' + id + '/' + operation
  const toolName = (id, operation) => 'big_fish_' + id + '_' + operation
  const getSessionIsolation = id => {
    if (disposed || !providers.has(id) || grantFor(id).deleted) throw Error('接口提供方未加载')
    return Boolean(providers.get(id).supportsSessionIsolation) && grantFor(id).sessionIsolation !== false
  }

  function sessionScope() {
    try {
      const config = JSON.parse(readFileSync(join(home, 'qq-bridge-config.json'), 'utf8'))
      const registry = ctx.workspaceRegistry || ctx.get('workspaceRegistry')
      const workspace = registry?.get?.(config.工作区)
      if (!workspace) return { workspaceId: '', sessions: [] }
      const members = new Set(workspace.sessionIds), archived = new Set(registry.archivedSessionIds || [])
      const bindings = Array.isArray(config.绑定) ? config.绑定 : []
      const sessions = new Map()
      for (const binding of bindings) {
        const id = binding?.会话, type = binding?.类型
        if (!members.has(id) || archived.has(id) || !['私聊', '群'].includes(type) || bindings.some(other => other?.会话 === id && other?.类型 !== type)) continue
        const session = agents().find(agent => sessionId(agent) === id)?.session || ctx.sessions?.get?.(id)
        const title = (session && ctx.get('sessionTitle')?.get(session)?.title) || session?.header?.title || session?.title || type + ' ' + binding.号码
        sessions.set(id, { id, title, type })
      }
      return { workspaceId: workspace.id, sessions: [...sessions.values()] }
    } catch { return { workspaceId: '', sessions: [] } }
  }
  const sessionAllowed = (id, grant) => grant.sessionIds.includes(id) && sessionScope().sessions.some(session => session.id === id)

  function ownerSnapshot(execution) {
    if (execution.source === 'test') return { isOwner: true, key: 'local-management' }
    let messageId = '', owner = '', source = null
    try {
      const session = agents().find(agent => sessionId(agent) === execution.sessionId)?.session || ctx.sessions?.get?.(execution.sessionId)
      messageId = latestUserId(session)
      const scope = qqScope(home, execution.sessionId, {}, messageId)
      owner = ownerQQ(JSON.parse(readFileSync(join(home, 'qq-bridge-config.json'), 'utf8')))
      if (scope && !scope.blocked && scope.source?.messageId && Array.isArray(scope.source.senders)) source = scope.source
    } catch { /* 来源未知时按非主人处理。 */ }
    const isOwner = Boolean(owner && source && source.senders.length === 1 && source.senders[0] === owner)
    return { isOwner, key: JSON.stringify([messageId, owner, source?.botId, source?.messageId, source?.senders]) }
  }

  async function invoke(providerId, operationId, input, execution = {}) {
    const requestId = randomUUID(), start = Date.now()
    try {
      const provider = providers.get(providerId), grant = grantFor(providerId)
      if (disposed || !provider) throw Error('接口提供方未加载')
      if (grant.deleted || !grant.enabled) throw Error('请先开启此插件接入开关')
      if (execution.sessionId !== undefined && (typeof execution.sessionId !== 'string' || !execution.sessionId || !sessionAllowed(execution.sessionId, grant))) throw Error('此会话未获接口授权或已离开绑定工作区')
      const localTest = execution.source === 'test' && execution.sessionId === undefined
      if (provider.supportsSessionIsolation && !execution.sessionId && !localTest) throw Error('缺少可信的调用会话')
      const isolated = getSessionIsolation(providerId)
      const actor = ownerSnapshot(execution)
      const operation = provider.operations.find(item => item.id === operationId)
      if (!operation) throw Error('接口不存在')
      validateValue(operation.inputSchema, input)
      const signal = AbortSignal.any([provider.lifetime.signal, provider.policyLifetime.signal, AbortSignal.timeout(15000), ...(execution.signal ? [execution.signal] : [])])
      signal.throwIfAborted()
      const assertCurrent = () => {
        signal.throwIfAborted()
        if (actor.key !== ownerSnapshot(execution).key) throw Error('调用期间 QQ 消息来源或主人配置已变更')
        if (provider !== providers.get(providerId) || !grantFor(providerId).enabled || isolated !== getSessionIsolation(providerId) || (execution.sessionId && !sessionAllowed(execution.sessionId, grantFor(providerId)))) throw Error('调用期间授权或会话隔离设置已变更')
      }
      const isolation = provider.supportsSessionIsolation ? Object.freeze({ enabled: isolated, sessionId: localTest ? '@local' : execution.sessionId, assertCurrent }) : undefined
      let onAbort
      const aborted = new Promise((_, reject) => {
        onAbort = () => reject(Error('接口调用已取消或超过 15 秒，写入操作请先核对结果再重试'))
        signal.addEventListener('abort', onAbort, { once: true })
      })
      let data
      try { data = await Promise.race([Promise.resolve().then(() => operation.handler(input, { ...execution, signal, requestId, isolation, isOwner: actor.isOwner })), aborted]) }
      finally { signal.removeEventListener('abort', onAbort) }
      signal.throwIfAborted()
      assertCurrent()
      validateValue(operation.outputSchema, data, 'output')
      return { ok: true, data, requestId, durationMs: Date.now() - start }
    } catch (error) {
      return { ok: false, error: { code: 'CALL_FAILED', message: String(error.message || error) }, requestId, durationMs: Date.now() - start }
    }
  }

  function syncTools() {
    const wanted = new Map()
    const allowed = new Set(sessionScope().sessions.map(session => session.id))
    for (const agent of agents()) {
      const sid = sessionId(agent)
      if (!allowed.has(sid) || !agent.ctx?.tools?.register) continue
      for (const [id, provider] of providers) {
        const grant = grantFor(id)
        if (grant.deleted || !grant.enabled || !grant.sessionIds.includes(sid)) continue
        for (const operation of provider.operations) {
          const key = sid + ':' + id + ':' + operation.id
          wanted.set(key, agent)
          if (mounted.get(key)?.agent === agent) continue
          mounted.get(key)?.off()
          mounted.delete(key)
          const off = agent.ctx.tools.register({
            name: toolName(id, operation.id), description: provider.title + ' · ' + operation.title + '。' + operation.description,
            parameters: operation.inputSchema, timeoutMs: 16000,
            output: { schema: { type: 'object', properties: {}, additionalProperties: true }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
            execute: (input, exec = {}) => invoke(id, operation.id, input, { signal: exec.signal, sessionId: exec.agent ? sessionId(exec.agent) : sid, source: 'model' }),
          })
          mounted.set(key, { agent, off })
        }
      }
    }
    for (const [key, record] of mounted) if (wanted.get(key) !== record.agent) { record.off(); mounted.delete(key) }
  }

  const send = (res, status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify(value))
  }
  function route(path, method, handler) {
    return ctx.webServer.register({ path, handler: async (req, res) => {
      try {
        const connection = ctx.get('connection')
        if (!connection?.requestRejection) return send(res, 503, { ok: false, error: { message: '宿主鉴权服务不可用' } })
        const rejection = await connection.requestRejection(req)
        if (rejection) return send(res, rejection, { ok: false, error: { message: '管理鉴权失败' } })
        if ((req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { ok: false, error: { message: '拒绝跨站请求' } })
        if (req.method !== method) return send(res, 405, { ok: false, error: { message: '请求方法应为 ' + method } })
        let body = {}
        if (method === 'POST') {
          if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(res, 415, { ok: false, error: { message: '只接受 JSON 请求' } })
          const chunks = []; let size = 0
          for await (const chunk of req) {
            size += Buffer.byteLength(chunk)
            if (size > 65536) return send(res, 413, { ok: false, error: { message: '请求超过 64 KB' } })
            chunks.push(Buffer.from(chunk))
          }
          try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
          catch { return send(res, 400, { ok: false, error: { message: 'JSON 格式错误' } }) }
        }
        send(res, 200, await handler(body, req))
      } catch (error) { send(res, 400, { ok: false, error: { message: String(error.message || error) } }) }
    } })
  }

  function list() {
    const scope = sessionScope(), allowed = new Set(scope.sessions.map(session => session.id))
    return {
      ok: true, schemaVersion: 1, warning: [configError, apisError].filter(Boolean).join('；'),
      providers: [...providers].filter(([id]) => !grantFor(id).deleted)
        .sort(([a], [b]) => (builtInOrder.get(a) ?? 3) - (builtInOrder.get(b) ?? 3)).map(([id, provider]) => ({
        id, title: provider.title, description: provider.description, version: provider.version, ...grantFor(id),
        supportsSessionIsolation: provider.supportsSessionIsolation, sessionIsolation: getSessionIsolation(id),
        sessionIds: grantFor(id).sessionIds.filter(session => allowed.has(session)),
        operations: provider.operations.map(({ handler, ...operation }) => ({ ...operation, endpoint: endpoint(id, operation.id), toolName: toolName(id, operation.id) })),
      })),
      sessions: scope.sessions, workspaceId: scope.workspaceId, apiOrigin: ctx.webServer.getOrigin?.() || '',
    }
  }

  function openapi() {
    const paths = {}
    for (const [id, provider] of [...providers].filter(([id]) => !grantFor(id).deleted)) for (const operation of provider.operations) {
      paths[endpoint(id, operation.id)] = { post: {
        operationId: toolName(id, operation.id), tags: [provider.title], summary: operation.title, description: operation.description,
        'x-big-fish-read-only': operation.readOnly,
        'x-big-fish-session-isolation': getSessionIsolation(id),
        ...(provider.supportsSessionIsolation ? { parameters: [{ in: 'header', name: 'X-Big-Fish-Session', required: false, description: '本人登录后的管理请求可指定已授权会话，省略时使用 @local 本机范围。模型调用由宿主自动确定会话。', schema: { type: 'string' } }] } : {}),
        requestBody: { required: true, content: { 'application/json': { schema: operation.inputSchema, example: operation.example } } },
        responses: { 200: { description: '统一调用结果，ok=false 时查看 error', content: { 'application/json': { schema: {
          type: 'object', properties: { ok: { type: 'boolean' }, data: operation.outputSchema, error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } }, requestId: { type: 'string' }, durationMs: { type: 'integer' } }, required: ['ok', 'requestId', 'durationMs'],
        } } } } },
      } }
    }
    return { openapi: '3.1.0', info: { title: '大肥鱼开放平台', version: '1.0.0', description: '管理接口复用 DSH 本人登录鉴权，会话工具还需要接入授权。' }, paths }
  }

  function saveGrant(providerId, grant) {
    if (configError) throw Error(configError)
    const next = { ...grants, [providerId]: grant }
    mkdirSync(home, { recursive: true })
    writeFileAtomicSync(configPath, JSON.stringify(next, null, 2))
    grants = next
    const provider = providers.get(providerId)
    provider.policyLifetime.abort()
    provider.policyLifetime = new AbortController()
    syncTools()
  }

  function connect({ providerId, enabled, sessionIds, sessionIsolation }) {
    if (!providers.has(providerId) || grantFor(providerId).deleted || typeof enabled !== 'boolean' || !Array.isArray(sessionIds) || sessionIds.some(id => typeof id !== 'string' || !id)) throw Error('接入参数无效')
    if (sessionIsolation !== undefined && (typeof sessionIsolation !== 'boolean' || !providers.get(providerId).supportsSessionIsolation)) throw Error('此提供方不支持会话隔离设置')
    const known = new Set(sessionScope().sessions.map(session => session.id))
    if (sessionIds.some(id => !known.has(id))) throw Error('授权会话不存在或不属于绑定工作区的 QQ 映射')
    saveGrant(providerId, { ...grantFor(providerId), enabled, sessionIds: [...new Set(sessionIds)], ...(sessionIsolation !== undefined ? { sessionIsolation } : {}) })
    return list()
  }

  function removeApi({ providerId }) {
    if (!providers.has(providerId)) throw Error('接口提供方未加载')
    // 移除标记与授权原子保存，插件重新注册或宿主重启也不会自动恢复接入。
    saveGrant(providerId, { deleted: true, enabled: false, sessionIds: [] })
    return list()
  }

  function register(manifest, transport = 'dsh') {
    if (disposed) throw Error('开放平台已卸载')
    if (!manifest || manifest.schemaVersion !== 1 || typeof manifest.id !== 'string' || !idPattern.test(manifest.id) || typeof manifest.title !== 'string' || !manifest.title || typeof manifest.description !== 'string' || typeof manifest.version !== 'string' || !Array.isArray(manifest.operations) || !manifest.operations.length) throw Error('插件清单无效')
    if (manifest.supportsSessionIsolation !== undefined && typeof manifest.supportsSessionIsolation !== 'boolean') throw Error('supportsSessionIsolation 必须是布尔值')
    const id = manifest.id
    const previous = providers.get(id)
    if (previous && !(previous.transport === 'http' && (transport === 'dsh' || grantFor(id).deleted))) throw Error('插件 ID 已注册 ' + id)
    const ids = new Set()
    const operations = manifest.operations.map(operation => {
      if (!operation || typeof operation.id !== 'string' || !idPattern.test(operation.id) || ids.has(operation.id) || typeof operation.title !== 'string' || !operation.title || typeof operation.description !== 'string' || typeof operation.readOnly !== 'boolean' || typeof operation.handler !== 'function') throw Error('接口定义无效或 ID 重复')
      ids.add(operation.id)
      const metadata = JSON.parse(JSON.stringify({ id: operation.id, title: operation.title, description: operation.description, readOnly: operation.readOnly, inputSchema: operation.inputSchema, outputSchema: operation.outputSchema, example: operation.example ?? {} }))
      checkSchema(metadata.inputSchema); checkSchema(metadata.outputSchema)
      if (metadata.inputSchema.type !== 'object') throw Error('输入 Schema 根类型必须是 object')
      validateValue(metadata.inputSchema, metadata.example, 'example')
      return { ...metadata, handler: operation.handler }
    })
    const previousApi = previous && apis.find(api => api.id === id)
    previous?.off()
    const provider = { transport, supportsSessionIsolation: manifest.supportsSessionIsolation === true, policyLifetime: new AbortController(), id: manifest.id, title: manifest.title, description: manifest.description, version: manifest.version, operations, lifetime: new AbortController() }
    const offs = []
    try {
      for (const operation of operations) offs.push(route(endpoint(id, operation.id), 'POST', (input, req) => invoke(id, operation.id, input, { source: 'test', sessionId: req.headers['x-big-fish-session'] })))
      providers.set(id, provider)
      syncTools()
    } catch (error) {
      providers.delete(id); offs.forEach(off => off()); syncTools()
      if (previousApi) apiOffs.push(register(httpManifest(previousApi), 'http'))
      throw error
    }
    provider.off = () => {
      if (providers.get(id) !== provider) return
      provider.lifetime.abort(); provider.policyLifetime.abort(); providers.delete(id)
      offs.forEach(off => off()); syncTools()
    }
    return provider.off
  }

  function addApi(value) {
    if (value?.transport !== undefined) {
      const reference = nativeApiReference(value)
      if (providers.get(reference.id)?.transport !== 'dsh') throw Error('未找到原生接口提供方，请在同一 DSH 安装并启用对应插件及大肥鱼')
      if (apis.some(api => api.id === reference.id)) {
        const next = apis.filter(api => api.id !== reference.id)
        writeFileAtomicSync(apisPath, JSON.stringify(next, null, 2))
        apis = next
      }
      if (grantFor(reference.id).deleted) saveGrant(reference.id, { enabled: false, sessionIds: [] })
      return list()
    }
    if (apisError) throw Error(apisError)
    const definition = JSON.parse(JSON.stringify(value))
    if (Object.hasOwn(grants, definition?.id) && !grantFor(definition.id).deleted) throw Error('此提供方 ID 已有授权记录，请使用新的 ID')
    const off = register(httpManifest(definition), 'http')
    try {
      const next = [...apis.filter(api => api.id !== definition.id), definition]
      mkdirSync(home, { recursive: true })
      writeFileAtomicSync(apisPath, JSON.stringify(next, null, 2))
      apis = next
    } catch (error) { off(); throw error }
    apiOffs.push(off)
    if (grantFor(definition.id).deleted) saveGrant(definition.id, { enabled: false, sessionIds: [] })
    return list()
  }

  const platform = { register: manifest => register(manifest), list, invoke, connect, openapi, getSessionIsolation }
  ctx.provide('bigFishOpenPlatform', platform)
  ctx.effect(() => route(PLATFORM_PATH + '/catalog', 'GET', list))
  ctx.effect(() => route(PLATFORM_PATH + '/openapi.json', 'GET', openapi))
  ctx.effect(() => route(PLATFORM_PATH + '/connect', 'POST', connect))
  ctx.effect(() => route(PLATFORM_PATH + '/apis', 'POST', addApi))
  ctx.effect(() => route(PLATFORM_PATH + '/remove', 'POST', removeApi))
  ctx.on('agent/created', syncTools)
  ctx.on('agent/disposed', syncTools)
  ctx.interval(syncTools, 2000)
  ctx.effect(() => () => {
    disposed = true
    apiOffs.splice(0).forEach(off => off())
    for (const provider of providers.values()) provider.off()
    for (const record of mounted.values()) record.off()
    mounted.clear()
  })

  ctx.effect(() => register({
    schemaVersion: 1, id: 'dsh_account', version: '1.0.0', title: 'DeepSeek 账户', description: '复用 DSH 官方账号服务，查询当前登录账号的充值余额与赠金。',
    operations: [{
      id: 'balance', title: '查询账户余额', description: '查询 DSH 当前登录的 DeepSeek 账户余额。充值余额和赠金分别返回，金额保留原始十进制字符串。', readOnly: true,
      inputSchema: { ...object({}), description: '无需业务参数，请传入空对象 {}。' }, example: {},
      outputSchema: object({ wallets: { type: 'array', items: wallet, description: '充值钱包列表' }, bonusWallets: { type: 'array', items: wallet, description: '赠送钱包列表' } }),
      async handler() {
        const account = ctx.get('deepseekAccount')
        if (!account?.getBalance) throw Error('当前宿主未提供 DeepSeek 账户服务')
        const result = await account.getBalance({ version: JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, locale: 'zh-CN', timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60 })
        if (!result) throw Error('请先在 DSH 登录 DeepSeek 账户')
        if (result.status !== 'ready') throw Error('DSH 账户余额查询失败，请检查登录状态或网络')
        return { wallets: result.value.map(({ currency, balance }) => ({ currency, balance })), bonusWallets: (result.bonusWallets || []).map(({ currency, balance }) => ({ currency, balance })) }
      },
    }],
  }))
  ctx.effect(() => register({
    schemaVersion: 1, id: 'skills', version: '1.1.0', title: '大肥鱼技能库',
    description: '查询大肥鱼自身功能及实际配置，包括 QQ 合并消息接收、图片文件、语音转写、表情包、记忆、心情和主动搭话，并列出开放平台接口。',
    operations: [{
      id: 'list_capabilities', title: '查询能力清单', readOnly: true,
      description: '当用户询问你有什么功能、能不能合并几条消息一起接收、合并窗口几秒、某开关是否打开或具体参数时，先调用此接口。自身功能与实际参数见 features，按 parameters 中的 type 解析 JSON 标量 value，区分 enabled（配置开关）与 effective（当前会话配置条件）。请勿把支持功能当成已开启，或把配置条件当成外部服务已连通。capabilities 另列开放平台接口和会话授权状态。参数传空对象。',
      inputSchema: object({}), example: {},
      outputSchema: object({
        sessionId: { type: 'string', description: '可信调用会话 ID，本机页面未指定会话时为空字符串' },
        providerCount: { type: 'integer', description: '已注册且未删除的提供方数量' },
        capabilityCount: { type: 'integer', description: '接口总数，包含本查询接口' },
        enabledCount: { type: 'integer', description: '接入开关已开启的接口数量' },
        callableCount: { type: 'integer', description: '当前会话已获授权且已启用的接口数量' },
        featureCount: { type: 'integer', description: '自身功能分组数量，独立于开放平台接口数量' },
        enabledFeatureCount: { type: 'integer', description: '已开启配置的功能分组数' },
        effectiveFeatureCount: { type: 'integer', description: '当前会话满足配置条件的功能分组数' },
        features: { type: 'array', items: object({
          id: { type: 'string' }, module: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' },
          mode: { type: 'string', description: 'automatic 为自动功能，panel 为面板操作，unavailable 为不可用，unknown 为读取失败' },
          enabled: { type: 'boolean', description: '本功能配置是否开启，组合功能需查看各参数的独立开关' },
          effective: { type: 'boolean', description: '本会话的开关、绑定等配置条件满足，未探测网络、凭据与外部运行状态' },
          reason: { type: 'string' },
          parameters: { type: 'array', items: object({ key: { type: 'string' }, type: { type: 'string' }, value: { type: 'string', description: '按 type 编码的 JSON 标量，0 和 false 原样保留' } }) },
        }) },
        capabilities: { type: 'array', items: object({
          providerId: { type: 'string', description: '提供方 ID' },
          providerTitle: { type: 'string', description: '提供方名称' },
          operationId: { type: 'string', description: '接口 ID' },
          title: { type: 'string', description: '能力名称' },
          description: { type: 'string', description: '接口用途和调用说明' },
          toolName: { type: 'string', description: '对应的模型工具名称' },
          readOnly: { type: 'boolean', description: '是否为只读能力' },
          enabled: { type: 'boolean', description: '提供方接入开关是否开启' },
          supportsSessionIsolation: { type: 'boolean', description: '接入插件是否支持可切换的会话隔离' },
          sessionIsolation: { type: 'boolean', description: '当前接入插件的会话隔离开关' },
          callable: { type: 'boolean', description: '当前调用会话是否已获该接口授权并开启接入' },
          unavailableReason: { type: 'string', description: '不可调用的原因，可调用时为空字符串' },
        }) },
      }),
      handler(_input, execution) {
        const sid = execution.sessionId || ''
        const features = readFeatures(execution)
        const catalog = list()
        const capabilities = catalog.providers.flatMap(provider => provider.operations.map(operation => {
          const enabled = Boolean(provider.enabled)
          const callable = enabled && Boolean(sid) && provider.sessionIds.includes(sid)
          let unavailableReason = ''
          if (!enabled) unavailableReason = '接入已关闭'
          else if (!sid) unavailableReason = '未指定 QQ 会话，请在已授权会话中确认可调用状态'
          else if (!callable) unavailableReason = '当前会话未获授权'
          return {
            providerId: provider.id, providerTitle: provider.title,
            operationId: operation.id, title: operation.title, description: operation.description,
            toolName: operation.toolName, readOnly: operation.readOnly, enabled,
            supportsSessionIsolation: provider.supportsSessionIsolation, sessionIsolation: provider.sessionIsolation,
            callable, unavailableReason,
          }
        }))
        return {
          sessionId: sid, features, featureCount: features.length,
          enabledFeatureCount: features.filter(feature => feature.enabled).length,
          effectiveFeatureCount: features.filter(feature => feature.effective).length,
          providerCount: catalog.providers.length, capabilityCount: capabilities.length,
          enabledCount: capabilities.filter(capability => capability.enabled).length,
          callableCount: capabilities.filter(capability => capability.callable).length, capabilities,
        }
      },
    }],
  }))
  const restored = []
  try {
    const saved = JSON.parse(readFileSync(apisPath, 'utf8'))
    if (!Array.isArray(saved)) throw Error('API 配置必须是数组')
    for (const definition of saved) {
      const manifest = httpManifest(definition)
      if (providers.get(manifest.id)?.transport !== 'dsh') restored.push(register(manifest, 'http'))
    }
    apis = saved
    apiOffs.push(...restored)
  } catch (error) {
    restored.reverse().forEach(off => off())
    if (error.code !== 'ENOENT') apisError = '手动 API 配置无法读取或校验失败，请修复 ' + apisPath
  }
  return platform
}
