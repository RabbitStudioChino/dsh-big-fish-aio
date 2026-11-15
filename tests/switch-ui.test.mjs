import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/controls.js', import.meta.url), 'utf8')

test('自定义开关保留 checked 回调，状态受配置控制，禁用后不提交', async () => {
  const changes = []
  const React = { createElement: (type, props, ...children) => ({ type, props, children }) }
  const context = vm.createContext({ require: () => React })
  vm.runInContext(source, context)
  const render = (checked, disabled = false) => context.FishSwitch({ type: 'checkbox', checked, disabled,
    'aria-label': '启用接口', className: 'platform-provider-toggle', onChange: event => changes.push(event.target.checked) })
  const button = render(false)
  assert.equal(button.type, 'button')
  assert.equal(button.props.type, 'button')
  assert.equal(button.props.role, 'switch')
  assert.equal(button.props['aria-checked'], false)
  assert.equal(button.props['aria-label'], '启用接口')
  assert.ok(button.props.className.includes('platform-provider-toggle'))
  await button.props.onClick()
  assert.deepEqual(changes, [true])
  assert.equal(button.props['aria-checked'], false, '等待配置更新后再显示开启')
  const enabled = render(true)
  assert.equal(enabled.props['aria-checked'], true)
  await enabled.props.onClick()
  await render(false, true).props.onClick()
  assert.deepEqual(changes, [true, false])
})

test('自定义开关点击进入配置区自动保存队列，提交修改后的值', async () => {
  const timers = new Map(), saved = []
  let serial = 0, value = false
  const React = { useRef: current => ({ current }), createElement: (type, props) => ({ type, props }) }
  const context = vm.createContext({ require: () => React,
    setTimeout: callback => { const id = ++serial; timers.set(id, callback); return id },
    clearTimeout: id => timers.delete(id),
  })
  vm.runInContext(source, context)
  const autosave = context.useFishAutosave(async () => saved.push(value))
  autosave.onClickCapture({ target: { closest: () => null } })
  assert.equal(timers.size, 0)
  const button = context.FishSwitch({ checked: value, onChange: event => { value = event.target.checked } })
  autosave.onClickCapture({ target: { closest: () => button } })
  await button.props.onClick()
  assert.deepEqual(saved, [])
  for (const callback of [...timers.values()]) callback()
  await new Promise(setImmediate)
  assert.deepEqual(saved, [true])
})
