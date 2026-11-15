import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
function hooks() {
  const states = [], refs = [], dependencies = []
  let stateIndex = 0, refIndex = 0, effectIndex = 0
  return {
    reset() { stateIndex = 0; refIndex = 0; effectIndex = 0 },
    React: {
      createElement: (type, props, ...children) => ({ type, props, children }),
      useState(value) {
        const index = stateIndex++
        if (!(index in states)) states[index] = value
        return [states[index], next => { states[index] = next }]
      },
      useRef(value) {
        const index = refIndex++
        if (!(index in refs)) refs[index] = { current: value }
        return refs[index]
      },
      useEffect(effect, deps) {
        const index = effectIndex++
        if (!dependencies[index] || deps.some((value, i) => value !== dependencies[index][i])) effect()
        dependencies[index] = deps
      },
      useMemo: fn => fn(),
    },
  }
}

test('共享刷新图标在请求期间旋转、阻止连点，成功和失败后均可再刷新', async () => {
  const state = hooks()
  const Button = vm.runInNewContext(read('src/controls.js') + '\nFishRefreshButton', {
    require: () => state.React, Glyph: 'svg',
  })
  let calls = 0, release
  const props = { label: '刷新记录', onClick() { calls++; return new Promise(resolve => { release = resolve }) } }
  const render = extra => { state.reset(); return Button({ ...props, ...extra }) }
  let button = render()
  assert.equal(button.props['aria-label'], '刷新记录')
  assert.equal(button.props['aria-busy'], false)
  assert.equal(button.children[0].props.className, 'fish-spin')
  assert.equal(button.children.some(child => typeof child === 'string'), false)
  const pending = button.props.onClick()
  await button.props.onClick()
  assert.equal(calls, 1)
  assert.equal(render().props.disabled, true)
  assert.equal(render().props['aria-busy'], true)
  release(); await pending
  assert.equal(render().props.disabled, false)
  await assert.rejects(render({ onClick: async () => { throw Error('offline') } }).props.onClick(), /offline/)
  assert.equal(render().props['aria-busy'], false)
  await render({ busy: true }).props.onClick()
  assert.equal(calls, 1)
  assert.equal(render({ busy: true }).props['aria-busy'], true)
  const css = read('src/theme.css')
  assert.match(css, /\.fish-refresh-button \.fish-spin\s*\{ animation-play-state: paused/)
  assert.match(css, /\.fish-refresh-button\[aria-busy=true\] \.fish-spin\s*\{ animation-play-state: running/)
})

test('吃大米饭首次进入和保留挂载后再次进入各读取一次，隐藏和普通重绘不读取', async () => {
  const state = hooks(), requests = []
  const source = read('src/panel.js')
  const Rice = vm.runInNewContext(source.slice(source.indexOf('function Rice('), source.indexOf('function Updates(')) + '\nRice', {
    React: state.React, h: state.React.createElement, FishRefreshButton: 'refresh',
    request: async path => { requests.push(path); return { days: [], 会话: [] } },
  })
  const render = active => { state.reset(); return Rice({ active }) }
  render(false); assert.equal(requests.length, 0)
  render(true); await new Promise(setImmediate); assert.equal(requests.length, 1)
  render(true); assert.equal(requests.length, 1)
  render(false); assert.equal(requests.length, 1)
  render(true); await new Promise(setImmediate); assert.equal(requests.length, 2)
  assert.ok(requests.every(path => path === '/dsh-qq-bridge/rice'))
  assert.match(source, /h\(Rice, \{ notify: fishNotify, active: tab === tabs.indexOf\('吃大米饭'\) \}\)/)
})

test('快速切回用量页后，旧请求晚到不会覆盖新统计或提前结束刷新状态', async () => {
  const state = hooks(), pending = []
  const source = read('src/panel.js')
  const Rice = vm.runInNewContext(source.slice(source.indexOf('function Rice('), source.indexOf('function Updates(')) + '\nRice', {
    React: state.React, h: state.React.createElement, FishRefreshButton: 'refresh',
    request: () => new Promise(resolve => pending.push(resolve)),
  })
  const render = active => { state.reset(); return Rice({ active }) }
  render(true); render(false); render(true)
  pending[1]({ days: [], 会话: [], 工作区: { path: 'new-value' } })
  await new Promise(setImmediate)
  assert.ok(JSON.stringify(render(true)).includes('new-value'))
  pending[0]({ days: [], 会话: [], 工作区: { path: 'old-value' } })
  await new Promise(setImmediate)
  const tree = JSON.stringify(render(true))
  assert.ok(tree.includes('new-value'))
  assert.ok(!tree.includes('old-value'))
})
