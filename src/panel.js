const React = require('react')
const h = React.createElement
const QQ = components['dsh-qq-link'].Section
const Memory = components['dsh-fish-memory'].Section
const Mood = components['dsh-feiyu-mood'].Section
const Speak = components['dsh-speak-up'].Section
const PANEL_ID = 'big-fish-aio'
const tabs = ['总览', 'QQ 互通', '长期记忆', '鱼的心情', '主动搭话', '开放平台', '文件管理', '运行日志', '吃大米饭', '更新与来源']
const UPDATES_TAB = tabs.length - 1
const FILE_MANAGER_TAB = tabs.indexOf('文件管理')
const TAB_ICONS = ['home', 'qq', 'memory', 'mood', 'speak', 'link', 'folder', 'log', 'rice', 'update']
const TAB_STAMPS = ['封面', '连接', '收藏', '观测', '问候', '接入', '归档', '回声', '米粒', '来处']
const DESCRIPTIONS = [
  '',
  '配置 QQ 连接、会话映射与消息策略。',
  '管理长期记忆、语义检索与召回策略。',
  '查看心情状态、情绪维度及变化记录，配置实例归属、判断模型和上下文注入。',
  '配置主动消息的触发时机、概率与目标会话。',
  '接入插件接口并管理会话授权。',
  '统一管理 QQ 图片、QQ 文件和表情包素材。',
  '查看 QQ 互通的实时运行日志。',
  '查看工作区 Token 用量、估算费用与限额。',
  '管理更新渠道，查看版本与项目来源。',
]
const submenus = {
  1: ['连接', '绑定', '消息策略', '角色设定', 'QQ 账号', 'QQ 空间', '表情包', '语音转写', '语音发送', '图片与文件', '聊天记录'].map(x => [x, x]),
  2: ['记忆库', 'RAG 语义召回'].map(x => [x, x]),
  3: [['mood', '心情'], ['bind', '会话绑定'], ['judge', '判断与注入'], ['charm', '挂饰']],
}
const TAB_ENGLISH = ['OVERVIEW', 'QQ LINK', 'MEMORY', 'MOOD', 'PROACTIVE MESSAGES', 'OPEN PLATFORM', 'FILE MANAGER', 'RUNTIME LOGS', 'TOKEN USAGE', 'UPDATES & SOURCES']
const SUBMENU_ENGLISH = {
  1: ['CONNECTION', 'BINDINGS', 'MESSAGE POLICIES', 'ROLES', 'QQ ACCOUNT', 'QQ SPACE', 'STICKERS', 'SPEECH TO TEXT', 'TEXT TO SPEECH', 'IMAGES & FILES', 'CHAT HISTORY'],
  2: ['LIBRARY', 'RAG SEMANTIC RECALL'],
  3: ['MOOD STATUS', 'BINDINGS', 'ASSESSMENT & CONTEXT', 'CHARMS'],
}
const css = FISH_THEME_CSS

// ── 更新后自动重开插件页：更新会重载插件并关掉页面，用 localStorage 记住“刚更新过” ──
const REOPEN_KEY = 'big-fish-aio.reopen-after-update'
const 标记更新后重开 = () => {
  try { if (typeof window !== 'undefined') window.localStorage.setItem(REOPEN_KEY, String(Date.now())) } catch {}
}
const 清除更新后重开 = () => {
  try { if (typeof window !== 'undefined') window.localStorage.removeItem(REOPEN_KEY) } catch {}
}
const 需要更新后重开 = () => {
  try {
    if (typeof window === 'undefined') return false
    const at = Number(window.localStorage.getItem(REOPEN_KEY) || 0)
    return at > 0 && Date.now() - at < 5 * 60000
  } catch { return false }
}
function 挂载更新后重开(ctx, readiness) {
  let stopped = false, timer = null, attempts = 0
  const open = () => {
    timer = null
    if (stopped || !需要更新后重开()) return
    if (readiness?.getSnapshot?.()?.syncing) return
    try {
      const layout = ctx.get('layout')
      if (typeof layout?.selectPanel === 'function') {
        layout.selectPanel(PANEL_ID)
        清除更新后重开()
        return
      }
    } catch {}
    if (++attempts < 10) timer = setTimeout(open, 250)
  }
  const schedule = () => {
    if (!stopped && timer === null && 需要更新后重开()) timer = setTimeout(open, 0)
  }
  const unsubscribe = readiness?.subscribe?.(schedule)
  // 不在槽位注册事务里改变布局；等重载提交后的下一轮事件再切页。
  schedule()
  return () => { stopped = true; clearTimeout(timer); unsubscribe?.() }
}

const FISH_HELP = { current: null, serial: 0, timer: null, listeners: new Set() }
function fishHideHelp() {
  if (FISH_HELP.timer) { clearTimeout(FISH_HELP.timer); FISH_HELP.timer = null }
  if (!FISH_HELP.current) return
  FISH_HELP.current = null
  FISH_HELP.listeners.forEach(fn => fn())
}
function fishScheduleHelpHide(delay = 160) {
  if (!FISH_HELP.current) return
  if (FISH_HELP.timer) clearTimeout(FISH_HELP.timer)
  FISH_HELP.timer = setTimeout(() => { FISH_HELP.timer = null; fishHideHelp() }, delay)
}
function fishCancelHelpHide() {
  if (!FISH_HELP.timer) return
  clearTimeout(FISH_HELP.timer)
  FISH_HELP.timer = null
}
function fishShowHelp(text, anchor, label, link) {
  if (!text || !anchor || typeof window === 'undefined') return
  fishCancelHelpHide()
  const rect = anchor.getBoundingClientRect()
  const width = Math.min(340, Math.max(200, window.innerWidth - 24))
  const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12))
  const placement = rect.bottom + 190 > window.innerHeight && rect.top > 190 ? 'above' : 'below'
  FISH_HELP.current = {
    id: ++FISH_HELP.serial,
    text,
    label: label || '字段说明',
    link: link || null,
    anchor,
    left,
    top: placement === 'above' ? rect.top - 8 : rect.bottom + 8,
    width,
    placement,
  }
  FISH_HELP.listeners.forEach(fn => fn())
}
const FISH_CONFIRM = { current: null, serial: 0, listeners: new Set() }
function fishFinishConfirm(ok) {
  const item = FISH_CONFIRM.current
  if (!item) return
  FISH_CONFIRM.current = null
  FISH_CONFIRM.listeners.forEach(fn => fn())
  item.resolve(Boolean(ok))
}
function fishAskConfirm(options = {}) {
  if (FISH_CONFIRM.current) fishFinishConfirm(false)
  return new Promise(resolve => {
    FISH_CONFIRM.current = {
      id: ++FISH_CONFIRM.serial,
      title: options.title || '确认操作？',
      description: options.description || '',
      confirmText: options.confirmText || '确认',
      cancelText: options.cancelText || '取消',
      danger: options.danger === true,
      resolve,
    }
    FISH_CONFIRM.listeners.forEach(fn => fn())
  })
}
function FishConfirmHost() {
  const [item, setItem] = React.useState(FISH_CONFIRM.current)
  React.useEffect(() => {
    const update = () => setItem(FISH_CONFIRM.current)
    FISH_CONFIRM.listeners.add(update)
    update()
    return () => FISH_CONFIRM.listeners.delete(update)
  }, [])
  if (!item) return null
  return h(FishModal, { className: 'fish-modal fish-confirm' },
    h('div', {
      className: 'fish-modal-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-confirm-title', 'aria-describedby': 'fish-confirm-desc',
      onKeyDown: (e) => { if (e.key === 'Escape') fishFinishConfirm(false) },
    },
    h('span', { className: 'fish-kicker' }, 'CONFIRM · 操作确认'),
    h('h2', { id: 'fish-confirm-title' }, item.title),
    h('p', { id: 'fish-confirm-desc', className: 'fish-modal-desc' }, item.description),
    h('div', { className: 'fish-modal-actions' },
      h('button', { type: 'button', className: 'fish-button fish-modal-cancel', autoFocus: true, onClick: () => fishFinishConfirm(false) }, item.cancelText),
      h('button', { type: 'button', className: 'fish-button ' + (item.danger ? 'fish-danger' : 'fish-primary'), onClick: () => fishFinishConfirm(true) }, item.confirmText))))
}

const FISH_TEXT = { current: null, serial: 0, listeners: new Set() }
function fishFinishText(value) {
  const item = FISH_TEXT.current
  if (!item) return
  FISH_TEXT.current = null
  FISH_TEXT.listeners.forEach(fn => fn())
  item.resolve(value === null || value === undefined ? null : String(value))
}
function fishAskText(options = {}) {
  if (FISH_TEXT.current) fishFinishText(null)
  return new Promise(resolve => {
    FISH_TEXT.current = {
      id: ++FISH_TEXT.serial,
      title: options.title || '编辑文字',
      description: options.description || '',
      value: options.value == null ? '' : String(options.value),
      placeholder: options.placeholder || '',
      confirmText: options.confirmText || '保存',
      cancelText: options.cancelText || '取消',
      maxLength: options.maxLength || 20000,
      resolve,
    }
    FISH_TEXT.listeners.forEach(fn => fn())
  })
}
function FishTextHost() {
  const [item, setItem] = React.useState(FISH_TEXT.current)
  const [text, setText] = React.useState('')
  React.useEffect(() => {
    const update = () => setItem(FISH_TEXT.current)
    FISH_TEXT.listeners.add(update)
    update()
    return () => FISH_TEXT.listeners.delete(update)
  }, [])
  React.useEffect(() => { setText(item?.value || '') }, [item && item.id])
  if (!item) return null
  return h(FishModal, { className: 'fish-modal' },
    h('div', { className: 'fish-modal-card qq-text-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-text-title', 'aria-describedby': 'fish-text-desc',
      onKeyDown: (e) => { if (e.key === 'Escape') fishFinishText(text) } },
    h('span', { className: 'fish-kicker' }, 'EDIT · 角色设定'),
    h('h2', { id: 'fish-text-title' }, item.title),
    item.description ? h('p', { id: 'fish-text-desc', className: 'fish-modal-desc' }, item.description) : null,
    h('textarea', { className: 'qq-text-modal-input', 'aria-label': '角色设定内容', autoFocus: true, maxLength: item.maxLength, value: text, placeholder: item.placeholder,
      onBlur: () => fishFinishText(text), onChange: (e) => setText(e.target.value) }),
    h('div', { className: 'fish-modal-actions' },
      h('button', { type: 'button', className: 'fish-button fish-modal-cancel', onClick: () => fishFinishText(text) }, '关闭'),
      null)))
}

