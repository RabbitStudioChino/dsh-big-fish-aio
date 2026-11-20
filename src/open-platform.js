const OPEN_PLATFORM_PATH = '/dsh-big-fish-aio/open-platform'
async function platformRequest(path, body) {
  const response = await fetch(OPEN_PLATFORM_PATH + path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  const result = await response.json()
  if (!response.ok || result.ok === false) throw Error(result.error?.message || '开放平台请求失败')
  return result
}

function PlatformCode({ value, title = 'JSON Schema' }) {
  return h('div', { className: 'platform-code-block' },
    h('div', { className: 'platform-code-head' }, h('span', null, title), h('span', null, 'JSON')),
    h('pre', { tabIndex: 0 }, h('code', { className: 'language-json' }, JSON.stringify(value, null, 2))))
}

function platformSchemaRows(schema, path = '$', required = true) {
  return [{ path, schema, required },
    ...Object.entries(schema.properties || {}).flatMap(([key, value]) => platformSchemaRows(value, path + '.' + key, Boolean(schema.required?.includes(key)))),
    ...(schema.items ? platformSchemaRows(schema.items, path + '[]') : [])]
}

function PlatformSchema({ schema }) {
  return h('div', { className: 'platform-schema' },
    h('div', { className: 'fish-table-wrap' }, h('table', { className: 'fish-table' },
      h('thead', null, h('tr', null, ...['字段', '类型', '必填', '说明'].map(label => h('th', { key: label }, label)))),
      h('tbody', null, ...platformSchemaRows(schema).map(({ path, schema: value, required }) => h('tr', { key: path },
        h('td', null, h('code', null, path)), h('td', null, value.type), h('td', null, path.endsWith('[]') ? '每项' : required ? '是' : '否'),
        h('td', null, value.description || (path === '$' ? 'JSON 根节点' : value.type === 'object' ? '对象字段见下方' : '—'), value.enum ? ' · 可选值 ' + value.enum.join(' / ') : '')))))),
    h(PlatformCode, { value: schema }))
}

function PlatformOperation({ provider, operation }) {
  const [input, setInput] = React.useState(JSON.stringify(operation.example, null, 2))
  const [result, setResult] = React.useState(null)
  const [busy, setBusy] = React.useState(false)
  const test = async () => {
    setBusy(true); setResult(null)
    try {
      const body = JSON.parse(input)
      const response = await fetch(operation.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setResult({ status: response.status, body: await response.json() })
    } catch (error) { setResult({ body: { ok: false, error: { message: error.message } } }) }
    finally { setBusy(false) }
  }
  return h('article', { className: 'platform-operation' },
    h('header', { className: 'platform-operation-head' }, h('span', { className: 'platform-method' }, 'POST'), h('h3', null, operation.title), h('span', { className: 'memory-badge' }, operation.readOnly ? '只读' : '写入'), h('code', null, operation.id)),
    h('div', { className: 'platform-operation-body' },
      h('div', { className: 'platform-operation-intro' },
        h('p', { className: 'fish-muted' }, operation.description),
        h('code', { className: 'platform-path' }, operation.endpoint),
        h('p', { className: 'fish-muted' }, '会话工具名 ', h('code', null, operation.toolName))),
      h('section', { className: 'platform-section' }, h('h3', null, '请求参数'), h(PlatformSchema, { schema: operation.inputSchema })),
      h('section', { className: 'platform-section' }, h('h3', null, '成功数据'), h(PlatformSchema, { schema: operation.outputSchema })),
      h('section', { className: 'platform-section' }, h('h3', null, '测试调用'),
        h('label', { className: 'memory-field' }, '请求 JSON', h('textarea', { value: input, rows: 4, spellCheck: false, onChange: event => setInput(event.target.value) })),
        !operation.readOnly ? h('p', { className: 'fish-muted' }, '此测试将写入数据，请核对参数。') : null,
        h('div', { className: 'memory-actions' }, h('button', { className: 'fish-button', type: 'button', disabled: busy || !provider.enabled, onClick: test }, busy ? '调用中…' : '测试调用'),
          !provider.enabled ? h('span', { className: 'fish-muted' }, '开启接入后可测试') : null)),
      result ? h('div', { role: 'status', className: 'platform-response' }, h('strong', null, (result.body.ok ? '调用成功' : '调用失败') + (result.status ? ' · HTTP ' + result.status : '')),
        h(PlatformCode, { value: result.body, title: '响应结果' })) : null))
}

function PlatformProvider({ provider, sessions, onRefresh, notify }) {
  const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
  const [selectedId, setSelectedId] = React.useState(null)
  const selectedOperation = provider.operations.find(operation => operation.id === selectedId)
  const detailRef = React.useRef(null)
  React.useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0
  }, [selectedOperation?.id, provider.sessionIsolation])
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const dialogRef = React.useRef(null)
  const saving = React.useRef(false)
  React.useEffect(() => {
    const dialog = dialogRef.current
    if (open) dialog.showModal()
    else if (dialog.open) dialog.close()
  }, [open])
  const save = async (enabled, selected, sessionIsolation) => {
    if (saving.current) return
    saving.current = true
    setBusy(true)
    try {
      const catalog = await platformRequest('/connect', { providerId: provider.id, enabled, sessionIds: selected, ...(sessionIsolation !== undefined ? { sessionIsolation } : {}) })
      onRefresh(catalog)
      notify('接入设置已保存。')
    } catch (error) { notify(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  const remove = async () => {
    if (saving.current || provider.removable === false) return
    saving.current = true
    setBusy(true)
    try {
      const confirmed = await fishAskConfirm({
        title: '删除接入？',
        description: '移除「' + provider.title + '」的接入卡片并撤销所有会话授权。接口配置和插件数据保留，重新导入后需要重新授权。',
        confirmText: '删除接入', danger: true,
      })
      if (!confirmed) return
      const catalog = await platformRequest('/remove', { providerId: provider.id })
      setOpen(false)
      onRefresh(catalog)
      notify('接入已删除。')
    } catch (error) { notify(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  return h(React.Fragment, null,
    h('article', { className: 'fish-card platform-provider-card', id: 'fish-platform-card-' + provider.id },
      h('button', { type: 'button', className: 'platform-provider-open', 'aria-haspopup': 'dialog', onClick: () => { setSelectedId(null); setOpen(true) } },
      h('span', { className: 'platform-provider-title' }, provider.title),
      h('span', { className: 'platform-provider-description' }, provider.description),
      h('span', { className: 'platform-provider-meta' }, h('span', null, provider.id + ' · v' + provider.version),
        h('span', null, provider.operations.length + ' 个接口'))),
      h(Switch, { type: 'checkbox', role: 'switch', className: 'platform-provider-toggle', 'aria-label': '启用' + provider.title + '接入', checked: provider.enabled, disabled: busy,
        onChange: event => save(event.target.checked, provider.sessionIds) })),
    h('dialog', { ref: dialogRef, className: 'memory-dialog platform-provider', 'aria-labelledby': 'platform-provider-' + provider.id,
      onCancel: event => { event.preventDefault(); setOpen(false) }, onClose: () => setOpen(false) },
      h('header', { className: 'memory-dialog-head' },
        h('div', null, h('p', null, provider.id + ' · v' + provider.version), h('h2', { id: 'platform-provider-' + provider.id }, provider.title)),
        h('div', { className: 'platform-provider-actions' },
          provider.removable !== false ? h('button', { type: 'button', className: 'fish-button fish-danger', disabled: busy, onClick: remove }, '删除') : null,
          h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭' + provider.title, disabled: busy, onClick: () => setOpen(false), autoFocus: true }, '×'))),
      h('div', { className: 'platform-provider-workspace' },
        h('aside', { className: 'platform-provider-sidebar', 'aria-label': '接入设置与接口列表' },
          h('p', { className: 'platform-provider-description' }, provider.description),
          h('section', { className: 'platform-provider-settings' },
            h('label', { className: 'platform-session-option' }, h('span', null, '开启接入'),
              h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '开启' + provider.title + '接入', checked: provider.enabled, disabled: busy,
                onChange: event => save(event.target.checked, provider.sessionIds) }))),
          h('fieldset', { className: 'platform-sessions', disabled: busy, 'aria-busy': busy }, h('legend', null, '允许调用的会话'),
            ...sessions.map(session => h('label', { key: session.id, className: 'platform-session-option' },
              h('span', null, session.title),
              h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '授权' + session.title, checked: provider.sessionIds.includes(session.id), disabled: busy,
                onChange: event => save(provider.enabled, event.target.checked ? [...provider.sessionIds, session.id] : provider.sessionIds.filter(id => id !== session.id)) }))),
            !sessions.length ? h('p', { className: 'fish-muted' }, '绑定工作区内暂无 QQ 映射会话。') : null),
          provider.supportsSessionIsolation ? h('section', { className: 'platform-isolation' },
            h('label', { className: 'platform-session-option' }, h('span', null, '会话级别隔离'),
              h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '会话级别隔离', checked: provider.sessionIsolation, disabled: busy,
                onChange: event => save(provider.enabled, provider.sessionIds, event.target.checked) }))) : null,
          h('nav', { className: 'platform-provider-operations', 'aria-label': '接口列表' },
            h('h3', null, '接口列表 · ' + provider.operations.length),
            ...provider.operations.map(operation => h('button', { key: operation.id, type: 'button',
              'aria-current': selectedId === operation.id ? 'true' : undefined, 'aria-controls': 'platform-detail-' + provider.id,
              onClick: () => setSelectedId(operation.id) },
              h('span', { className: 'platform-operation-choice' }, h('strong', null, operation.title), h('span', { className: 'memory-badge' }, operation.readOnly ? '只读' : '写入')),
              h('code', null, operation.id))))),
        h('section', { id: 'platform-detail-' + provider.id, ref: detailRef, className: 'platform-provider-detail', 'aria-label': '接口详情', tabIndex: 0 },
          open && selectedOperation ? h(PlatformOperation, { key: selectedOperation.id + ':' + provider.sessionIsolation, provider, operation: selectedOperation })
            : h('div', { className: 'platform-provider-empty' }, h('h3', null, '选择一个接口'), h('p', null, '选择接口以查看参数、返回结构及测试调用。'))))))
}

function PlatformAddApi({ onClose, onCreated, apiOrigin = '' }) {
  const emptySchema = JSON.stringify({ type: 'object', properties: {}, required: [], additionalProperties: false }, null, 2)
  const newOperation = () => ({ id: '', title: '', description: '', url: '', readOnly: false,
    headers: '{}', inputSchema: emptySchema, outputSchema: emptySchema, example: '{}' })
  const [form, setForm] = React.useState({ id: '', title: '', description: '', version: '1.0.0', operations: [newOperation()] })
  const [active, setActive] = React.useState(0)
  const [view, setView] = React.useState('base')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const [pendingImport, setPendingImport] = React.useState(null)
  const [nativeReference, setNativeReference] = React.useState(null)
  const [importOrigin, setImportOrigin] = React.useState(apiOrigin)
  const [importToken, setImportToken] = React.useState('')
  const ref = React.useRef(null)
  const saving = React.useRef(false)
  const fileRef = React.useRef(null)
  React.useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  const fillImport = definition => {
    setForm({ id: definition.id, title: definition.title, description: definition.description, version: definition.version,
      operations: definition.operations.map(operation => ({ ...operation,
        ...Object.fromEntries(['headers', 'inputSchema', 'outputSchema', 'example'].map(key => [key, JSON.stringify(operation[key] ?? {}, null, 2)])) })) })
    setNativeReference(null); setActive(0); setView('base'); setPendingImport(null); setImportToken(''); setError('')
  }
  const importFile = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || saving.current) return
    saving.current = true; setBusy(true); setError('')
    try {
      if (file.size > 65536) throw Error('接入文件不能超过 64 KB')
      const text = await file.text(), parsed = parseHttpApiImport(text, { origin: apiOrigin })
      if (parsed.definition.transport === 'dsh') {
        setNativeReference(parsed.definition); setPendingImport(null); setImportToken('')
      } else if (parsed.needsToken || (parsed.needsOrigin && !apiOrigin)) {
        setNativeReference(null); setPendingImport({ text, ...parsed }); setImportOrigin(apiOrigin); setImportToken('')
      } else fillImport(parsed.definition)
    } catch (error) { setError(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  const completeImport = () => {
    try {
      if (pendingImport.needsOrigin && !importOrigin.trim()) throw Error('请填写插件所在 DSH 的地址')
      if (pendingImport.needsToken && !importToken.trim()) throw Error('请粘贴一次插件 Token')
      fillImport(parseHttpApiImport(pendingImport.text, { origin: importOrigin, token: importToken }).definition)
    } catch (error) { setError(error.message) }
  }
  const changeProvider = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const changeOperation = (key, value) => setForm(current => ({ ...current,
    operations: current.operations.map((operation, index) => index === active ? { ...operation, [key]: value } : operation) }))
  const addOperation = () => {
    setForm(current => ({ ...current, operations: [...current.operations, newOperation()] }))
    setActive(form.operations.length); setView('base')
  }
  const removeOperation = () => {
    setForm(current => ({ ...current, operations: current.operations.filter((_, index) => index !== active) }))
    setActive(Math.min(active, form.operations.length - 2)); setView('base')
  }
  const jsonFields = [['inputSchema', '请求 Schema（JSON）', 'input'], ['outputSchema', '返回 Schema（JSON）', 'output'],
    ['example', '请求示例（JSON）', 'examples'], ['headers', '认证请求头（JSON，选填）', 'examples']]
  const idPattern = /^[a-z][a-z0-9_]{0,23}$/
  const submit = async event => {
    event.preventDefault()
    if (saving.current || pendingImport) return
    saving.current = true; setBusy(true); setError('')
    try {
      if (nativeReference) {
        onCreated(await platformRequest('/apis', nativeReference))
        return
      }
      const operations = [], ids = new Set()
      for (const [index, operation] of form.operations.entries()) {
        let targetView = 'base'
        try {
          for (const [key, label] of [['title', '接口名称'], ['id', '接口 ID'], ['description', '接口说明'], ['url', '目标地址']]) {
            if (!operation[key].trim()) throw Error('请填写' + label)
          }
          if (!idPattern.test(operation.id.trim())) throw Error('接口 ID 须以小写字母开头，使用小写字母、数字或下划线，最长 24 位')
          if (ids.has(operation.id.trim())) throw Error('接口 ID 重复，请使用不同的 ID')
          ids.add(operation.id.trim())
          let url
          try { url = new URL(operation.url.trim()) } catch { throw Error('请填写有效的 HTTP(S) 目标地址') }
          if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw Error('目标地址须使用 HTTP(S)，认证信息请放在请求头中')
          const parsed = {}
          for (const [key, label, tab] of jsonFields) {
            targetView = tab
            try { parsed[key] = JSON.parse(operation[key]) } catch { throw Error(label + ' 格式错误') }
          }
          operations.push({ id: operation.id.trim(), title: operation.title.trim(), description: operation.description.trim(),
            readOnly: operation.readOnly, url: operation.url.trim(), ...parsed })
        } catch (error) {
          setActive(index); setView(targetView)
          throw Error('接口 ' + (index + 1) + ' · ' + error.message)
        }
      }
      const catalog = await platformRequest('/apis', {
        schemaVersion: 1, id: form.id.trim(), title: form.title.trim(), description: form.description.trim(), version: form.version.trim(), operations,
      })
      onCreated(catalog)
    } catch (error) { setError(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  const field = (data, change, key, label, props = {}) => h('label', { key, className: 'memory-field' }, label,
    h('input', { required: true, disabled: busy, ...props, value: data[key], onChange: event => change(key, event.target.value) }))
  const idProps = { pattern: '[a-z][a-z0-9_]{0,23}', maxLength: 24, title: '小写字母开头，使用小写字母、数字或下划线，最长 24 位' }
  const operation = form.operations[active]
  return h('dialog', { ref, className: 'memory-dialog platform-add-api', 'aria-labelledby': 'platform-add-api-title',
    onCancel: event => { event.preventDefault(); if (!saving.current) onClose() } },
    h('header', { className: 'memory-dialog-head' }, h('div', null, h('p', null, 'DSH 原生注册 / HTTP POST · 接入规范 v1'), h('h2', { id: 'platform-add-api-title' }, '接入 API')),
      h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭接入 API', disabled: busy, onClick: onClose }, '×')),
    h('form', { id: 'platform-add-api-form', className: 'memory-dialog-body platform-api-form', onSubmit: submit },
      h('div', { className: 'platform-import-bar' },
        h('input', { ref: fileRef, type: 'file', accept: '.json,application/json', hidden: true, disabled: busy, onChange: importFile, 'aria-label': '选择 API 接入 JSON 文件' }),
        h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => fileRef.current.click() }, '导入 JSON'),
        h('span', { className: 'fish-muted' }, '选择 AI 生成的 big-fish-api.json，自动填入全部接口。')),
      pendingImport ? h('section', { className: 'platform-import-setup' },
        h('h3', null, '补充连接信息'), h('p', { className: 'fish-muted' }, pendingImport.definition.title + ' · ' + pendingImport.definition.operations.length + ' 个接口，统一填写一次即可。'),
        pendingImport.needsOrigin ? field({ origin: importOrigin }, (_, value) => setImportOrigin(value), 'origin', '插件所在 DSH 地址', { type: 'url', placeholder: 'http://127.0.0.1:端口' }) : null,
        pendingImport.needsToken ? field({ token: importToken }, (_, value) => setImportToken(value), 'token', '插件 Token（只粘贴值）', { type: 'password', autoComplete: 'off' }) : null,
        h('div', { className: 'memory-actions' }, h('button', { type: 'button', className: 'fish-button fish-primary', onClick: completeImport, disabled: busy }, '填入表单'),
          h('button', { type: 'button', className: 'fish-button', onClick: () => { setPendingImport(null); setImportToken(''); setError('') }, disabled: busy }, '取消导入'))) : null,
      nativeReference ? h('section', { className: 'platform-import-setup' },
        h('h3', null, 'DSH 原生接口'), h('code', null, nativeReference.id),
        h('p', { className: 'fish-muted' }, '引用同一 DSH 中已启用的插件，无需地址或 Token。接入后需启用并授权会话。'),
        h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { setNativeReference(null); setError('') } }, '取消导入')) : null,
      h('fieldset', { className: 'platform-api-manual', disabled: busy || Boolean(nativeReference), hidden: Boolean(nativeReference) },
      h('section', { className: 'platform-api-provider' }, h('h3', null, '提供方信息'),
        h('div', { className: 'platform-api-fields' }, field(form, changeProvider, 'title', '名称', { autoFocus: true }),
          field(form, changeProvider, 'id', '提供方 ID', idProps), field(form, changeProvider, 'version', '版本'), field(form, changeProvider, 'description', '提供方说明'))),
      h('div', { className: 'platform-api-workspace' },
        h('aside', { className: 'platform-api-sidebar' },
          h('div', { className: 'platform-api-list-head' }, h('h3', null, '接口列表'), h('span', { className: 'fish-muted' }, form.operations.length + ' 个')),
          h('nav', { className: 'platform-api-list', 'aria-label': '接口列表' },
            ...form.operations.map((item, index) => h('button', { key: index, type: 'button', 'aria-label': '编辑接口 ' + (index + 1),
              'aria-pressed': active === index, disabled: busy, onClick: () => setActive(index) },
              h('strong', null, item.title || '接口 ' + (index + 1)), h('span', null, item.id || '未填写 ID')))),
          h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: addOperation }, '+ 添加接口')),
        h('section', { className: 'platform-api-editor', 'aria-label': '当前接口编辑器' },
          h('div', { className: 'platform-api-editor-head' },
            h('nav', { className: 'platform-api-tabs', 'aria-label': '接口填写内容' },
              ...[['base', '基本信息'], ['input', '请求 Schema'], ['output', '返回 Schema'], ['examples', '示例与认证']].map(([key, label]) =>
                h('button', { key, type: 'button', className: 'fish-button', 'aria-pressed': view === key, disabled: busy, onClick: () => setView(key) }, label))),
            h('button', { type: 'button', className: 'fish-button fish-danger', disabled: busy || form.operations.length === 1, onClick: removeOperation }, '移除此接口')),
          h('div', { className: 'platform-api-pane' },
            view === 'base' ? h('div', { className: 'platform-api-base' },
              h('div', { className: 'platform-api-fields' }, field(operation, changeOperation, 'title', '接口名称'), field(operation, changeOperation, 'id', '接口 ID', idProps)),
              field(operation, changeOperation, 'description', '接口说明'),
              field(operation, changeOperation, 'url', '目标地址', { type: 'url', placeholder: 'https://your-service.example/api/action' }),
              h('label', { className: 'platform-api-readonly' }, h('input', { type: 'checkbox', disabled: busy, checked: operation.readOnly, onChange: event => changeOperation('readOnly', event.target.checked) }), '此接口只读'),
              h('p', { className: 'fish-muted' }, '发送 POST JSON，远端成功结果须为 {"ok":true,"data":…}。'))
            : h('div', { className: 'platform-api-json' },
              ...jsonFields.filter(([, , tab]) => tab === view).map(([key, label]) => h('label', { key, className: 'memory-field' }, label,
                h('textarea', { required: true, disabled: busy, spellCheck: false, value: operation[key], onChange: event => changeOperation(key, event.target.value) }))),
              h('p', { className: 'fish-muted' }, view === 'examples' ? '认证请求头仅保存在本机配置中。无需认证时填写 {}。' : 'Schema 遵循 v1 规范。返回 Schema 描述成功结果中的 data。'))))))),
    h('footer', { className: 'memory-dialog-foot' },
      error ? h('p', { role: 'alert', className: 'memory-feedback' }, error) : null,
      h('div', { className: 'platform-api-actions' }, h('span', { className: 'fish-muted' }, nativeReference ? '从已安装插件载入接口，接入开关与会话授权保持当前设置。' : form.operations.length + ' 个接口将保存到同一张卡片，创建后开启接入并授权会话。'),
        h('button', { form: 'platform-add-api-form', type: 'submit', className: 'fish-button fish-primary', disabled: busy || Boolean(pendingImport) }, busy ? '接入中…' : '确认接入'))))
}

const PLATFORM_GUIDE_EXAMPLE = {
  openapi: '3.1.0',
  info: { title: '大肥鱼开放平台', version: '1.0.0' },
  paths: {
    '/dsh-big-fish-aio/open-platform/invoke/my_plugin/read': {
      post: {
        operationId: 'big_fish_my_plugin_read', tags: ['我的插件'], summary: '查询记录', description: '读取记录，返回 items。',
        'x-big-fish-read-only': true, 'x-big-fish-session-isolation': true,
        parameters: [{ in: 'header', name: 'X-Big-Fish-Session', required: false,
          description: '已登录管理请求可指定已授权会话，省略时使用 @local。模型会话由宿主确定。', schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': {
          schema: { type: 'object', properties: {}, required: [], additionalProperties: false }, example: {},
        } } },
        responses: { 200: { description: '检查 ok，成功读取 data，失败读取 error。', content: { 'application/json': {
          schema: {
            type: 'object', required: ['ok', 'requestId', 'durationMs'],
            properties: {
              ok: { type: 'boolean' },
              data: { type: 'object', required: ['items'], additionalProperties: false, properties: {
                items: { type: 'array', items: { type: 'object', required: ['id', 'text', 'isOwner'], additionalProperties: false,
                  properties: { id: { type: 'string' }, text: { type: 'string' }, isOwner: { type: 'boolean' } } } },
              } },
              error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } },
              requestId: { type: 'string' }, durationMs: { type: 'integer' },
            },
          },
          example: { ok: true, data: { items: [{ id: 'note-1', text: '明天买牛奶', isOwner: true }] }, requestId: '00000000-0000-4000-8000-000000000001', durationMs: 3 },
        } } } },
      },
    },
  },
}

