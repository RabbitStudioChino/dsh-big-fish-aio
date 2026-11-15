import { themePaletteCSS } from '../lib/theme-palette.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../modules/mood/assets/widget.js', import.meta.url), 'utf8')
const flush = async () => { for (let i = 0; i < 8; i++) await new Promise(setImmediate) }
function element(tag) {
  const listeners = new Map()
  const node = { tag, children: [], querySelectorAll: () => [],
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this) },
    attributes: {}, style: { setProperty(k, v) { this[k] = v } }, offsetWidth: 180, offsetHeight: 180,
    get parentNode() { return this.parent },
    matches: () => Boolean(node.popoverOpen),
    showPopover() { this.popoverOpen = true; this.raised = (this.raised || 0) + 1 },
    hidePopover() { this.popoverOpen = false },
    getBoundingClientRect: () => ({ left: 500, top: 500, right: 680, bottom: 680, width: 180, height: 180 }),
    appendChild(child) { child.remove?.(); child.parent = this; this.children.push(child) },
    setAttribute(k, v) { this.attributes[k] = v }, hasAttribute(k) { return Object.hasOwn(this.attributes, k) }, setPointerCapture() {},
    attachShadow() { this.shadowRoot = element('shadow-root'); return this.shadowRoot },
    addEventListener(name, fn) { listeners.set(name, fn) }, removeEventListener(name) { listeners.delete(name) },
    fire(name, event = {}) { listeners.get(name)?.({ target: node, preventDefault() {}, stopPropagation() {}, ...event }) },
  }
  Object.defineProperty(node, 'innerHTML', { set() { node.children = [] } })
  return node
}
const walk = node => [node, ...node.children.flatMap(walk), ...(node.shadowRoot ? walk(node.shadowRoot) : [])]
function fixture() {
  const document = element('document'), window = element('window')
  let themeObserver, layerObserver
  const storage = new Map([['fm-widget-scale', '1.25']]), requests = []
  document.createElement = element; document.head = element('head'); document.body = element('body')
  document.body.setAttribute('data-ds-dark-theme', '')
  Object.assign(window, { innerWidth: 1440, innerHeight: 900 })
  const data = { ok: true, key: 'scope-a', mood: 0, slots: [{ id: 'scope-a', sessions: ['session-a'] }], timeline: [], dims: [{ key: 'happy', label: '开心', value: 0 }] }
  const memories = { ok: true, sessions: [
    { id: 'session-other', storeId: 'other', memories: [{ id: 'other', text: '其他隔离库' }] },
    { id: 'session-a', storeId: 'scope-a', title: '当前范围', memories: [{ id: 'old', text: '已被取代', 已被取代: {} }, { id: 'm1', text: '当前范围的记忆' }] },
  ] }
  const report = { ok: true, 今天: '2026-11-10', days: [{ date: '2026-11-10', cost: 1.25, total: 1234, input: 1000, output: 234 }] }
  vm.runInNewContext(source, { FISH_PALETTE_CSS: themePaletteCSS, document, window, AbortController, clearInterval() {}, clearTimeout() {}, Image: function () {},
    CSSStyleSheet: class { replaceSync(css) { this.text = css } },
    MutationObserver: class {
      constructor(callback) { this.callback = callback }
      observe(target, options) {
        if (options.attributeFilter?.includes('data-ds-dark-theme')) themeObserver = this
        else layerObserver = this
      }
      disconnect() { this.disconnected = true }
    },
    localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    fetch: async url => { requests.push(url); return { ok: true, json: async () => url.endsWith('/rice') ? report : url.endsWith('/list') ? memories : data } },
    setInterval() {}, setTimeout() { return 1 },
  })
  const widget = document.body.children[0], root = widget.shadowRoot, trigger = root.children[0], image = trigger.children[0], panel = root.children[1]
  return { document, window, storage, requests, widget, root, themeObserver, layerObserver, trigger, image, panel, data, text: () => walk(panel).map(node => node.textContent || '').join('\n') }
}