const FISH_WRITER = { open: false, serial: 0, listeners: new Set() }
function fishOpenRoleWriter() {
  FISH_WRITER.open = true
  FISH_WRITER.serial++
  FISH_WRITER.listeners.forEach(fn => fn())
}
function FishRoleWriterHost() {
  const [open, setOpen] = React.useState(FISH_WRITER.open)
  const [need, setNeed] = React.useState('')
  const [result, setResult] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  React.useEffect(() => {
    const update = () => setOpen(Boolean(FISH_WRITER.open))
    FISH_WRITER.listeners.add(update)
    update()
    return () => FISH_WRITER.listeners.delete(update)
  }, [])
  const close = () => {
    if (busy) return
    FISH_WRITER.open = false
    FISH_WRITER.listeners.forEach(fn => fn())
    setNeed(''); setResult(''); setError('')
  }
  const generate = async () => {
    if (!need.trim() || busy) return
    setBusy(true); setError(''); setResult('')
    try {
      const response = await fetch('/dsh-qq-bridge/role-draft', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 需求: need.trim() }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.ok) throw new Error(data?.说 || '生成失败')
      setResult(String(data.文字 || '').trim())
    } catch (e) { setError(String((e && e.message) || e)) }
    finally { setBusy(false) }
  }
  const copy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      fishNotify('角色设定已复制', { tone: 'success' })
    } catch (e) { fishNotify('复制失败，请手动选择文本', { holdMs: 6000 }) }
  }
  if (!open) return null
  return h(FishModal, { className: 'fish-modal' },
    h('div', { className: 'fish-modal-card qq-role-writer-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-writer-title',
      onKeyDown: (e) => { if (e.key === 'Escape') close() } },
    h('span', { className: 'fish-kicker' }, 'AI · 专业代写'),
    h('h2', { id: 'fish-writer-title' }, '大肥鱼专业代写'),
    h('p', { className: 'fish-modal-desc' }, '输入需求后生成角色设定，此操作消耗 DeepSeek Token。'),
    h(FishTextarea, { className: 'qq-role-writer-input', 'aria-label': '角色设定需求', autoFocus: true, value: need, placeholder: '例如：想要一个嘴硬心软、说话简短、会默默关心人的角色。', onChange: (e) => setNeed(e.target.value) }),
    h('div', { className: 'fish-modal-actions' },
      h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !need.trim(), onClick: generate }, busy ? '生成中…' : '生成角色设定'),
      h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: busy, onClick: close }, '关闭')),
    error ? h('p', { className: 'fish-modal-error', role: 'alert' }, error) : null,
    result ? h('div', { className: 'qq-role-writer-result' },
      h('div', { className: 'qq-role-writer-result-head' }, h('strong', null, '生成结果'), h('button', { type: 'button', className: 'fish-button', onClick: copy }, '一键复制')),
      h('pre', { className: 'qq-role-writer-result-text' }, result)) : null))
}

function FishHelpHost() {
  const [item, setItem] = React.useState(FISH_HELP.current)
  const cardRef = React.useRef(null)
  React.useEffect(() => {
    const update = () => setItem(FISH_HELP.current)
    FISH_HELP.listeners.add(update)
    update()
    return () => FISH_HELP.listeners.delete(update)
  }, [])
  React.useEffect(() => {
    if (!item) return
    const hide = () => fishHideHelp()
    const outside = (e) => {
      if (cardRef.current && cardRef.current.contains(e.target)) return
      if (item.anchor && item.anchor !== e.target && !item.anchor.contains(e.target)) fishHideHelp()
    }
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    document.addEventListener('pointerdown', outside, true)
    return () => {
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
      document.removeEventListener('pointerdown', outside, true)
    }
  }, [item && item.id])
  if (!item) return null
  return h('div', {
    ref: cardRef,
    className: 'fish-help-popover', 'data-placement': item.placement, role: 'tooltip',
    style: { left: item.left + 'px', top: item.top + 'px', width: item.width + 'px' },
    onMouseEnter: fishCancelHelpHide,
    onMouseLeave: () => fishScheduleHelpHide(120),
  },
  h('span', { className: 'fish-help-label' }, item.label),
  h('p', null, item.text, item.link ? ' ' : null,
    item.link ? h('button', {
      type: 'button', className: 'fish-help-link',
      onClick: (e) => {
        e.preventDefault()
        const action = item.link.onClick
        fishHideHelp()
        if (typeof action === 'function') action()
      },
    }, item.link.text) : null))
}

// 线性图标统一走这一份，保证侧栏、状态卡和页头图章的手感一致。
const ICONS = {
  home: { paths: ['M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H10V21H5a1 1 0 0 1-1-1Z'] },
  qq: { paths: ['M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8.5A1.5 1.5 0 0 1 19 17h-7l-4.6 3.6V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z'], dots: [[7.6, 11.2, 1], [12, 11.2, 1], [16.4, 11.2, 1]] },
  memory: { paths: ['M12 6.2C10 4.9 7.5 4.5 4 4.8v14c3.5-.3 6 .1 8 1.4 2-1.3 4.5-1.7 8-1.4v-14c-3.5-.3-6 .1-8 1.4Z', 'M12 6.2v14'] },
  mood: { paths: ['M12 20s-7-4.2-7-9.4A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 7 3.6C19 15.8 12 20 12 20Z', 'M7.4 12.1h2.2l1.2-2 1.8 4 1.3-2h2.7'] },
  speak: { paths: ['M4 5.5h16v10H9l-5 4Z', 'M18 2.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z'], dots: [[8.2, 10.5, 1], [12, 10.5, 1], [15.8, 10.5, 1]] },
  update: { paths: ['M20 12a8 8 0 1 1-2.4-5.7', 'M20 4v4h-4', 'M12 8.4v3.8l2.4 1.4'] },
  refresh: { paths: ['M3 12a9 9 0 0 1 15.36-6.36L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15.36 6.36L3 16', 'M3 21v-5h5'] },
  link: { paths: ['M9.4 14.6 14.6 9.4', 'M8.1 11.9 6.5 13.5a3.4 3.4 0 0 0 4.8 4.8l1.6-1.6', 'M15.9 12.1l1.6-1.6a3.4 3.4 0 0 0-4.8-4.8l-1.6 1.6'] },
  send: { paths: ['M4 11.5 20 4l-4.5 16-4-6.5Z', 'M11.5 13.5 20 4'] },
  layers: { paths: ['M12 3 21 8l-9 5-9-5Z', 'M3 12l9 5 9-5', 'M3 16l9 5 9-5'] },
  folder: { paths: ['M3 7.2A1.2 1.2 0 0 1 4.2 6h5l2 2.4h8.6A1.2 1.2 0 0 1 21 9.6v8.2a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 17.8Z', 'M3 10h18'] },
  log: { paths: ['M4 5h16v14H4Z', 'm8 9 3 3-3 3', 'M13 15h4'] },
  heart: { paths: ['M12 20s-7-4.2-7-9.4A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 7 3.6C19 15.8 12 20 12 20Z'] },
  spark: { paths: ['M12 3.2l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7Z', 'M18.8 16.2l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z'] },
  rice: { paths: ['M4 11h16a8 8 0 0 1-16 0Z', 'M3 21h18', 'M9 8c0-1.5 1-2.5 1-4', 'M15 8c0-1.5 1-2.5 1-4'] },
  pin: { paths: ['M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z'], dots: [[12, 11, 2]] },
  sparkle: { paths: ['M12 2.5l1.2 3.6 3.6 1.2-3.6 1.2L12 12.1 10.8 8.5 7.2 7.3l3.6-1.2Z'] },
}

function Glyph({ name, size = 22, className = '' }) {
  const icon = ICONS[name] || ICONS.spark
  return h('svg', {
    className: 'fish-glyph' + (className ? ' ' + className : ''), width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true, focusable: 'false',
  },
  ...icon.paths.map((d, i) => h('path', { key: 'p' + i, d })),
  ...(icon.dots || []).map(([cx, cy, r], i) => h('circle', { key: 'd' + i, cx, cy, r, fill: 'currentColor', stroke: 'none' })))
}

function FishIcon({ size = 24 }) {
  return h('img', {
    src: '/dsh-feiyu-mood/logo.png', width: size, height: size,
    className: 'fish-logo-img', alt: '', 'aria-hidden': true, decoding: 'async', style: { display: 'block' },
  })
}

