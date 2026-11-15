import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const source = 'function Glyph() {}\nfunction FishRefreshButton() {}\n' + ['lib/open-platform-schema.mjs', 'lib/open-platform-http.mjs', 'lib/open-platform-import.mjs', 'src/open-platform.js']
  .map(path => readFileSync(new URL('../' + path, import.meta.url), 'utf8').replace(/^import .*\n/gm, '').replaceAll('export function ', 'function ')).join('\n')
const walk = node => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(walk)]
function assertGuideSections(tree) {
  const headings = walk(tree).filter(node => node.type === 'h3').map(node => node.children[0].replace(/^\d+\.\s*/, ''))
  for (const topic of ['接入文件与注册', '提供方与接口字段', 'Schema 数据格式', '执行上下文与会话权限', '记录格式与数据示例', 'OpenAPI 文档字段', '调用与响应格式']) {
    assert.ok(headings.includes(topic), '接入规范缺少「' + topic + '」')
  }
}

test('信息卡片打开配置模态框，会话开关即时保存并处理失败和重复操作', async () => {
  const states = [], refs = [], requests = [], notices = [], effects = []
  let cursor = 0, refCursor = 0, failed = false, release = null
  const dialog = { open: false, showModal() { this.open = true }, close() { this.open = false } }
  const sessions = [{ id: 'p', type: '私聊', title: '主人' }, { id: 'g', type: '群', title: '群聊伙伴' }]
  let provider = { id: 'test', title: '接口', description: '插件说明', enabled: false, version: '1', sessionIds: [], operations: [{ id: 'balance', title: '查询余额', readOnly: true }] }
  const sandbox = {
    h: (type, props, ...children) => ({ type, props, children }),
    React: {
      Fragment: 'fragment',
      useState(value) { const index = cursor++; if (!(index in states)) states[index] = value; return [states[index], next => { states[index] = next }] },
      useRef(value) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: value }; return refs[index] },
      useEffect(effect) { effects.push(effect) },
    },
    fetch: async (url, options) => {
      const body = JSON.parse(options.body)
      requests.push({ url, body })
      if (release) await new Promise(resolve => { release = resolve })
      return { ok: !failed, json: async () => failed ? { ok: false, error: { message: '保存失败' } }
        : { providers: [{ ...provider, enabled: body.enabled, sessionIds: body.sessionIds }] } }
    },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Provider = PlatformProvider; globalThis.Operation = PlatformOperation', sandbox)
  const render = () => {
    cursor = 0; refCursor = 0
    const tree = sandbox.Provider({ provider, sessions, notify(message) { notices.push(message) }, onRefresh(value) { provider = value.providers[0] } })
    walk(tree).find(node => node.type === 'dialog').props.ref.current = dialog
    effects.splice(0).forEach(effect => effect())
    return tree
  }
  const toggle = label => walk(render()).find(node => node.props?.role === 'switch' && node.props['aria-label'] === label)
  let tree = render()
  const card = tree.children[0]
  assert.equal(card.type, 'article')
  const opener = card.children[0]
  assert.equal(opener.type, 'button'); assert.equal(opener.props['aria-haspopup'], 'dialog')
  assert.equal(walk(opener).some(node => node.type === 'input' || node.type === sandbox.Operation), false)
  assert.equal(card.children[1].props.role, 'switch')
  assert.ok(JSON.stringify(card).includes('插件说明'))
  assert.equal(dialog.open, false)
  opener.props.onClick(); tree = render()
  assert.equal(dialog.open, true)
  let modal = tree.children[1]
  assert.equal(modal.type, 'dialog'); assert.ok(modal.props['aria-labelledby'])
  assert.equal(walk(modal).some(node => node.type === sandbox.Operation), false)
  assert.ok(JSON.stringify(modal).includes('选择一个接口'))
  walk(modal).find(node => node.type === 'button' && node.props?.['aria-controls'] === 'platform-detail-test').props.onClick()
  modal = render().children[1]
  assert.ok(walk(modal).some(node => node.type === sandbox.Operation))
  assert.equal(walk(modal).some(node => node.props?.type === 'radio' || node.children?.includes('保存会话授权')), false)
  assert.deepEqual(walk(modal).filter(node => node.props?.role === 'switch').map(node => node.props['aria-label']), ['开启接口接入', '授权主人', '授权群聊伙伴'])
  await toggle('授权主人').props.onChange({ target: { checked: true } })
  assert.equal(requests[0].body.enabled, false)
  assert.deepEqual(requests[0].body.sessionIds, ['p'])
  await toggle('授权群聊伙伴').props.onChange({ target: { checked: true } })
  assert.deepEqual(requests[1].body.sessionIds, ['p', 'g'])
  walk(render()).find(node => node.type === 'dialog').props.onCancel({ preventDefault() {} })
  render(); assert.equal(dialog.open, false)
  await toggle('启用接口接入').props.onChange({ target: { checked: true } })
  render(); assert.equal(dialog.open, false)
  opener.props.onClick(); render(); assert.equal(dialog.open, true)
  assert.equal(requests[2].body.enabled, true)
  assert.deepEqual(requests[2].body.sessionIds, ['p', 'g'])
  await toggle('授权主人').props.onChange({ target: { checked: false } })
  assert.equal(requests[3].body.enabled, true)
  assert.deepEqual(requests[3].body.sessionIds, ['g'])
  failed = true
  await toggle('授权主人').props.onChange({ target: { checked: true } })
  assert.equal(toggle('授权主人').props.checked, false)
  assert.equal(toggle('授权主人').props.disabled, false)
  assert.equal(notices.at(-1), '保存失败')
  failed = false; release = true
  const pending = toggle('授权主人').props.onChange({ target: { checked: true } })
  assert.ok(walk(render()).filter(node => node.props?.role === 'switch').every(node => node.props.disabled))
  const count = requests.length
  await toggle('授权群聊伙伴').props.onChange({ target: { checked: false } })
  assert.equal(requests.length, count)
  release(); release = null; await pending
  assert.equal(toggle('授权主人').props.checked, true)
  walk(render()).find(node => node.type === 'dialog').props.onCancel({ preventDefault() {} })
  render(); assert.equal(dialog.open, false)
  render().children[0].children[0].props.onClick(); render(); assert.equal(dialog.open, true)
  assert.equal(walk(render()).some(node => node.type === sandbox.Operation), false, '重新打开卡片后等待选择接口')
  assert.deepEqual(provider.sessionIds, ['g', 'p'])
})

