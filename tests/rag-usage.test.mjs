import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import vm from 'node:vm'
import { embed, DEFAULT_EMBEDDING } from '../modules/memory/lib/qwen-embedding.mjs'
import { createSemanticIndex } from '../modules/memory/lib/semantic-index.mjs'
import { recordEmbeddingUsage, readEmbeddingUsage, ragUsage, embeddingRate, emptyRagUsage } from '../modules/memory/lib/embedding-usage.mjs'

test('RAG 实际请求记录用量，缓存复用去重，失败与缺失用量可区分', async () => {
  const home = mkdtempSync(join(tmpdir(), 'fish-rag-usage-')), originalFetch = globalThis.fetch
  let mode = 'ok', requests = 0
  const c = { ...DEFAULT_EMBEDDING, enabled: true, dimensions: 64 }
  const data = { memories: [{ id: 'memory-1', text: 'synthetic private memory' }] }
  const svc = createSemanticIndex({ home, config: () => c, load: () => data, storeId: () => 'store',
    input: () => ({}), getKey: async () => 'synthetic-secret', workspace: () => 'workspace-a' })
  try {
    globalThis.fetch = async (_url, options) => {
      requests++
      const body = JSON.parse(options.body)
      if (mode === 'failed') return Response.json({}, { status: 429 })
      return Response.json({ usage: mode === 'unknown' ? {} : { total_tokens: 100 },
        output: { embeddings: body.input.texts.map((_, text_index) => ({ text_index, embedding: [1, ...Array(63).fill(0)] })) } })
    }
    assert.equal((await svc.fill('session-a')).completed, 1)
    await svc.fill('session-a')
    await Promise.all([svc.prepare('session-a', 'synthetic query'), svc.prepare('session-a', 'synthetic query')])
    await svc.prepare('session-a', 'synthetic query')
    assert.equal(requests, 2)
    let records = readEmbeddingUsage(home, 'workspace-a')
    assert.equal(records.length, 2)
    assert.deepEqual(records.map(x => x.type), ['document', 'query'])
    assert.ok(records.every(x => x.status === 'success' && x.tokens === 100 && x.sessionId === 'session-a'))
    assert.equal(ragUsage(records[0]).ragCost, 0.00005)
    mode = 'failed'
    assert.equal((await svc.prepare('session-a', 'failed query')).fallback, 'http_429')
    records = readEmbeddingUsage(home, 'workspace-a')
    assert.equal(records.length, 3)
    assert.equal(ragUsage(records.at(-1)).ragFailed, 1)
    assert.equal(ragUsage(records.at(-1)).ragUnknownTokens, 1)
    mode = 'unknown'
    await svc.prepare('session-a', 'unknown query')
    assert.equal(ragUsage(readEmbeddingUsage(home, 'workspace-a').at(-1)).ragUnknownTokens, 1)
    const count = readEmbeddingUsage(home, 'workspace-a').length
    await assert.rejects(embed(c, ['test'], 'query', async () => '', undefined,
      e => recordEmbeddingUsage(home, { ...e, workspace: 'workspace-a' })), /missing_key/)
    assert.equal(readEmbeddingUsage(home, 'workspace-a').length, count)
    assert.equal(readEmbeddingUsage(home, 'workspace-b').length, 0)
    const text = readFileSync(join(home, 'fish-memory-embedding-usage.jsonl'), 'utf8')
    assert.ok(!text.includes('synthetic-secret') && !text.includes('synthetic private memory') && !text.includes('synthetic query'))
    appendFileSync(join(home, 'fish-memory-embedding-usage.jsonl'), '{interrupted')
    recordEmbeddingUsage(home, { id: 'unfinished', phase: 'start', workspace: 'workspace-a' })
    assert.equal(ragUsage(readEmbeddingUsage(home, 'workspace-a').at(-1)).ragPending, 1)
    assert.equal(embeddingRate({ ...c, endpoint: 'https://custom.invalid/embedding' }), null)
    assert.equal(embeddingRate({ ...c, endpoint: 'https://dashscope-intl.aliyuncs.com/api/v1/embedding' }), 0.514)
  } finally { svc.reset(); globalThis.fetch = originalFetch; rmSync(home, { recursive: true, force: true }) }
})