function Wave({ className = '' }) {
  return h('svg', { className: 'fish-hero-wave ' + className, viewBox: '0 0 1200 190', preserveAspectRatio: 'none', 'aria-hidden': true, focusable: 'false' },
    h('path', { className: 'fish-wave-back', d: 'M0 94C130 44 260 42 388 80S648 160 802 130 1050 58 1200 96V190H0Z' }),
    h('path', { className: 'fish-wave-front', d: 'M0 134C150 94 284 98 432 128S704 178 864 148 1084 100 1200 128V190H0Z' }),
    h('path', { className: 'fish-wave-foam', d: 'M0 108C160 62 300 64 456 98S720 154 880 126 1090 84 1200 108' }))
}

function Bubbles({ className = '' }) {
  return h('svg', { className: 'fish-bubbles ' + className, viewBox: '0 0 220 220', fill: 'none', 'aria-hidden': true, focusable: 'false' },
    h('circle', { cx: 42, cy: 158, r: 26 }),
    h('circle', { cx: 94, cy: 196, r: 10 }),
    h('circle', { cx: 150, cy: 172, r: 5 }),
    h('circle', { cx: 186, cy: 118, r: 16 }),
    h('circle', { cx: 158, cy: 74, r: 4 }),
    h('path', { d: 'M24 148c2-8 8-12 16-13M176 108c1-6 6-9 12-10' }))
}

function Sparkle({ className = '' }) {
  return h('svg', { className: 'fish-sparkle ' + className, viewBox: '0 0 40 40', fill: 'none', 'aria-hidden': true, focusable: 'false' },
    h('path', { d: 'M20 3Q23 17 34 20Q23 23 20 37Q17 23 6 20Q17 17 20 3Z' }),
    h('path', { d: 'M33 4Q34 10 39 11Q34 12 33 18Q32 12 27 11Q32 10 33 4Z' }))
}

async function request(path, options) {
  const response = await fetch(path, { cache: 'no-store', ...options })
  let data
  try { data = await response.json() } catch { throw new Error('接口未返回有效 JSON（HTTP ' + response.status + '）') }
  if (!response.ok || !data.ok) throw Object.assign(new Error(data.error || data.说 || '接口请求失败：' + response.status), { data })
  return data
}
const button = (label, onClick, primary = false, disabled = false) => h('button', { type: 'button', className: 'fish-button' + (primary ? ' fish-primary' : ''), onClick, disabled }, label)
const link = (url, label) => h('a', { href: url, target: '_blank', rel: 'noreferrer' }, label)

// 总览的每日一句：从最近一条未被取代的记忆里取一小段，再按心情基调选语气。
// 同一天、同一份数据会得到同一句；换一天会换模板。没有记忆/心情时用通用句。
function 记忆片段(text) {
  let t = String(text || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#>~“”"「」『』]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  t = t.replace(/^[，,。；;：:\s-]+/, '')
  const first = t.split(/[。！？!?；;]/)[0].trim()
  if (first.length < 4) return ''
  return first.length > 30 ? first.slice(0, 30).replace(/[，,、\s]+$/, '') + '…' : first
}
function 最近记忆(memory) {
  const all = []
  for (const session of (memory?.sessions || [])) {
    for (const item of (session?.memories || [])) {
      if (!item || !item.text || item.已被取代) continue
      const text = 记忆片段(item.text)
      if (!text) continue
      all.push({
        text,
        id: item.id || '',
        time: Date.parse(item.at || '') || 0,
        importance: Number(item.importance) || 0,
      })
    }
  }
  all.sort((a, b) => (b.time - a.time) || (b.importance - a.importance))
  return all[0] || null
}
function 每天一句({ memory, mood } = {}) {
  const 记忆 = 最近记忆(memory)
  const 分值 = Number(mood?.mood)
  const dims = Object.fromEntries((mood?.dims || []).map(d => [d.key, Number(d.value) || 0]))
  let tone = '平静'
  if (Number.isFinite(分值) && (分值 >= 66 || dims.happy >= 60 || dims.sweet >= 60)) tone = '明亮'
  else if (Number.isFinite(分值) && (分值 <= 38 || dims.sad >= 55 || dims.worry >= 55 || dims.heartache >= 55)) tone = '低落'
  const today = new Date()
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000)
  const memo = 记忆?.text || ''
  const withMemo = {
    明亮: [
      `当前心情良好。相关记忆：「${memo}」。`,
      `当前状态积极。相关记忆：「${memo}」。`,
      `当前心情稳定向好。相关记忆：「${memo}」。`,
      `心情与记忆摘要：「${memo}」。`,
    ],
    低落: [
      `当前心情偏低。相关记忆：「${memo}」。`,
      `当前情绪需要关注。相关记忆：「${memo}」。`,
      `当前状态偏低。相关记忆：「${memo}」。`,
      `心情与记忆摘要：「${memo}」。`,
    ],
    平静: [
      `当前心情平稳。相关记忆：「${memo}」。`,
      `当前状态正常。相关记忆：「${memo}」。`,
      `当前心情无显著变化。相关记忆：「${memo}」。`,
      `心情与记忆摘要：「${memo}」。`,
    ],
  }
  const plain = {
    明亮: [
      '当前心情良好。',
      '当前心情稳定向好。',
      '当前状态积极。',
    ],
    低落: [
      '当前心情偏低。',
      '当前情绪需要关注。',
      '当前状态偏低。',
    ],
    平静: [
      '当前心情平稳。',
      '当前状态正常。',
      '当前心情无显著变化。',
    ],
  }
  const pool = memo ? (withMemo[tone] || withMemo.平静) : (plain[tone] || plain.平静)
  const seed = tone + '|' + memo + '|' + String(mood?.moodLabel || '')
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  // 日期每加一天，索引正好加一：同样的记忆/心情下，相邻两天不会撞同一句。
  return pool[(dayNumber + hash) % pool.length]
}

function Overview({ navigate, notify }) {
  const [state, setState] = React.useState({})
  const [welcomeImage] = React.useState(() => BIGFISH_IMAGES[Math.floor(Math.random() * BIGFISH_IMAGES.length)])
  const refresh = async () => {
    const results = await Promise.allSettled([request('/dsh-qq-bridge/state'), request('/dsh-fish-memory/list'), request('/dsh-feiyu-mood/state'), request('/dsh-speak-up/state')])
    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason.message)
    setState({ qq: results[0].value, memory: results[1].value, mood: results[2].value, speak: results[3].value })
    if (errors.length && typeof notify === 'function') notify('读取部分模块状态失败：' + errors.join('；'), { holdMs: 7000 })
  }
  React.useEffect(() => { void refresh() }, [])
  const qq = state.qq, memory = state.memory, mood = state.mood
  const libraries = [...new Map((memory?.sessions || []).map(s => [s.storeId || s.id, s])).values()]
  const connected = Boolean(qq?.NapCat状态?.用户 && !qq?.NapCat状态?.错)
  const moodValue = mood ? String(mood.mood ?? '—') + (mood.moodLabel ? ' · ' + mood.moodLabel : '') : '—'
  const stats = [
    { label: 'QQ 后端', value: !qq ? '—' : qq.NapCat状态?.错 ? '未连接' : qq.NapCat状态?.用户 ? '已连接' : '未连接', hint: qq?.NapCat状态?.昵称 || '配置 NapCat / SnowLuma 连接', icon: 'link', tone: connected ? 'mint' : 'blue' },
    { label: '消息转发', value: !qq ? '—' : qq.配置?.总开关 ? qq.配置?.试运行 ? '试运行' : '已开启' : '已关闭', hint: '沿用原插件的收发开关与绑定策略', icon: 'send', tone: 'blue' },
    { label: '长期记忆', value: !memory ? '—' : memory.全局开关 ? '已开启' : '已关闭', hint: '按会话与 QQ 来源隔离，按需语义召回', icon: 'memory', tone: 'gold' },
    { label: '记忆条目', value: memory ? String(libraries.reduce((n, s) => n + (s.count || 0), 0)) : '—', hint: memory ? libraries.length + ' 个记忆库' : '等待宿主记忆服务', icon: 'layers', tone: 'gold' },
    { label: '鱼的心情', value: moodValue, hint: '按会话或工作区绑定，保留情绪时间线', icon: 'heart', tone: 'rose' },
    { label: '主动搭话', value: !state.speak ? '—' : state.speak.配置?.总开关 ? state.speak.配置?.试运行 ? '试运行' : '已开启' : '已关闭', hint: '复用目标会话的人格、历史、工具和记忆', icon: 'spark', tone: 'mint' },
  ]
  return h('div', { className: 'fish-overview' },
    h('section', { className: 'fish-hero' },
      h('div', { className: 'fish-hero-copy' },
        h('span', { className: 'fish-kicker fish-kicker-light' }, h('span', { className: 'fish-kicker-dot' }), 'BIG FISH · QQ陪伴手帐'),
        h('h1', null, '把日常，收进', h('span', { className: 'fish-mark' }, '鱼的胃袋'), '里。'),
        h('p', { className: 'fish-hero-lead' }, 'QQ 的消息、一起记住的事、今天的心情，还有一句恰到好处的问候——都替你收好，慢慢翻。'),
        h('p', { className: 'fish-hero-quote' }, '“' + 每天一句({ memory, mood }) + '”')),
      h('figure', { className: 'fish-welcome', 'aria-hidden': true },
        h('span', { className: 'fish-tape fish-welcome-tape' }),
        h('img', { src: welcomeImage, alt: '', width: 1254, height: 1254, decoding: 'async' }),
        h('figcaption', null, '大肥鱼 · QQ 陪伴助手')),
      h(Wave), h(Bubbles, { className: 'fish-hero-bubbles' }), h(Sparkle, { className: 'fish-hero-spark' })),
    h('section', { className: 'fish-board' },
      h('header', { className: 'fish-section-head' },
        h('div', null, h('span', { className: 'fish-kicker' }, 'TODAY · 今日状态'), h('h2', null, '运行状态')),
        h('span', { className: 'fish-section-note' }, '连接、记忆与心情状态')),
      h('div', { className: 'fish-stats' }, ...stats.map(({ label, value, hint, icon, tone }) => h('article', { className: 'fish-card fish-stat', 'data-tone': tone, key: label },
        h('span', { className: 'fish-stat-icon', 'aria-hidden': true }, h(Glyph, { name: icon, size: 20 })),
        h('div', { className: 'fish-stat-copy' },
          h('span', { className: 'fish-stat-label' }, label),
          h('div', { className: 'fish-value' }, value),
          h('span', { className: 'fish-stat-hint' }, hint)))))),
    h('section', { className: 'fish-board fish-chapters' },
      h('header', { className: 'fish-section-head' },
        h('div', null, h('span', { className: 'fish-kicker' }, 'CHAPTERS · 功能 ALL IN ONE'), h('h2', null, '功能入口')),
        h('span', { className: 'fish-section-note' }, '点击进入对应功能区')),
      h('div', { className: 'fish-grid' },
        h('article', { className: 'fish-card fish-feature fish-feature-character', 'data-fish-feature': 'qq', 'data-index': '01' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '01'), '连接'),
            h('h2', null, 'QQ 互通'),
            h('p', { className: 'fish-muted' }, '统一设置后端连接、私聊与群聊绑定、回复策略。历史记录按段整理后，写进目标会话的记忆。'),
            h('div', { className: 'fish-actions' }, button('打开 QQ 手帐 →', () => navigate(1), true))),
          h('figure', { className: 'fish-feature-sticker', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-chat.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))),
        h('article', { className: 'fish-card fish-feature fish-feature-character', 'data-fish-feature': 'memory', 'data-index': '02' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '02'), '记忆'),
            h('h2', null, '长期记忆'),
            h('p', { className: 'fish-muted' }, '浏览与编辑记忆，整理档案，配置遗忘与召回。Qwen 语义检索按需启用，保留原有来源隔离。'),
            h('div', { className: 'fish-actions' }, button('翻翻记忆口袋 →', () => navigate(2), true))),
          h('figure', { className: 'fish-feature-sticker', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-read.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))),
        h('article', { className: 'fish-card fish-feature fish-feature-light', 'data-fish-feature': 'mood', 'data-index': '03' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '03'), '心情'),
            h('h2', null, '鱼的心情'),
            h('p', { className: 'fish-muted' }, '自动判断心情、查看情绪时间线，管理会话或工作区绑定与挂饰。'),
            h('div', { className: 'fish-actions' }, button('查看心情状态 →', () => navigate(3)))),
          h('figure', { className: 'fish-feature-sticker fish-feature-sticker-small', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-heart.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))),
        h('article', { className: 'fish-card fish-feature fish-feature-light', 'data-fish-feature': 'speak', 'data-index': '04' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '04'), '搭话'),
            h('h2', null, '主动搭话'),
            h('p', { className: 'fish-muted' }, '设置触发间隔、时段和目标，支持演练与实际发送。'),
            h('div', { className: 'fish-actions' }, button('设置主动搭话 →', () => navigate(4)))),
          h('figure', { className: 'fish-feature-sticker fish-feature-sticker-small', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-wave.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))))))
}

