import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { deepseekBalance } from '../lib/deepseek-balance.mjs'

const source = readFileSync(new URL('../src/rice-report.js', import.meta.url), 'utf8')
const helpers = vm.createContext({})
vm.runInContext(source, helpers)
const plain = value => JSON.parse(JSON.stringify(value))

test('北京时间日期边界：周一、月初、自定义合法性与闰年热点图', () => {
  assert.deepEqual(plain(helpers.riceWindow('week', '2026-11-17')), { from: '2026-11-16', to: '2026-11-17' })
  assert.equal(helpers.riceWindow('month', '2026-11-17').from, '2026-11-01')
  for (const [from, to] of [['2026-02-30', '2026-03-01'], ['2026-11-18', '2026-11-17'], ['', '']]) assert.ok(helpers.riceWindow('custom', '2026-11-17', from, to).error)
  const year = helpers.riceHeat('year', '2024-12-31', [])
  assert.equal(year.groups.length, 12)
  assert.equal(year.groups.flatMap(g => g.cells).filter(Boolean).length, 366)
  assert.equal(helpers.riceHeat('week', '2026-11-17', []).groups[0].cells.filter(Boolean).length, 7)
})

test('选区包含首尾日期，缓存、RAG 与会话色段不重算费用', () => {
  const days = [1, 2, 3].map(n => ({ date: '2026-11-0' + n, input: 10, output: 2, cacheRead: 5, cacheWrite: 1, ragTokens: 3, total: 18, cost: 0.1, sessions: [{ id: 'a', title: 'synthetic', total: 12 }, { id: 'b', total: 6 }] }))
  const result = helpers.riceSummary(days, { from: '2026-11-02', to: '2026-11-03' })
  assert.equal(result.total, 36); assert.equal(result.cost, 0.2); assert.equal(result.ragTokens, 6)
  assert.deepEqual(plain(result.sessions.map(s => s.total)), [24, 12])
  assert.equal(helpers.riceSummary(days, { error: true }).total, 0)
})

test('官方余额合并充值与赠金；失败不伪装为零，不返回认证信息', async () => {
  let options, result = { status: 'ready', value: [{ currency: 'CNY', balance: '5.25', secret: 'synthetic' }], bonusWallets: [{ currency: 'CNY', balance: '1.00' }, { currency: 'USD', balance: '100' }] }
  const ctx = { get: () => ({ getBalance: async value => { options = value; return result } }) }
  const balance = await deepseekBalance(ctx)
  assert.equal(balance.balance, 6.25); assert.equal(options.timezoneOffsetSeconds, 28800); assert.ok(options.version)
  assert.ok(!JSON.stringify(balance).includes('synthetic'))
  result = { status: 'failed' }; await assert.rejects(deepseekBalance(ctx))
  result = { status: 'ready', value: [{ currency: 'CNY', balance: '' }] }; await assert.rejects(deepseekBalance(ctx))
  await assert.rejects(deepseekBalance({ get: () => undefined }))
})

test('三套海报使用色库绘制 PNG 画布，不包含余额或会话资料', () => {
  const texts = [], rectangles = []
  const context = { fillRect() {}, beginPath() {}, roundRect(...args) { rectangles.push(args) }, fill() {}, fillText(value) { texts.push(value) } }
  const sandbox = vm.createContext({ document: { createElement: () => ({ getContext: () => context }), querySelector: () => ({}) }, getComputedStyle: () => ({ getPropertyValue: () => '#112233' }) })
  vm.runInContext(source, sandbox)
  const summary = { total: 18, input: 10, output: 2, cacheRead: 5, cacheWrite: 1, ragTokens: 3, cost: 0.1 }
  for (const theme of ['ocean', 'claude', 'gpt']) for (const period of ['week', 'month', 'year']) {
    const canvas = sandbox.ricePoster({ summary, days: [], today: '2026-11-17', period, theme, name: '测试', label: '本月' })
    assert.equal(canvas.width, 880); assert.ok(canvas.height >= 900)
  }
  assert.ok(texts.includes('用量报告')); assert.ok(texts.includes('总 Token 数'))
  assert.ok(!texts.some(t => /余额|会话/.test(t)))
  assert.ok(rectangles.every(([x, y, w]) => x >= 0 && y >= 0 && x + w <= 880))
})

