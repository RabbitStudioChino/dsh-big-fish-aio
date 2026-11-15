import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

test('通用模态框使用浏览器顶层，关闭卸载时释放焦点与遮罩', () => {
  let mount, opened = 0, closed = 0, cancelled = false
  const dialog = { open: false, showModal() { this.open = true; opened++ }, close() { this.open = false; closed++ } }
  const React = {
    useRef: () => ({ current: dialog }), useLayoutEffect: effect => { mount = effect },
    createElement: (type, props, children) => ({ type, props, children }),
  }
  const source = readFileSync(new URL('../src/controls.js', import.meta.url), 'utf8')
  const context = vm.createContext({ require: () => React })
  vm.runInContext(source, context)
  const backdropClick = () => {}
  const modal = context.FishModal({ children: '表单', className: 'fish-modal', onMouseDown: backdropClick })
  assert.equal(modal.type, 'dialog')
  assert.equal(modal.props.onMouseDown, backdropClick)
  const unmount = mount()
  assert.equal(opened, 1)
  modal.props.onCancel({ preventDefault() { cancelled = true } })
  assert.equal(cancelled, true)
  unmount()
  assert.equal(closed, 1)
})