function Rice({ notify, active = true } = {}) {
  const [data, setData] = React.useState(null)
  const [busy, setBusy] = React.useState(false)
  const latestLoad = React.useRef(0)
  const [error, setError] = React.useState('')
  const [range, setRange] = React.useState(7)
  const [tip, setTip] = React.useState(null)
  const [thresholdOpen, setThresholdOpen] = React.useState(false)
  const [thresholds, setThresholds] = React.useState({ dailyLimit: '', lowBalance: '' })
  const [thresholdBusy, setThresholdBusy] = React.useState(false)
  const [thresholdError, setThresholdError] = React.useState('')
  const closeThresholds = () => { if (!thresholdBusy) setThresholdOpen(false) }
  const saveThresholds = async event => {
    event.preventDefault()
    if (thresholdBusy) return
    setThresholdBusy(true); setThresholdError('')
    try {
      const result = await request('/dsh-qq-bridge/rice-thresholds', { method: 'POST', body: JSON.stringify({ dailyLimit: Number(thresholds.dailyLimit), lowBalance: Number(thresholds.lowBalance) }) })
      setData(old => ({ ...old, thresholds: result.thresholds }))
      notify?.('鱼粮阈值已保存')
    } catch (error) { setThresholdError(error.message) }
    finally { setThresholdBusy(false) }
  }
  const load = async () => {
    const id = ++latestLoad.current
    setBusy(true); setError('')
    try {
      const value = await request('/dsh-qq-bridge/rice')
      if (id === latestLoad.current) setData(value)
    } catch (e) {
      if (id !== latestLoad.current) return
      setError(e.message)
      if (typeof notify === 'function') notify('读取 Token 用量失败：' + e.message, { holdMs: 7000 })
    } finally { if (id === latestLoad.current) setBusy(false) }
  }
  React.useEffect(() => { if (active) void load() }, [active])
  const fmt = (n) => {
    const v = Math.max(0, Number(n) || 0)
    if (v >= 1e6) return (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'
    if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K'
    return Math.round(v).toLocaleString('zh-CN')
  }
  const money = (n) => {
    const v = Math.max(0, Number(n) || 0)
    return '¥' + (v >= 100 ? v.toFixed(2) : v >= 1 ? v.toFixed(3) : v.toFixed(4))
  }
  const dayKey = (d) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
  const zero = () => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0, cost: 0,
    ragCalls: 0, ragDocumentCalls: 0, ragQueryCalls: 0, ragFailed: 0, ragPending: 0,
    ragTokens: 0, ragUnknownTokens: 0, ragUnpriced: 0, ragCost: 0 })
  const add = (a, b) => {
    const out = zero()
    for (const key of Object.keys(out)) out[key] = (a[key] || 0) + (b[key] || 0)
    return out
  }
  const ragMoney = value => '¥' + (Number(value) || 0).toFixed(6)
  const days = data?.days || []
  const byDay = new Map(days.map(d => [d.date, d]))
  const today = data?.今天 || dayKey(new Date())
  const todayTotal = byDay.get(today) || zero()
  const sumRange = (n) => {
    if (!n) return data?.全部 || zero()
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - n + 1)
    const from = dayKey(start), to = dayKey(end)
    let out = zero()
    for (const d of days) if (d.date >= from && d.date <= to) out = add(out, d)
    return out
  }
  const series = React.useMemo(() => {
    const end = new Date(); const start = new Date()
    if (range) start.setDate(end.getDate() - range + 1)
    else {
      const first = days[0]?.date
      if (!first) return []
      start.setTime(new Date(first + 'T00:00:00').getTime())
    }
    const out = []; const d = new Date(start)
    while (d <= end) { out.push(byDay.get(dayKey(d)) || { date: dayKey(d), ...zero() }); d.setDate(d.getDate() + 1) }
    return out
  }, [days, range])
  const chart = React.useMemo(() => {
    const W = 760, H = 230, pad = 34
    const max = Math.max(1, ...series.map(x => x.total))
    const pts = series.map((x, i) => [pad + (series.length <= 1 ? 0 : i * (W - pad * 2) / (series.length - 1)), H - pad - (x.total / max) * (H - pad * 2)])
    const line = pts.map(p => p.join(',')).join(' ')
    const area = pts.length ? ('M' + pts[0][0] + ',' + (H - pad) + ' L' + line.replace(/ /g, ' L') + ' L' + pts[pts.length - 1][0] + ',' + (H - pad) + ' Z') : ''
    return { W, H, pad, max, pts, line, area }
  }, [series])
  const heat = React.useMemo(() => {
    const now = new Date()
    const year = now.getFullYear(), month = now.getMonth()
    const leading = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < leading; i++) cells.push({ key: 'blank-' + i, blank: true })
    for (let day = 1; day <= daysInMonth; day++) {
      const key = dayKey(new Date(year, month, day))
      const x = byDay.get(key)
      cells.push({ key, total: x?.total || 0, sessions: x?.sessions || [] })
    }
    const max = Math.max(1, ...cells.map(x => x.total || 0))
    return {
      label: year + '年' + (month + 1) + '月',
      cells: cells.map(x => x.blank ? x : ({ ...x, level: x.total <= 0 ? 0 : Math.min(4, Math.ceil(x.total / max * 4)) })),
    }
  }, [days])
  const sessions = data?.会话 || []
  const showTip = (event, date) => {
    const width = typeof window !== 'undefined' ? Math.min(300, window.innerWidth - 28) : 300
    const height = 250
    const x = Math.max(10, Math.min((event.clientX || 0) + 14, (typeof window !== 'undefined' ? window.innerWidth : 1200) - width - 10))
    const y = Math.max(10, Math.min((event.clientY || 0) + 14, (typeof window !== 'undefined' ? window.innerHeight : 900) - height - 10))
    setTip({ date, x, y })
  }
  const tipDay = tip ? byDay.get(tip.date) : null
  return h('div', { className: 'rice-page' },
    h('div', { className: 'fish-toolbar rice-toolbar' },
      h('div', null, h('span', { className: 'fish-kicker' }, 'RICE · 每日用量'), h('h2', null, '吃大米饭')),
      h('div', { className: 'fish-actions' },
        h('button', { type: 'button', className: 'fish-button rice-threshold-button', disabled: !data, onClick: () => {
          setThresholds({ dailyLimit: data?.thresholds?.dailyLimit || '', lowBalance: data?.thresholds?.lowBalance || '' }); setThresholdError(''); setThresholdOpen(true)
        } }, '阈值设定'),
        h(FishRefreshButton, { busy, onClick: load, label: '刷新用量' }))),
    thresholdOpen ? h(FishModal, { className: 'fish-modal', onClick: event => { if (event.target === event.currentTarget) closeThresholds() }, onKeyDown: event => { if (event.key === 'Escape') { event.preventDefault(); closeThresholds() } } },
      h('form', { className: 'fish-modal-card rice-threshold-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rice-threshold-title', onSubmit: saveThresholds },
        h('span', { className: 'fish-kicker' }, 'RICE · 鱼粮管理'),
        h('h2', { id: 'rice-threshold-title' }, '阈值设定'),
        h('p', { className: 'fish-modal-desc' }, '金额单位为人民币（元），留空或填 0 关闭对应功能。保存后立即生效。'),
        [['dailyLimit', '每日鱼粮上限', '按北京时间统计当前工作区每日估算花费（含 RAG）。达到 80% 时私信提醒主人；达到上限自动关闭总开关，次日不会自动开启。'],
          ['lowBalance', '提醒补充鱼粮', 'DeepSeek 账户人民币余额（含赠金）低于此金额时私信主人续费。不受主动搭话及总开关影响，余额恢复后再次不足才会重新提醒。']].map(([key, label, help], i) =>
          h('label', { className: 'rice-threshold-field', key }, h('strong', null, label + '（人民币元）'),
            h(FishInput, { icon: '¥', type: 'number', min: '0', max: '1000000000', step: 'any', inputMode: 'decimal', autoFocus: i === 0, 'aria-label': label + '（人民币元）', 'aria-describedby': 'rice-help-' + key, disabled: thresholdBusy, value: thresholds[key], placeholder: '0.00', onChange: event => setThresholds({ ...thresholds, [key]: event.target.value }) }),
            h('span', { className: 'fish-muted', id: 'rice-help-' + key }, help))),
        h('p', { className: 'fish-muted' }, '请先在 QQ 私聊映射中勾选主人 QQ 并连接 QQ 后端。试运行不发送私信。每分钟及会话用量更新时检查，已发起的模型请求可能继续计费。'),
        thresholdError ? h('p', { className: 'fish-modal-error', role: 'alert' }, thresholdError) : null,
        h('div', { className: 'fish-modal-actions' }, h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: thresholdBusy, onClick: closeThresholds }, '关闭'),
          h('button', { type: 'submit', className: 'fish-button fish-primary', disabled: thresholdBusy }, thresholdBusy ? '保存中…' : '保存')))) : null,
    h('p', { className: 'fish-muted' }, '统计当前绑定工作区（' + (data?.工作区?.path || '读取中…') + '）的会话与 RAG 用量。RAG 按实际请求记录，含索引构建和查询，缓存复用不新增调用。'),
    error ? h('p', { className: 'fish-modal-error', role: 'alert' }, error) : null,
    h('div', { className: 'rice-stats' },
      [['今天', todayTotal], ['近 7 天', sumRange(7)], ['近 30 天', sumRange(30)], ['全部', data?.全部 || zero()]].map(([label, v]) =>
        h('article', { key: label, className: 'fish-card rice-stat' },
          h('span', { className: 'rice-stat-label' }, label),
          h('strong', { className: 'rice-stat-value' }, fmt(v.total)),
          h('span', { className: 'rice-stat-cost' }, '≈ ' + money(v.cost || 0)),
          h('span', { className: 'rice-stat-sub' }, '输入 ' + fmt(v.input) + ' · 输出 ' + fmt(v.output)),
          h('span', { className: 'rice-stat-sub' }, '缓存 ' + fmt(v.cacheRead + v.cacheWrite) + ' · RAG ' + fmt(v.ragTokens))))),
    h('div', { className: 'rice-grid' },
      h('section', { className: 'fish-card rice-chart-card' },
        h('div', { className: 'fish-section-head' },
          h('div', null, h('span', { className: 'fish-kicker' }, 'TREND'), h('h3', null, '用量趋势')),
          h('div', { className: 'fish-subnav rice-range' }, ...[7, 30, 0].map(n => h('button', { key: n, type: 'button', className: 'fish-button' + (range === n ? ' fish-primary' : ''), onClick: () => setRange(n) }, n ? '近 ' + n + ' 天' : '全部')))),
        series.length ? h('svg', { className: 'rice-line', viewBox: '0 0 ' + chart.W + ' ' + chart.H, role: 'img', 'aria-label': 'Token 用量趋势' },
          [0, 1, 2, 3].map(i => h('line', { key: i, x1: chart.pad, x2: chart.W - chart.pad, y1: chart.pad + i * (chart.H - chart.pad * 2) / 3, y2: chart.pad + i * (chart.H - chart.pad * 2) / 3, className: 'rice-gridline' })),
          chart.area ? h('path', { d: chart.area, className: 'rice-area' }) : null,
          chart.pts.length ? h('polyline', { points: chart.line, className: 'rice-polyline' }) : null,
          ...chart.pts.map((p, i) => h('circle', {
            key: 'hit-' + i, cx: p[0], cy: p[1], r: 10, className: 'rice-hit',
            onMouseEnter: e => showTip(e, series[i].date), onMouseLeave: () => setTip(null),
          })),
          h('text', { x: chart.pad, y: 18, className: 'rice-axis' }, fmt(chart.max)),
          h('text', { x: chart.W - chart.pad, y: chart.H - 4, textAnchor: 'end', className: 'rice-axis' }, series[series.length - 1]?.date?.slice(5) || ''))
        : h('p', { className: 'fish-muted' }, '暂无 Token 记录。')),
      h('section', { className: 'fish-card rice-heat-card' },
        h('div', { className: 'fish-section-head' }, h('div', null, h('span', { className: 'fish-kicker' }, 'HEATMAP'), h('h3', null, heat.label)),
          h('span', { className: 'fish-muted rice-heat-legend' }, '少 ', ...[0, 1, 2, 3, 4].map(l => h('i', { key: l, className: 'rice-heat-dot', 'data-level': l })), ' 多')),
        h('div', { className: 'rice-heat', role: 'img', 'aria-label': '本月 Token 用量热力图' },
          ...heat.cells.map(x => x.blank
            ? h('span', { key: x.key, className: 'rice-heat-cell rice-heat-blank' })
            : h('span', {
                key: x.key, className: 'rice-heat-cell', 'data-level': x.level, title: x.key + ' · ' + fmt(x.total),
                onMouseEnter: e => showTip(e, x.key), onMouseLeave: () => setTip(null),
              }))))),
    h('section', { className: 'fish-card rice-table-card' },
      h('div', { className: 'fish-section-head' }, h('div', null, h('span', { className: 'fish-kicker' }, 'SESSIONS'), h('h3', null, '每个会话的用量')), h('span', { className: 'fish-muted' }, sessions.length + ' 个会话')),
      sessions.length ? h('div', { className: 'rice-table-wrap' },
        h('table', { className: 'rice-table' },
          h('thead', null, h('tr', null, ...['会话', '今日', '全部', '输入', '输出', '缓存', 'Qwen RAG', '金额'].map(x => h('th', { key: x }, x)))),
          h('tbody', null,
            ...sessions.map(s => h('tr', { key: s.id },
              h('td', null, h('span', { className: 'rice-session-title' }, s.title || s.id.slice(-12)), h('span', { className: 'rice-session-id' }, s.id.slice(-8))),
              h('td', null, fmt(s.今天?.total)),
              h('td', null, fmt(s.全部?.total)),
              h('td', null, fmt(s.全部?.input)),
              h('td', null, fmt(s.全部?.output)),
              h('td', null, fmt((s.全部?.cacheRead || 0) + (s.全部?.cacheWrite || 0))),
              h('td', null, fmt(s.全部?.ragTokens)),
              h('td', null, money(s.全部?.cost || 0))))
          )
        )
      ) : h('p', { className: 'fish-muted' }, '当前工作区暂无可统计会话。')),
    tip ? h('div', { className: 'rice-tooltip', role: 'tooltip', style: { left: tip.x + 'px', top: tip.y + 'px' } },
      h('div', { className: 'rice-tip-date' }, tip.date),
      h('div', { className: 'rice-tip-total' }, fmt(tipDay?.total || 0), h('span', null, ' TOKEN')),
      h('div', { className: 'rice-tip-cost' }, '≈ ' + money(tipDay?.cost || 0)),
      h('div', { className: 'rice-stat-sub' }, 'Qwen RAG ' + fmt(tipDay?.ragCalls) + ' 次 · 估算 ' + ragMoney(tipDay?.ragCost)),
      h('div', { className: 'rice-tip-label' }, '会话细分'),
      (tipDay?.sessions || []).length
        ? [...tipDay.sessions].slice(0, 6).map((s, i) => {
            const pct = tipDay.total ? Math.round(s.total / tipDay.total * 100) : 0
            return h('div', { key: s.id || i, className: 'rice-tip-row' },
              h('div', { className: 'rice-tip-row-head' }, h('span', null, s.title || s.id.slice(-8)), h('strong', null, fmt(s.total)), h('em', null, pct + '%')),
              h('div', { className: 'rice-tip-bar' }, h('i', { style: { width: Math.max(2, pct) + '%' } })))
          })
        : h('div', { className: 'rice-tip-empty' }, '当日无记录')) : null)
}