test('开放平台页头展示一句简介', () => {
  const panel = readFileSync(new URL('../src/panel.js', import.meta.url), 'utf8')
  assert.ok(panel.includes('接入插件接口并管理会话授权。'))
  assert.equal(panel.includes('把你自己的插件通过暴露标准接口接进来'), false)
  assert.equal(panel.includes('接入接口并打开开关后大肥鱼就能直接获得调用能力。'), false)
})

test('字段表包含根节点、数组元素与全部嵌套字段，Schema 使用 JSON 代码块', () => {
  const sandbox = { h: (type, props, ...children) => ({ type, props, children }) }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Schema = PlatformSchema; globalThis.Code = PlatformCode', sandbox)
  const schema = { type: 'object', required: ['wallets'], properties: { wallets: { type: 'array', description: '充值钱包', items: { type: 'object', required: ['currency'], properties: { currency: { type: 'string', enum: ['CNY', 'USD'] }, balance: { type: 'string', description: '十进制金额' } } } } } }
  const nodes = walk(sandbox.Schema({ schema }))
  const rows = nodes.filter(node => node.type === 'tr').slice(1)
  assert.deepEqual(rows.map(row => row.children[0].children[0].children[0]), ['$', '$.wallets', '$.wallets[]', '$.wallets[].currency', '$.wallets[].balance'])
  assert.equal(rows.at(-1).children[2].children[0], '否')
  const code = sandbox.Code({ value: schema })
  const json = walk(code).find(node => node.type === 'code')
  assert.equal(json.props.className, 'language-json'); assert.equal(json.children[0], JSON.stringify(schema, null, 2))
  const empty = { type: 'object', properties: {}, description: '无需业务参数，请传入空对象 {}。' }
  assert.ok(JSON.stringify(sandbox.Schema({ schema: empty })).includes('无需业务参数'))
})

