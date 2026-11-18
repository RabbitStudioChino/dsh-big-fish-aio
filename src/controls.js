function FishRefreshButton({ onClick, busy = false, disabled = false, label = '刷新', className = '', children, ...props }) {
  const React = require('react'), h = React.createElement
  const [pending, setPending] = React.useState(false)
  const inFlight = React.useRef(false)
  const refreshing = busy || pending
  return h('button', { ...props, type: 'button',
    className: 'fish-button fish-refresh-button' + (className ? ' ' + className : ''),
    disabled: disabled || refreshing, 'aria-busy': refreshing, 'aria-label': label,
    title: refreshing ? '正在' + label : label,
    onClick: async event => {
      if (disabled || busy || inFlight.current) return
      inFlight.current = true
      setPending(true)
      try { await onClick?.(event) }
      finally { inFlight.current = false; setPending(false) }
    } }, h(Glyph, { name: 'refresh', size: 18, className: 'fish-spin' }))
}

// 顶层 dialog 让弹窗避开滚动容器的裁剪和定位上下文。
function FishModal({ children, onCancel, tone, ...props }) {
  const React = require('react'), ref = React.useRef(null)
  React.useLayoutEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  return React.createElement('dialog', { ...props, className: (props.className || '') + (tone === 'danger' ? ' fish-modal-danger' : ''), ref, role: 'presentation', onCancel: event => { event.preventDefault(); onCancel?.(event) } }, children)
}

