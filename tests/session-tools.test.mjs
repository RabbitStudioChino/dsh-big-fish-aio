import test from 'node:test'
import assert from 'node:assert/strict'
import { createSessionTools } from '../modules/qq/lib/session-tools.mjs'

const command = process.platform === 'win32' ? 'pwsh' : 'bash'
const sandboxNames = [command, 'job_list', 'job_output', 'job_kill']
const legacyNames = [...sandboxNames, 'web_search', 'web_fetch']

function fixture() {
  const key = {}, definitions = new Map(), mounted = [], logs = [], acquiredPresets = [], rows = []
  let released = 0, acquired = 0, ready = true
  const registry = {
    resolve: async id => ({ id: id || 'minimal' }),
    mount: async (scope, id) => {
      mounted.push({ scope, id })
      if (id === 'standard' && scope.inherited) {
        for (const [name, tool] of definitions) scope.inherited.set(name, tool)
      }
      return id
    },
    presetForSession: session => session.header.agentPreset ?? null,
    async acquireScope(id) { acquired++; acquiredPresets.push(id); return { key, async [Symbol.asyncDispose]() { released++ } } },
  }
  const web = { searchReady: async provider => ready && provider === 'deepseek-account', fetchReady: async () => ready }
  const tools = { get: (name, scope) => scope === key ? definitions.get(name) : scope.tools.get(name)?.tool || scope.inherited.get(name) }
  const shell = { sandboxMode: 'workspace-write' }
  const sandboxPolicy = { resolve: ({ session }) => ({ mode: session.mode, workspaceRoot: session.header.cwd }) }
  const ctx = { tools, get: name => ({ agentPresets: registry, web, shell, sandboxPolicy })[name] }
  for (const name of legacyNames) definitions.set(name, {
    name, timeoutMs: 60000,
    output: { render: () => '宿主格式' },
    execute: async (args, exec) => ({ args, ...exec,
      ...(name === command ? { policy: sandboxPolicy.resolve({ session: exec.agent.session }) } : {}),
    }),
  })
  const agent = (id = 'old', preset) => {
    const a = { id, tools: new Map(), inherited: new Map(), session: {
      header: { agentPreset: preset, cwd: '/workspace/' + id }, mode: 'workspace-write', events: ['历史聊天'],
    } }
    if (preset === 'standard') {
      for (const [name, tool] of definitions) a.inherited.set(name, tool)
    }
    a.ctx = { inherited: a.inherited, tools: { register(tool, options) {
      assert.equal(a.tools.has(tool.name), false)
      a.tools.set(tool.name, { tool, options })
      return () => a.tools.delete(tool.name)
    } } }
    rows.push({ 会话: id, 沙箱环境: true, 开: true })
    return a
  }
  return { ctx, registry, web, shell, definitions, mounted, agent, logs, acquiredPresets,
    rows, manager: createSessionTools({ ctx, bindings: () => rows, log: text => logs.push(text) }),
    ready: value => { ready = value }, stats: () => ({ acquired, released }) }
}

test('新映射固定使用宿主标准预设；恢复保留原预设并补齐沙箱工具', async () => {
  const f = fixture()
  const options = await f.manager.createOptions(), fresh = f.agent('new', 'standard'), scope = fresh.ctx
  assert.equal(options.agentPreset, 'standard')
  assert.equal(await options.setup(scope, fresh), undefined, 'setup 不能把预设 ID 当成提交回调返回')
  assert.equal(f.ctx.tools.get(command, fresh).output, f.definitions.get(command).output)
  assert.equal(fresh.tools.size, sandboxNames.length, '标准预设的执行工具同样受映射开关约束')
  const a = f.agent('saved', 'custom')
  await f.manager.resumeSetup(a.ctx, a)
  assert.deepEqual(f.mounted, [{ scope, id: 'standard' }, { scope: a.ctx, id: 'custom' }])
  await f.manager.ensure(a)
  assert.deepEqual([...a.tools.keys()], sandboxNames)
  assert.deepEqual(f.acquiredPresets, ['standard', 'standard'])
  await f.manager.dispose()
})

