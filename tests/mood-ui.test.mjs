import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const walk = node => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(walk)]
const label = node => (node.children || []).flat(Infinity).filter(x => typeof x === 'string').join('')
const flush = async () => { for (let i = 0; i < 6; i++) await new Promise(setImmediate) }

function fixture(stored = []) {
  let index = 0, module
  let config = { 模式: 'memory', autoJudge: true, slots: [{ id: 'manual', label: '我的配置', sessions: ['session-private'] }] }
  const mood = { ok: true, mountedSessions: 1, key: 'qq_1_shared', slots: [{ id: 'qq_1_shared', label: '普通群共享心情', sessions: ['group-a', 'group-b'] }], timeline: [] }
  const state = [config, mood], requests = [], uploads = [], events = [], storage = new Map(stored)
  const effects = [], reads = [], timers = new Map()
  const Dialog = () => null
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useEffect: fn => effects.push(fn), useCallback: fn => fn, useRef: value => ({ current: value }),
    useState(initial) {
      const i = index++
      if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial
      return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value }]
    },
  }
  vm.runInNewContext(readFileSync(new URL('../modules/mood/client.js', import.meta.url), 'utf8'), {
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail } },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    createImageBitmap: async () => ({ close() {} }),
    setInterval: (fn, delay) => { timers.set(fn, delay); return fn }, clearInterval: id => timers.delete(id),
    document: { hidden: false, addEventListener() {}, removeEventListener() {} },
    window: { addEventListener() {}, removeEventListener() {}, dispatchEvent: event => events.push(event), __ModuleLoader__: { load: ({ factory }) => { module = factory(() => React) } } },
    fetch: async (url, options) => {
      reads.push(url)
      if (url.includes('/charm-image')) {
        uploads.push({ url, file: options.body })
        return { ok: true, json: async () => ({ ok: true, images: { good: { custom: true, url: '/uploaded-good?v=2' } } }) }
      }
      if (options?.method === 'POST') {
        const patch = JSON.parse(options.body); requests.push(patch); config = { ...config, ...patch }
      }
      return { ok: true, json: async () => url.includes('/config') ? { ok: true, config } : mood }
    },
  })
  const render = page => {
    index = 0
    const panel = walk(module.Section({ page, Dialog })).find(node => node.type?.name === 'Panel')
    return walk(panel.type(panel.props))
  }
  return { state, requests, render, mood, events, uploads, storage, effects, reads, timers }
}

test('心情页面挂载完整加载资源，更新卸载只执行函数清理并停止轮询', async () => {
  const f = fixture()
  f.render('mood')
  const cleanups = f.effects.map(effect => effect())
  for (const cleanup of cleanups) assert.ok(cleanup === undefined || typeof cleanup === 'function', 'Effect 不得将 Promise 返回给 React 作为清理函数')
  await flush()
  for (const path of ['/config', '/state', '/sessions', '/workspaces', '/models']) assert.ok(f.reads.includes('/dsh-feiyu-mood' + path), path)
  assert.deepEqual([...f.timers.values()], [20000])
  f.reads.length = 0
  for (const timer of f.timers.keys()) timer()
  await flush()
  assert.deepEqual(f.reads, ['/dsh-feiyu-mood/state'])
  cleanups.forEach(cleanup => cleanup?.())
  assert.equal(f.timers.size, 0)
})

test('心情默认展示分库绑定，可切换自定义模式并保存，状态提示跟随开关和挂载', async () => {
  const f = fixture()
  let nodes = f.render('bind')
  const button = name => nodes.find(node => node.type === 'button' && label(node) === name)
  assert.ok(button('跟随记忆库（默认）'))
  assert.equal(nodes.filter(node => label(node) === '普通群共享心情').length, 1)
  assert.ok(nodes.some(node => label(node) === 'group-a'))
  assert.ok(nodes.some(node => label(node) === 'group-b'))
  assert.equal(nodes.some(node => node.props['aria-label'] === '添加绑定会话'), false)
  button('会话模式').props.onClick(); await flush()
  assert.equal(f.requests[0].模式, 'session')
  nodes = f.render('bind')
  assert.ok(nodes.some(node => node.props['aria-label'] === '添加绑定会话'))
  assert.ok(nodes.some(node => node.props.value === '我的配置'))
  f.state[0].autoJudge = false
  assert.ok(f.render('mood').some(node => node.props.role === 'status' && label(node).includes('自动判断已关闭')))
  f.state[0].autoJudge = true; f.mood.mountedSessions = 0
  assert.ok(f.render('mood').some(node => node.props.role === 'status' && label(node).includes('当前实例尚未挂载')))
})

test('四个心情页面说明与衰减、阈值、重置及挂饰读取行为一致', () => {
  const f = fixture()
  const text = page => f.render(page).map(label).join('\n')
  assert.match(text('mood'), /清空情绪维度、时间线及注入记录/)
  assert.match(text('mood'), /上下文注入内容/)
  assert.match(text('bind'), /写入库对应一个心情实例/)
  const judge = text('judge')
  for (const expected of ['自然衰减仍按时间计算', '七维情绪独立向零衰减', '半衰期固定为 90 分钟', '低于阈值仍可更新心情和时间线', '原始心情变化绝对值', '设置超过 10 时无法由单次情绪变化触发', '按宿主本地时间每日零点重新统计']) {
    assert.ok(judge.includes(expected), expected)
  }
  assert.doesNotMatch(text('charm'), /挂饰显示服务端|点击挂饰显示或隐藏/)
  assert.match(text('charm'), /五档心情挂饰/)
})

