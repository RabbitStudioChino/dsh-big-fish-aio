// 复用宿主工具，并在每次执行前复核当前 QQ 映射的沙箱授权。
export function createSessionTools({ ctx, bindings = () => [], log }) {
  const attached = new Map(), pending = new Map()
  const gatedNames = new Set(['bash', 'pwsh', 'job_list', 'job_output', 'job_kill',
    'subagent', 'subagent_fork', 'workflow', 'plugin_manager', 'write', 'edit', 'read', 'read_image', 'glob', 'grep'])
  let disposed = false
  const presets = () => ctx.get?.('agentPresets')
  const sessionKey = id => String(id || '').replace(/^session-/, '')
  const enabled = agent => {
    const rows = bindings().filter(row => sessionKey(row.会话) === sessionKey(agent.id))
    return !disposed && rows.length === 1 && rows[0].开 !== false && rows[0].沙箱环境 === true
  }
  const abort = record => {
    for (const controller of record.running) controller.abort(new Error('此会话的沙箱环境已关闭'))
    record.running.clear()
  }
  const release = async record => {
    abort(record)
    for (const off of record.off.reverse()) off()
    await record.lease[Symbol.asyncDispose]()
  }

  async function ensure(agent) {
    if (disposed || !agent?.ctx?.tools?.register) return
    if (attached.has(agent)) {
      if (!enabled(agent)) abort(attached.get(agent))
      return
    }
    if (pending.has(agent)) return pending.get(agent)
    const registry = presets()
    if (!registry) return
    const names = [...gatedNames]
    if (registry.presetForSession(agent.session) == null) names.push('web_search', 'web_fetch')
    const task = (async () => {
      const lease = await registry.acquireScope('standard')
      const record = { lease, off: [], running: new Set() }
      try {
        if (disposed) return
        const web = ctx.get?.('web')
        for (const name of names) {
          const gated = gatedNames.has(name)
          const existing = ctx.tools.get(name, agent)
          if (!gated && existing) continue
          const tool = ctx.tools.get(name, lease.key) || existing
          if (!tool) continue
          const ready = { web_search: 'searchReady', web_fetch: 'fetchReady' }[name]
          if (ready && typeof web?.[ready] !== 'function') continue
          const definition = gated ? { ...tool, async execute(args, exec) {
            if (!enabled(agent)) throw new Error('此会话的沙箱环境未开启')
            if (name === 'bash' || name === 'pwsh') {
              if (ctx.get?.('shell')?.sandboxMode === undefined || !ctx.get?.('sandboxPolicy')) {
                throw new Error('宿主缺少沙箱执行器或沙箱策略，无法挂载 QQ 代码执行工具')
              }
            }

            const controller = new AbortController()
            record.running.add(controller)
            let background = false
            try {
              const signal = exec.signal ? AbortSignal.any([exec.signal, controller.signal]) : controller.signal
              const result = await tool.execute(args, { ...exec, signal })
              background = (name === 'bash' || name === 'pwsh') && result?.kind !== 'foreground'
              return result
            } finally { if (!background) record.running.delete(controller) }
          } } : tool
          record.off.push(agent.ctx.tools.register(definition, {
            when: gated ? () => enabled(agent) : ({ modelSelection }) => web[ready](modelSelection.provider),
          }))
        }
        if (record.off.length) {
          attached.set(agent, record)
          log('已为 QQ 会话挂载按映射授权的宿主工具：' + agent.id)
        }
      } finally {
        if (!attached.has(agent)) await release(record)
      }
    })()
    pending.set(agent, task)
    try { await task } finally { pending.delete(agent) }
  }

  return {
    async createOptions() {
      const registry = presets()
      if (!registry) return {}
      const { id } = await registry.resolve('standard')
      return {
        agentPreset: id,
        async setup(agentCtx, agent) {
          await registry.mount(agentCtx, id)
          await ensure(agent)
        },
      }
    },
    async resumeSetup(agentCtx, agent) {
      const registry = presets(), id = registry?.presetForSession(agent.session)
      if (id != null) await registry.mount(agentCtx, id)
      await ensure(agent)
    },
    ensure,
    async sync(agents) {
      const wanted = new Set(agents.filter(Boolean))
      for (const [agent, record] of attached) {
        if (wanted.has(agent)) continue
        attached.delete(agent)
        await release(record)
      }
      for (const agent of wanted) await ensure(agent)
    },
    async dispose() {
      disposed = true
      await Promise.allSettled([...pending.values()])
      for (const record of attached.values()) await release(record)
      attached.clear()
    },
  }
}
