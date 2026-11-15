import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const panel = readFileSync(new URL('../src/panel.js', import.meta.url), 'utf8')
const updateLog = readFileSync(new URL('../src/update-log.js', import.meta.url), 'utf8')
const notifier = readFileSync(new URL('../src/update-notifier.js', import.meta.url), 'utf8')
const source = panel.slice(panel.indexOf('function UpdateArtwork('), panel.indexOf('\nfunction FileManager('))
const walk = node => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(walk)]
const flush = () => new Promise(resolve => setImmediate(resolve))

test('正式渠道直接切换，内测先提示再确认切换，Token 支持失败重试和取消', async () => {
  const notices = []
  const states = [], refs = [], effectDeps = [], cleanups = [], calls = [], confirmations = [], versions = []
  let stateCursor = 0, refCursor = 0, effectCursor = 0, effects = []
  let pendingCheck = null, pendingInstall = null
  let installedChannel = 'mirror', confirm = false, betaFailure = true, betaConfigured = false
  const h = (type, props, ...children) => ({ type, props, children })
  const sandbox = {
    setTimeout: () => 1, clearTimeout() {},
    h, META: { upstreamCompatibility: [] }, FishSelect: function FishSelect() {}, FishModal() {}, Glyph() {}, link: h,
    标记更新后重开() {}, 清除更新后重开() {}, 重开面板() {},
    React: {
      useState(initial) {
        const index = stateCursor++
        if (!(index in states)) states[index] = initial
        return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next }]
      },
      useRef(initial) { const index = refCursor++; return refs[index] ||= { current: initial } },
      useEffect(effect, deps) {
        const index = effectCursor++
        if (!effectDeps[index] || deps.some((value, i) => value !== effectDeps[index][i])) effects.push({ index, effect })
        effectDeps[index] = deps
      },
    },
    fishAskConfirm: async options => { confirmations.push(options); return confirm },
    request: async (url, options = {}) => {
      const body = options.body ? JSON.parse(options.body) : {}
      calls.push({ url, body })
      if (url.includes('/update?') && pendingCheck) return new Promise(resolve => { pendingCheck.resolve = resolve })
      if (url.includes('/install-status')) return { ok: true, operationId: calls.filter(call => call.url.includes('/install?')).at(-1)?.body.operationId, progress: 50, message: '正在安装' }
      if (url.includes('/install?') && pendingInstall) return new Promise(resolve => { pendingInstall.resolve = resolve })
      if (url.includes('/beta') && betaFailure) throw Error('Token 验证失败')
      if (url.includes('/beta')) betaConfigured = true
      if (url.includes('/install?')) installedChannel = new URL(url, 'http://localhost').searchParams.get('channel')
      if (url.includes('/version')) return { ok: true, channel: installedChannel, installedChannel, betaConfigured, displayVersion: '0.5.1' }
      const channel = new URL(url, 'http://localhost').searchParams.get('channel')
      return { ok: true, latest: '0.5.1', hasUpdate: false, sourceChanged: channel !== installedChannel,
        switchRequired: (channel === 'mirror') !== (installedChannel === 'mirror'), canInstall: true, installedChannel, channel }
    },
  }
  vm.createContext(sandbox)
  vm.runInContext(notifier + '\n' + updateLog + '\n' + source + '\nglobalThis.UpdatesComponent = Updates', sandbox)
  const render = (versionChannel = 'mirror') => {
    stateCursor = 0; refCursor = 0; effectCursor = 0; effects = []
    const nodes = walk(sandbox.UpdatesComponent({ notify: (text, options) => { const item = { text, options, updates: [] }; notices.push(item); return { update: patch => item.updates.push(patch) } }, versionInfo: { channel: versionChannel, installedChannel, displayVersion: '0.5.26', repositoryVersion: '0.5.26', installedCommit: installedChannel === 'mirror' ? null : 'a'.repeat(40) }, onVersionInfo: info => versions.push(info) }))
    effects.forEach(({ index, effect }) => { cleanups[index]?.(); cleanups[index] = effect() })
    return nodes
  }
  const select = value => render().find(node => node.props?.id === 'fish-update-channel').props.onChange({ target: { value } })
  const button = name => render().find(node => node.type === 'button' && node.children.includes(name))
  render(); await flush()
  assert.deepEqual(render().find(node => node.props?.['aria-label'] === '当前安装版本').children, ['当前版本 v0.5.26'])
  const operations = render().find(node => node.props?.className === 'fish-update-operations')
  assert.deepEqual(walk(operations).filter(node => node.type === 'button').map(node => node.children.at(-1)), ['检查更新', '更新日志'])
  assert.ok(render().some(node => node.props?.className === 'fish-source-link' && node.children.includes('本项目仓库：')))
  assert.equal(render().some(node => node.children?.some(child => typeof child === 'string' && child.startsWith('当前安装来源'))), false)
  const options = walk(render().find(node => node.props?.id === 'fish-update-channel')).filter(node => node.type === 'option')
  assert.deepEqual(options.map(node => node.children.join('')), ['国内镜像', 'GitHub 仓库', '内测版'])
  select('github'); await flush(); render(); await flush()
  assert.equal(confirmations.length, 0)
  assert.equal(render().find(node => node.props?.id === 'fish-update-channel').props.value, 'github')
  await button('立即更新').props.onClick()
  assert.equal(confirmations[0].description, '是否切换项目拉取方式，可能会因为网络问题拉取失败')
  assert.equal(calls.filter(call => call.url.includes('/install?')).length, 0)
  confirm = true
  await button('立即更新').props.onClick()
  assert.equal(calls.find(call => call.url.includes('/install?')).body.confirmSourceChange, true)
  assert.equal(versions.at(-1).displayVersion, '0.5.1')
  assert.deepEqual(render().find(node => node.props?.['aria-label'] === '当前安装版本').children, ['当前版本 v0.5.26'])
  const progress = notices.find(item => item.options?.progress === 0)
  assert.ok(progress.updates.some(update => update.progress === 50))
  assert.equal(progress.updates.at(-1).progress, 100)

  confirm = false
  select('beta'); await flush()
  assert.equal(button('确认切换'), undefined)
  assert.equal(render().find(node => node.props?.id === 'fish-update-channel').props.value, 'github')
  confirm = true
  const channelCalls = calls.filter(call => call.url.includes('/channel')).length
  select('beta'); await flush()
  assert.equal(confirmations.at(-1).description, '此版本仅作为内部测试使用，未受邀请请勿使用')
  assert.equal(render().find(node => node.props?.id === 'fish-update-channel').props.value, 'github')
  assert.equal(calls.filter(call => call.url.includes('/channel')).length, channelCalls)
  assert.equal(confirmations.at(-1).confirmText, '确认切换')
  assert.equal(button('确认切换'), undefined)
  let nodes = render()
  assert.ok(nodes.some(node => node.props?.role === 'dialog'))
  const input = nodes.find(node => node.props?.id === 'fish-beta-token')
  assert.equal(input.props.type, 'password')
  assert.equal(input.props.autoComplete, 'off')
  input.props.onChange({ target: { value: 'github_pat_private_ui_test_12345' } })
  await render().find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  assert.ok(render().some(node => node.props?.role === 'alert' && node.children.includes('Token 验证失败')))
  assert.equal(render().find(node => node.props?.id === 'fish-update-channel').props.value, 'github')
  betaFailure = false
  await render().find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  nodes = render(); await flush()
  assert.equal(nodes.some(node => node.props?.role === 'dialog'), false)
  assert.equal(nodes.find(node => node.props?.id === 'fish-update-channel').props.value, 'beta')
  select('mirror'); await flush(); render(); await flush()
  select('beta'); await flush()
  assert.equal(confirmations.at(-1).confirmText, '确认切换')
  assert.equal(button('确认切换'), undefined)
  render(); await flush()
  assert.equal(render().some(node => node.props?.role === 'dialog'), false)
  assert.equal(render().find(node => node.props?.id === 'fish-update-channel').props.value, 'beta')
  assert.deepEqual(render().find(node => node.props?.['aria-label'] === '当前安装版本').children, ['当前版本 v0.5.26'])
  assert.equal(calls.filter(call => call.url.includes('/beta')).length, 2)
  assert.deepEqual(render().filter(node => node.type === 'th').map(node => node.children.join('')), ['项目名称', '原作者仓库', '整合时的原仓库版本'])
  const authCalls = calls.filter(call => call.url.includes('/beta')).length
  await flush()
  button('更新 Token').props.onClick()
  render().find(node => node.type === 'form').props.onKeyDown({ key: 'Escape' })
  assert.equal(render().some(node => node.props?.role === 'dialog'), false)
  assert.equal(calls.filter(call => call.url.includes('/beta')).length, authCalls)
  assert.equal(states.includes('github_pat_private_ui_test_12345'), false)

  const automatic = { ok: true, channel: 'beta', installedChannel: 'beta', latest: '0.5.1', hasUpdate: true, canInstall: true }
  sandbox.fishSetUpdateResult(automatic)
  assert.ok(render().some(node => node.props?.role === 'status' && node.children.includes('有新版本 v0.5.1')))
  assert.equal(button('立即更新').props.disabled, false, '自动检查后已打开的页面直接允许安装')
  sandbox.fishSetUpdateResult({ ...automatic, channel: 'mirror', hasUpdate: false })
  assert.ok(button('立即更新'), '其他渠道的检查结果不覆盖当前渠道')
  sandbox.fishSetUpdateResult(automatic)
  cleanups.forEach(cleanup => cleanup?.())
  states.length = 0; refs.length = 0; effectDeps.length = 0; cleanups.length = 0
  const checksBefore = calls.filter(call => call.url.includes('/update?')).length
  let reopened = render('beta')
  assert.ok(reopened.some(node => node.type === 'button' && node.children.includes('立即更新')))
  await flush()
  assert.equal(calls.filter(call => call.url.includes('/update?')).length, checksBefore, '重新打开复用自动检测结果')
  const installsBefore = calls.filter(call => call.url.includes('/install?')).length
  await button('立即更新').props.onClick()
  assert.equal(calls.filter(call => call.url.includes('/install?')).length, installsBefore + 1)
  assert.equal(calls.filter(call => call.url.includes('/update?')).length, checksBefore + 1, '安装前核验目标')
  assert.ok(button('检查更新'), '安装完成后清除可更新状态')
  assert.deepEqual(render().find(node => node.props?.['aria-label'] === '当前安装版本').children, ['当前版本 v0.5.26 · aaaaaaaa'])
  pendingCheck = {}
  const staleCheck = button('检查更新').props.onClick()
  sandbox.fishSetUpdateResult(automatic)
  assert.equal(button('立即更新').props.disabled, false)
  pendingCheck.resolve({ ...automatic, hasUpdate: false })
  await staleCheck
  pendingCheck = null
  assert.ok(button('立即更新'), '较早的检查响应不覆盖自动检测结果')
  pendingInstall = {}
  const installing = button('立即更新').props.onClick()
  await flush()
  sandbox.fishSetUpdateResult(automatic)
  assert.ok(render().some(node => node.type === 'button' && node.props['aria-label'] === '正在安装更新' && node.props.disabled))
  pendingInstall.resolve({ ok: true })
  await installing
  assert.ok(button('检查更新'))
})


