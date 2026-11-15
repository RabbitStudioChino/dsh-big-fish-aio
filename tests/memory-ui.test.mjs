import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const walk = x => !x || typeof x !== 'object' ? [] : [x, ...(x.children || []).flat(Infinity).flatMap(walk)]
const label = x => (x.children || []).flat(Infinity).filter(v => typeof v === 'string').join('')
function fixture() {
  const memory = { id: 'm1', text: '周末一起整理书架', importance: .5, category: 'event', tags: [], related: [], at: '2026-11-07T03:00:00Z' }
  const session = { id: 'a', title: '测试私聊', storeId: 'qq_1_private_2', qq: true, count: 1, enabled: true, memories: [memory], deleted: [], traces: [] }
  const data = { ok: true, 全局开关: true, userPronoun: '主人', qqIsolatedGroups: [], policy: { maxItems: 6 }, spec: [], sessions: [session, { ...session, id: 'g1', title: '群甲', storeId: 'qq_1_shared' }, { ...session, id: 'g2', title: '群乙', storeId: 'qq_1_shared' }] }
  const state = [], requests = []
  let index = 0, module
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    Fragment: 'fragment', useEffect() {}, useCallback: fn => fn, useRef: value => ({ current: value }),
    useState(initial) {
      const i = index++
      if (!(i in state)) state[i] = i === 0 ? data : i === 3 ? data.policy : typeof initial === 'function' ? initial() : initial
      return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value }]
    },
  }
  vm.runInNewContext(readFileSync(new URL('../modules/memory/lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: ({ factory }) => { module = factory(() => React) } } },
    fetch: async (url, options) => { requests.push({ url, body: options?.body && JSON.parse(options.body) }); return { ok: true, json: async () => url.endsWith('/list') ? data : { ok: true, count: 2 } } },
    setTimeout, clearTimeout,
  })
  let page = '记忆库'
  const render = () => { index = 0; return walk(module.Section({ page, onPageChange: name => { page = name }, historyImport: { type: 'history-tool', children: [] } })) }
  const button = (nodes, name) => nodes.find(x => x.type === 'button' && (x.props['aria-label'] || label(x)) === name)
  const dialog = nodes => nodes.find(x => x.type?.name === 'MemoryDialog')
  return { render, button, dialog, requests, page: value => { page = value } }
}

test('同一共享库只展示一次，编辑在同一个弹窗切换并携带正确库标识', async () => {
  const f = fixture()
  let nodes = f.render()
  assert.equal(nodes.filter(x => x.props.className === 'memory-library-row').length, 2)
  assert.ok(nodes.some(x => label(x) === '普通群共享记忆'))
  assert.equal(f.button(nodes, '查看记忆'), undefined)
  f.button(nodes, '管理').props.onClick()
  nodes = f.render()
  assert.equal(nodes.filter(x => x.type?.name === 'MemoryDialog').length, 1)
  assert.equal(f.dialog(nodes).props.subtitle, '记忆库 · 记忆条目')
  nodes.find(x => x.props.role === 'button' && label(x) === '编辑').props.onClick()
  nodes = f.render()
  assert.equal(f.dialog(nodes).props.subtitle, '记忆库 · 编辑记忆')
  assert.equal(nodes.filter(x => x.type?.name === 'MemoryDialog').length, 1)
  f.button(nodes, '保存修改').props.onClick()
  await new Promise(setImmediate)
  assert.deepEqual(f.requests.find(r => r.url.endsWith('/edit')).body, { session: 'a', id: 'm1', text: '周末一起整理书架', importance: .5, storeId: 'qq_1_private_2' })
})

test('管理弹窗保留全部工具，各工具从固定导航直接访问', () => {
  const f = fixture()
  f.button(f.render(), '管理').props.onClick()
  for (const [title, expected] of [['记忆条目', '记忆条目'], ['新增记忆', '新增记忆'], ['档案导入与生成', '档案导入与生成'], ['整理与修复', '整理与修复'], ['回收站', '回收站'], ['召回诊断', '召回诊断'], ['语义索引', '语义索引']]) {
    let nodes = f.render()
    const nav = nodes.find(x => x.props['aria-label'] === '记忆库工具')
    f.button(walk(nav), title).props.onClick()
    nodes = f.render()
    const modal = f.dialog(nodes)
    assert.equal(modal.props.subtitle, '记忆库 · ' + expected)
    assert.equal(nodes.filter(x => x.type?.name === 'MemoryDialog').length, 1)
    assert.equal(f.button(nodes, '管理工具'), undefined)
    if (title === '语义索引') {
      const embedded = walk(modal).find(x => x.type?.name === 'EmbeddingSettings')
      assert.equal(embedded.props.indexOnly, true)
      assert.equal(embedded.props.storeId, 'qq_1_private_2')
    }
  }
})

test('移除范围与称呼和数据管理，聊天记录导入使用独立页面', () => {
  const f = fixture()
  let nodes = f.render()
  assert.equal(f.button(nodes, '范围与称呼'), undefined)
  assert.equal(nodes.some(x => x.props['aria-label'] === '隔离群号'), false)
  f.page('QQ 聊天记录导入')
  nodes = f.render()
  assert.equal(f.dialog(nodes), undefined)
  assert.equal(nodes.some(x => x.type === 'history-tool'), false)
  assert.equal(f.button(nodes, '预览旧数据迁移'), undefined)
  assert.equal(f.button(nodes, '新增记忆'), undefined)
})