test('两条旧会话补挂原生工具，保留历史和绑定身份，重复调用幂等且维持鉴权与取消', async () => {
  const f = fixture(), a = f.agent('private'), b = f.agent('group'), c = f.agent('standard-group', 'standard')
  const before = JSON.stringify([a.session, b.session, c.session])
  await Promise.all([f.manager.sync([a, b, c]), f.manager.ensure(a), f.manager.ensure(a)])
  for (const item of [a, b]) {
    assert.deepEqual([...item.tools.keys()], legacyNames)
    const { tool, options } = item.tools.get('web_search')
    assert.equal(tool, f.definitions.get('web_search'), '复用宿主校验、结果格式、超时与执行器')
    assert.equal(await options.when({ modelSelection: { provider: 'deepseek-account' } }), true)
    f.ready(false)
    assert.equal(await options.when({ modelSelection: { provider: 'deepseek-account' } }), false)
    f.ready(true)
    const controller = new AbortController()
    const result = await tool.execute({ queries: ['天气'] }, { signal: controller.signal })
    assert.equal(result.signal, controller.signal)
    const sandbox = item.tools.get(command).tool
    assert.equal(sandbox.output, f.definitions.get(command).output)
    assert.equal(item.tools.get(command).options.when(), true)
    const execution = { agent: item, callId: 'call-' + item.id, signal: controller.signal }
    const code = await sandbox.execute({ command: 'python3 -c "print(6 * 7)"', timeoutMs: 1000 }, execution)
    assert.equal(code.agent, item)
    assert.equal(code.callId, execution.callId)
    assert.equal(code.signal.aborted, false)
    controller.abort()
    assert.equal(code.signal.aborted, true)
    assert.deepEqual(code.policy, { mode: 'workspace-write', workspaceRoot: item.session.header.cwd })
    item.session.mode = 'read-only'
    assert.equal((await sandbox.execute({}, execution)).policy.mode, 'read-only')
    item.session.mode = 'workspace-write'
  }
  assert.equal(c.tools.size, sandboxNames.length)
  assert.equal(f.ctx.tools.get(command, c).output, f.definitions.get(command).output)
  assert.equal(JSON.stringify([a.session, b.session, c.session]), before)
  assert.equal(f.stats().acquired, 3)
  await f.manager.sync([b])
  assert.equal(a.tools.size, 0)
  assert.equal(b.tools.size, legacyNames.length)
  const replacement = f.agent('group')
  await f.manager.sync([replacement])
  assert.equal(b.tools.size, 0)
  assert.equal(replacement.tools.size, legacyNames.length)
  await f.manager.dispose()
  assert.equal(replacement.tools.size, 0)
  assert.deepEqual(f.stats(), { acquired: 4, released: 4 })
})

test('宿主沙箱缺失时拒绝执行，恢复沙箱后可重试', async () => {
  const f = fixture(), a = f.agent()
  delete f.shell.sandboxMode
  await f.manager.ensure(a)
  const tool = a.tools.get(command).tool
  await assert.rejects(tool.execute({}, { agent: a }), /缺少沙箱/)
  f.shell.sandboxMode = 'workspace-write'
  assert.equal((await tool.execute({}, { agent: a })).agent, a)
  await f.manager.dispose()
})

test('宿主已有或禁用的工具不覆盖，旧会话恢复在 setup 阶段补挂', async () => {
  const f = fixture(), a = f.agent()
  const existing = { name: 'web_search' }
  a.tools.set('web_search', { tool: existing })
  f.definitions.delete('web_fetch')
  await f.manager.ensure(a)
  assert.equal(a.tools.get('web_search').tool, existing)
  assert.deepEqual([...a.tools.keys()], ['web_search', ...sandboxNames])
  assert.deepEqual(f.stats(), { acquired: 1, released: 0 })
  await f.manager.sync([])
  assert.equal(a.tools.get('web_search').tool, existing)
  f.definitions.set('web_fetch', { name: 'web_fetch' })
  await f.manager.resumeSetup(a.ctx, a)
  assert.equal(a.tools.size, legacyNames.length)
  await f.manager.dispose()
})

test('补挂中途失败撤销已注册工具并释放预设，下次可重试', async () => {
  const f = fixture(), a = f.agent()
  const register = a.ctx.tools.register
  a.ctx.tools.register = (tool, options) => {
    if (tool.name === 'web_fetch') throw Error('fixture register failure')
    return register(tool, options)
  }
  await assert.rejects(f.manager.ensure(a), /register failure/)
  assert.equal(a.tools.size, 0)
  assert.deepEqual(f.stats(), { acquired: 1, released: 1 })
  a.ctx.tools.register = register
  await f.manager.ensure(a)
  assert.equal(a.tools.size, legacyNames.length)
  await f.manager.dispose()
})

test('卸载等待进行中的补挂，完成后不遗留注册或预设引用；旧宿主无预设仍可创建', async () => {
  const f = fixture(), a = f.agent()
  let finish
  f.registry.acquireScope = () => new Promise(resolve => { finish = resolve })
  const pending = f.manager.ensure(a), disposing = f.manager.dispose()
  let released = false
  finish({ key: {}, async [Symbol.asyncDispose]() { released = true } })
  await Promise.all([pending, disposing])
  assert.equal(a.tools.size, 0); assert.equal(released, true)
  const legacy = createSessionTools({ ctx: { get: () => undefined }, log() {} })
  assert.deepEqual(await legacy.createOptions(), {})
  await legacy.ensure(a)
})

