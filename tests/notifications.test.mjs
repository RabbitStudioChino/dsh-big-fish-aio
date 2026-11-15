import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
test('通知同时堆叠，五秒倒计时支持悬停暂停、恢复与手动关闭', () => {
  let now = 0, serial = 0, cursor = 0, refCursor = 0, effectCursor = 0
  const timers = new Map(), states = [], refs = [], effects = []
  const context = vm.createContext({
    Date: { now: () => now }, setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { fn, at: now + delay }); return id }, clearTimeout: id => timers.delete(id),
    h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState: initial => { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], next => { states[i] = next }] },
      useRef: initial => refs[refCursor++] ||= { current: initial },
      useEffect: (fn, deps) => { const i = effectCursor++, old = effects[i]; if (!old || deps.some((v, j) => v !== old.deps[j])) { old?.off?.(); effects[i] = { deps, off: fn() } } },
    },
  })
  vm.runInContext(readFileSync(new URL('../src/notifications.js', import.meta.url), 'utf8'), context)
  context.fishNotify('第一条'); context.fishNotify('第二条')
  const store = vm.runInContext('FISH_TOAST', context)
  assert.equal(store.items.length, 2)
  assert.deepEqual(Array.from(store.items, item => item.text), ['第二条', '第一条'])
  let item = store.items[0]
  const render = () => { cursor = refCursor = effectCursor = 0; return context.FishNotice({ item }) }
  const advance = ms => { now += ms; for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn() } }
  let card = render(); advance(1000); card.props.onMouseEnter(); card = render()
  advance(6000); assert.equal(states[2], false)
  assert.equal(card.children.at(-1).props.style.animationPlayState, 'paused')
  card.props.onMouseLeave(); render(); advance(3999); assert.equal(states[2], false)
  advance(1); render(); assert.equal(states[2], true)
  advance(180); assert.equal(store.items.length, 1)
  context.fishToastDone(store.items[0].id); assert.equal(store.items.length, 0)
  const reset = () => { effects.forEach(effect => effect.off?.()); effects.length = states.length = refs.length = 0 }
  reset()
  const progress = context.fishNotify('正在下载', { progress: 0 })
  item = store.items[0]; card = render(); advance(6000); assert.equal(store.items.length, 1)
  progress.update({ progress: 45 }); item = store.items[0]; card = render()
  assert.equal(card.children.at(-1).props.style.transform, 'scaleX(0.45)')
  card.props.onMouseEnter(); card = render(); advance(6000)
  assert.equal(states[2], false); assert.equal(card.children.at(-1).props.style.animation, 'none')
  progress.update({ progress: 100 }); item = store.items[0]; render(); advance(5000); render(); advance(180)
  assert.equal(store.items.length, 0)
  reset()
  const task = context.fishNotify('手动关闭任务', { progress: 10 })
  item = store.items[0]; card = render(); card.children[1].props.onClick(); render(); advance(100)
  task.update({ progress: 30 }); item = store.items[0]; render(); advance(80)
  assert.equal(store.items.length, 0)
  task.update({ progress: 60 }); assert.equal(store.items.length, 0, '手动关闭后不复活')
})

test('相同内容连续触发也逐条置顶，更新与关闭仅影响对应通知', () => {
  const { fishNotify, FISH_TOAST } = vm.runInNewContext(readFileSync(new URL('../src/notifications.js', import.meta.url), 'utf8') + '\n({ fishNotify, FISH_TOAST })')
  const first = fishNotify('配置已保存'), second = fishNotify('配置已保存')
  fishNotify('配置已保存')
  assert.deepEqual(Array.from(FISH_TOAST.items, item => item.id), [3, 2, 1])
  second.update({ text: '第二次保存已确认' })
  assert.deepEqual(Array.from(FISH_TOAST.items, item => item.text), ['配置已保存', '第二次保存已确认', '配置已保存'])
  first.close()
  assert.deepEqual(Array.from(FISH_TOAST.items, item => item.id), [3, 2])
})
