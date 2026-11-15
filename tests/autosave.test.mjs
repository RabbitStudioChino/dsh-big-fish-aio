import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
const wait = () => new Promise(resolve => setTimeout(resolve, 10))
test('输入过程不保存，失焦保存；选择即时提交并串行保留后续修改', async () => {
  const refs = []; let index = 0, value = 1, release, active = 0, max = 0
  const saved = []
  const context = vm.createContext({ setTimeout, clearTimeout, require: () => ({ useRef: initial => refs[index++] ||= { current: initial } }) })
  vm.runInContext(readFileSync(new URL('../src/controls.js', import.meta.url), 'utf8'), context)
  const render = () => { index = 0; const snapshot = value; return context.useFishAutosave(async () => {
    active++; max = Math.max(max, active); saved.push(snapshot)
    if (snapshot === 1) await new Promise(resolve => { release = resolve })
    active--
  }) }
  let form = render()
  const input = { target: { matches: () => true } }, toggle = { target: { matches: () => false } }
  form.onChangeCapture(input); await wait(); assert.equal(saved.length, 0)
  form.onBlurCapture(input); await wait(); assert.deepEqual(saved, [1])
  value = 2; form = render(); form.onChangeCapture(toggle); await wait(); assert.deepEqual(saved, [1])
  release(); await wait(); assert.deepEqual(saved, [1, 2]); assert.equal(max, 1)
})