test('QQ 宿主入口修复现有绑定，创建入口传递预设，恢复入口补回旧会话工具', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const { Readable } = await import('node:stream')
  const home = mkdtempSync(join(tmpdir(), 'fish-session-tools-')), previous = process.env.DSH_HOME
  process.env.DSH_HOME = home
  const f = fixture(), a = f.agent('session-existing'), restored = f.agent('session-restored')
  const agents = new Map([[a.id, a]]), routes = new Map(), cleanups = [], calls = []
  writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify({ 工作区: 'work', 绑定: [
    { 类型: '私聊', 号码: '123456', 会话: a.id, 开: true },
    { 类型: '群', 号码: '654321', 会话: restored.id, 开: true },
  ] }))
  const ctx = {
    ...f.ctx, logger: { info() {} }, on: () => () => {}, interval: () => () => {},
    effect(fn) { const off = fn(); if (off) cleanups.push(off) },
    sessions: { list: () => [] },
    workspaceRegistry: { list: () => [{ id: 'work', path: home }], get: () => ({ attachSession: async () => {} }) },
    agents: {
      get: id => agents.get(id), list: () => [...agents.values()],
      async resume(options) {
        assert.equal(options.resumeSessionId, restored.id)
        await options.setup(restored.ctx, restored)
        agents.set(restored.id, restored)
        return { agent: restored }
      },
      async create(options) {
        calls.push(options)
        const created = f.agent(options.sessionId, options.meta.agentPreset)
        created.session.append = () => {}
        await options.setup(created.ctx, created)
        agents.set(created.id, created)
        return { agent: created }
      },
    },
    webServer: { register(route) { routes.set(route.path, route.handler); return () => {} } },
    get(name) { return name === 'connection' ? { requestRejection: () => undefined } : f.ctx.get(name) || this[name] },
  }
  try {
    const host = await import('../modules/qq/lib/host.js?session-tools-host')
    host.apply(ctx)
    const call = async (path, body) => {
      const req = Readable.from([JSON.stringify(body || {})])
      Object.assign(req, { method: body ? 'POST' : 'GET', url: path, headers: {} })
      let result
      await routes.get(path)(req, { setHeader() {}, end(text) { result = JSON.parse(text) } })
      return result
    }
    await call('/dsh-qq-bridge/state')
    for (const agent of [a, restored]) assert.deepEqual([...agent.tools.keys()], legacyNames)
    const created = await call('/dsh-qq-bridge/create-session', { 名称: '新 QQ 会话' })
    assert.equal(created.ok, true, JSON.stringify(created))
    assert.equal(calls.length, 1)
    assert.equal(calls[0].meta.agentPreset, 'standard')
    assert.equal(calls[0].meta.cwd, home)
    assert.equal(f.mounted.at(-1).id, 'standard')
    assert.equal(f.ctx.tools.get(command, agents.get(created.会话)).output, f.definitions.get(command).output)
    assert.deepEqual(a.session.events, ['历史聊天'])
  } finally {
    for (const off of cleanups.reverse()) await off()
    if (previous === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previous
    rmSync(home, { recursive: true, force: true })
  }
})

test('沙箱逐会话明确授权，旧配置默认关闭，关闭后拦截已排队调用并中止执行', async () => {
  const f = fixture(), a = f.agent('private'), b = f.agent('group', 'standard')
  delete f.rows[0].沙箱环境
  f.rows[1].沙箱环境 = false
  await f.manager.sync([a, b])
  for (const agent of [a, b]) {
    const entry = agent.tools.get(command)
    assert.equal(entry.options.when(), false)
    await assert.rejects(entry.tool.execute({}, { agent }), /未开启/)
  }
  f.rows[0].沙箱环境 = true
  assert.equal(a.tools.get(command).options.when(), true)
  assert.equal(b.tools.get(command).options.when(), false)
  f.rows[0].沙箱环境 = false
  await assert.rejects(a.tools.get(command).tool.execute({}, { agent: a }), /未开启/)
  await f.manager.dispose()

  const running = fixture(), c = running.agent('running')
  running.definitions.get(command).execute = async (_args, exec) => new Promise(resolve => {
    exec.signal.addEventListener('abort', () => resolve('aborted'), { once: true })
  })
  await running.manager.ensure(c)
  const task = c.tools.get(command).tool.execute({}, { agent: c })
  running.rows[0].沙箱环境 = false
  await running.manager.sync([c])
  assert.equal(await task, 'aborted')
  await running.manager.dispose()
})
