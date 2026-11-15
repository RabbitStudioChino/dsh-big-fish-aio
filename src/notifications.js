const FISH_TOAST = { items: [], serial: 0, listeners: new Set() }
function fishNotify(text, options = {}) {
  const value = String(text ?? '').trim()
  if (!value) return
  const id = ++FISH_TOAST.serial
  const normalize = value => typeof value === 'number' && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : undefined
  const publish = () => FISH_TOAST.listeners.forEach(listener => listener())
  FISH_TOAST.items = [{ id, text: value, tone: options.tone, actions: options.actions, progress: normalize(options.progress) }, ...FISH_TOAST.items]
  publish()
  return {
    update(patch) {
      FISH_TOAST.items = FISH_TOAST.items.map(item => item.id === id ? { ...item, ...patch,
        ...(Object.hasOwn(patch, 'progress') ? { progress: normalize(patch.progress) } : {}) } : item)
      publish()
    },
    close() { fishToastDone(id) },
  }
}
function fishToastDone(id) {
  FISH_TOAST.items = FISH_TOAST.items.filter(item => item.id !== id)
  FISH_TOAST.listeners.forEach(listener => listener())
}
function FishNotice({ item }) {
  const [hover, setHover] = React.useState(false), [focus, setFocus] = React.useState(false)
  const [closing, setClosing] = React.useState(false)
  const remaining = React.useRef(5000)
  const controlled = item.progress !== undefined
  const paused = !controlled && (hover || focus)
  React.useEffect(() => {
    if (!closing) return
    const timer = setTimeout(() => fishToastDone(item.id), 180)
    return () => clearTimeout(timer)
  }, [closing, item.id])
  React.useEffect(() => {
    if (closing || paused) return
    if (controlled && item.progress < 100) { remaining.current = 5000; return }
    const started = Date.now(), timer = setTimeout(() => setClosing(true), remaining.current)
    return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - started)) }
  }, [paused, closing, item.id, item.progress])
  return h('article', { className: 'fish-notice-card' + (closing ? ' is-closing' : ''), 'data-tone': item.tone || 'info', role: 'status',
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    onFocusCapture: () => setFocus(true), onBlurCapture: event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false) } },
    h('div', { className: 'fish-notice-text' }, item.text),
    h('button', { type: 'button', className: 'fish-notice-close', 'aria-label': '关闭通知', onClick: () => setClosing(true) }, '×'),
    item.actions?.length ? h('div', { className: 'fish-notice-actions' }, ...item.actions.map((action, index) =>
      h('button', { type: 'button', key: index, onClick: () => { action.onClick?.(); setClosing(true) } }, action.label))) : null,
    h('i', { className: 'fish-notice-progress', 'aria-hidden': controlled ? undefined : true, role: controlled ? 'progressbar' : undefined,
      'aria-label': controlled ? '任务进度' : undefined, 'aria-valuemin': controlled ? 0 : undefined, 'aria-valuemax': controlled ? 100 : undefined, 'aria-valuenow': item.progress,
      style: controlled ? { animation: 'none', transform: 'scaleX(' + item.progress / 100 + ')' } : { animationPlayState: paused || closing ? 'paused' : 'running' } }))
}
function NotificationHost() {
  const [items, setItems] = React.useState(FISH_TOAST.items), ref = React.useRef(null)
  const positions = React.useRef(new Map())
  const [mount] = React.useState(() => {
    const node = document.createElement('div')
    node.style.display = 'contents'
    return node
  })
  const { createPortal } = require('react-dom')
  React.useLayoutEffect(() => {
    const attach = () => {
      const modal = document.activeElement?.closest('dialog:modal') || [...document.querySelectorAll('dialog:modal')].at(-1)
      const target = modal || document.body, notice = ref.current
      if (mount.parentNode !== target) { notice?.hidePopover?.(); target.appendChild(mount) }
      if (FISH_TOAST.items.length && notice?.isConnected && !notice.matches(':popover-open')) notice.showPopover?.()
    }
    attach()
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
    document.addEventListener('focusin', attach, true)
    return () => { observer.disconnect(); document.removeEventListener('focusin', attach, true); mount.remove() }
  }, [mount])
  React.useEffect(() => {
    const update = () => setItems(FISH_TOAST.items)
    FISH_TOAST.listeners.add(update); update()
    return () => FISH_TOAST.listeners.delete(update)
  }, [])
  React.useLayoutEffect(() => {
    if (items.length) ref.current?.showPopover?.()
    else ref.current?.hidePopover?.()
  }, [items.length])
  React.useLayoutEffect(() => {
    const stack = ref.current
    const observer = new ResizeObserver(() => {
      positions.current = new Map(Array.from(stack.querySelectorAll('.fish-notice-slot'), slot => [slot.dataset.noticeId, slot.offsetTop]))
    })
    observer.observe(stack)
    return () => observer.disconnect()
  }, [])
  React.useLayoutEffect(() => {
    const stack = ref.current
    if (!stack) return
    if (items[0] && !positions.current.has(String(items[0].id))) stack.scrollTop = 0
    const next = new Map(), stackTop = stack.getBoundingClientRect().top
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    for (const slot of stack.querySelectorAll('.fish-notice-slot')) {
      const id = slot.dataset.noticeId, top = slot.offsetTop, previous = positions.current.get(id)
      if (reduced) slot.getAnimations().forEach(animation => animation.cancel())
      else if (previous !== undefined && previous !== top) {
        // 连续插入时从当前视觉位置续接，避免打断下移后跳动。
        const shift = slot.getBoundingClientRect().top - stackTop + stack.scrollTop - top
        slot.getAnimations().forEach(animation => animation.cancel())
        slot.animate([{ transform: 'translateY(' + (previous - top + shift) + 'px)' }, { transform: 'translateY(0)' }],
          { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' })
      }
      next.set(id, top)
    }
    positions.current = next
  }, [items])
  return createPortal(h('div', { ref, popover: 'manual', className: 'big-fish-notice fish-notice-stack', 'aria-label': '全局通知' },
    h('style', null, FISH_THEME_CSS), ...items.map(item => h('div', { key: item.id, className: 'fish-notice-slot', 'data-notice-id': item.id }, h(FishNotice, { item })))), mount)
}