function FishSwitch({ checked = false, disabled = false, onChange, className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('button', { ...props, type: 'button', role: 'switch', 'aria-checked': Boolean(checked), disabled,
    className: 'fish-switch' + (className ? ' ' + className : ''),
    onClick: () => {
      if (disabled) return
      // 保留各页现有的 checked 事件签名，复用即时保存与失败恢复逻辑。
      return onChange?.({ target: { checked: !checked }, currentTarget: { checked: !checked } })
    } },
    h('span', { className: 'fish-switch-thumb', 'aria-hidden': true }))
}

// 大肥鱼通用表单控件：输入框 / 下拉框 / 多行文本。
// 全局面板仍会统一修饰原生控件；这些组件给新页面提供一致的结构与图标位。
function FishInput({ icon, className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('span', { className: 'fish-input-box' + (className ? ' ' + className : '') },
    icon ? h('span', { className: 'fish-input-icon', 'aria-hidden': true }, icon) : null,
    h('input', { ...props, className: 'fish-input' + (icon ? ' fish-input-with-icon' : '') }))
}

function FishSelect({ children, className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('span', { className: 'fish-select-box' + (className ? ' ' + className : '') },
    h('select', { ...props, className: 'fish-select-input' }, children))
}

function FishTextarea({ className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('textarea', { ...props, className: 'fish-textarea-input' + (className ? ' ' + className : '') })
}

// 全局 select 浮层：接管原生下拉菜单，统一成手帐风格。
function FishSelectLayer() {
  const React = require('react'), h = React.createElement
  const [popup, setPopup] = React.useState(null)
  const popupRef = React.useRef(null)
  const selectRef = React.useRef(null)
  const lastClosed = React.useRef({ select: null, at: 0 })

  const close = (focus = true, toggle = false) => {
    const select = selectRef.current
    selectRef.current = null
    if (toggle && select) lastClosed.current = { select, at: Date.now() }
    if (select) {
      select.removeAttribute('aria-expanded')
      if (focus && typeof document !== 'undefined' && document.contains(select)) select.focus({ preventScroll: true })
    }
    setPopup(null)
  }

  const open = (select) => {
    if (!select || select.disabled || select.multiple) return
    if (selectRef.current === select) { close(true, true); return }
    const options = Array.from(select.options).map((option, index) => ({
      value: option.value,
      label: String(option.textContent || '').trim(),
      disabled: option.disabled,
      selected: index === select.selectedIndex,
    }))
    if (!options.length) return
    if (popupRef.current) {
      selectRef.current?.removeAttribute('aria-expanded')
    }
    const rect = select.getBoundingClientRect()
    const minWidth = select.dataset?.fishSelectCompact === 'true' ? 0 : 220
    const width = Math.min(Math.max(minWidth, Math.ceil(rect.width)), Math.max(0, window.innerWidth - 16))
    const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - width - 8))
    const below = Math.max(0, window.innerHeight - rect.bottom - 8)
    const above = Math.max(0, rect.top - 8)
    const wanted = Math.min(300, options.length * 42 + 14)
    const openUp = below < wanted && above > below
    const maxHeight = Math.min(300, openUp ? above : below)
    const top = openUp ? null : rect.bottom
    const bottom = openUp ? window.innerHeight - rect.top : null
    const selectedIndex = Math.max(0, select.selectedIndex)
    selectRef.current = select
    select.setAttribute('aria-expanded', 'true')
    select.setAttribute('aria-haspopup', 'listbox')
    setPopup({ select, options, active: selectedIndex, left, top, bottom, width, maxHeight })
  }

  const choose = (option) => {
    const select = selectRef.current
    if (!select || option.disabled) return
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
    if (setter) setter.call(select, option.value)
    else select.value = option.value
    select.dispatchEvent(new Event('input', { bubbles: true }))
    select.dispatchEvent(new Event('change', { bubbles: true }))
    close(true)
  }

  React.useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const onPointerDown = (event) => {
      const target = event.target
      if (popupRef.current && target instanceof Node && popupRef.current.contains(target)) return
      const select = target && target.closest ? target.closest('select') : null
      if (select && select.closest('.big-fish') && !select.disabled && !select.multiple) {
        event.preventDefault()
        event.stopPropagation()
        open(select)
        return
      }
      if (popupRef.current) close(false)
    }
    const onClick = (event) => {
      const target = event.target
      const select = target && target.closest ? target.closest('select') : null
      if (select) { event.preventDefault(); event.stopPropagation() }
    }
    const onMouseDown = (event) => {
      const target = event.target
      const select = target && target.closest ? target.closest('select') : null
      if (!select || !select.closest('.big-fish') || select.disabled || select.multiple) return
      event.preventDefault()
      event.stopPropagation()
      const closed = lastClosed.current
      if (closed.select === select && Date.now() - closed.at < 300) return
      if (!popupRef.current || selectRef.current !== select) open(select)
    }
    const onKeyDown = (event) => {
      const target = event.target
      if (!target || target.tagName !== 'SELECT' || !target.closest?.('.big-fish')) return
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        open(target)
      }
    }
    const onViewportChange = (event) => {
      if (!popupRef.current) return
      if (event?.target instanceof Node && popupRef.current.contains(event.target)) return
      close(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
    }
  }, [])

  React.useLayoutEffect(() => {
    if (popup) {
      popupRef.current?.showPopover?.()
      popupRef.current?.focus({ preventScroll: true })
    }
  }, [popup && popup.select])

  React.useEffect(() => {
    if (!popup) return
    const active = popupRef.current?.querySelector('.fish-select-option.is-active')
    active?.scrollIntoView({ block: 'nearest' })
  }, [popup && popup.active])

  if (!popup) return null
  const move = (step) => {
    if (!popup.options.length) return
    let next = popup.active
    for (let i = 0; i < popup.options.length; i++) {
      next = (next + step + popup.options.length) % popup.options.length
      if (!popup.options[next].disabled) break
    }
    setPopup(current => current ? { ...current, active: next } : current)
  }
  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); return }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); move(event.key === 'ArrowDown' ? 1 : -1); return }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(popup.options[popup.active]); return }
    if (event.key === 'Tab') close(false)
  }
  // 菜单须位于所属模态框内，避免被原生 dialog 的背景禁用规则拦截。
  return require('react-dom').createPortal(h('div', {
    ref: popupRef, popover: 'manual', className: 'fish-select-popup', role: 'listbox', tabIndex: -1,
    'data-compact': popup.select.dataset?.fishSelectCompact,
    'aria-label': popup.select.getAttribute('aria-label') || '选项',
    style: { left: popup.left + 'px', top: popup.top === null ? 'auto' : popup.top + 'px',
      bottom: popup.bottom === null ? 'auto' : popup.bottom + 'px', width: popup.width + 'px', maxHeight: popup.maxHeight + 'px' },
    onKeyDown, onPointerDown: event => event.stopPropagation(),
  }, ...popup.options.map((option, index) => h('button', {
    key: index, type: 'button', role: 'option', disabled: option.disabled,
    'aria-selected': option.selected ? 'true' : 'false',
    className: 'fish-select-option' + (index === popup.active ? ' is-active' : ''),
    onClick: () => choose(option),
    onMouseEnter: () => setPopup(current => current ? { ...current, active: index } : current),
  }, h('span', null, option.label)))), popup.select.closest('[aria-modal="true"], dialog[open]') || popup.select.closest('.big-fish'))
}

// 同一配置区域串行提交，输入框保留编辑过程，失焦才进入保存队列。
function useFishAutosave(save) {
  const React = require('react'), latest = React.useRef(save), state = React.useRef({ timer: null, pending: false, running: null })
  latest.current = save
  const flush = () => {
    const job = state.current
    clearTimeout(job.timer); job.pending = true
    if (job.running) return job.running
    job.running = (async () => {
      let saved
      while (job.pending) { job.pending = false; saved = await latest.current() }
      return saved
    })().catch(error => { if (typeof fishNotify === 'function') fishNotify('保存失败：' + error.message) }).finally(() => { job.running = null })
    return job.running
  }
  const schedule = () => { clearTimeout(state.current.timer); state.current.timer = setTimeout(() => { void flush() }, 0) }
  const textField = target => target.matches?.('textarea,input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=button]):not([type=submit])')
  return {
    flush,
    onClickCapture: event => { if (event.target.closest?.('button.fish-switch:not(:disabled)')) schedule() },
    onChangeCapture: event => { if (!textField(event.target)) schedule() },
    onBlurCapture: event => { if (textField(event.target)) schedule() },
  }
}