test('吃大米饭按工作区和请求日期汇总 RAG，费用和 Token 合入会话与总额', async () => {
  const home = mkdtempSync(join(tmpdir(), 'fish-rag-rice-')), previousHome = process.env.DSH_HOME
  const workspace = join(home, 'workspace'), routes = new Map(), off = []
  let riceManifest, injectPlatform
  mkdirSync(workspace)
  writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify({ 工作区: 'selected', 总开关: false }))
  process.env.DSH_HOME = home
  try {
    const host = await import('../modules/qq/lib/host.js?rag-rice')
    const key = '--' + workspace.replace(/\//g, '-').replace(/^-+/, '') + '--'
    const now = Date.now(), yesterday = now - 86400000
    const record = (id, at, tokens, workspaceKey = key, status = 'success') => {
      recordEmbeddingUsage(home, { id, at, phase: 'start', workspace: workspaceKey, sessionId: 'session-a', type: 'document', rate: 0.5 })
      recordEmbeddingUsage(home, { id, phase: 'finish', status, tokens })
    }
    record('yesterday', yesterday, 1000)
    record('today', now, 2000)
    record('other-workspace', now, 900000, 'other-workspace')
    record('failure', now, null, key, 'failed')
    host.apply({ effect(fn) { const f = fn(); if (f) off.push(f) }, on: () => () => {}, interval: () => () => {},
      agents: { list: () => [] }, sessions: { list: () => [] },
      sessionTitle: { get: () => ({ title: 'Synthetic session' }) },
      workspaceRegistry: { list: () => [{ id: 'selected', path: workspace }] },
      get: name => name === 'connection' ? { requestRejection: () => undefined } : undefined,
      inject(services, callback) {
        assert.deepEqual(services, ['bigFishOpenPlatform'])
        injectPlatform = callback
      },
      webServer: { register(r) { routes.set(r.path, r.handler); return () => {} } } })
    assert.equal(riceManifest, undefined)
    injectPlatform({
      bigFishOpenPlatform: { register(manifest) { riceManifest = manifest; return () => {} } },
      effect(fn) { const dispose = fn(); if (dispose) off.push(dispose) },
    })
    let result
    await routes.get('/dsh-qq-bridge/rice')({ method: 'GET', url: '/dsh-qq-bridge/rice', headers: { host: 'localhost' } },
      { setHeader() {}, end(text) { result = JSON.parse(text) } })
    assert.equal(result.ok, true, JSON.stringify(result))
    assert.equal(riceManifest.title, '吃大米饭')
    const sessionUsage = riceManifest.operations.find(operation => operation.id === 'session_usage').handler({}, { sessionId: 'session-a' })
    assert.equal(sessionUsage.today.totalTokens, 2000)
    assert.equal(sessionUsage.total.totalTokens, 3000)
    assert.equal(sessionUsage.total.estimatedCostCny, 0.0015)
    const sessionTokens = riceManifest.operations.find(operation => operation.id === 'session_tokens').handler({}, { sessionId: 'session-a' })
    assert.equal(sessionTokens.total.ragTokens, 3000)
    assert.equal(sessionTokens.total.inputTokens, 0)
    assert.equal(sessionTokens.total.cacheHitRate, 0)
    const { Readable } = await import('node:stream')
    const saveThresholds = async (body, method = 'POST', origin = 'http://localhost') => {
      const req = Readable.from([JSON.stringify(body)])
      Object.assign(req, { method, url: '/dsh-qq-bridge/rice-thresholds', headers: { host: 'localhost', origin } })
      let response
      await routes.get(req.url)(req, { setHeader() {}, end(text) { response = JSON.parse(text) } })
      return response
    }
    assert.equal((await saveThresholds({ dailyLimit: 1, lowBalance: 0 }, 'GET')).ok, false)
    assert.equal((await saveThresholds({ dailyLimit: 1, lowBalance: 0 }, 'POST', 'https://foreign.invalid')).ok, false)
    assert.equal((await saveThresholds({ dailyLimit: -1, lowBalance: 0 })).ok, false)
    assert.deepEqual((await saveThresholds({ dailyLimit: 1, lowBalance: 0 })).thresholds, { dailyLimit: 1, lowBalance: 0 })
    assert.deepEqual(JSON.parse(readFileSync(join(home, 'big-fish-rice-thresholds.json'), 'utf8')).dailyLimit, 1)

    assert.equal(result.全部.ragCalls, 3)
    assert.equal(result.全部.ragTokens, 3000)
    assert.equal(result.全部.total, 3000)
    assert.equal(result.全部.input, 3000)
    assert.equal(result.全部.cost, 0.0015)
    assert.equal(result.全部.ragCost, 0.0015)
    assert.equal(result.days.length, 2)
    assert.equal(result.days.find(d => d.date === result.今天).ragCalls, 2)
    assert.equal(result.会话[0].今天.total, 2000)
    assert.equal(result.会话[0].全部.total, 3000)
    assert.equal(result.会话[0].全部.cost, 0.0015)
    assert.equal(result.会话[0].今天.cost, 0.001)
    await saveThresholds({ dailyLimit: 0.0009, lowBalance: 0 })
    const power = Readable.from([JSON.stringify({ 开: true })])
    Object.assign(power, { method: 'POST', headers: { host: 'localhost' } })
    let denied
    await routes.get('/dsh-qq-bridge/power')(power, { setHeader() {}, end(text) { denied = JSON.parse(text) } })
    assert.equal(denied.ok, false)
    assert.match(denied.说, /鱼粮已达上限/)
    assert.equal(JSON.parse(readFileSync(join(home, 'qq-bridge-config.json'), 'utf8')).总开关, false)

    assert.equal(result.会话[0].全部.ragUnknownTokens, 1)
    recordEmbeddingUsage(home, { id: 'today', phase: 'finish', status: 'success', tokens: 2000 })
    assert.equal(readEmbeddingUsage(home, key).length, 3)
  } finally {
    off.reverse().forEach(fn => fn())
    if (previousHome === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previousHome
    rmSync(home, { recursive: true, force: true })
  }
})

test('吃大米饭合并 Qwen RAG 明细，使用已含 RAG 的总额并兼容旧数据', () => {
  const source = readFileSync(new URL('../src/panel.js', import.meta.url), 'utf8')
  const rice = source.slice(source.indexOf('function Rice('), source.indexOf('function Updates('))
  const today = new Date().toLocaleDateString('sv-SE')
  const flatten = node => !node || typeof node !== 'object' ? [] : [node, ...node.children.flat(Infinity).flatMap(flatten)]
  for (const rag of [{}, { ...emptyRagUsage(), ragCalls: 2, ragTokens: 8, ragCost: 0.25 }]) {
    let index = 0, tip = null
    const total = { input: 80 + (rag.ragTokens || 0), output: 10, cacheRead: 10, cacheWrite: 0,
      total: 100 + (rag.ragTokens || 0), cost: 1 + (rag.ragCost || 0), ...rag }
    const data = { days: [{ date: today, ...total }], 全部: total, 今天: today,
      会话: [{ id: 'synthetic-session', title: 'Test session', 今天: total, 全部: total }] }
    const React = { createElement: (type, props, ...children) => ({ type, props, children }),
      useState: value => {
        const slot = index++
        return [slot === 0 ? data : slot === 4 ? tip : value, next => { if (slot === 4) tip = next }]
      }, useRef: () => ({ current: 0 }), useEffect() {}, useMemo: fn => fn() }
    const render = vm.runInNewContext(readFileSync(new URL('../src/rice-report.js', import.meta.url), 'utf8') + '\n' + rice + '\nRice', { React, h: React.createElement, FishRefreshButton: 'button' })
    const tree = render(), nodes = flatten(tree), text = JSON.stringify(tree)
    assert.ok(!text.includes('每日 RAG 用量') && !text.includes('RAG 估算') && !text.includes('NaN'))
    const cards = nodes.filter(n => n.type === 'article')
    assert.equal(cards.length, 2)
    const summaryCard = cards.find(n => n.props.className.includes('rice-summary-card'))
    const summaryNodes = flatten(summaryCard)
    assert.equal(summaryNodes.find(n => n.props?.className === 'rice-summary-value').children[0], String(total.total))
    assert.equal(summaryNodes.find(n => n.props?.className === 'rice-stat-cost').children[0], '≈ ¥' + total.cost.toFixed(3))
    assert.ok(JSON.stringify(summaryCard).includes('RAG '))
    assert.deepEqual(nodes.filter(n => n.type === 'th').map(n => n.children[0]),
      ['会话', '今日', '全部', '输入', '输出', '缓存', 'Qwen RAG', '金额'])
    const cells = nodes.filter(n => n.type === 'td')
    assert.equal(cells[6].children[0], String(rag.ragTokens || 0))
    assert.equal(cells[7].children[0], '¥' + total.cost.toFixed(3))
    // 两个图表共用同一提示框，分别触发并检查文案。
    for (const className of ['rice-hit', 'rice-heat-cell']) {
      const hit = nodes.filter(n => n.props?.className === className && n.props.onMouseEnter &&
        (className === 'rice-hit' || n.props.key === today)).at(-1)
      assert.ok(hit)
      hit.props.onMouseEnter({ clientX: 100, clientY: 100 })
      index = 0
      const tooltip = flatten(render()).find(n => n.props?.role === 'tooltip')
      assert.ok(JSON.stringify(tooltip).includes('Qwen RAG ' + (rag.ragCalls || 0) + ' 次'))
    }
  }
})
