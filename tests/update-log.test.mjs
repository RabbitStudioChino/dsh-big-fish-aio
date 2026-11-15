import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
const source = readFileSync(new URL('../src/update-log.js', import.meta.url), 'utf8')
const target = { ok: true, channel: 'github', current: '1.0.0', latest: '1.1.0', releaseId: 'v1.1.0', latestCommit: 'b'.repeat(40), hasUpdate: true, canInstall: true }
const doc = version => ({ version, releaseId: 'v' + version, title: '版本 ' + version, publishedAt: '2026-11-11T10:00:00+08:00', summary: '概要', sections: [
  { id: 'empty', title: '空分类', items: [] },
  { id: 'important', title: '重要更新', items: [{ id: 'one', module: '工作台', title: '<script>纯文本</script>', description: '一\n二' }] },
  { id: 'unknown', title: '新的分类', items: [{ id: 'two', title: '条目二', links: [{ label: '不安全', url: 'javascript:alert(1)' }] }] },
] })
const walk = node => !node || typeof node !== 'object' ? [] : [node, ...(node.children || []).flat(Infinity).flatMap(walk)]
const flush = () => new Promise(resolve => setImmediate(resolve))
test('安装后日志分类、历史与编号，纯文本及关闭持久去重', async () => {
  const states = [], refs = [], deps = [], cleanup = [], effects = [], calls = []
  let cursor = 0, ref = 0, effect = 0, closed = 0, unavailable = false
  const sandbox = { URL, Date, AbortController, AbortSignal, fishNotify() {}, FISH_THEME_CSS: '', FISH_UPDATE: { dismissed: new Set() }, FishModal() {}, FishSelect() {},
    h: (type, props, ...children) => ({ type, props, children }),
    React: {
      useState(initial) { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value }] },
      useRef(initial) { return refs[ref++] ||= { current: initial } },
      useEffect(fn, values) { const i = effect++; if (!deps[i] || values.some((v, j) => deps[i][j] !== v)) effects.push(() => { cleanup[i]?.(); cleanup[i] = fn() }); deps[i] = values },
    },
    request: async (url, options = {}) => {
      calls.push({ url, options })
      if (url.includes('/changelog') && unavailable) throw Error('网络中断')
      if (url.includes('/reminder')) return { ok: true }
      if (url.includes('/releases')) return { ok: true, status: 'ready', releases: [{ releaseId: 'v1.0.0', title: '旧版' }] }
      const changelog = doc(url.includes('v1.0.0') ? '1.0.0' : '1.1.0')
      if (changelog.version === '1.0.0') changelog.sections = [{ id: 'empty', title: '空分类', items: [] }]
      return { ok: true, status: 'ready', changelog }
    },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.Component = UpdateLog', sandbox)
  const render = () => {
    cursor = 0; ref = 0; effect = 0; effects.length = 0
    const nodes = walk(sandbox.Component({ initial: { target: { ...target, postInstall: true } }, onClose: () => closed++ }))
    effects.forEach(fn => fn()); return nodes
  }
  render(); await flush()
  let nodes = render()
  assert.equal(nodes[0].props.className, 'big-fish fish-release-host')
  const theme = readFileSync(new URL('../src/theme.css', import.meta.url), 'utf8')
  assert.match(theme, /\.big-fish\.fish-release-host\s*\{\s*display:\s*contents;\s*\}/)
  assert.ok(nodes.some(n => n.children?.includes('<script>纯文本</script>')))
  assert.ok(nodes.some(n => n.props?.className === 'fish-release-description' && n.children.includes('一\n二')))
  assert.equal(nodes.some(n => n.type === 'button' && walk(n).some(child => child.children?.includes('空分类'))), false)
  const categories = nodes.find(n => n.props?.['aria-label'] === '更新日志分类')
  assert.deepEqual(walk(categories).filter(n => n.type === 'button').map(n => n.children[0].children[0]), ['重要更新', '新的分类'])
  assert.equal(nodes.some(n => n.children?.includes('工作台')), false)
  assert.equal(nodes.some(n => n.props?.className === 'fish-release-warning'), false)
  assert.ok(calls.some(call => call.url.includes('/releases')))
  const historySelect = () => nodes.find(n => n.props?.['aria-label'] === '历史版本')
  assert.equal(historySelect().props.value, 'v1.1.0')
  assert.equal(walk(historySelect()).filter(n => n.type === 'option').length, 2)
  nodes.find(n => n.type === 'button' && walk(n).some(child => child.children?.includes('新的分类'))).props.onClick()
  nodes = render(); assert.equal(nodes.find(n => n.type === 'ol').props.start, 2)
  assert.equal(nodes.some(n => n.type === 'a'), false)
  let focused, prevented = false
  const first = { tabIndex: 0, getClientRects: () => [1], focus: () => { focused = 'first' } }
  const last = { ...first, focus: () => { focused = 'last' } }
  nodes.find(n => n.props?.role === 'dialog').props.onKeyDown({ key: 'Tab', shiftKey: true, target: first, currentTarget: { querySelectorAll: () => [first, last] }, preventDefault: () => { prevented = true } })
  assert.equal(focused, 'last'); assert.equal(prevented, true)
  historySelect().props.onChange({ target: { value: 'v1.0.0' } })
  render(); await flush(); nodes = render()
  assert.ok(nodes.some(n => n.type === 'h3' && n.children.includes('版本 1.0.0')))
  assert.ok(nodes.some(n => n.children?.includes('此版本暂无更新条目')))
  assert.equal(walk(nodes.find(n => n.props?.['aria-label'] === '更新日志分类')).filter(n => n.type === 'button').length, 0)
  assert.equal(nodes.some(n => n.type === 'button' && n.children.some(text => typeof text === 'string' && text.startsWith('立即更新'))), false)
  assert.ok(nodes.some(n => n.children?.includes('GitHub 正式版 · 已安装 v1.1.0')))
  assert.equal(calls.find(call => call.url.includes('/changelog')).options.signal.aborted, true)
  unavailable = true
  historySelect().props.onChange({ target: { value: 'v1.1.0' } })
  render(); await flush(); nodes = render()
  assert.ok(nodes.some(n => n.type === 'p' && n.children.some(child => typeof child === 'string' && child.includes('网络中断'))))
  unavailable = false
  nodes.find(n => n.type === 'button' && n.children.includes('重试')).props.onClick()
  render(); await flush(); nodes = render()
  assert.ok(nodes.some(n => n.type === 'h3' && n.children.includes('版本 1.1.0')))
  nodes.find(n => n.props?.['aria-label'] === '关闭更新日志').props.onClick(); await flush()
  assert.equal(closed, 1)
  assert.equal(JSON.parse(calls.at(-1).options.body).targetId, 'github:1.1.0:' + 'b'.repeat(40))
  cleanup.forEach(fn => fn?.())
})
test('自动弹窗在窗口可见且其他模态框关闭后出队', () => {
  let hidden = true, modal = true, syncing = true, opened, pump, dispose, readinessListener
  const sandbox = { React: { useRef: () => ({ current: null }), useState: () => [null, value => { opened = value }], useEffect: fn => { dispose = fn() } },
    document: { body: {}, get visibilityState() { return hidden ? 'hidden' : 'visible' }, querySelector: () => modal ? {} : null, addEventListener() {}, removeEventListener() {} },
    MutationObserver: class { constructor(fn) { pump = fn } observe() {} disconnect() {} },
  }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.host = UpdateLogHost', sandbox)
  sandbox.fishOpenUpdateLog(target); sandbox.host({ readiness: { getSnapshot: () => ({ syncing }), subscribe: fn => { readinessListener = fn; return () => { readinessListener = null } } } })
  assert.equal(opened, undefined)
  hidden = false; pump(); assert.equal(opened, undefined)
  modal = false; pump(); assert.equal(opened, undefined, '宿主热更新尚未完成时不打开日志')
  syncing = false; readinessListener(); assert.equal(opened.target, target)
  dispose(); assert.equal(readinessListener, null)
})
test('共享安装器发现目标变化只刷新版本并提示再次确认，不提前弹日志', async () => {
  const calls = [], next = { ...target, latest: '1.2.0', releaseId: 'v1.2.0', latestCommit: 'c'.repeat(40) }
  const sandbox = { fishSetInstallOutcome() {}, fishNotify() {}, fishSetUpdateResult(value) { calls.push(value) }, request: async () => next }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.logs = FISH_LOG', sandbox)
  assert.equal(await sandbox.fishInstallUpdate(target), false)
  assert.equal(calls.length, 1); assert.equal(calls[0], next); assert.equal(sandbox.logs.pending, null)
})