test('规范按钮位于刷新右侧，点击打开分节原生模态框并支持关闭', () => {
  const state = [], effects = []; let cursor = 0, closed = 0
  const dialog = { open: false, showModal() { this.open = true }, close() { this.open = false } }
  const sandbox = {
    h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(value) { const index = cursor++; if (!(index in state)) state[index] = value; return [state[index], next => { state[index] = next }] },
      useEffect(effect) { effects.push(effect) }, useRef: () => ({ current: dialog }),
    },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Page = OpenPlatform; globalThis.Guide = PlatformGuide', sandbox)
  const render = () => { cursor = 0; return sandbox.Page({ notify() {} }) }
  const tree = render(), toolbar = walk(tree).find(node => node.props?.className === 'platform-toolbar')
  assert.deepEqual(toolbar.children.map(node => node.props.label || node.props['aria-label'] || node.children[0]), ['刷新接口目录', '接入规范与 OpenAPI', 'AI 开发 prompt', '+ 接入 API'])
  assert.equal(toolbar.children[0].type.name, 'FishRefreshButton')
  assert.equal(toolbar.children[0].children.some(child => typeof child === 'string'), false)
  assert.equal(JSON.stringify(tree).includes('统一发现插件接口，按会话授权，让大肥鱼调用。'), false)
  toolbar.children[1].props.onClick()
  assert.ok(walk(render()).some(node => node.type === sandbox.Guide))
  const guide = sandbox.Guide({ onClose() { closed++ } }), cleanup = effects.at(-1)()
  assert.equal(guide.type, 'dialog'); assert.equal(dialog.open, true)
  assertGuideSections(guide)
  guide.props.onCancel({ preventDefault() {} }); assert.equal(closed, 1)
  cleanup(); assert.equal(dialog.open, false)
})

test('刷新期间保持忙碌并拒绝重复请求，成功和失败后恢复按钮', async () => {
  const states = [], refs = []
  let cursor = 0, refCursor = 0, requests = 0, resolveFetch, rejectFetch
  const sandbox = {
    h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(value) { const index = cursor++; if (!(index in states)) states[index] = value; return [states[index], next => { states[index] = next }] },
      useRef(value) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: value }; return refs[index] },
      useEffect() {},
    },
    fetch() {
      requests++
      return new Promise((resolve, reject) => { resolveFetch = resolve; rejectFetch = reject })
    },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Page = OpenPlatform', sandbox)
  const render = () => { cursor = 0; refCursor = 0; return sandbox.Page({ notify() {} }) }
  const button = () => walk(render()).find(node => node.props?.label === '刷新接口目录')
  assert.equal(button().props.busy, false)
  assert.equal(button().type.name, 'FishRefreshButton')
  for (const success of [true, false]) {
    const original = button(), before = requests
    const pending = original.props.onClick()
    assert.equal(button().props.busy, true)
    assert.equal(button().props.busy, true)
    await original.props.onClick()
    assert.equal(requests, before + 1)
    if (success) resolveFetch({ ok: true, json: async () => ({ providers: [], sessions: [] }) })
    else rejectFetch(Error('网络中断'))
    await pending
    assert.equal(button().props.busy, false)
    assert.equal(button().props.busy, false)
    if (!success) assert.ok(JSON.stringify(render()).includes('网络中断'))
  }
})