test('更新贴纸解码完成后再交叉过渡，快速切换保持已有图片', async () => {
  const states = [], effects = []
  let cursor = 0
  const sandbox = { h: (type, props, ...children) => ({ type, props, children }), React: {
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value }] },
    useEffect(effect) { effects.push(effect) },
  } }
  vm.createContext(sandbox); vm.runInContext(source, sandbox)
  const render = outcome => { cursor = 0; effects.length = 0; const tree = sandbox.UpdateArtwork({ outcome }); effects.forEach(effect => effect()); return tree }
  let tree = render('idle')
  assert.equal(tree.props['data-outcome'], 'idle')
  assert.ok(walk(tree).some(node => node.props?.src?.endsWith('/sticker-update.png')))
  tree = render('success')
  assert.equal(tree.props['data-outcome'], 'idle')
  await walk(tree).find(node => node.props?.['data-artwork'] === 'success').props.onLoad({ currentTarget: { decode: async () => {} } })
  render('success'); tree = render('success')
  assert.equal(tree.props['data-outcome'], 'success')
  tree = render('failure')
  assert.equal(tree.props['data-outcome'], 'success')
  await walk(tree).find(node => node.props?.['data-artwork'] === 'failure').props.onLoad({ currentTarget: { decode: async () => {} } })
  render('failure'); assert.equal(render('failure').props['data-outcome'], 'failure')
})