function UpdateArtwork({ outcome = 'idle' }) {
  const [ready, setReady] = React.useState({})
  const [shown, setShown] = React.useState('idle')
  React.useEffect(() => { if (outcome === 'idle' || ready[outcome]) setShown(outcome) }, [outcome, ready])
  return h('div', { className: 'fish-update-stickers', 'data-outcome': shown },
    ...[['idle', 'sticker-update'], ['success', 'sticker-update-success'], ['failure', 'sticker-update-failure']].map(([state, file]) =>
      h('img', { key: state, 'data-artwork': state, src: '/dsh-big-fish-aio/bigfish/' + file + '.png', alt: '', width: 1254, height: 1254, decoding: 'async',
        onLoad: async event => {
          const image = event.currentTarget
          try { await image.decode?.(); setReady(current => ({ ...current, [state]: true })) } catch {}
        } })))
}

function Updates({ notify, versionInfo, onVersionInfo } = {}) {
  const initialChannel = versionInfo?.channel || FISH_UPDATE.result?.channel || null
  const [update, setUpdate] = React.useState(FISH_UPDATE.result?.channel === initialChannel ? FISH_UPDATE.result : null)
  const [busy, setBusy] = React.useState(false)
  const tell = typeof notify === 'function' ? notify : () => {}
  const [channel, setChannel] = React.useState(initialChannel)
  const [betaOpen, setBetaOpen] = React.useState(false)
  const [token, setToken] = React.useState('')
  const [betaError, setBetaError] = React.useState('')
  const requestId = React.useRef(0)
  const installing = React.useRef(false)
  const check = async (force = true) => {
    if (!channel) return
    const id = ++requestId.current
    setBusy(true)
    try {
      const result = await request('/dsh-big-fish-aio/update?channel=' + channel + (force ? '&refresh=1' : ''))
      if (id === requestId.current) {
        setUpdate(result)
        if (result.ok) fishSetUpdateResult(result)
      }
    } catch (e) { if (id === requestId.current) { setUpdate(null); tell('检查更新失败：' + e.message, { holdMs: 6000 }) } }
    finally { if (id === requestId.current) setBusy(false) }
  }
  const install = async () => {
    installing.current = true; setBusy(true)
    try { await fishInstallUpdate(update, { notify: tell, onVersionInfo }) }
    catch (error) { tell('安装未完成：' + error.message) }
    finally { installing.current = false; setBusy(false) }
  }
  React.useEffect(() => {
    let active = true
    if (!channel) request('/dsh-big-fish-aio/version').then(info => {
      if (active) { setChannel(info.channel); onVersionInfo?.(info) }
    }).catch(e => { if (active) tell('读取更新来源失败：' + e.message) })
    return () => { active = false; requestId.current++ }
  }, [])
  React.useEffect(() => {
    const receive = result => {
      if (result.channel !== channel) return
      setUpdate(result)
      if (!installing.current) {
        requestId.current++
        setBusy(false)
      }
    }
    FISH_UPDATE.listeners.add(receive)
    const known = FISH_UPDATE.result
    if (known?.ok && known.channel === channel) receive(known)
    else void check(false)
    return () => FISH_UPDATE.listeners.delete(receive)
  }, [channel])
  const canUpdate = Boolean(update?.ok && (update.hasUpdate || update.sourceChanged))
  const installedBeta = versionInfo?.installedChannel === 'beta'
  const installedVersion = versionInfo?.version || versionInfo?.displayVersion || META.version
  const installedCommit = installedBeta ? versionInfo?.installedCommit : null
  const status = !update ? (busy ? '正在检查…' : '暂未取得更新信息')
    : update.error ? '检查失败，可重试'
    : update.hasUpdate ? '有新版本 v' + update.latest
    : '已是最新版本'
  const changeChannel = async next => {
    setBusy(true)
    try {
      if (next === 'beta') {
        const confirmed = await fishAskConfirm({ title: '内测版使用提示', description: '此版本仅作为内部测试使用，未受邀请请勿使用', confirmText: '确认切换' })
        if (!confirmed) return
        const info = await request('/dsh-big-fish-aio/version')
        if (!info.betaConfigured) {
          setToken(''); setBetaError(''); setBetaOpen(true)
          return
        }
      }
      await request('/dsh-big-fish-aio/channel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ channel: next }) })
      setUpdate(null); setChannel(next)
    } catch (e) { tell('切换渠道失败：' + e.message) }
    finally { setBusy(false) }
  }
  const connectBeta = async e => {
    e.preventDefault()
    if (busy || !token.trim()) return
    setBusy(true); setBetaError('')
    try {
      await request('/dsh-big-fish-aio/beta', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: token.trim() }) })
      setToken(''); setBetaOpen(false); setUpdate(null)
      if (channel === 'beta') await check(true)
      else setChannel('beta')
    } catch (e) { setBetaError(e.message) }
    finally { setBusy(false) }
  }
  return h('div', { className: 'fish-updates' },
    betaOpen ? h(FishModal, { className: 'fish-modal' },
      h('form', { className: 'fish-modal-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-beta-title', 'aria-describedby': 'fish-beta-desc', onSubmit: connectBeta,
        onKeyDown: e => { if (e.key === 'Escape' && !busy) { setBetaOpen(false); setToken('') } } },
        h('span', { className: 'fish-kicker' }, 'BETA · 内测鉴权'),
        h('h2', { id: 'fish-beta-title' }, '连接内测仓库'),
        h('p', { id: 'fish-beta-desc', className: 'fish-modal-desc' }, '仅支持 RabbitStudio 私有内测仓库 dsh-big-fish-aio-demo 的 main 分支。请输入拥有该仓库 Contents 读取权限的 GitHub Token，服务端会验证连接并安全保存在本机。'),
        h('label', { className: 'fish-beta-label', htmlFor: 'fish-beta-token' }, 'GitHub Token'),
        h('input', { id: 'fish-beta-token', type: 'password', autoComplete: 'off', autoFocus: true, spellCheck: false, maxLength: 255, value: token, disabled: busy,
          onChange: e => setToken(e.target.value) }),
        betaError ? h('p', { className: 'fish-modal-error', role: 'alert' }, betaError) : null,
        h('div', { className: 'fish-modal-actions' },
          h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: busy, onClick: () => { setBetaOpen(false); setToken('') } }, '取消'),
          h('button', { type: 'submit', className: 'fish-button fish-primary', disabled: busy || !token.trim() }, busy ? '验证连接中…' : '验证并连接')))) : null,
    h('section', { className: 'fish-card fish-update-card' },
      h('div', { className: 'fish-update-body' },
        h('span', { className: 'fish-kicker' }, 'UPGRADE · 版本更新'),
        h('div', { className: 'fish-update-heading' },
          h('div', null,
            h('h2', null, '大肥鱼版本更新'),
            h('p', { className: 'fish-update-desc fish-muted' }, '正式版可使用国内镜像或 GitHub 仓库，内测版需要私有仓库授权。')),
          h('div', { className: 'fish-update-badges' },
            h('p', { className: 'fish-update-status fish-installed-version', 'aria-label': '当前安装版本', title: installedCommit || undefined },
              '当前版本 v' + installedVersion + (installedCommit ? ' · ' + installedCommit.slice(0, 8) : '')),
            h('p', { className: 'fish-update-status', role: 'status', 'aria-live': 'polite', title: update?.error || undefined }, h('span', { className: 'fish-update-dot' }), status))),
        h('div', { className: 'fish-update-controls' },
          h('label', { className: 'fish-channel-field', htmlFor: 'fish-update-channel' },
            h('span', null, '更新渠道'),
            h(FishSelect, {
              id: 'fish-update-channel', 'aria-label': '更新渠道', value: channel || 'mirror', disabled: busy || !channel,
              onChange: e => { void changeChannel(e.target.value) },
            }, h('option', { value: 'mirror' }, '国内镜像'), h('option', { value: 'github' }, 'GitHub 仓库'), h('option', { value: 'beta' }, '内测版'))),
          channel === 'beta' ? h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { setToken(''); setBetaError(''); setBetaOpen(true) } }, '更新 Token') : null,
          h('div', { className: 'fish-update-operations' },
            h('button', {
              type: 'button',
              className: 'fish-button fish-update-check' + (canUpdate && !busy ? ' fish-gold' : ''),
              disabled: busy || !channel || Boolean(canUpdate && update?.canInstall === false),
              'aria-label': busy ? (canUpdate ? '正在安装更新' : '正在检查更新') : (canUpdate ? '立即更新' : '检查更新'),
              onClick: canUpdate ? install : () => check(true),
            }, busy
              ? h(Glyph, { name: 'update', size: 18, className: 'fish-spin' })
              : (canUpdate ? '立即更新' : '检查更新')),
            h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { void fishViewInstalledLog().catch(error => tell('读取本地更新日志失败：' + error.message)) } }, '更新日志'))),
        update?.error ? h('p', { className: 'fish-update-note fish-muted' }, '检查更新失败：' + update.error) : null,
        channel === 'beta' && update?.commitUpdate ? h('p', { className: 'fish-update-note fish-muted' }, '目标提交 ' + String(update.latestCommit || '').slice(0, 8) + '，立即更新将安装此提交。') : null,
        update?.devCopy ? h('p', { className: 'fish-update-note fish-muted' }, '当前是本地开发副本，自动安装已禁用。请在项目目录执行 git pull，再运行 npm run build 并重载 DSH。') : null),
      h('figure', { className: 'fish-update-art', 'aria-hidden': true },
        h('span', { className: 'fish-tape fish-update-tape' }),
        h(UpdateArtwork, { outcome: update?.installOutcome || FISH_UPDATE.installOutcome || 'idle' }))),
    h('section', { className: 'fish-card fish-sources' },
      h('header', { className: 'fish-section-head fish-sources-head' },
        h('div', null,
          h('span', { className: 'fish-kicker' }, 'PROVENANCE · 项目来源'),
          h('h2', null, '原作者、项目来源与版本对应'),
          h('p', { className: 'fish-source-link' }, '本项目仓库：', link('https://github.com/RabbitStudioChino/dsh-big-fish-aio', 'RabbitStudioChino/dsh-big-fish-aio ↗'))),
        h('span', { className: 'fish-section-note' }, '固定记录整合基线，不随上游最新版本变化')),
      h('div', { className: 'fish-table-wrap' }, h('table', { className: 'fish-table' },
        h('thead', null, h('tr', null,
          ...['项目名称', '原作者仓库'].map(x => h('th', { key: x, scope: 'col' }, x)),
          h('th', { scope: 'col' }, '整合时的原仓库版本'))),
        h('tbody', null, ...META.upstreamCompatibility.map(item => h('tr', { key: item.url },
          h('td', null, h('span', { className: 'fish-source-name' }, item.name)),
          h('td', null, link(item.url, item.url.replace('https://github.com/', ''))),
          h('td', null, item.version, h('div', { className: 'fish-muted', title: item.commit }, item.commit.slice(0, 7))))))))))
}