test('规范以完整字段表展示同一接口的配置、存储记录与请求响应示例', () => {
  const effects = [], requests = []
  const dialog = { open: false, showModal() { this.open = true }, close() { this.open = false } }
  const sandbox = {
    h: (type, props, ...children) => ({ type, props, children }),
    fetch: (...args) => { requests.push(args); throw Error('文档不应请求接口目录') },
    React: { useEffect: effect => effects.push(effect), useRef: () => ({ current: dialog }) },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Guide = PlatformGuide; globalThis.Code = PlatformCode', sandbox)
  const tree = sandbox.Guide({ onClose() {} })
  const cleanup = effects.map(effect => effect())
  assert.equal(dialog.open, true)
  assertGuideSections(tree)
  assert.deepEqual(walk(tree).filter(node => node.type === 'button').map(node => node.children[0]), ['×'])
  assert.equal(walk(tree).some(node => node.type === 'nav'), false)
  assert.equal(requests.length, 0)
  const blocks = walk(tree).filter(node => node.type === sandbox.Code)
  assert.equal(blocks.length, 6)
  const spec = blocks.find(block => block.props.value?.openapi).props.value
  const reference = blocks.find(block => block.props.title === 'big-fish-api.json').props.value
  assert.deepEqual(Object.keys(reference), ['schemaVersion', 'transport', 'id'])
  assert.equal(blocks.find(block => block.props.title === '插件持久化记录示例').props.value.sessionId, 'session-demo-001')
  assert.equal(blocks.find(block => block.props.title === '失败响应 · HTTP 200').props.value.ok, false)
  assert.equal(JSON.stringify(tree).includes('一份清单，连接插件与大肥鱼'), false)
  assert.equal(spec.openapi, '3.1.0')
  assert.deepEqual(Object.keys(spec.paths), ['/dsh-big-fish-aio/open-platform/invoke/my_plugin/read'])
  const operation = Object.values(spec.paths)[0].post
  assert.equal(operation.operationId, 'big_fish_my_plugin_read')
  assert.equal(operation['x-big-fish-read-only'], true)
  const input = operation.requestBody.content['application/json']
  assert.deepEqual(Object.keys(input.schema.properties), [])
  assert.equal(input.schema.additionalProperties, false)
  const response = operation.responses[200].content['application/json']
  assert.equal(response.schema.properties.data.properties.items.items.properties.isOwner.type, 'boolean')
  assert.equal(response.example.data.items[0].isOwner, true)
  const prose = JSON.stringify(tree)
  for (const contract of ['platformCtx.effect', 'getSessionIsolation(providerId)', 'execution.isolation.sessionId', 'isolation.assertCurrent()', 'execution.isOwner', '@local', 'X-Big-Fish-Session']) assert.ok(prose.includes(contract))
  cleanup.reverse().forEach(off => off())
  assert.equal(dialog.open, false)
})


test('接入 API 表单提交规范清单，错误保留输入，成功清除搜索并展示新卡片', async () => {
  const state = [], refs = [], requests = [], effects = []
  let cursor = 0, refCursor = 0, failed = false, created
  const dialog = { open: false, showModal() { this.open = true }, close() { this.open = false } }
  const catalog = { providers: [{ id: 'echo', title: '回声 API', description: '测试', operations: [] }], sessions: [] }
  const sandbox = {
    SyntaxError, URL,
    h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(value) { const index = cursor++; if (!(index in state)) state[index] = value; return [state[index], next => { state[index] = typeof next === 'function' ? next(state[index]) : next }] },
      useRef(value) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: index === 0 ? dialog : value }; return refs[index] },
      useEffect(effect) { effects.push(effect) },
    },
    fetch: async (url, options) => { requests.push({ url, body: JSON.parse(options.body) }); return { ok: !failed, json: async () => failed ? { ok: false, error: { message: 'ID 重复' } } : catalog } },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Add = PlatformAddApi; globalThis.Page = OpenPlatform; globalThis.Provider = PlatformProvider', sandbox)
  const render = () => { cursor = 0; refCursor = 0; return sandbox.Add({ onClose() {}, onCreated(value) { created = value } }) }
  let tree = render()
  const cleanup = effects.pop()(); effects.length = 0
  assert.equal(tree.type, 'dialog'); assert.equal(dialog.open, true)
  const input = label => walk(render()).find(node => node.type === 'label' && node.children[0] === label).children[1]
  for (const [label, value] of [['名称', '回声 API'], ['提供方 ID', 'echo'], ['版本', '1.0.0'], ['提供方说明', '测试'], ['接口名称', '回声'], ['接口 ID', 'send'], ['接口说明', '返回内容'], ['目标地址', 'https://example.test/echo']]) {
    input(label).props.onChange({ target: { value } })
  }
  const submit = () => walk(render()).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  walk(render()).find(node => node.type === 'button' && node.children.includes('示例与认证')).props.onClick()
  input('请求示例（JSON）').props.onChange({ target: { value: '{' } })
  await submit(); assert.equal(requests.length, 0); assert.equal(created, undefined)
  assert.ok(walk(render()).some(node => node.props?.role === 'alert'))
  input('请求示例（JSON）').props.onChange({ target: { value: '{}' } })
  failed = true; await submit()
  assert.equal(input('名称').props.value, '回声 API')
  assert.equal(created, undefined)
  assert.ok(JSON.stringify(render()).includes('ID 重复'))
  failed = false; await submit()
  assert.equal(requests.at(-1).url, '/dsh-big-fish-aio/open-platform/apis')
  assert.equal(requests.at(-1).body.schemaVersion, 1)
  assert.equal(requests.at(-1).body.operations[0].url, 'https://example.test/echo')
  assert.equal(requests.at(-1).body.operations[0].inputSchema.additionalProperties, false)
  assert.equal(created, catalog)
  cleanup(); assert.equal(dialog.open, false)
  state.length = 0; refs.length = 0
  const page = () => { cursor = 0; return sandbox.Page({ notify() {} }) }
  const toolbar = walk(page()).find(node => node.props?.className === 'platform-toolbar')
  const addButton = toolbar.children.at(-1)
  assert.equal(addButton.children[0], '+ 接入 API')
  assert.ok(addButton.props.className.includes('platform-add-button'))
  addButton.props.onClick()
  walk(page()).find(node => node.type === 'input' && node.props.type === 'search').props.onChange({ target: { value: '不匹配' } })
  const modal = walk(page()).find(node => node.type === sandbox.Add)
  assert.ok(modal)
  modal.props.onCreated(catalog)
  tree = page()
  assert.equal(walk(tree).some(node => node.type === sandbox.Add), false)
  assert.ok(walk(tree).some(node => node.type === sandbox.Provider && node.props.provider.id === 'echo'))
})