test('分享仅提供 PNG 下载与图片剪贴板，切换样式和维度，不支持复制时保留下载', async () => {
  let cursor = 0, copied = 0, downloaded = 0
  const posterTexts = []
  const slots = [], ref = { current: null }
  const canvas = { getContext: () => ({ fillRect() {}, beginPath() {}, roundRect() {}, fill() {}, fillText(t) { posterTexts.push(t) } }), toDataURL: () => 'data:image/png;base64,synthetic', toBlob: fn => fn({ type: 'image/png' }) }
  const h = (type, props, ...children) => ({ type, props, children })
  const sandbox = vm.createContext({ React: { useState(init) { const i = cursor++; if (!(i in slots)) slots[i] = init; return [slots[i], v => { slots[i] = v }] }, useRef: () => ref, useEffect: fn => fn() }, h, FishModal: 'dialog', FishInput: 'input',
    document: { createElement: tag => tag === 'canvas' ? canvas : { click() { downloaded++ } }, querySelector: () => ({}) }, getComputedStyle: () => ({ getPropertyValue: () => '#112233' }),
    navigator: { clipboard: { async write(items) { assert.equal((await items[0].data['image/png']).type, 'image/png'); copied++ } } }, ClipboardItem: class { constructor(data) { this.data = data } },
    URL: { createObjectURL: () => 'blob:synthetic', revokeObjectURL() {} }, setTimeout: fn => fn() })
  vm.runInContext(source, sandbox)
  const flat = n => !n || typeof n !== 'object' ? [] : [n, ...n.children.flat(Infinity).flatMap(flat)]
  const props = { summary: { total: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, ragTokens: 0, cost: 0 }, days: [{ date: '2026-10-31', total: 100 }, { date: '2026-11-01', total: 50 }, { date: '2026-11-16', total: 20 }, { date: '2026-11-17', total: 30 }], today: '2026-11-17', label: '当天', onClose() {} }
  const render = () => { cursor = 0; return flat(sandbox.RiceShare(props)) }
  render(); let nodes = render()
  for (const title of ['Claude', 'GPT', '周', '月', '年']) {
    nodes.find(n => n.type === 'button' && n.children.includes(title)).props.onClick(); posterTexts.length = 0; nodes = render()
    if (['周', '月', '年'].includes(title)) assert.ok(posterTexts.includes({ 周: '50', 月: '100', 年: '200' }[title]))
  }
  assert.equal(nodes.find(n => n.props?.['aria-label'] === '关闭分享').props.className, 'fish-modal-close')
  assert.ok(!JSON.stringify(nodes).includes('统计范围：'))
  const footer = nodes.find(n => n.props?.className === 'rice-share-footer')
  assert.ok(footer.children.some(n => n?.props?.className === 'fish-actions rice-share-actions'))
  assert.ok(footer.children.some(n => n?.props?.className === 'fish-muted rice-share-privacy'))
  await nodes.find(n => n.type === 'button' && n.children.includes('复制图片')).props.onClick(); assert.equal(copied, 1)
  await nodes.find(n => n.type === 'button' && n.children.includes('下载 PNG')).props.onClick(); assert.equal(downloaded, 1)
  sandbox.navigator.clipboard = undefined
  await nodes.find(n => n.type === 'button' && n.children.includes('复制图片')).props.onClick()
  assert.ok(slots.some(value => typeof value === 'string' && value.includes('不支持复制图片')))
})