test('原生点击挂饰切换悬浮框，拖动后的点击被屏蔽，换图与缩放即时生效', async () => {
  const f = fixture()
  await flush()
  assert.equal(f.widget.style['--fm-scale'], '1.25')
  assert.equal(f.widget.style['--fm-glass-alpha'], '0.65')
  assert.equal(f.widget.children.length, 0, '挂饰内容与样式位于 Shadow DOM')
  assert.equal(f.widget.attributes.popover, 'manual')
  assert.equal(f.widget.popoverOpen, true)
  assert.match(f.root.adoptedStyleSheets[0].text, /:host \.fm-panel/)
  assert.equal(f.image.src, '/dsh-feiyu-mood/feiyu-sad.png')
  assert.equal(walk(f.widget).filter(node => node.tag === 'button').length, 1, '仅挂饰图片本身是按钮')
  f.trigger.fire('click', { detail: 1 }); await flush()
  assert.equal(f.panel.style.display, 'block')
  assert.equal(f.trigger.attributes['aria-expanded'], 'true')
  assert.match(f.text(), /0 {2}难过/)
  f.trigger.fire('click', { detail: 1 })
  assert.equal(f.panel.style.display, 'none')
  assert.equal(f.trigger.attributes['aria-expanded'], 'false')
  f.trigger.fire('pointerdown', { button: 0, pointerId: 1, clientX: 500, clientY: 500 })
  f.trigger.fire('pointermove', { pointerId: 1, clientX: 520, clientY: 520 })
  f.trigger.fire('pointerup', { pointerId: 1 })
  f.trigger.fire('click', { detail: 1 })
  assert.equal(f.panel.style.display, 'none', '拖动不打开卡片')
  f.trigger.fire('click', { detail: 0 }); await flush()
  assert.equal(f.panel.style.display, 'block', '键盘原生 click 可打开卡片')
  f.widget.fire('click', { target: f.panel })
  assert.equal(f.panel.style.display, 'block', '内容点击不切换卡片')
  f.window.fire('fish-charm-updated', { detail: { images: { sad: { url: '/custom-sad' } }, faces: { sad: { url: '/custom-face' } } } })
  assert.equal(f.image.src, '/custom-sad')
  assert.ok(walk(f.panel).some(node => node.src === '/custom-face'))
  f.window.fire('fish-charm-scale', { detail: 1.6 })
  assert.equal(f.widget.style['--fm-scale'], '1.6')
  f.window.fire('fish-charm-transparency', { detail: 80 })
  assert.equal(f.widget.style['--fm-glass-alpha'], '0.2')
  f.storage.set('fm-widget-transparency', '0')
  f.window.fire('storage', { key: 'fm-widget-transparency' })
  assert.equal(f.widget.style['--fm-glass-alpha'], '1')
  f.storage.set('fm-widget-transparency', '100')
  f.window.fire('storage', { key: 'fm-widget-transparency' })
  assert.equal(f.widget.style['--fm-glass-alpha'], '0')
  f.storage.set('fm-widget-transparency', 'invalid')
  f.window.fire('storage', { key: 'fm-widget-transparency' })
  assert.equal(f.widget.style['--fm-glass-alpha'], '0.65')
})

test('弹出内容切换复用今日用量，随机记忆限定绑定范围，关闭后停止附加数据请求', async () => {
  const f = fixture()
  await flush()
  assert.equal(f.requests.some(url => url.endsWith('/rice') || url.endsWith('/list')), false)
  f.storage.set('fm-widget-panel', 'cost')
  f.window.fire('fish-charm-panel', { detail: 'cost' })
  f.trigger.fire('click', { detail: 1 }); await flush()
  assert.match(f.text(), /今日开销/)
  assert.match(f.text(), /≈ ¥1\.250(?:\n|$)/)
  assert.ok(walk(f.panel).some(node => node.className === 'rice-stat-value' && node.textContent === '1.2K'))
  assert.equal(f.panel.attributes['data-content'], 'cost')
  f.storage.set('fm-widget-panel', 'memory')
  f.window.fire('fish-charm-panel', { detail: 'memory' }); await flush()
  assert.match(f.text(), /当前范围的记忆/)
  assert.doesNotMatch(f.text(), /其他隔离库|已被取代/)
  f.data.key = 'empty-scope'; f.data.slots = []
  f.window.fire('fish-charm-panel', { detail: 'memory' }); await flush()
  assert.match(f.text(), /暂无可展示记忆/)
  f.trigger.fire('click', { detail: 1 })
  const before = f.requests.length
  f.window.fire('fish-charm-panel', { detail: 'cost' }); await flush()
  assert.equal(f.requests.length, before)
})


test('构造样式表保留在独立根内，主题同步与实例回收不依赖普通 style 标签', () => {
  const f = fixture()
  assert.equal(f.document.head.children.length, 0)
  assert.equal(walk(f.root).some(node => node.tag === 'style'), false)
  assert.equal(f.root.adoptedStyleSheets.length, 1)
  assert.equal(f.widget.attributes['data-theme'], 'dark')
  delete f.document.body.attributes['data-ds-dark-theme']
  f.themeObserver.callback()
  assert.equal(f.widget.attributes['data-theme'], 'light')
  f.window.__feiyuMoodDispose()
  assert.equal(f.themeObserver.disconnected, true)
  assert.equal(f.layerObserver.disconnected, true)
  assert.equal(f.document.body.children.length, 0)
})

test('其他浮层打开后重新置顶，随模态框迁移时保留挂饰和卡片状态', async () => {
  const f = fixture()
  await flush()
  f.trigger.fire('click', { detail: 1 }); await flush()
  const raised = f.widget.raised, panel = f.panel
  f.document.fire('toggle', { target: element('popover'), newState: 'open' })
  assert.equal(f.widget.raised, raised + 1)
  const modal = element('dialog')
  f.document.activeElement = { closest: () => modal }
  f.layerObserver.callback()
  assert.equal(f.widget.parentNode, modal)
  assert.equal(f.widget.popoverOpen, true)
  assert.equal(f.panel, panel)
  assert.equal(f.panel.style.display, 'block')
  f.document.activeElement = null
  f.layerObserver.callback()
  assert.equal(f.widget.parentNode, f.document.body)
  assert.equal(f.widget.popoverOpen, true)
})
