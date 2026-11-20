import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8')
const walk = node => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(walk)]

test('定时任务开关提交当前任务 ID，刷新后显示停用或开启状态', async () => {
  const data = { workspaceId: 'fish', sessions: [], tasks: [{ id: 'task', sessionId: 'session', message: '带伞', repeat: 'daily', enabled: true, nextAt: 1, status: 'pending' }] }
  const states = [data], requests = [], notices = []
  let cursor = 0
  const render = vm.runInNewContext(read('src/scheduled-messages.js') + '\nScheduledMessages', {
    h: (type, props, ...children) => ({ type, props, children }), button: () => null, FishSwitch() {}, SCHEDULE_REPEATS: { daily: '每天' },
    React: {
      useState(value) { const i = cursor++; if (!(i in states)) states[i] = value; return [states[i], next => { states[i] = next }] },
      useEffect() {}, useRef: value => ({ current: value }),
    },
    async platformRequest(path, input) {
      if (path === '/scheduled-messages') return structuredClone(data)
      requests.push({ path, input: { ...input } })
      data.tasks[0].enabled = input.enabled
      return { ok: true }
    },
  })
  const draw = () => { cursor = 0; return walk(render({ notify: message => notices.push(message) })) }
  const toggle = tree => tree.find(node => node.type?.name === 'FishSwitch')
  assert.equal(toggle(draw()).props.checked, true)
  await toggle(draw()).props.onChange({ target: { checked: false } })
  assert.deepEqual(requests[0], { path: '/scheduled-messages/enabled', input: { id: 'task', enabled: false } })
  const paused = draw()
  assert.equal(toggle(paused).props.checked, false)
  assert.ok(paused.some(node => node.children.includes('已停用')))
  await toggle(paused).props.onChange({ target: { checked: true } })
  assert.equal(toggle(draw()).props.checked, true)
  assert.equal(notices.at(-1), '定时任务已开启。')
})