function FileManager({ notify } = {}) {
  return h('div', { className: 'fish-file-manager' },
    typeof FishStickers === 'function' ? h(FishStickers, { notify, mode: 'files' }) : h('p', { className: 'fish-muted' }, '表情包管理组件不可用'),
    h('section', { className: 'fish-card' },
      h('h2', null, 'QQ 图片'),
      h('p', { className: 'fish-muted' }, '管理 QQ 接收图片的本地归档；删除归档副本不会影响 DSH 会话附件。'),
      typeof FishQQStorage === 'function' ? h(FishQQStorage, { kind: 'images', notify }) : h('p', { className: 'fish-muted' }, '图片存储管理组件不可用')),
    h('section', { className: 'fish-card' },
      h('h2', null, 'QQ 文件'),
      h('p', { className: 'fish-muted' }, '管理 QQ 接收文件的本地归档；文件不会被自动执行。'),
      typeof FishQQStorage === 'function' ? h(FishQQStorage, { kind: 'files', notify }) : h('p', { className: 'fish-muted' }, '文件存储管理组件不可用')))
}

function RunLog({ notify } = {}) {
  const [lines, setLines] = React.useState([])
  const [error, setError] = React.useState('')
  const terminalRef = React.useRef(null)
  React.useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const result = await request('/dsh-qq-bridge/logs')
        if (!active) return
        setLines(Array.isArray(result.日志) ? result.日志 : [])
        setError('')
      } catch (e) {
        if (active) setError(e.message)
      }
    }
    void load()
    const timer = setInterval(load, 1200)
    return () => { active = false; clearInterval(timer) }
  }, [])
  React.useEffect(() => {
    const node = terminalRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [lines])
  return h('div', { className: 'fish-run-log' },
    h('section', { className: 'fish-terminal-card' },
      h('div', { className: 'fish-terminal-head' },
        h('span', { className: 'fish-terminal-live' }, h('i', { 'aria-hidden': true }), 'LIVE'),
        h('span', { className: 'fish-terminal-title' }, 'QQ 互通 · 实时日志'),
        h('span', { className: 'fish-terminal-count' }, lines.length + ' 行')),
      h('div', { ref: terminalRef, className: 'fish-terminal', role: 'log', 'aria-label': 'QQ 互通实时日志', 'aria-live': 'polite' },
        lines.length
          ? lines.map((line, i) => h('div', { className: 'fish-terminal-line', key: i },
            h('span', { className: 'fish-terminal-time' }, line.时间),
            h('span', { className: 'fish-terminal-prompt', 'aria-hidden': true }, '›'),
            h('span', { className: 'fish-terminal-text' }, line.文本)))
          : h('div', { className: 'fish-terminal-empty' }, error || '等待日志…')),
      error && lines.length ? h('p', { className: 'fish-terminal-error', role: 'status' }, '日志连接中断：' + error) : null))
}