test('安装成功与失败都发布贴纸状态，状态在客户端重载后恢复', async () => {
  const notifier = readFileSync(new URL('../src/update-notifier.js', import.meta.url), 'utf8')
  const saved = new Map()
  let failure = false
  const sandbox = { window: { sessionStorage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) } },
    fishNotify() {}, 标记更新后重开() {}, 清除更新后重开() {}, 重开面板() { throw Error('旧实例不得在更新成功后主动切页') }, setTimeout: () => 1, clearTimeout() {},
    request: async url => {
      if (url.includes('/update?')) return target
      if (url.includes('/install?') && failure) throw Error('安装失败')
      return { ok: true }
    },
  }
  vm.createContext(sandbox); vm.runInContext(notifier + '\n' + source + '\nglobalThis.state = FISH_UPDATE', sandbox)
  sandbox.fishSetUpdateResult(target)
  assert.equal(await sandbox.fishInstallUpdate(target), true)
  assert.equal(sandbox.state.result.installOutcome, 'success')
  const reloaded = vm.createContext({ window: sandbox.window })
  vm.runInContext(notifier + '\nglobalThis.state = FISH_UPDATE', reloaded)
  assert.equal(reloaded.state.installOutcome, 'success')
  failure = true
  await assert.rejects(sandbox.fishInstallUpdate(target), /安装失败/)
  assert.equal(sandbox.state.result.installOutcome, 'failure')
})

test('手动查看使用已安装版本与来源，不依赖待更新目标或联网检查', async () => {
  const calls = []
  const sandbox = { META: { version: '1.0.0' }, request: async url => {
    calls.push(url)
    return { version: '1.0.0', packageVersion: '1.0.0', installedChannel: 'beta', channel: 'mirror', installedCommit: 'a'.repeat(40) }
  } }
  vm.createContext(sandbox); vm.runInContext(source + '\nglobalThis.queue = FISH_LOG', sandbox)
  await sandbox.fishViewInstalledLog()
  assert.equal(sandbox.queue.pending.target.latest, '1.0.0')
  assert.equal(sandbox.queue.pending.target.releaseId, 'v1.0.0')
  assert.equal(sandbox.queue.pending.target.channel, 'beta')
  assert.deepEqual(calls, ['/dsh-big-fish-aio/version'])
})