test('用量大卡片按日周总计及自定义切换，会话色段随选区变化', () => {
  let cursor = 0
  const slots = [], h = (type, props, ...children) => ({ type, props, children })
  const day = (date, total, id) => ({ date, total, cost: total / 1000, input: total, sessions: [{ id, title: 'synthetic', total }] })
  slots[0] = { 今天: '2026-11-17', days: [day('2026-10-31', 100, 'a'), day('2026-11-16', 20, 'a'), day('2026-11-17', 30, 'b')], 会话: [] }
  const context = vm.createContext({ React: { createElement: h, useState(init) { const i = cursor++; if (!(i in slots)) slots[i] = init; return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next }] }, useRef: () => ({ current: 0 }), useEffect() {}, useMemo: fn => fn() }, h, window: { innerWidth: 1200, innerHeight: 800 }, FishRefreshButton: 'button', FishInput: 'input' })
  const panel = readFileSync(new URL('../src/panel.js', import.meta.url), 'utf8')
  vm.runInContext(source + '\n' + panel.slice(panel.indexOf('function Rice('), panel.indexOf('function UpdateArtwork(')), context)
  const flat = n => !n || typeof n !== 'object' ? [] : [n, ...n.children.flat(Infinity).flatMap(flat)]
  const render = () => { cursor = 0; return flat(context.Rice()) }
  const total = nodes => nodes.find(n => n.props?.className === 'rice-summary-value').children[0]
  let nodes = render(); assert.equal(total(nodes), '30')
  nodes.find(n => n.type === 'button' && n.children.includes('周')).props.onClick(); nodes = render(); assert.equal(total(nodes), '50')
  assert.equal(nodes.find(n => n.props?.className === 'rice-session-stack').children.flat().length, 2)
  nodes.find(n => n.type === 'button' && n.children.includes('总计')).props.onClick(); nodes = render(); assert.equal(total(nodes), '150')
  nodes.find(n => n.type === 'button' && n.children.includes('自定义')).props.onClick({ currentTarget: { getBoundingClientRect: () => ({ left: 450, bottom: 200 }) } }); nodes = render()
  assert.equal(total(nodes), '150')
  const picker = nodes.find(n => n.type?.name === 'RiceDateRange')
  assert.ok(picker)
  picker.props.onApply('2026-11-16', '2026-11-16'); nodes = render()
  assert.equal(total(nodes), '20')
  assert.equal(nodes.find(n => n.type === 'button' && n.children.includes('分享')).props.disabled, false)
  // 余额低于已启用阈值时变色，相等和禁用时保持正常。
  slots[0].thresholds = { lowBalance: 5 }; slots[9] = { balance: 4.99, updatedAt: 1 }; nodes = render()
  assert.ok(nodes.some(n => n.props?.className === 'rice-balance-value is-low'))
  slots[9].balance = 5; nodes = render(); assert.ok(!nodes.some(n => n.props?.className === 'rice-balance-value is-low'))
  slots[9].balance = 1; slots[0].thresholds.lowBalance = 0; nodes = render(); assert.ok(!nodes.some(n => n.props?.className === 'rice-balance-value is-low'))
  const segment = nodes.find(n => n.props?.role === 'listitem')
  assert.equal(segment.props.title, undefined)
  segment.props.onMouseEnter({ clientX: 100, clientY: 100 }); nodes = render()
  const tooltip = nodes.find(n => n.props?.role === 'tooltip')
  assert.equal(tooltip.props.className, 'rice-tooltip'); assert.ok(JSON.stringify(tooltip).includes('100.0%'))
})

