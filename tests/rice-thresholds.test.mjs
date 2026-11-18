import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRiceThresholds, validateThresholds, reachedThreshold } from '../lib/rice-thresholds.mjs'

function fixture() {
  const home = mkdtempSync(join(tmpdir(), 'rice-threshold-'))
  const c = { 总开关: true, 试运行: false, NapCat: 'synthetic', 工作区: 'test', 绑定: [{ 类型: '私聊', 号码: '12345678', 会话: 'owner', 主人QQ: true }] }
  const messages = [], errors = []
  let spent = 0, remaining = 10, day = '2026-11-09', stops = 0, fail = false, reads = 0
  const options = { home, config: () => ({ ...c }), rice: () => ({ 今天: day, days: [{ date: day, cost: spent }] }),
    balance: async () => { reads++; return remaining }, log: e => errors.push(e),
    send: async (config, owner, text) => { if (fail) throw Error('offline'); messages.push({ owner, text }) },
    stop() { c.总开关 = false; stops++ } }
  return { home, c, messages, errors, options, service: createRiceThresholds(options), set(v) { if ('spent' in v) spent = v.spent; if ('remaining' in v) remaining = v.remaining; if ('day' in v) day = v.day; if ('fail' in v) fail = v.fail },
    get stops() { return stops }, get reads() { return reads }, close() { rmSync(home, { recursive: true, force: true }) } }
}

test('校验金额，默认禁用，不查询余额或发送私信', async () => {
  assert.equal(reachedThreshold(0.08, 0.1 * 0.8), true)
  assert.equal(reachedThreshold(0.0799, 0.1 * 0.8), false)
  for (const value of [-1, Infinity, NaN, '2', null, 1e10]) assert.throws(() => validateThresholds({ dailyLimit: value, lowBalance: 0 }))
  const f = fixture()
  try { await f.service.check(); assert.equal(f.reads, 0); assert.equal(f.messages.length, 0) } finally { f.close() }
})

test('80% 单日去重及重启持久化，到限关闭，跨日不自动开启', async () => {
  const f = fixture()
  try {
    f.service.save({ dailyLimit: 10, lowBalance: 0 })
    f.set({ spent: 7.99 }); await f.service.check(); assert.equal(f.messages.length, 0)
    f.set({ spent: 8 }); await Promise.all([f.service.check(), f.service.check()]); assert.equal(f.messages.length, 1)
    await createRiceThresholds(f.options).check(); assert.equal(f.messages.length, 1)
    f.set({ spent: 10 }); await f.service.check(); assert.equal(f.stops, 1); assert.equal(f.c.总开关, false)
    f.set({ day: '2026-11-10', spent: 8 }); await f.service.check(); assert.equal(f.messages.length, 3); assert.equal(f.c.总开关, false)
  } finally { f.close() }
})

test('低余额严格小于阈值，独立总开关，恢复后再提醒，试运行不发', async () => {
  const f = fixture()
  try {
    f.c.总开关 = false; f.service.save({ dailyLimit: 0, lowBalance: 5 })
    f.set({ remaining: 5 }); await f.service.check(); assert.equal(f.messages.length, 0)
    f.set({ remaining: 4.99 }); await f.service.check(); await createRiceThresholds(f.options).check(); assert.equal(f.messages.length, 1)
    f.set({ remaining: 6 }); await f.service.check()
    f.set({ remaining: -1 }); await f.service.check(); assert.equal(f.messages.length, 2)
    f.c.试运行 = true; f.set({ remaining: 0 }); await f.service.check(); assert.equal(f.messages.length, 2)
    assert.ok(f.messages.every(m => m.owner === '12345678'))
  } finally { f.close() }
})

test('越过全部阈值立即停机；私信失败可重试；无主人仍能停机', async () => {
  const f = fixture()
  try {
    f.service.save({ dailyLimit: 10, lowBalance: 0 }); f.set({ spent: 11, fail: true })
    await f.service.check(); assert.equal(f.stops, 1); assert.equal(f.messages.length, 0); assert.equal(f.errors.length, 1)
    f.set({ fail: false }); await createRiceThresholds(f.options).check(); assert.equal(f.messages.length, 1)
    f.c.绑定[0].主人QQ = false; f.c.总开关 = true
    await createRiceThresholds(f.options).check(); assert.equal(f.stops, 2)
  } finally { f.close() }
})

test('余额查询中变更主人或阈值，不发送旧提醒；销毁后停止', async () => {
  const f = fixture()
  try {
    let resolve
    const service = createRiceThresholds({ ...f.options, balance: () => new Promise(r => { resolve = r }) })
    service.save({ dailyLimit: 0, lowBalance: 5 })
    const pending = service.check()
    f.c.绑定[0].号码 = '87654321'
    resolve(1); await pending; assert.equal(f.messages.length, 0)
    const next = service.check(); service.save({ dailyLimit: 0, lowBalance: 0 }); resolve(1); await next; assert.equal(f.messages.length, 0)
    service.dispose(); await service.check(); assert.equal(f.messages.length, 0)
  } finally { f.close() }
})