test('页签支持图标、键盘切换及已访问面板保留', () => {
  const state = [], registrations = []
  let index = 0, plugin
  const React = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    useEffect() {}, useLayoutEffect() {}, useRef: value => ({ current: value }),
    useState(value) {
      const i = index++
      if (!(i in state)) state[i] = typeof value === 'function' ? value() : value
      return [state[i], next => { state[i] = typeof next === 'function' ? next(state[i]) : next }]
    },
  }
  vm.runInNewContext(read('client.js'), { window: { __ModuleLoader__: {
    load({ factory }) { plugin = factory(id => id === 'react' ? React : {}) },
  } } })
  plugin.apply({ get: () => ({
    inject: (_, fn) => fn(),
    register: (slot, Component) => registrations.push({ slot, Component }),
  }) })
  const Page = registrations.find(item => item.slot.name === 'main').Component
  const render = () => { index = 0; return walk(Page()) }
  let tree = render(), tabs = tree.filter(n => n.props?.role === 'tab')
  assert.deepEqual(tabs.map(t => t.props['aria-label']), ['总览', 'QQ 互通', '长期记忆', '鱼的心情', '主动搭话', '定时任务', '开放平台', '文件管理', '运行日志', '吃大米饭', '更新与来源'])
  const overview = tree.find(n => n.props?.id === 'fish-panel-0').children[0]
  const overviewTree = walk(overview.type(overview.props))
  const welcome = overviewTree.find(n => n.props?.className === 'fish-welcome')
  const chat = overviewTree.find(n => n.props?.['data-fish-feature'] === 'qq')
  const memory = overviewTree.find(n => n.props?.['data-fish-feature'] === 'memory')
  const mood = overviewTree.find(n => n.props?.['data-fish-feature'] === 'mood')
  const speak = overviewTree.find(n => n.props?.['data-fish-feature'] === 'speak')
  const sidebar = tree.find(n => n.props?.className === 'fish-sidebar-scene')
  assert.equal(sidebar, undefined)
  assert.match(walk(welcome).find(n => n.type === 'img').props.src, /^\/dsh-big-fish-aio\/bigfish\/(welcome|sticker-[a-z-]+)\.png$/)
  const slots = [chat, memory, mood, speak]
  const resources = ['sticker-chat.png', 'sticker-read.png', 'sticker-heart.png', 'sticker-wave.png']
  slots.forEach((slot, i) => {
    assert.ok(slot, resources[i] + ' 有独立位置')
    const images = walk(slot).filter(n => n.type === 'img')
    assert.equal(images.length, 1, '每处点缀使用一个角色')
    assert.equal(images[0].props.src, '/dsh-big-fish-aio/bigfish/' + resources[i])
    assert.equal(images[0].props.width, 1254)
    assert.equal(images[0].props.height, 1254)
    assert.equal(images[0].props.alt, '', '装饰图不重复朗读界面文字')
    assert.ok(walk(slot).some(n => n.props?.['aria-hidden'] === true))
  })
  assert.equal(overviewTree.filter(n => n.type === 'img').length, 5)

  tabs[1].props.onClick()
  tree = render()
  assert.ok(tree.some(n => n.props?.className === 'fish-content fish-flat'), '操作页切换为扁平界面')
  assert.equal(tree.filter(n => n.props?.role === 'tabpanel').length, 2)
  assert.equal(tree.find(n => n.props?.id === 'fish-panel-0').props.hidden, true)
  const submenu = tree.find(n => n.props?.['aria-label'] === 'QQ 互通子菜单')
  const entries = walk(submenu).filter(n => n.type === 'button').map(n => n.children.join(''))
  assert.equal(entries.indexOf('群聊频率'), entries.indexOf('消息策略') + 1)
  assert.equal(entries.indexOf('语音转写'), entries.indexOf('表情包') + 1)
  assert.equal(entries.at(-1), '聊天记录')
  assert.equal(entries.indexOf('聊天记录'), entries.indexOf('图片与文件') + 1)
  assert.equal(entries.indexOf('语音发送'), entries.indexOf('语音转写') + 1)
  assert.ok(entries.includes('图片与文件') && !entries.includes('图片与语音'))
  const space = walk(submenu).find(n => n.type === 'button' && n.children.includes('QQ 空间'))
  space.props.onClick()
  tree = render()
  assert.equal(tree.find(n => n.props?.id === 'fish-panel-1').children[0].props.page, 'QQ 空间')
  assert.ok(tree.some(n => n.props?.className === 'fish-sidebar-note' && n.props.role === 'status'))
  state[3] = { 用户: 123456789, 昵称: '测试伙伴' }
  tree = render()
  const note = tree.find(n => n.props?.className === 'fish-sidebar-note')
  assert.equal(note.props.title, 'QQ 已连接 · 测试伙伴 · 123456789')
  assert.ok(walk(note).some(n => n.props?.className === 'fish-connection-dot' && n.props['data-connected'] === true))
  assert.equal(tree.some(n => n.type === 'footer'), false)
  tabs = tree.filter(n => n.props?.role === 'tab')
  tabs[2].props.onClick()
  tree = render()
  const memorySubmenu = tree.find(n => n.props?.['aria-label'] === '长期记忆子菜单')
  const memoryEntries = walk(memorySubmenu).filter(n => n.type === 'button').map(n => n.children.join(''))
  assert.deepEqual(memoryEntries, ['记忆库', 'RAG 语义召回'])

  let focused = -1, prevented = false
  tabs = tree.filter(n => n.props?.role === 'tab')
  tabs[1].props.onKeyDown({
    key: 'End', preventDefault() { prevented = true },
    currentTarget: { closest: () => ({ querySelectorAll: () => tabs.map((_, i) => ({ focus() { focused = i } })) }) },
  })
  tree = render()
  assert.equal(focused, tabs.length - 1)
  assert.equal(prevented, true)
  assert.equal(tree.find(n => n.props?.id === 'fish-tab-10').props['aria-selected'], true)
  assert.equal(tree.filter(n => n.props?.role === 'tabpanel').length, 4)
  assert.equal(tree.find(n => n.props?.id === 'fish-panel-1').props.hidden, true)
  for (const [key, expected] of [['Home', 0], ['ArrowLeft', tabs.length - 1], ['ArrowRight', 0], ['ArrowDown', 1], ['ArrowUp', 0]]) {
    tabs = tree.filter(n => n.props?.role === 'tab')
    const active = tabs.find(n => n.props['aria-selected'])
    active.props.onKeyDown({ key, preventDefault() {}, currentTarget: { closest: () => ({ querySelectorAll: () => tabs.map((_, i) => ({ focus() { focused = i } })) }) } })
    tree = render()
    assert.equal(focused, expected)
    assert.equal(tree.find(n => n.props?.id === 'fish-tab-' + expected).props['aria-selected'], true)
  }
  tree.find(node => node.props?.['aria-label'] === '定时任务' && node.props.role === 'tab').props.onClick()
  render().find(node => node.type?.name === 'ScheduledMessages').props.openPlatform()
  tree = render()
  assert.equal(tree.find(node => node.props?.['aria-label'] === '开放平台' && node.props.role === 'tab').props['aria-selected'], true)
  assert.equal(tree.find(node => node.type?.name === 'OpenPlatform').props.revealSchedule, true)
  tree.find(node => node.props?.['aria-label'] === '总览' && node.props.role === 'tab').props.onClick()
  assert.equal(render().find(node => node.type?.name === 'OpenPlatform').props.revealSchedule, false)
})