function PlatformGuideTable({ label, rows, columns = ['字段', '类型', '要求', '作用与约束', '示例'] }) {
  return h('div', { className: 'fish-table-wrap platform-guide-table', role: 'region', 'aria-label': label, tabIndex: 0 },
    h('table', { className: 'fish-table' },
      h('caption', null, label),
      h('thead', null, h('tr', null, ...columns.map(column => h('th', { key: column, scope: 'col' }, column)))),
      h('tbody', null, ...rows.map((row, index) => h('tr', { key: index },
        ...row.map((cell, column) => column === 0
          ? h('th', { key: column, scope: 'row' }, h('code', null, cell))
          : h('td', { key: column }, cell)))))))
}

function PlatformGuide({ onClose }) {
  const ref = React.useRef(null)
  const query = PLATFORM_GUIDE_EXAMPLE.paths[OPEN_PLATFORM_PATH + '/invoke/my_plugin/read'].post
  React.useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  return h('dialog', { ref, className: 'memory-dialog platform-guide', 'aria-labelledby': 'platform-guide-title', onCancel: event => { event.preventDefault(); onClose() } },
    h('header', { className: 'memory-dialog-head' }, h('div', null, h('p', null, '开发参考 · 接入规范 v1'), h('h2', { id: 'platform-guide-title' }, '接入规范与 OpenAPI')),
      h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭接入规范与 OpenAPI', onClick: onClose, autoFocus: true }, '×')),
    h('div', { className: 'memory-dialog-body platform-guide-body' },
      h('div', { className: 'platform-guide-sections' },
        h('section', null, h('h3', null, '接入文件与注册'),
          h(PlatformGuideTable, { label: 'big-fish-api.json · 原生引用文件', rows: [
            ['schemaVersion', 'integer', '必填', '接入文件规范版本，固定为 1', '1'],
            ['transport', 'string', '必填', '同一 DSH 内通过原生服务注册', 'dsh'],
            ['id', 'string', '必填', '匹配已安装插件的提供方 ID', 'my_plugin'],
          ] }),
          h(PlatformCode, { title: 'big-fish-api.json', value: { schemaVersion: 1, transport: 'dsh', id: 'my_plugin' } }),
          h(PlatformGuideTable, { label: '注册与接入流程', columns: ['调用／操作', '作用', '实现要求'], rows: [
            ['ctx.inject(["bigFishOpenPlatform"], callback)', '服务就绪后注册，启停时随依赖重建', '使用可选服务注入，插件自身可独立运行'],
            ['platformCtx.effect(() => service.register(manifest))', '持有并回收 register 返回的注销函数', 'service 为 platformCtx.bigFishOpenPlatform'],
            ['getSessionIsolation(providerId)', '读取平台当前隔离开关', '插件面板只展示状态，平台不可用时按开启隔离处理'],
            ['导出 API 配置', '下载本插件的三字段引用文件', '按钮放在插件面板刷新按钮左侧，复用面板鉴权'],
            ['导入 JSON → 确认接入', '引用已注册的接口与 Schema', '同一 DSH 启用插件和大肥鱼，无需填写地址或 Token'],
            ['开启接入 → 授权会话', '让目标会话获得模型工具', '默认关闭接入、授权为空，只允许绑定工作区内的 QQ 映射会话'],
          ] }),
          h('p', { className: 'fish-muted' }, '文件最大 64 KB，仅含上述三字段。完整插件代码可使用「AI 开发 prompt」生成。')),
        h('section', null, h('h3', null, '提供方与接口字段'),
          h(PlatformGuideTable, { label: '原生 manifest · 一个插件注册一个提供方', rows: [
            ['schemaVersion', 'integer', '必填', '注册清单规范版本', '1'],
            ['id', 'string', '必填', '提供方唯一标识，升级保留', 'my_plugin'],
            ['title', 'string', '必填', '卡片名称与接口分组名称', '我的插件'],
            ['description', 'string', '必填', '说明插件对外提供的能力', '查询插件记录'],
            ['version', 'string', '必填', '提供方自身的接口版本', '1.0.0'],
            ['supportsSessionIsolation', 'boolean', '可选', '存储层实现隔离后设为 true，平台显示隔离开关并提供 isolation 上下文', 'true'],
            ['operations', 'array', '必填', '同一提供方全部接口，数组非空', '[{ id: "read", … }]'],
            ['operations[].id', 'string', '必填', '提供方内唯一，组成调用路径与工具名', 'read'],
            ['operations[].title', 'string', '必填', '接口列表名称与 OpenAPI summary', '查询记录'],
            ['operations[].description', 'string', '必填', '向模型说明接口用途与调用条件', '读取记录，返回 items'],
            ['operations[].readOnly', 'boolean', '必填', 'true 表示查询，处理器应只读数据，写入填 false', 'true'],
            ['operations[].inputSchema', 'object', '必填', '业务参数 Schema，根类型为 object', '{ type: "object", … }'],
            ['operations[].outputSchema', 'object', '必填', 'handler 成功返回的数据 Schema，对应响应 data', '{ type: "object", … }'],
            ['operations[].example', '输入数据', '可选', '符合 inputSchema 的请求示例，省略时按空对象校验', '{}'],
            ['operations[].handler', 'function', '必填', '接收 input、execution，返回成功数据，失败抛错', 'async (input, execution) => data'],
          ] }),
          h('p', { className: 'fish-muted' }, '提供方与接口 ID 均匹配 ^[a-z][a-z0-9_]{0,23}$。handler 直接调用插件业务方法，原生引用文件只负责导入。'),
          h(PlatformGuideTable, { label: '外部 HTTP 清单 · 手动接入时的接口字段', rows: [
            ['operations[].url', 'string', '必填', 'HTTP(S) 目标地址，平台禁止重定向', 'https://api.example.com/notes/read'],
            ['operations[].headers', 'object', '可选', '静态认证请求头，默认空对象，Content-Type 由平台填写，禁用 Host 和连接控制头', '{}'],
          ] }),
          h('p', { className: 'fish-muted' }, 'HTTP 清单根字段为 schemaVersion、id、title、description、version、operations。接口的名称、Schema 和 example 沿用上表，平台将 url 与 headers 映射为调用处理器。')),
        h('section', null, h('h3', null, 'Schema 数据格式'),
          h(PlatformGuideTable, { label: '注册校验支持的 JSON Schema 子集', rows: [
            ['type', 'string', '必填', '支持 object、array、string、number、integer、boolean、null', 'object'],
            ['properties', 'object', 'object 必填', '为每个对象字段声明子 Schema', '{ text: { type: "string" } }'],
            ['required', 'string[]', '可选', '必填字段名须已在 properties 中声明', '["text"]'],
            ['additionalProperties', 'boolean', 'object 必填', '固定 false，拒绝未声明字段', 'false'],
            ['items', 'object', 'array 必填', '数组每一项的 Schema', '{ type: "string" }'],
            ['enum', '标量数组', '可选', '允许值列表非空，每个选项为标量', '["todo", "done"]'],
            ['minLength', 'integer', 'string 可选', '最少 Unicode 码点数，非负整数', '1'],
            ['maxLength', 'integer', 'string 可选', '最多 Unicode 码点数，不小于 minLength', '2000'],
            ['title', 'string', '可选注释', '字段显示名称', '备忘内容'],
            ['description', 'string', '可选注释', '向开发者与模型解释字段', '需要保存的文本'],
            ['default', '数据值', '可选注释', '默认值说明，实际补值由业务处理', 'todo'],
            ['examples', 'array', '可选注释', '字段示例，区别于接口的请求 example', '["明天买牛奶"]'],
          ] }),
          h('p', { className: 'fish-muted' }, '输入和成功数据均校验，嵌套最多 12 层。integer 须为安全整数，number 须为有限数值。$ref、oneOf、format、minimum 等字段会被拒绝。')),
        h('section', null, h('h3', null, '执行上下文与会话权限'),
          h(PlatformGuideTable, { label: 'handler(input, execution) · 第二个参数由平台提供', rows: [
            ['signal', 'AbortSignal', '平台提供', '向后续异步操作传递取消与 15 秒超时', 'execution.signal'],
            ['requestId', 'string', '平台提供', '关联本次调用的 UUID', 'execution.requestId'],
            ['source', 'string', '平台提供', '区分模型调用与已登录管理调用', 'model / test'],
            ['sessionId', 'string', '按调用来源', '模型调用来自宿主，管理调用可用已授权会话请求头指定', 'execution.sessionId'],
            ['isOwner', 'boolean', '平台提供', '已核验本轮只有主人发言为 true，非主人、混合或未知来源为 false，管理页手工调用为 true', 'execution.isOwner'],
            ['isolation', '冻结对象', '声明隔离能力后', '可信存储访问上下文，缺少时拒绝会话业务调用', 'execution.isolation'],
            ['isolation.enabled', 'boolean', '上下文提供', '平台卡片隔离开关，默认开启', 'true'],
            ['isolation.sessionId', 'string', '上下文提供', '新建记录保存的归属，本机管理范围为 @local', 'session-demo-001'],
            ['isolation.assertCurrent()', 'function', '存储层调用', '复核授权、消息来源、隔离设置与取消状态', '排队、读取后、返回前、原子提交前'],
          ] }),
          h(PlatformGuideTable, { label: '存储层权限矩阵', columns: ['场景', '可访问范围', '实现要求'], rows: [
            ['隔离开启', '当前 isolation.sessionId 的记录', '先过滤再搜索、排序、计数与分页，按 ID 读取、修改、完成和删除均校验归属'],
            ['隔离关闭', '获授权会话共享读写记录', '保留所有原归属，新记录继续写入实际 sessionId，再开启时恢复隔离'],
            ['QQ 主人', '遵守同一套隔离规则', 'isOwner 记录来源，访问范围由会话隔离决定'],
            ['面板／页面测试', '@local 本机范围', '已登录面板手工新建 isOwner=true，隔离关闭时采用共享范围'],
            ['旧记录未知归属', '@local 本机待整理范围', '保留原数据，采用明确的历史兼容策略'],
            ['调用上下文缺失', '拒绝会话业务调用', '缺少 isolation 或布尔 isOwner 时提示升级'],
            ['授权或隔离变化', '中止在途操作', '检查 signal 与 assertCurrent()，原子提交前再次复核'],
            ['其他 HTTP 入口', '按远端自身的认证和权限处理', '通用 HTTP 清单仅转发业务参数，未传递原生 isolation、isOwner 协议'],
          ] }),
          h('p', { className: 'fish-muted' }, '模型参数仅填写业务内容。归属从 execution.isolation.sessionId 取得，来源从 execution.isOwner 取得，幂等键始终按会话区分。')),
        h('section', null, h('h3', null, '记录格式与数据示例'),
          h(PlatformGuideTable, { label: '示例插件内部记录 · 与模型请求体分开定义', rows: [
            ['id', 'string', '业务定义', '记录主键，读取与修改时校验会话归属', 'note-1'],
            ['text', 'string', '业务定义', '示例业务字段，遵循插件自身 Schema', '明天买牛奶'],
            ['sessionId', 'string', '隔离实现要求', '创建时保存可信会话，修改时保留原归属', 'session-demo-001'],
            ['isOwner', 'boolean', '来源实现要求', '新建保存平台值，手工新建默认 true，查询返回原标记，修改与完成保留创建时标记', 'true'],
            ['idempotencyKey', 'string', '业务可选', '同一会话内相同键与内容只提交一次，相同键对应不同内容时拒绝', 'note-demo-001'],
          ] }),
          h(PlatformCode, { title: '插件持久化记录示例', value: {
            id: 'note-1', text: '明天买牛奶', sessionId: 'session-demo-001', isOwner: true, idempotencyKey: 'note-demo-001',
          } }),
          h('p', { className: 'fish-muted' }, '示例查询只返回 id、text、isOwner。旧记录缺少 isOwner 时若按 true 兼容，应说明该值无法还原历史发送者。')),
        h('section', null, h('h3', null, 'OpenAPI 文档字段'),
          h(PlatformGuideTable, { label: '平台依据同一份原生清单生成 OpenAPI 3.1', rows: [
            ['openapi', 'string', '文档版本', 'OpenAPI 描述格式版本', '3.1.0'],
            ['info.title', 'string', '文档信息', '平台接口文档标题', '大肥鱼开放平台'],
            ['info.version', 'string', '文档信息', '接口文档的版本标识', '1.0.0'],
            ['paths', 'object', '路径集合', '按调用路径收录已注册接口', '/…/invoke/my_plugin/read'],
            ['paths[path].post', 'object', '操作定义', '声明该路径使用 POST JSON 调用', '{ operationId, … }'],
            ['post.operationId', 'string', '操作标识', '与模型工具名对应', 'big_fish_my_plugin_read'],
            ['post.tags', 'string[]', '接口分组', '来自提供方 title', '["我的插件"]'],
            ['post.summary', 'string', '接口名称', '来自 operations[].title', '查询记录'],
            ['post.description', 'string', '接口说明', '来自 operations[].description', '读取记录，返回 items'],
            ['post.x-big-fish-read-only', 'boolean', '平台扩展', '对应接口 readOnly 标记', 'true'],
            ['post.x-big-fish-session-isolation', 'boolean', '平台扩展', '文档生成时的当前隔离开关状态', 'true'],
            ['post.parameters', 'array', '支持隔离时', '描述可选的已登录管理请求头', '[{ in, name, … }]'],
            ['parameters[].in', 'string', '参数位置', '会话选择放在 HTTP 请求头', 'header'],
            ['parameters[].name', 'string', '参数名', '平台校验目标会话属于已授权绑定工作区', 'X-Big-Fish-Session'],
            ['parameters[].required', 'boolean', '是否必填', '省略时，适配隔离的接口使用本机 @local 范围', 'false'],
            ['parameters[].description', 'string', '参数说明', '解释管理用途与默认范围', '指定已授权会话'],
            ['parameters[].schema', 'object', '参数类型', '请求头的类型约束', '{ type: "string" }'],
            ['post.requestBody.required', 'boolean', '请求体要求', '无业务参数时传空对象', 'true'],
            ['requestBody.content.application/json.schema', 'object', '输入格式', '映射原生 inputSchema', '{ type: "object", … }'],
            ['requestBody.content.application/json.example', '输入数据', '请求示例', '映射原生 example', '{}'],
            ['post.responses.200.description', 'string', '状态说明', '业务执行结果用 ok 区分成功与失败', '检查 ok、data、error'],
            ['responses.200.content.application/json.schema', 'object', '响应格式', '统一外层包裹 outputSchema 对应的 data', '{ properties: { ok, data, … } }'],
            ['responses.200.content.application/json.example', '响应数据', '文档示例', '本页为单个接口提供合成成功结果', '{ ok: true, data: … }'],
          ] }),
          h(PlatformCode, { title: 'my_plugin/read · 单个接口 OpenAPI 示例', value: PLATFORM_GUIDE_EXAMPLE })),
        h('section', null, h('h3', null, '调用与响应格式'),
          h(PlatformGuideTable, { label: '平台 HTTP 管理接口 · 路径前缀 /dsh-big-fish-aio/open-platform', columns: ['方法与相对路径', '功能', '输入／结果'], rows: [
            ['GET /catalog', '读取接口目录、接入状态与有效会话授权', '返回 providers、sessions、workspaceId'],
            ['GET /openapi.json', '生成全部已注册接口的 OpenAPI 3.1 文档', '返回 openapi、info、paths'],
            ['POST /apis', '导入原生引用或外部 HTTP 清单', '原生引用为 schemaVersion、transport、id'],
            ['POST /connect', '保存接入、会话授权与隔离设置', 'providerId、enabled、sessionIds，可选 sessionIsolation'],
            ['POST /remove', '移除非内置卡片并撤销授权，保留配置与业务数据', 'providerId，恢复需重新导入和授权'],
            ['POST /invoke/{providerId}/{operationId}', '调用指定处理器', '业务参数 → 统一响应'],
          ] }),
          h(PlatformGuideTable, { label: '查询接口调用约定', columns: ['项目', '值／限制', '说明'], rows: [
            ['Method', 'POST', '管理入口与模型工具共用同一处理器'],
            ['Path', OPEN_PLATFORM_PATH + '/invoke/my_plugin/read', '路径由 providerId 与 operationId 组成'],
            ['Content-Type', 'application/json', '请求体为 inputSchema 描述的对象'],
            ['管理鉴权', 'DSH 本人登录态及同源校验', '原生导入无需额外填写 Token'],
            ['模型权限', '接入开启 + 会话授权', '仅授权绑定工作区内的 QQ 映射会话'],
            ['请求体大小', '最多 64 KB', '参数错误返回 ok=false'],
            ['执行时限', '15 秒', '传递 signal，写入超时后核对结果再重试'],
            ['业务结果', 'HTTP 200', '成功与业务失败均需读取 ok'],
            ['管理报文错误', '4xx 或 503', '读取 error.message，可能没有 requestId 与 durationMs'],
            ['外部 HTTP API', 'POST JSON，远端成功返回 {ok:true,data:…}', '沿用远端认证，远端响应上限 1 MB'],
          ] }),
          h(PlatformGuideTable, { label: '响应外层及示例接口成功数据', rows: [
            ['ok', 'boolean', '始终返回', '本次调用是否成功', 'true / false'],
            ['data', 'outputSchema 对应类型', '成功时', 'handler 直接返回的业务数据', '{ items: […] }'],
            ['error', 'object', '失败时', '平台或管理入口的错误详情', '{ code, message }'],
            ['error.code', 'string', '业务调用失败时', '当前平台统一业务错误代码', 'CALL_FAILED'],
            ['error.message', 'string', '失败时', '错误原因，管理报文错误也提供此字段', '此会话未获接口授权或已离开绑定工作区'],
            ['requestId', 'string', '业务结果必有', '本次调用的 UUID', '00000000-0000-4000-8000-000000000001'],
            ['durationMs', 'integer', '业务结果必有', '调用耗时，单位毫秒', '3'],
            ['data.items', 'array', '本示例成功时', '查询返回的可见记录', '[{ id, text, isOwner }]'],
            ['data.items[].id', 'string', '本示例每项必有', '记录 ID', 'note-1'],
            ['data.items[].text', 'string', '本示例每项必有', '记录内容', '明天买牛奶'],
            ['data.items[].isOwner', 'boolean', '本示例每项必有', '记录创建时保存的来源标记', 'true'],
          ] }),
          h('div', { className: 'platform-guide-examples' },
            h(PlatformCode, { title: '请求体 · application/json', value: query.requestBody.content['application/json'].example }),
            h(PlatformCode, { title: '成功响应 · HTTP 200', value: query.responses[200].content['application/json'].example }),
            h(PlatformCode, { title: '失败响应 · HTTP 200', value: {
              ok: false, error: { code: 'CALL_FAILED', message: '此会话未获接口授权或已离开绑定工作区' },
              requestId: '00000000-0000-4000-8000-000000000002', durationMs: 1,
            } }))))))
}

function PlatformPrompt({ onClose, notify }) {
  const dialogRef = React.useRef(null)
  const textRef = React.useRef(null)
  React.useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PLATFORM_PLUGIN_PROMPT)
      notify('Prompt 已复制。')
    } catch {
      textRef.current?.focus()
      textRef.current?.select()
      notify('复制失败，已选中全文，请手动复制。')
    }
  }
  return h('dialog', { ref: dialogRef, className: 'memory-dialog platform-prompt', 'aria-labelledby': 'platform-prompt-title',
    onCancel: event => { event.preventDefault(); onClose() } },
    h('header', { className: 'memory-dialog-head' }, h('h2', { id: 'platform-prompt-title' }, 'AI 开发 prompt'),
      h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭 AI 开发 prompt', onClick: onClose, autoFocus: true }, '×')),
    h('div', { className: 'memory-dialog-body platform-prompt-body' },
      h('p', { className: 'fish-muted' }, '复制后填写业务需求，交给 DSH 中的 AI 生成插件。'),
      h('textarea', { ref: textRef, readOnly: true, spellCheck: false, value: PLATFORM_PLUGIN_PROMPT, 'aria-label': 'AI 开发 prompt 全文' })),
    h('footer', { className: 'memory-dialog-foot' },
      h('button', { type: 'button', className: 'fish-button fish-primary', onClick: copy }, '复制 Prompt')))
}