test('多接口分区编辑保留输入，定位未完成接口与 JSON 错误，支持移除并提交同一提供方', async () => {
  const states = [], refs = [], requests = []
  let cursor = 0, refCursor = 0
  const sandbox = {
    URL, h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(value) { const index = cursor++; if (!(index in states)) states[index] = value; return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next }] },
      useRef(value) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: value }; return refs[index] }, useEffect() {},
    },
    fetch: async (url, options) => { requests.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ ok: true }) } },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Add = PlatformAddApi', sandbox)
  const render = () => { cursor = 0; refCursor = 0; return sandbox.Add({ onClose() {}, onCreated() {} }) }
  const input = label => walk(render()).find(node => node.type === 'label' && node.children[0] === label).children[1]
  const fill = (label, value) => input(label).props.onChange({ target: { value } })
  const click = label => walk(render()).find(node => node.type === 'button' && (node.props?.['aria-label'] === label || node.children.includes(label))).props.onClick()
  const submit = () => walk(render()).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  for (const [label, value] of [['名称', '多接口'], ['提供方 ID', 'multi'], ['提供方说明', '同一卡片']]) fill(label, value)
  const fillOperation = id => {
    for (const [label, value] of [['接口名称', id + '接口'], ['接口 ID', id], ['接口说明', id + '说明'], ['目标地址', 'https://example.test/' + id]]) fill(label, value)
  }
  fillOperation('first'); click('+ 添加接口')
  assert.equal(input('接口 ID').props.value, '')
  await submit()
  assert.equal(requests.length, 0)
  assert.ok(JSON.stringify(render()).includes('接口 2 · 请填写接口名称'))
  fillOperation('second'); click('编辑接口 1')
  assert.equal(input('接口 ID').props.value, 'first')
  click('请求 Schema'); fill('请求 Schema（JSON）', '{')
  click('编辑接口 2'); click('基本信息')
  assert.equal(input('接口 ID').props.value, 'second')
  await submit()
  assert.equal(requests.length, 0)
  assert.equal(input('请求 Schema（JSON）').props.value, '{')
  assert.ok(JSON.stringify(render()).includes('接口 1 · 请求 Schema（JSON） 格式错误'))
  fill('请求 Schema（JSON）', '{"type":"object","properties":{},"additionalProperties":false}')
  click('编辑接口 2'); click('基本信息'); fill('接口 ID', 'first')
  await submit()
  assert.equal(requests.length, 0)
  assert.ok(JSON.stringify(render()).includes('接口 2 · 接口 ID 重复'))
  fill('接口 ID', 'second'); click('示例与认证'); fill('认证请求头（JSON，选填）', '{"X-Test":"second"}')
  click('编辑接口 1'); click('示例与认证')
  assert.equal(input('认证请求头（JSON，选填）').props.value, '{}')
  await submit()
  assert.equal(requests.length, 1)
  assert.equal(requests[0].id, 'multi')
  assert.deepEqual(requests[0].operations.map(item => item.id), ['first', 'second'])
  assert.equal(requests[0].operations[1].headers['X-Test'], 'second')
  click('移除此接口')
  assert.equal(input('接口 ID').props.value, 'second')
  assert.equal(walk(render()).find(node => node.type === 'button' && node.children.includes('移除此接口')).props.disabled, true)
  await submit()
  assert.equal(requests[1].operations.length, 1)
  assert.equal(requests[1].operations[0].id, 'second')
})