test('下拉菜单上下展开均直接贴合选择框，浮层使用顶层 popover 并挂载到所属模态框', () => {
  for (const rect of [{ left: 100, top: 500, bottom: 542, width: 300 }, { left: 100, top: 100, bottom: 142, width: 300 }, { left: 100, top: 100, bottom: 142, width: 148, compact: true }, { left: 100, top: 500, bottom: 542, width: 300, modal: true }]) {
    let popup = null, refIndex = 0
    const refs = [], effects = [], layouts = [], listeners = new Map()
    const React = {
      createElement: (type, props, ...children) => ({ type, props, children }),
      useState: () => [popup, value => { popup = typeof value === 'function' ? value(popup) : value }],
      useRef(initial) {
        const index = refIndex++
        if (!refs[index]) refs[index] = { current: initial }
        return refs[index]
      },
      useEffect: fn => effects.push(fn), useLayoutEffect: fn => layouts.push(fn),
    }
    const root = {}, modal = rect.modal ? {} : null
    const select = {
      dataset: { fishSelectCompact: rect.compact ? 'true' : undefined },
      options: ['心情', '开销', '记忆'].map((label, index) => ({ value: String(index), textContent: label })),
      selectedIndex: 0, getBoundingClientRect: () => rect, closest: selector => selector === '[aria-modal="true"], dialog[open]' ? modal : root,
      setAttribute() {}, removeAttribute() {}, getAttribute: () => '挂饰弹出卡片', focus() {},
    }
    const sandbox = {
      require: id => id === 'react-dom' ? { createPortal(node, mount) { assert.equal(mount, modal || root); return node } } : React, Node: class {},
      document: { addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener() {}, contains: () => true },
      window: { innerWidth: 800, innerHeight: 600, addEventListener() {}, removeEventListener() {} },
    }
    vm.runInNewContext(read('src/controls.js') + '\nthis.SelectLayer = FishSelectLayer', sandbox)
    sandbox.SelectLayer()
    effects.forEach(effect => effect())
    listeners.get('pointerdown')({ target: { closest: () => select }, preventDefault() {}, stopPropagation() {} })
    refIndex = 0; layouts.length = 0
    const tree = sandbox.SelectLayer()
    let shown = 0
    tree.props.ref.current = { showPopover: () => shown++, focus() {} }
    layouts.forEach(effect => effect())
    assert.equal(shown, 1)
    assert.equal(tree.props.popover, 'manual')
    assert.equal(tree.props.style.width, rect.width + 'px')
    if (rect.top === 500) {
      assert.equal(tree.props.style.top, 'auto')
      assert.equal(tree.props.style.bottom, '100px', '上开按选择框上边缘锚定，不减预留最大高度')
    } else {
      assert.equal(tree.props.style.top, '142px')
      assert.equal(tree.props.style.bottom, 'auto')
    }
  }
})

test('导航重排后仍按名称恢复页面，兼容旧数字页签', () => {
  const source = read('src/panel.js')
  const locationSource = source.slice(source.indexOf('const tabs ='), source.indexOf('const css =')) +
    source.slice(source.indexOf('const LOCATION_KEY ='), source.indexOf('\nfunction Page()'))
  for (const [saved, expected] of [
    [{ tab: 8, tabLabel: '开放平台' }, 6],
    [{ tab: 5, tabLabel: '吃大米饭' }, 9],
    [{ tab: 5 }, 9],
    [{ tab: 8 }, 10],
  ]) {
    const actual = vm.runInNewContext(locationSource + '\nreadSavedLocation().tab', {
      window: { localStorage: { getItem: () => JSON.stringify(saved) } },
    })
    assert.equal(actual, expected)
  }
})