function OpenPlatform({ notify, revealSchedule }) {
  const [catalog, setCatalog] = React.useState(null)
  const [error, setError] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [guideOpen, setGuideOpen] = React.useState(false)
  const [promptOpen, setPromptOpen] = React.useState(false)
  const [apiOpen, setApiOpen] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const refreshInFlight = React.useRef(false)
  const refresh = async () => {
    if (refreshInFlight.current) return
    refreshInFlight.current = true
    setRefreshing(true)
    try { setCatalog(await platformRequest('/catalog')); setError('') }
    catch (error) { setError(error.message) }
    finally { refreshInFlight.current = false; setRefreshing(false) }
  }
  React.useEffect(() => { refresh() }, [])
  const hasSchedule = catalog?.providers?.some(provider => provider.id === 'schedule')
  React.useEffect(() => {
    if (!revealSchedule || !hasSchedule) return
    setQuery('')
    return flashJumpTarget('fish-platform-card-schedule')
  }, [revealSchedule, hasSchedule])
  const providers = (catalog?.providers || []).filter(provider => (provider.title + provider.description + provider.operations.map(operation => operation.title).join(' ')).toLowerCase().includes(query.toLowerCase()))
  return h('div', { className: 'platform-page' },
    h('div', { className: 'platform-toolbar' },
      h(FishRefreshButton, { onClick: refresh, busy: refreshing, label: '刷新接口目录' }),
      h('button', { className: 'fish-button', type: 'button', onClick: () => setGuideOpen(true) }, '接入规范与 OpenAPI'),
      h('button', { className: 'fish-button', type: 'button', onClick: () => setPromptOpen(true) }, 'AI 开发 prompt'),
      h('button', { className: 'fish-button fish-primary platform-add-button', type: 'button', onClick: () => setApiOpen(true) }, '+ 接入 API')),
    apiOpen ? h(PlatformAddApi, { apiOrigin: catalog?.apiOrigin || '', onClose: () => setApiOpen(false), onCreated: value => { setCatalog(value); setQuery(''); setApiOpen(false); notify('API 已载入，可在卡片配置接入与会话授权。') } }) : null,
    guideOpen ? h(PlatformGuide, { onClose: () => setGuideOpen(false) }) : null,
    promptOpen ? h(PlatformPrompt, { onClose: () => setPromptOpen(false), notify }) : null,
    error ? h('p', { role: 'alert', className: 'memory-feedback' }, error) : null,
    catalog?.warning ? h('p', { role: 'alert', className: 'memory-feedback' }, catalog.warning) : null,
    h('label', { className: 'memory-field' }, '搜索接口', h('input', { type: 'search', value: query, onChange: event => setQuery(event.target.value), placeholder: '插件名称、功能或接口名称' })),
    h('div', { className: 'platform-providers' }, ...providers.map(provider => h(PlatformProvider, { key: provider.id, provider, sessions: catalog.sessions, onRefresh: setCatalog, notify }))),
    catalog && !providers.length ? h('div', { className: 'memory-empty' }, '无匹配接口。') : null)
}