test('变化记录通过模态框查看，日期按天筛选且保留超过四十条的完整结果', () => {
  const f = fixture()
  const first = new Date(2026, 10, 8, 23, 59).getTime(), second = new Date(2026, 10, 9, 0, 0).getTime()
  f.mood.timeline = Array.from({ length: 45 }, (_, i) => ({ at: first + i, mood: 71, delta: 1, reason: '前一天-' + i }))
  f.mood.timeline.push({ at: second, mood: 72, delta: 1, reason: '第二天' })
  let nodes = f.render('mood')
  assert.equal(nodes.some(n => Object.hasOwn(n.props, 'data-fm-tlrow')), false)
  nodes.find(n => n.type === 'button' && label(n) === '查看心情变化记录').props.onClick()
  nodes = f.render('mood')
  assert.equal(nodes.filter(n => Object.hasOwn(n.props, 'data-fm-tlrow')).length, 46)
  nodes.find(n => n.props['aria-label'] === '筛选记录日期').props.onChange({ target: { value: '2026-11-08' } })
  nodes = f.render('mood')
  assert.equal(nodes.filter(n => Object.hasOwn(n.props, 'data-fm-tlrow')).length, 45)
  nodes.find(n => n.props['aria-label'] === '筛选记录日期').props.onChange({ target: { value: '2026-11-09' } })
  assert.equal(f.render('mood').filter(n => Object.hasOwn(n.props, 'data-fm-tlrow')).length, 1)
  nodes.find(n => n.type === 'button' && label(n) === '全部日期').props.onClick()
  assert.equal(f.render('mood').filter(n => Object.hasOwn(n.props, 'data-fm-tlrow')).length, 46)
})

test('绑定与判断采用卡片表单布局，挂饰提供五档独立上传和设置页大小控制', () => {
  const f = fixture()
  assert.ok(f.render('bind').some(n => n.props.className?.includes('mood-settings')))
  assert.ok(f.render('judge').filter(n => n.props.className === 'fish-form-row mood-form-row').length >= 10)
  const nodes = f.render('charm')
  assert.equal(nodes.filter(n => n.props.type === 'file').length, 1)
  assert.equal(nodes.find(n => n.props.type === 'range').props['aria-label'], '挂饰大小')
  const headings = nodes.filter(n => n.type === 'h2').map(label)
  assert.ok(headings.indexOf('调整挂饰') > headings.indexOf('五档心情挂饰'))
  const popup = nodes.find(n => n.props['aria-label'] === '挂饰弹出卡片')
  assert.equal(popup.props.value, 'mood')
  popup.props.onChange({ target: { value: 'memory' } })
  assert.equal(f.storage.get('fm-widget-panel'), 'memory')
  assert.ok(f.events.some(event => event.type === 'fish-charm-panel' && event.detail === 'memory'))
})


test('上传成功即刷新预览并通知挂饰，大小设置即时广播并持久化', async () => {
  const f = fixture()
  let nodes = f.render('charm')
  const upload = nodes.find(n => n.props['aria-label'] === '选择挂饰图片')
  nodes.find(n => n.props['aria-label'] === '上传62–79 开心全身像').props.onClick()
  const input = { files: [{ size: 100 }], value: 'fixture.png' }
  await upload.props.onChange({ currentTarget: input })
  assert.equal(f.uploads.length, 1)
  assert.match(f.uploads[0].url, /tier=good&kind=body$/)
  assert.equal(input.value, '')
  assert.ok(f.events.some(event => event.type === 'fish-charm-updated' && event.detail.images.good.url === '/uploaded-good?v=2'))
  nodes = f.render('charm')
  assert.ok(nodes.some(n => n.props.src === '/uploaded-good?v=2'))
  nodes.find(n => n.props['aria-label'] === '挂饰大小').props.onInput({ currentTarget: { value: '125' } })
  assert.equal(f.storage.get('fm-widget-scale'), '1.25')
  assert.ok(f.events.some(event => event.type === 'fish-charm-scale' && event.detail === 1.25))
  const transparency = f.render('charm').find(n => n.props['aria-label'] === '卡片透明度')
  assert.equal(transparency.props.value, 35)
  transparency.props.onInput({ currentTarget: { value: '80' } })
  assert.equal(f.storage.get('fm-widget-transparency'), '80')
  assert.ok(f.events.some(event => event.type === 'fish-charm-transparency' && event.detail === 80))
  assert.equal(fixture([...f.storage]).render('charm').find(n => n.props['aria-label'] === '卡片透明度').props.value, 80)
  await upload.props.onChange({ currentTarget: { files: [{ size: 4 * 1024 * 1024 + 1 }], value: 'oversize.png' } })
  assert.equal(f.uploads.length, 1, '客户端超限校验失败时不提交文件')
})