test('JSON 导入原子填入全部接口，认证只填一次，确认前不请求后端', async () => {
  const states = [], refs = [], requests = []
  let cursor = 0, refCursor = 0
  const sandbox = {
    URL, Headers, TextEncoder, h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(value) { const index = cursor++; if (!(index in states)) states[index] = value; return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next }] },
      useRef(value) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: value }; return refs[index] }, useEffect() {},
    }, fetch: async (_, options) => { requests.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ ok: true }) } },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Add = PlatformAddApi', sandbox)
  const render = () => { cursor = 0; refCursor = 0; return sandbox.Add({ apiOrigin: 'http://127.0.0.1:55202', onClose() {}, onCreated() {} }) }
  const input = label => walk(render()).find(node => node.type === 'label' && node.children[0] === label).children[1]
  const click = label => walk(render()).find(node => node.type === 'button' && node.children.includes(label)).props.onClick()
  const file = async text => walk(render()).find(node => node.props?.type === 'file').props.onChange({ target: { value: 'file.json', files: [{ size: new TextEncoder().encode(text).length, text: async () => text }] } })
  const empty = { type: 'object', properties: {}, additionalProperties: false }
  const imported = { schemaVersion: 1, id: 'memo', title: '备忘录', description: '四合一', version: '1.0.0', operations: ['read', 'write'].map(id => ({ id, title: id, description: id, url: '{{DSH_ORIGIN}}/memo/' + id, headers: { Authorization: 'Bearer {{API_TOKEN}}' }, readOnly: id === 'read', inputSchema: empty, outputSchema: empty, example: {} })) }
  input('名称').props.onChange({ target: { value: '保留原表单' } })
  await file('{')
  assert.equal(input('名称').props.value, '保留原表单'); assert.equal(requests.length, 0)
  await file(JSON.stringify(imported))
  assert.equal(input('插件所在 DSH 地址').props.value, 'http://127.0.0.1:55202')
  assert.equal(input('名称').props.value, '保留原表单')
  click('填入表单'); assert.ok(JSON.stringify(render()).includes('请粘贴一次插件 Token'))
  input('插件 Token（只粘贴值）').props.onChange({ target: { value: 'synthetic-token' } })
  click('填入表单')
  assert.equal(input('名称').props.value, '备忘录')
  assert.equal(input('目标地址').props.value, 'http://127.0.0.1:55202/memo/read')
  assert.equal(requests.length, 0)
  await walk(render()).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  assert.equal(requests.length, 1); assert.equal(requests[0].operations.length, 2)
  assert.ok(requests[0].operations.every(item => item.headers.Authorization === 'Bearer synthetic-token'))
  assert.ok(!JSON.stringify(requests[0]).includes('{{'))
})

test('原生 JSON 导入不出现 Token，禁用手动表单校验，确认仅发送引用', async () => {
  const states = [], refs = [], requests = []
  let cursor = 0, refCursor = 0
  const sandbox = {
    URL, Headers, TextEncoder, h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(value) { const index = cursor++; if (!(index in states)) states[index] = value; return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next }] },
      useRef(value) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: value }; return refs[index] }, useEffect() {},
    }, fetch: async (_, options) => { requests.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ ok: true }) } },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Add = PlatformAddApi', sandbox)
  const render = () => { cursor = 0; refCursor = 0; return sandbox.Add({ onClose() {}, onCreated() {} }) }
  const nodes = () => walk(render())
  const file = async text => nodes().find(node => node.props?.type === 'file').props.onChange({ target: { value: 'file.json', files: [{ size: text.length, text: async () => text }] } })
  const reference = { schemaVersion: 1, transport: 'dsh', id: 'big_fish_memo' }
  await file(JSON.stringify(reference))
  assert.equal(requests.length, 0)
  assert.equal(nodes().some(node => node.props?.type === 'password'), false)
  assert.equal(nodes().find(node => node.type === 'fieldset').props.disabled, true)
  assert.equal(nodes().find(node => node.type === 'fieldset').props.hidden, true)
  await file('{')
  assert.equal(nodes().find(node => node.type === 'fieldset').props.hidden, true)
  await nodes().find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  assert.deepEqual(requests, [reference])
  nodes().find(node => node.type === 'button' && node.children.includes('取消导入')).props.onClick()
  assert.equal(nodes().find(node => node.type === 'fieldset').props.disabled, false)
  assert.equal(nodes().find(node => node.type === 'fieldset').props.hidden, false)
})