test('双月日期跨度支持跨月、反向和同日选择，应用前保留草稿，取消不应用', () => {
  let cursor = 0, applied, closed = 0
  const slots = [], h = (type, props, ...children) => ({ type, props, children })
  const context = vm.createContext({ React: { useState(init) { const i = cursor++; if (!(i in slots)) slots[i] = init; return [slots[i], value => { slots[i] = value }] } }, h, FishModal: 'dialog' })
  vm.runInContext(source, context)
  const flat = n => !n || typeof n !== 'object' ? [] : [n, ...n.children.flat(Infinity).flatMap(flat)]
  const render = () => { cursor = 0; return flat(context.RiceDateRange({ today: '2026-11-17', from: '', to: '', position: {}, onApply: (...dates) => { applied = dates }, onClose: () => { closed++ } })) }
  let nodes = render()
  assert.deepEqual(nodes.filter(n => n.type === 'section').map(n => n.props['aria-label']), ['2026年11月', '2026年12月'])
  const button = (nodes, label) => nodes.find(n => n.type === 'button' && (n.props['aria-label'] === label || n.children.includes(label)))
  assert.deepEqual(nodes.find(n => n.props?.className === 'fish-modal-actions').children.map(n => n.children[0]), ['取消', '清除', '应用'])
  assert.equal(button(nodes, '应用').props.disabled, true)
  button(nodes, '2026-12-05').props.onClick(); nodes = render(); button(nodes, '2026-11-20').props.onClick(); nodes = render()
  assert.equal(applied, undefined); assert.equal(button(nodes, '应用').props.disabled, false)
  assert.ok(button(nodes, '2026-11-25').props.className.includes('in-range'))
  button(nodes, '应用').props.onClick(); assert.deepEqual(applied, ['2026-11-20', '2026-12-05'])
  applied = undefined; button(nodes, '2026-11-17').props.onClick(); nodes = render(); button(nodes, '2026-11-17').props.onClick(); nodes = render()
  button(nodes, '应用').props.onClick(); assert.deepEqual(applied, ['2026-11-17', '2026-11-17'])
  applied = undefined; button(nodes, '清除').props.onClick(); nodes = render()
  assert.equal(applied, undefined); assert.equal(button(nodes, '应用').props.disabled, true)
  assert.ok(!nodes.some(n => n.props?.className?.includes('is-edge') || n.props?.className?.includes('in-range')))
  applied = undefined; button(nodes, '上个月').props.onClick(); nodes = render(); assert.equal(nodes.find(n => n.type === 'section').props['aria-label'], '2026年10月')
  button(nodes, '取消').props.onClick(); assert.equal(closed, 1); assert.equal(applied, undefined)
  assert.equal(helpers.riceCalendarMonth('2024-01-01', 1).cells.filter(Boolean).length, 29)
  assert.equal(helpers.riceCalendarMonth('2026-12-01', 1).month, '2027-01-01')
})


test('分享海报总量与各项 Token 明细使用 K/M，费用保持人民币金额', () => {
  assert.equal(helpers.riceTokens(999), '999')
  assert.equal(helpers.riceTokens(1000), '1K')
  assert.equal(helpers.riceTokens(1500), '1.5K')
  assert.equal(helpers.riceTokens(1000000), '1M')
  const texts = [], context = { fillRect() {}, beginPath() {}, roundRect() {}, fill() {}, fillText(t) { texts.push(t) } }
  const sandbox = vm.createContext({ document: { createElement: () => ({ getContext: () => context }), querySelector: () => ({}) }, getComputedStyle: () => ({ getPropertyValue: () => '#112233' }) })
  vm.runInContext(source, sandbox)
  sandbox.ricePoster({ summary: { total: 556140000, input: 4320000, output: 350100, cacheRead: 551470000, cacheWrite: 0, ragTokens: 56400, cost: 20.542 }, days: [], today: '2026-11-17', period: 'month', name: '测试', theme: 'ocean', label: '本月' })
  assert.ok(texts.includes('556.14M'))
  assert.ok(texts.includes('输入 4.32M  ·  输出 350.1K'))
  assert.ok(texts.includes('缓存 551.47M  ·  RAG 56.4K'))
  assert.ok(texts.includes('≈ ¥20.5420'))
})