const LOCATION_KEY = 'big-fish:last-location-v2'
function readSavedLocation() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(LOCATION_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (!saved || !Number.isInteger(saved.tab) || saved.tab < 0 || saved.tab >= tabs.length) return null
    const defaults = { 1: '连接', 2: '记忆库', 3: 'mood' }
    const sub = { ...defaults }
    for (const id of [1, 2, 3]) {
      const key = saved.subpage && saved.subpage[id]
      if (typeof key === 'string' && (submenus[id] || []).some(pair => Array.isArray(pair) && pair[0] === key)) sub[id] = key
    }
    return { tab: saved.tabLabel ? Math.max(0, tabs.indexOf(saved.tabLabel)) : saved.tab === 8 ? UPDATES_TAB : saved.tab === 5 ? tabs.indexOf('吃大米饭') : saved.tab, subpage: sub }
  } catch (error) { return null }
}

function Page() {
  const savedLocation = readSavedLocation()
  const initialTab = openUpdatesRequested ? UPDATES_TAB : (savedLocation?.tab ?? 0)
  const [tab, setTab] = React.useState(initialTab)
  const [visited, setVisited] = React.useState([initialTab])
  const [subpage, setSubpage] = React.useState(savedLocation?.subpage || { 1: '连接', 2: '记忆库', 3: 'mood' })
  const [qqStatus, setQQStatus] = React.useState(null)
  const [versionInfo, setVersionInfo] = React.useState(null)
  const [updateAvailable, setUpdateAvailable] = React.useState(Boolean(FISH_UPDATE.result?.hasUpdate))
  React.useEffect(() => {
    const receive = result => setUpdateAvailable(Boolean(result?.hasUpdate))
    FISH_UPDATE.listeners.add(receive)
    receive(FISH_UPDATE.result)
    return () => FISH_UPDATE.listeners.delete(receive)
  }, [])
  const navRef = React.useRef(null), workspaceRef = React.useRef(null), contentRef = React.useRef(null), highlightRef = React.useRef(null)
  const enterAnimation = React.useRef(null)
  const qqGuard = React.useRef({ dirty: false, save: null })
  const speakGuard = React.useRef({ dirty: false, save: null })
  const navigateRef = React.useRef(null)
  const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // 立即换内容，再由 useLayoutEffect 做一次淡入；不再先把旧内容淡成空白。
  const animateChange = change => change()
  const activeGuard = () => tab === 1 ? qqGuard.current : tab === 4 ? speakGuard.current : null
  const requestLeave = async action => {
    const guard = activeGuard()
    if (guard?.dirty && typeof guard.save === 'function') {
      const saved = await guard.save()
      if (saved !== false) action()
      return
    }
    action()
  }
  const navigate = id => {
    if (id === tab) return
    requestLeave(() => animateChange(() => { setTab(id); setVisited(old => old.includes(id) ? old : [...old, id]) }))
  }
  const selectSubpage = (id, key) => {
    const current = subpage[id]
    if (id === tab && key === current) return
    requestLeave(() => animateChange(() => {
      setTab(id); setVisited(old => old.includes(id) ? old : [...old, id])
      setSubpage(old => ({ ...old, [id]: key }))
    }))
  }
  const flashJumpTarget = (id) => {
    let tries = 0
    const tick = () => {
      const el = typeof document !== 'undefined' ? document.getElementById(id) : null
      if (el && el.getClientRects().length) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.remove('fish-jump-flash')
        void el.offsetWidth
        el.classList.add('fish-jump-flash')
        setTimeout(() => el.classList.remove('fish-jump-flash'), 1500)
        return
      }
      if (++tries < 50) setTimeout(tick, 80)
    }
    setTimeout(tick, 50)
  }
  const openFileManager = () => {
    navigate(FILE_MANAGER_TAB)
    flashJumpTarget('fish-sticker-files-card')
  }
  navigateRef.current = navigate
  React.useEffect(() => {
    let active = true
    const loadVersion = () => request('/dsh-big-fish-aio/version')
      .then(info => { if (active && info && info.version) setVersionInfo(info) })
      .catch(() => {})
    void loadVersion()
    const onFocus = () => { void loadVersion() }
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') window.addEventListener('focus', onFocus)
    const timer = setInterval(loadVersion, 30000)
    return () => {
      active = false
      clearInterval(timer)
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') window.removeEventListener('focus', onFocus)
    }
  }, [])
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(LOCATION_KEY, JSON.stringify({ tab, tabLabel: tabs[tab], subpage }))
      }
    } catch (error) {}
  }, [tab, subpage])
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return undefined
    const onBeforeUnload = (event) => {
      const dirty = Boolean(qqGuard.current?.dirty || speakGuard.current?.dirty)
      if (!dirty) return undefined
      event.preventDefault()
      event.returnValue = '当前配置未保存，是否刷新？'
      return event.returnValue
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [tab])
  React.useEffect(() => {
    openUpdatesRequested = false
    showUpdates = () => navigateRef.current?.(UPDATES_TAB)
    return () => { showUpdates = null; enterAnimation.current?.cancel() }
  }, [])
  React.useEffect(() => {
    let active = true
    const refresh = () => request('/dsh-qq-bridge/state').then(s => { if (active) setQQStatus(s.NapCat状态) }).catch(() => { if (active) setQQStatus({ 错: '无法读取连接状态' }) })
    void refresh()
    const timer = setInterval(refresh, 15000)
    return () => { active = false; clearInterval(timer) }
  }, [])
  React.useLayoutEffect(() => {
    const nav = navRef.current, highlight = highlightRef.current
    if (!nav || !highlight) return
    const update = () => {
      const selected = nav.querySelector('[role=tab][aria-selected=true]')
      if (selected) { highlight.style.transform = 'translateY(' + selected.offsetTop + 'px)'; highlight.style.height = selected.offsetHeight + 'px' }
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update); observer.observe(nav)
    return () => observer.disconnect()
  }, [tab])
  React.useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return
    if (workspaceRef.current) workspaceRef.current.scrollTop = 0
    if (reducedMotion()) return
    enterAnimation.current?.cancel()
    if (node.animate) enterAnimation.current = node.animate([{ opacity: .35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' })
    return () => enterAnimation.current?.cancel()
  }, [tab, subpage])
  const subIndex = (submenus[tab] || []).findIndex(([key]) => key === subpage[tab])
  const subTitle = submenus[tab]?.[subIndex]?.[1]
  const englishPath = TAB_ENGLISH[tab] + (subTitle ? ' > ' + SUBMENU_ENGLISH[tab][subIndex] : '')
  const render = [
    () => h(Overview, { navigate, notify: fishNotify }),
    () => h(QQ, { page: subpage[1], onPageChange: key => selectSubpage(1, key), guard: qqGuard, notify: fishNotify, help: fishShowHelp, hideHelp: fishHideHelp, laterHideHelp: fishScheduleHelpHide, confirm: fishAskConfirm, editRole: fishAskText, openRoleWriter: fishOpenRoleWriter, openFileManager }),
    () => h(Memory, { page: subpage[2], onPageChange: key => selectSubpage(2, key), notify: fishNotify, active: tab === 2 }),
    () => h(Mood, { page: subpage[3], onPageChange: key => selectSubpage(3, key), notify: fishNotify, Dialog: components['dsh-fish-memory'].MemoryDialog }),
    () => h(Speak, { guard: speakGuard, notify: fishNotify }), () => h(OpenPlatform, { notify: fishNotify }), () => h(FileManager, { notify: fishNotify }), () => h(RunLog, { notify: fishNotify }), () => h(Rice, { notify: fishNotify, active: tab === tabs.indexOf('吃大米饭') }), () => h(Updates, { notify: fishNotify, versionInfo, onVersionInfo: setVersionInfo }),
  ]
  const connected = Boolean(qqStatus?.用户 && !qqStatus?.错)
  const connection = !qqStatus ? '正在读取 QQ 连接…' : qqStatus?.错 ? 'QQ 连接读取失败' : connected ? 'QQ 已连接 · ' + (qqStatus.昵称 || '伙伴') + ' · ' + qqStatus.用户 : 'QQ 未连接'
  return h('div', { className: 'big-fish' }, h('style', null, css),
    h('div', { className: 'fish-frame' },
      h(FishTextHost),
      h(FishRoleWriterHost),
      h(FishHelpHost),
      h(FishConfirmHost),
      h(FishSelectLayer),
      h('aside', { className: 'fish-binder' },
        h('div', { className: 'fish-rings', 'aria-hidden': true }, ...[0, 1, 2, 3, 4, 5, 6].map(i => h('span', { key: i }))),
        h('header', { className: 'fish-brand' },
          h('span', { className: 'fish-logo' }, h(FishIcon, { size: 30 })),
          h('span', { className: 'fish-brand-text' },
            h('span', { className: 'fish-brand-name' }, '大肥鱼'),
            h('span', { className: 'fish-brand-sub' }, 'QQ陪伴手帐')),
          h('button', {
            type: 'button', className: 'fish-version-pin',
            title: '大肥鱼 v' + (versionInfo?.version || META.version) + ' · 查看更新与来源',
            'aria-label': updateAvailable ? '发现新版本，查看更新与来源' : '查看更新与来源',
            onClick: () => navigate(UPDATES_TAB),
          }, updateAvailable ? h('span', { className: 'fish-update-dot', 'aria-hidden': true }) : null,
          (versionInfo?.installedChannel === 'beta' ? '内测' : 'v' + (versionInfo?.displayVersion || META.version)))),
        h('nav', { ref: navRef, className: 'fish-nav', 'aria-label': '大肥鱼功能', role: 'tablist', 'aria-orientation': 'vertical' },
          h('span', { ref: highlightRef, className: 'fish-nav-highlight', 'aria-hidden': true }),
          ...tabs.map((label, id) => {
            const items = submenus[id]
            const selected = subpage[id]
            return h('div', { key: label, className: 'fish-nav-group' },
              h('button', {
                type: 'button', role: 'tab', id: 'fish-tab-' + id, 'aria-label': label, 'aria-selected': tab === id, 'aria-controls': 'fish-panel-' + id,
                tabIndex: tab === id ? 0 : -1, className: 'fish-tab', onClick: () => navigate(id), onKeyDown: e => {
                  const next = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? (id + 1) % tabs.length : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? (id + tabs.length - 1) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null
                  if (next !== null) { e.preventDefault(); navigate(next); e.currentTarget.closest('[role=tablist]').querySelectorAll('[role=tab]')[next].focus() }
                },
              }, h('span', { className: 'fish-tab-icon', 'aria-hidden': true }, h(Glyph, { name: TAB_ICONS[id], size: 19 })), h('span', { className: 'fish-tab-label' }, label), h('span', { className: 'fish-tab-no', 'aria-hidden': true }, String(id + 1).padStart(2, '0'))),
              items && tab === id ? h('div', { className: 'fish-submenu', role: 'group', 'aria-label': label + '子菜单' },
                ...items.map(([key, name]) => h('button', { key, type: 'button', 'aria-current': selected === key ? 'page' : undefined, onClick: () => selectSubpage(id, key) }, name))) : null)
          })),
        h('div', { className: 'fish-binder-foot' },
          h('div', { className: 'fish-sidebar-note', role: 'status', title: qqStatus?.错 || connection },
            h('span', { className: 'fish-connection-dot', 'data-connected': connected, 'aria-hidden': true }), h('span', null, connection)))),
      h('main', { className: 'fish-workspace' },
        h('div', { className: 'fish-paper' },
          h('span', { className: 'fish-tape fish-tape-corner fish-tape-left', 'aria-hidden': true }),
          h('span', { className: 'fish-tape fish-tape-corner fish-tape-right', 'aria-hidden': true }),
          h('span', { className: 'fish-fade fish-fade-top', 'aria-hidden': true }),
          h('span', { className: 'fish-fade fish-fade-bottom', 'aria-hidden': true }),
          h('div', { ref: workspaceRef, className: 'fish-scroll' },
            h('div', { ref: contentRef, className: 'fish-content' + (tab === 0 ? ' fish-overview-content' : ' fish-flat') },
              tab === 0 ? null : h('header', { className: 'fish-page-head' },
                h('div', { className: 'fish-page-head-copy' },
                  h('nav', { className: 'fish-breadcrumb', 'aria-label': '页面路径' },
                    h('span', { className: 'fish-kicker', lang: 'en' }, englishPath),
                    h('h1', { className: 'fish-breadcrumb-title' }, h('span', null, tabs[tab] === '开放平台' ? '大肥鱼开放平台' : tabs[tab]),
                      subTitle ? h(React.Fragment, null, h('span', { className: 'fish-breadcrumb-separator', 'aria-hidden': true }, '>'), h('span', { className: 'fish-breadcrumb-current', 'aria-current': 'page' }, subTitle)) : null)),
                  h('p', { className: 'fish-page-desc' }, tabs[tab] === '开放平台' ? h('strong', null, DESCRIPTIONS[tab]) : DESCRIPTIONS[tab])),
                h('div', { className: 'fish-page-stamp', 'aria-hidden': true },
                  h(Glyph, { name: TAB_ICONS[tab], size: 30 }),
                  h('span', { className: 'fish-page-stamp-no' }, String(tab + 1).padStart(2, '0')),
                  h('span', { className: 'fish-page-stamp-label' }, TAB_STAMPS[tab]))),
              ...visited.map(id => h('section', { key: id, id: 'fish-panel-' + id, role: 'tabpanel', 'aria-labelledby': 'fish-tab-' + id, className: 'fish-panel', hidden: tab !== id }, render[id]()))))))))
}


return {
  inject: ['slots'],
  apply(ctx) {
    const slots = ctx.get('slots')
    if (!slots) return
    const readiness = ctx.get('modules')?.entries?.state
    slots.inject('sidebar.panellist', () => slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 20, label: () => '大肥鱼' }, FishIcon))
    slots.inject('main', () => {
      const unregister = slots.register({ name: 'main', key: PANEL_ID }, Page)
      const stopReopen = 挂载更新后重开(ctx, readiness)
      return () => { stopReopen(); unregister?.() }
    })
    slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'big-fish-update-notice' }, () => h(React.Fragment, null,
      h(NotificationHost),
      h(UpdateLogHost, { readiness }),
      h(UpdateNotifier, { open: () => {
        openUpdatesRequested = true
        ctx.get('layout')?.selectPanel(PANEL_ID)
        showUpdates?.()
      } }))))
  },
}