test('阈值按钮在刷新左侧，人民币金额统一提交保存，失败保留输入', async () => {
  const { readFileSync } = await import('node:fs'), { default: vm } = await import('node:vm')
  const source = readFileSync(new URL('../src/panel.js', import.meta.url), 'utf8')
  let cursor = 0, fail = false, payload
  const slots = []
  const React = { createElement: (type, props, ...children) => ({ type, props, children }), useState(init) {
    const i = cursor++; if (!(i in slots)) slots[i] = init
    return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next }]
  }, useRef: () => ({ current: 0 }), useEffect() {}, useMemo: fn => fn() }
  slots[0] = { days: [], thresholds: { dailyLimit: 10, lowBalance: 3 } }
  const Rice = vm.runInNewContext(readFileSync(new URL('../src/rice-report.js', import.meta.url), 'utf8') + '\n' + source.slice(source.indexOf('function Rice('), source.indexOf('function Updates(')) + '\nRice', {
    React, h: React.createElement, FishRefreshButton: 'button', FishModal: 'modal', FishInput: 'input', request: async (url, opts) => {
      assert.equal(url, '/dsh-qq-bridge/rice-thresholds'); payload = JSON.parse(opts.body)
      if (fail) throw Error('offline')
      return { ok: true, thresholds: payload }
    }
  })
  const flat = n => !n || typeof n !== 'object' ? [] : [n, ...n.children.flat(Infinity).flatMap(flat)]
  const render = () => { cursor = 0; return flat(Rice()) }
  let nodes = render(), buttons = nodes.filter(n => n.type === 'button')
  assert.deepEqual(buttons.slice(0, 2).map(n => n.props.label || n.children[0]), ['阈值设定', '刷新用量'])
  buttons[0].props.onClick(); nodes = render()
  const inputs = nodes.filter(n => n.type === 'input')
  assert.deepEqual(inputs.map(n => n.props['aria-label']), ['每日鱼粮上限（人民币元）', '提醒补充鱼粮（人民币元）'])
  assert.equal(inputs[1].props.value, '3.00')
  inputs[1].props.onChange({ target: { value: '5' } }); render().filter(n => n.type === 'input')[1].props.onBlur({ target: { value: '5' } })
  assert.equal(render().filter(n => n.type === 'input')[1].props.value, '5.00')
  assert.ok(inputs.every(n => n.props.type === 'number' && n.props.icon === '¥' && n.props.inputMode === 'decimal' && typeof n.props.onBlur === 'function'))
  assert.ok(nodes.some(n => n.type === 'button' && n.props.type === 'submit' && n.children.includes('保存')))
  nodes.find(n => n.type === 'input').props.onChange({ target: { value: '12.5' } }); nodes = render()
  nodes.filter(n => n.type === 'input')[1].props.onChange({ target: { value: '3.25' } }); nodes = render()
  assert.equal(payload, undefined)
  fail = true; await nodes.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }); nodes = render()
  assert.equal(nodes.find(n => n.type === 'input').props.value, '12.5'); assert.ok(nodes.some(n => n.props?.role === 'alert'))
  fail = false; await nodes.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} })
  assert.deepEqual(payload, { dailyLimit: 12.5, lowBalance: 3.25 }); assert.equal(render().some(n => n.type === 'form'), true)
  render().find(n => n.type === 'button' && n.children.includes('关闭')).props.onClick()
  assert.equal(render().some(n => n.type === 'form'), false)
})


test('超限警示与继续运行授权持久化，仅适用当天工作区和原上限', async () => {
  const f = fixture()
  try {
    f.service.save({ dailyLimit: 10, lowBalance: 0 }); f.set({ spent: 11 })
    await f.service.check()
    assert.equal(f.service.alert().limit, 10)
    assert.match(f.messages[0].text, /达到上限后可在大肥鱼插件中继续开启/)
    f.service.resume(); f.c.总开关 = true
    await createRiceThresholds(f.options).check(); assert.equal(f.stops, 1)
    assert.equal(f.service.alert(), null)
    f.set({ day: '2026-11-10' }); await f.service.check(); assert.equal(f.stops, 2)
    f.service.resume(); f.c.总开关 = true
    f.service.save({ dailyLimit: 9, lowBalance: 0 }); await f.service.check(); assert.equal(f.stops, 3)
    f.service.resume(); f.c.总开关 = true; f.c.工作区 = 'other'
    await f.service.check(); assert.equal(f.stops, 4)
  } finally { f.close() }
})

test('插件轮询弹出超限警示，选择重开只传鱼粮跳过标记并去重', async () => {
  const { readFileSync } = await import('node:fs'), { default: vm } = await import('node:vm')
  const source = readFileSync(new URL('../src/panel.js', import.meta.url), 'utf8')
  let poll, prompt, requestBody, clean
  const storage = new Map()
  const sandbox = { React: { useEffect(fn) { clean = fn() } }, setInterval(fn) { poll = fn; return 1 }, clearInterval() {},
    localStorage: { getItem: k => storage.get(k), setItem: (k, v) => storage.set(k, v) }, fishNotify() {},
    request: async (path, options) => {
      if (path.endsWith('rice-alert')) return { alert: { id: 'cutoff-1' } }
      assert.ok(path.endsWith('/power')); requestBody = JSON.parse(options.body); return { ok: true }
    } }
  vm.createContext(sandbox)
  vm.runInContext(source.slice(source.indexOf('const FISH_CONFIRM ='), source.indexOf('const FISH_TEXT =')), sandbox)
  sandbox.fishAskConfirm = async options => { prompt = options; return true }
  sandbox.RiceAlertHost()
  await new Promise(setImmediate)
  assert.equal(prompt.danger, true); assert.equal(prompt.cancelText, '保持关闭'); assert.equal(prompt.confirmText, '重新开启')
  assert.deepEqual(requestBody, { 开: true, 跳过鱼粮上限: true })
  prompt = null; await poll(); assert.equal(prompt, null)
  clean()
})
