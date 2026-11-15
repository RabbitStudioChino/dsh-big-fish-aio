// 大肥鱼心情 · 右下角挂饰（浏览器端，纯 DOM）
// 挂饰 = 整张形象图直接当按钮，可拖动（拖不出屏幕）；面板会按屏幕边自动适配
;(function () {
  'use strict'
  var version = 'charm-shared-theme-palette'
  if (window.__feiyuMoodVersion === version && document.querySelectorAll('.fm-widget').length) return
  if (window.__feiyuMoodDispose) window.__feiyuMoodDispose()
  document.querySelectorAll('.fm-widget').forEach(function (node) { node.remove() })
  document.head.querySelectorAll('style').forEach(function (node) {
    if (node.textContent.indexOf('.fm-widget{') >= 0) node.remove()
  })
  window.__feiyuMoodInited = true
  window.__feiyuMoodVersion = version
  var controller = new AbortController()
  function listen(target, name, callback, capture) {
    target.addEventListener(name, callback, { signal: controller.signal, capture: Boolean(capture) })
  }

  var B = '/dsh-feiyu-mood'
  var dimColor = {
    happy: 'var(--fm-green)', calm: 'var(--fm-blue)', sweet: 'var(--fm-pink)',
    heartache: 'var(--fm-amber)', worry: 'var(--fm-amber)', sad: 'var(--fm-blue)', jealous: 'var(--fm-purple)'
  }

  function face(v, faces) {
    var tier = v >= 80 ? 'great' : v >= 62 ? 'good' : v >= 42 ? 'ok' : v >= 25 ? 'worry' : 'sad'
    var labels = { great: '欢喜', good: '开心', ok: '一般', worry: '心疼', sad: '难过' }
    if (faces && faces[tier]) return { img: faces[tier].url, label: labels[tier] }
    if (v >= 80) return { img: B + '/face-great.png', label: '欢喜' }
    if (v >= 62) return { img: B + '/face-good.png', label: '开心' }
    if (v >= 42) return { img: B + '/face-ok.png', label: '一般' }
    if (v >= 25) return { img: B + '/face-worry.png', label: '心疼' }
    return { img: B + '/face-sad.png', label: '难过' }
  }

  var css = [
    ':host{all:initial;display:block}',
    FISH_PALETTE_CSS,
    // 尺寸由设置页调整，--fm-scale 保存当前倍数。
    ':host{position:fixed;right:18px;bottom:18px;z-index:99990;--fm-scale:1;',
    'width:calc(180px * var(--fm-scale));height:calc(180px * var(--fm-scale));',
    'cursor:grab;user-select:none;background:transparent;border:0;padding:0;-webkit-user-drag:none;',
    'transition:filter .15s}',
    ':host(:not(:popover-open)){display:none}:host::backdrop{background:transparent;pointer-events:none}',
    ':host .fm-trigger{width:100%;height:100%;min-width:0;min-height:0;display:block;appearance:none;border:0;padding:0;margin:0;background:transparent;box-shadow:none;cursor:grab;touch-action:none}',
    ':host .fm-trigger:hover{filter:brightness(1.04)}',
    ':host .fm-trigger:active{cursor:grabbing}',
    ':host .fm-trigger>img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}',
    // 面板：基础定位（JS positionPanel 会按屏幕边适配再调）
    ':host .fm-panel{position:absolute;box-sizing:border-box;left:0;width:352px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);',
    'overflow:auto;background:var(--fm-glass-highlight),rgba(var(--fm-glass-color),var(--fm-glass-alpha,.65));color:var(--fm-text);border:1px solid var(--fm-glass-edge);',
    'backdrop-filter:blur(24px) saturate(180%) brightness(1.08);-webkit-backdrop-filter:blur(24px) saturate(180%) brightness(1.08);',
    'border-radius:24px;box-shadow:var(--fm-glass-shadow);padding:16px;display:none;',
    'font-size:14px;line-height:1.7;cursor:auto;',
    'font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}',
    ':host .fm-panel img{pointer-events:none;-webkit-user-drag:none}',
    ':host .fm-head{display:flex;align-items:center;gap:12px;margin-bottom:4px}',
    ':host .fm-face{width:64px;height:64px;object-fit:contain;flex:none}',
    ':host .fm-big{font-size:22px;font-weight:600;line-height:1.4}',
    ':host .fm-reason{color:var(--fm-muted);margin:6px 0 10px;overflow-wrap:anywhere}',
    ':host .fm-dim{display:flex;align-items:center;gap:8px;margin:4px 0}',
    ':host .fm-dimlabel{width:34px;flex:none;color:var(--fm-muted)}',
    ':host .fm-bar{flex:1;height:7px;border-radius:4px;background:var(--fm-soft);overflow:hidden}',
    ':host .fm-bar i{display:block;height:100%}',
    ':host .fm-val{width:28px;text-align:right;color:var(--fm-muted);flex:none}',
    ':host .fm-title{margin:0 0 12px;font-size:16px;font-weight:650;color:var(--fm-text)}',
    ':host .fm-note{color:var(--fm-muted);font-size:12px;margin-top:8px;overflow-wrap:anywhere}',
    ':host .fm-memory{white-space:pre-wrap;overflow-wrap:anywhere;max-height:50vh;overflow:auto;user-select:text}',
    // 开销卡片沿用色库中的统计配色。
    ':host .fm-panel[data-content=cost]{font-family:"HarmonyOS Sans SC",-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}',
    ':host .rice-stat{display:grid;gap:5px;min-width:0;margin-top:12px;padding:16px;border:1px solid var(--fm-border);border-radius:22px;background:rgba(var(--fm-glass-color),calc(var(--fm-glass-alpha,.65) * .35));box-shadow:var(--fm-shadow)}',
    ':host .rice-stat-label{color:var(--fm-muted);font-size:12.5px}',
    ':host .rice-stat-value{font-family:inherit;font-size:26px;line-height:1.15;overflow-wrap:anywhere}',
    ':host .rice-stat-cost{color:var(--fm-green);font-family:inherit;font-size:15px;font-weight:600}',
    ':host .rice-stat-sub{color:var(--fm-muted);font-size:12px;overflow-wrap:anywhere}',
    '@media(prefers-reduced-motion:reduce){:host,:host *{transition:none!important}}:host .fm-trigger:focus-visible{outline:2px solid var(--fm-accent);outline-offset:3px}'
  ].join('')

  function el(tag, cls, text) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (text != null) n.textContent = text
    return n
  }
  function elImg(src, cls, alt) {
    var n = document.createElement('img')
    n.src = src
    n.className = cls
    n.alt = alt || ''
    n.draggable = false
    return n
  }

  var widget = el('div', 'fm-widget')
  widget.setAttribute('popover', 'manual')
  var root = widget.attachShadow({ mode: 'open' })
  // 构造样式表留在 Shadow DOM 中，避免依赖宿主中的 style 标签。
  var sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  root.adoptedStyleSheets = [sheet]
  function syncTheme() {
    widget.setAttribute('data-theme', document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light')
  }
  syncTheme()
  var themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
  // 基础布局内联，避免宿主清理 head 样式后原图进入页面排版。
  Object.assign(widget.style, {
    position: 'fixed', right: '18px', bottom: '18px', zIndex: '99990',
    width: 'calc(180px * var(--fm-scale, 1))', height: 'calc(180px * var(--fm-scale, 1))',
  })
  var bodyImg = elImg(B + '/feiyu.png', '', '形象')
  Object.assign(bodyImg.style, { width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' })
  var trigger = el('button', 'fm-trigger')
  trigger.type = 'button'
  Object.assign(trigger.style, { width: '100%', height: '100%', padding: '0', border: '0', background: 'transparent', display: 'block', touchAction: 'none' })
  trigger.appendChild(bodyImg)
  root.appendChild(trigger)
  trigger.title = '点击展开或关闭挂饰弹出卡片，按住拖动换位置'

  // ⭐ 2026-10-31：**外面这个小挂件跟着心情换形象**（五档，和面板里那张脸同一套阈值）
  //   1 大笑 / 2 微笑 / 3 普通（原图 feiyu.png）/ 4 嘟嘴 / 5 哭
  //   ⚠ 3 档仍然用 feiyu.png 那个路径，别改成 feiyu-ok.png —— 老图不动，免得缓存和备份对不上
  function bodyFor(v, images) {
    var tier = v >= 80 ? 'great' : v >= 62 ? 'good' : v >= 42 ? 'ok' : v >= 25 ? 'worry' : 'sad'
    var defaults = { great: 'feiyu-great.png', good: 'feiyu-good.png', ok: 'feiyu.png', worry: 'feiyu-worry.png', sad: 'feiyu-sad.png' }
    return images && images[tier] ? images[tier].url : B + '/' + defaults[tier]
  }
  var 当前形象 = B + '/feiyu.png'
  function 换形象(v, images) {
    if (v == null || v === '') return
    var src = bodyFor(Number(v), images)
    if (src === 当前形象) return
    当前形象 = src
    bodyImg.src = src
  }
  // 五张先各自拉一遍，换档的时候不会空一下（本地端口，几十毫秒）
  ;[B + '/feiyu-great.png', B + '/feiyu-good.png', B + '/feiyu.png', B + '/feiyu-worry.png', B + '/feiyu-sad.png']
    .forEach(function (u) { var i = new Image(); i.src = u })

  try { 设缩放(取缩放()) } catch (e) {}
  setTransparency(readTransparency())

  var panel = el('div', 'fm-panel')
  panel.id = 'fish-mood-value-panel'
  Object.assign(panel.style, { display: 'none', position: 'absolute', overflow: 'auto', boxSizing: 'border-box' })
  root.appendChild(panel)
  panel.setAttribute('role', 'region')
  panel.setAttribute('aria-label', '挂饰弹出卡片')
  trigger.setAttribute('aria-controls', panel.id)
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-label', '展开挂饰弹出卡片')

  var open = false
  var data = null
  var panelMode = readPanelMode()
  var memorySelection = null
  var requestVersion = 0

  // 以挂饰为锚点定位，空间不足时夹入视口并允许卡片内部滚动。
  function positionPanel() {
    if (!open) return
    var rect = widget.getBoundingClientRect()
    var margin = 8
    var winW = window.innerWidth
    var winH = window.innerHeight
    panel.style.width = Math.min(352, Math.max(0, winW - 2 * margin)) + 'px'
    panel.style.maxHeight = Math.max(0, winH - 2 * margin) + 'px'
    var above = Math.max(0, rect.top - margin - 10)
    var below = Math.max(0, winH - rect.bottom - margin - 10)
    var useAbove = panel.offsetHeight <= above || above >= below
    panel.style.maxHeight = (useAbove ? above : below) + 'px'
    var pw = panel.offsetWidth
    var ph = panel.offsetHeight
    var left = Math.max(margin, Math.min(winW - pw - margin, rect.left + (rect.width - pw) / 2))
    var top = useAbove ? rect.top - ph - 10 : rect.bottom + 10
    top = Math.max(margin, Math.min(winH - ph - margin, top))
    panel.style.left = (left - rect.left) + 'px'
    panel.style.top = (top - rect.top) + 'px'
    panel.style.bottom = 'auto'
  }

  function readTransparency() {
    var stored
    try { stored = localStorage.getItem('fm-widget-transparency') } catch (e) {}
    var value = stored == null ? 35 : Number(stored)
    return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 35
  }
  function setTransparency(value) {
    var next = Number(value)
    next = Number.isFinite(next) ? Math.min(100, Math.max(0, next)) : 35
    widget.style.setProperty('--fm-glass-alpha', String((100 - next) / 100))
  }

  function readPanelMode() {
    var value
    try { value = localStorage.getItem('fm-widget-panel') } catch (e) {}
    return ['mood', 'cost', 'memory'].includes(value) ? value : 'mood'
  }

  function panelTitle() {
    return { mood: '今日心情', cost: '今日开销', memory: '随机记忆' }[panelMode]
  }

  function renderNotice(message) {
    panel.setAttribute('data-content', panelMode)
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', panelTitle()))
    panel.appendChild(el('div', 'fm-reason', message))
    positionPanel()
  }

  function renderMain(d) {
    var f = face(d.mood, d.charmFaces)
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', '今日心情'))
    if (d.label) panel.appendChild(el('div', 'fm-note', d.label))
    var head = el('div', 'fm-head')
    head.appendChild(elImg(f.img, 'fm-face', f.label))
    var htxt = el('div')
    htxt.appendChild(el('div', 'fm-big', (d.mood == null ? '--' : d.mood) + '  ' + f.label))
    var midnight = new Date()
    midnight.setHours(0, 0, 0, 0)
    var today = (d.timeline || []).filter(function (entry) { return new Date(entry.at).getTime() >= midnight.getTime() })
    htxt.appendChild(el('div', 'fm-reason', today.length ? d.lastReason || '今日已有心情变化。' : '今日暂无心情变化记录。'))
    head.appendChild(htxt)
    panel.appendChild(head)

    ;(d.dims || []).forEach(function (x) {
      var row = el('div', 'fm-dim')
      row.appendChild(el('span', 'fm-dimlabel', x.label))
      var bar = el('div', 'fm-bar')
      var fill = el('i')
      fill.style.width = (x.value || 0) + '%'
      fill.style.background = dimColor[x.key] || 'var(--fm-muted)'
      bar.appendChild(fill)
      row.appendChild(bar)
      row.appendChild(el('span', 'fm-val', String(x.value || 0)))
      panel.appendChild(row)
    })

    positionPanel()
  }

  function renderCost(report) {
    if (!Array.isArray(report.days) || !report.今天) throw new Error('用量数据格式不完整')
    var day = report.days.find(function (row) { return row.date === report.今天 }) || {}
    var formatTokens = function (value) {
      var number = Math.max(0, Number(value) || 0)
      if (number >= 1e6) return (number / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'
      if (number >= 1e3) return (number / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K'
      return Math.round(number).toLocaleString('zh-CN')
    }
    var cost = Math.max(0, Number(day.cost) || 0)
    var money = '¥' + (cost >= 100 ? cost.toFixed(2) : cost >= 1 ? cost.toFixed(3) : cost.toFixed(4))
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', '今日开销'))
    panel.appendChild(el('div', 'fm-note', report.今天 + ' · 北京时间 · 工作区估算'))
    var card = el('article', 'rice-stat')
    card.appendChild(el('span', 'rice-stat-label', '今天'))
    card.appendChild(el('strong', 'rice-stat-value', formatTokens(day.total)))
    card.appendChild(el('span', 'rice-stat-cost', '≈ ' + money))
    card.appendChild(el('span', 'rice-stat-sub', '输入 ' + formatTokens(day.input) + ' · 输出 ' + formatTokens(day.output)))
    card.appendChild(el('span', 'rice-stat-sub', '缓存 ' + formatTokens((day.cacheRead || 0) + (day.cacheWrite || 0)) + ' · RAG ' + formatTokens(day.ragTokens)))
    card.appendChild(el('span', 'rice-stat-sub', 'RAG 调用 ' + formatTokens(day.ragCalls) + ' 次'))
    panel.appendChild(card)
    if (day.ragUnpriced || day.ragUnknownTokens) panel.appendChild(el('div', 'fm-note', '部分 RAG 用量缺少定价或 Token，估算金额尚未计全。'))
    positionPanel()
  }

  function selectMemory(list, mood) {
    var slot = (mood.slots || []).find(function (item) { return item.id === mood.key })
    var sessions = new Set((slot && slot.sessions || []).concat(mood.key))
    var seen = new Set()
    var choices = []
    ;(list.sessions || []).forEach(function (library) {
      if (!sessions.has(library.id) && library.storeId !== mood.key) return
      ;(library.memories || []).forEach(function (memory, index) {
        var key = (library.storeId || library.id) + ':' + (memory.id || index)
        if (seen.has(key) || memory.已被取代 || !String(memory.text || '').trim()) return
        seen.add(key)
        choices.push({ text: memory.text, at: memory.at, title: slot && slot.label || library.title || '' })
      })
    })
    return choices.length ? choices[Math.floor(Math.random() * choices.length)] : null
  }

  function renderMemory(memory) {
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', '随机记忆'))
    panel.appendChild(el('div', 'fm-memory', memory ? memory.text : '当前心情绑定范围暂无可展示记忆。'))
    if (memory) {
      panel.appendChild(el('div', 'fm-note', memory.title))
      if (memory.at) panel.appendChild(el('div', 'fm-note', memory.at))
    }
    positionPanel()
  }

  async function readJson(url) {
    var response = await fetch(url, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error('HTTP ' + response.status)
    var result = await response.json()
    if (result.ok === false) throw new Error(result.error || '读取失败')
    return result
  }

  async function load() {
    var current = ++requestVersion
    try {
      var next = await readJson(B + '/state')
      if (current !== requestVersion || controller.signal.aborted) return
      data = next
      换形象(next.mood, next.charmImages)
      if (!open) return
      if (panelMode === 'mood') return renderMain(next)
      if (panelMode === 'cost') {
        var report = await readJson('/dsh-qq-bridge/rice')
        if (current === requestVersion && !controller.signal.aborted) renderCost(report)
        return
      }
      if (!memorySelection || memorySelection.key !== next.key) {
        var list = await readJson('/dsh-fish-memory/list')
        if (current !== requestVersion || controller.signal.aborted) return
        memorySelection = { key: next.key, value: selectMemory(list, next) }
      }
      renderMemory(memorySelection.value)
    } catch (error) {
      if (open && current === requestVersion && !controller.signal.aborted) renderNotice('读取失败，点击挂饰关闭后可重新打开。')
    }
  }

  function toggle() {
    open = !open
    requestVersion++
    panel.style.display = open ? 'block' : 'none'
    trigger.setAttribute('aria-label', open ? '关闭挂饰弹出卡片' : '展开挂饰弹出卡片')
    trigger.setAttribute('aria-expanded', String(open))
    if (open) {
      memorySelection = null
      renderNotice('正在读取…')
      load()
    }
  }

  // 使用原生点击控制卡片，指针捕获仅负责拖动和屏蔽拖动后的 click。
  var pointer = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false, dragged = false
  listen(trigger, 'click', function (event) {
    event.stopPropagation()
    var wasDragged = moved
    moved = false
    if (wasDragged && event.detail !== 0) return
    toggle()
  })
  listen(trigger, 'pointerdown', function (event) {
    if (event.button !== 0 || pointer !== null) return
    pointer = event.pointerId
    sx = event.clientX; sy = event.clientY
    var rect = widget.getBoundingClientRect()
    ox = rect.left; oy = rect.top
    moved = false
    trigger.setPointerCapture(event.pointerId)
  })
  listen(trigger, 'pointermove', function (event) {
    if (pointer === null || event.pointerId !== pointer) return
    var dx = event.clientX - sx, dy = event.clientY - sy
    if (!moved && Math.abs(dx) <= 4 && Math.abs(dy) <= 4) return
    moved = true
    dragged = true
    var maxX = Math.max(0, window.innerWidth - widget.offsetWidth)
    var maxY = Math.max(0, window.innerHeight - widget.offsetHeight)
    widget.style.left = Math.min(maxX, Math.max(0, ox + dx)) + 'px'
    widget.style.top = Math.min(maxY, Math.max(0, oy + dy)) + 'px'
    widget.style.right = 'auto'
    widget.style.bottom = 'auto'
    positionPanel()
  })
  listen(trigger, 'pointerup', function (event) {
    if (event.pointerId !== pointer) return
    pointer = null
    if (moved) 存位置()
  })
  listen(trigger, 'pointercancel', function () { pointer = null; moved = true })
  listen(trigger, 'lostpointercapture', function () { pointer = null })

  // ⭐ 0.8.0：挂饰自己能多大（0.6 ~ 1.6 倍），记在浏览器本地
  function 取缩放() {
    var v = 1
    try { v = Number(localStorage.getItem('fm-widget-scale')) || 1 } catch (e) {}
    return Math.min(1.6, Math.max(0.6, v))
  }
  function 设缩放(v) {
    var s = Math.min(1.6, Math.max(0.6, Number(v) || 1))
    try { widget.style.setProperty('--fm-scale', String(s)) } catch (e) {}
    保持屏内()
  }

  // 调整尺寸后限制挂饰位置。
  function 保持屏内() {
    var rect = widget.getBoundingClientRect()
    var maxX = Math.max(0, window.innerWidth - widget.offsetWidth)
    var maxY = Math.max(0, window.innerHeight - widget.offsetHeight)
    if (dragged) {
      widget.style.left = Math.min(maxX, Math.max(0, rect.left)) + 'px'
      widget.style.top = Math.min(maxY, Math.max(0, rect.top)) + 'px'
      widget.style.right = 'auto'
      widget.style.bottom = 'auto'
      存位置()
    }
  }

  // ⭐ 0.8.2：拖过的位置要记住。
  //   · 只存**左上角坐标**（left/top）：挂饰能拖到屏幕中间，这时候 right/bottom 已经没意义了，
  //     统一成一套坐标，逻辑只剩一条。
  //   · 读回来先**夹进当前窗口**：窗口可能变小、屏幕可能换；而且收起态是 64px、
  //     大图还能放到 1.6 倍（288px），同一个坐标在不同形态下合法范围不一样。
  //     所以形态/尺寸一变就重新夹一次（下面 保持屏内() 已经在做）。
  //   · 没拖过的人**完全不写 inline 的 left/top**，CSS 的默认角落继续生效。
  var 存位置计时 = 0
  function 存位置() {
    if (!dragged) return
    // 拖动时每帧都写 localStorage 太浪费，攒到停手再写
    if (存位置计时) return
    存位置计时 = setTimeout(function () {
      存位置计时 = 0
      try {
        var r = widget.getBoundingClientRect()
        localStorage.setItem('fm-widget-pos', JSON.stringify({
          x: Math.round(r.left), y: Math.round(r.top),
        }))
      } catch (e) {}
    }, 200)
  }

  function 读位置() {
    var v = null
    try { v = JSON.parse(localStorage.getItem('fm-widget-pos') || 'null') } catch (e) { v = null }
    if (!v || typeof v !== 'object') return null
    var x = Number(v.x), y = Number(v.y)
    if (!isFinite(x) || !isFinite(y)) return null // 脏数据当没存过，别让挂饰消失
    return { x: x, y: y }
  }

  function 恢复位置() {
    var p = 读位置()
    if (!p) return
    dragged = true
    var maxX = Math.max(0, window.innerWidth - widget.offsetWidth)
    var maxY = Math.max(0, window.innerHeight - widget.offsetHeight)
    widget.style.left = Math.min(maxX, Math.max(0, p.x)) + 'px'
    widget.style.top = Math.min(maxY, Math.max(0, p.y)) + 'px'
    widget.style.right = 'auto'
    widget.style.bottom = 'auto'
  }

  // 顶层浮层按打开顺序叠放，挂饰移入当前模态框以保持可交互。
  function syncLayer(raise) {
    var modal = document.activeElement?.closest('dialog:modal') || Array.from(document.querySelectorAll('dialog:modal')).at(-1)
    var target = modal || document.body
    if (widget.parentNode !== target || raise) widget.hidePopover?.()
    if (widget.parentNode !== target) target.appendChild(widget)
    if (!widget.matches(':popover-open')) widget.showPopover?.()
  }
  document.body.appendChild(widget)
  syncLayer()
  var layerObserver = new MutationObserver(function () { syncLayer() })
  layerObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
  listen(document, 'toggle', function (event) {
    if (event.target !== widget && event.newState === 'open') syncLayer(true)
  }, true)
  恢复位置()      // ⭐ 0.8.2：上次拖到哪儿就放哪儿（没拖过的照旧走 CSS 的默认角落）
  保持屏内()      // 形态定下来之后再夹一次（收起态 64px、大图能到 288px，合法范围不一样）
  load()

  // ⭐ 0.7.6（收起态那个数字以前不刷新，得点一下才变）：
  //   以前只有「点开面板」才 load() 一次，收起来的时候就再也不拉了 —— 数字一直是旧的。
  //   现在收起态也每 20 秒拉一次（就一个 GET，不花 token）；页面重新可见时也补一次。
  var pollTimer = setInterval(load, 20000)
  listen(window, 'fish-charm-updated', function (event) {
    if (!data) return load()
    data.charmImages = event.detail.images
    data.charmFaces = event.detail.faces
    换形象(data.mood, data.charmImages)
    if (open && panelMode === 'mood') renderMain(data)
  })
  listen(window, 'fish-charm-scale', function (event) {
    设缩放(event.detail)
    if (open) positionPanel()
  })
  listen(window, 'fish-charm-transparency', function (event) { setTransparency(event.detail) })
  function changePanelMode(event) {
    panelMode = event && ['mood', 'cost', 'memory'].includes(event.detail) ? event.detail : readPanelMode()
    memorySelection = null
    requestVersion++
    if (open) { renderNotice('正在读取…'); load() }
  }
  listen(window, 'fish-charm-panel', changePanelMode)
  listen(window, 'storage', function (event) {
    if (event.key === 'fm-widget-transparency') setTransparency(readTransparency())
    if (event.key === 'fm-widget-panel') changePanelMode()
    if (event.key === 'fish-charm-update') load()
    if (event.key === 'fm-widget-scale') {
      设缩放(取缩放())
      if (open) positionPanel()
    }
  })
  listen(document, 'visibilitychange', function () {
    if (!document.hidden) load()
  })

  // 窗口缩放时，把挂饰拉回屏幕内（拖过才管；没拖的 right/bottom 定位会自然跟随）
  listen(window, 'resize', function () {
    if (!dragged) { positionPanel(); return }
    var rect = widget.getBoundingClientRect()
    var maxX = window.innerWidth - widget.offsetWidth
    var maxY = window.innerHeight - widget.offsetHeight
    var x = Math.min(maxX < 0 ? 0 : maxX, Math.max(0, rect.left))
    var y = Math.min(maxY < 0 ? 0 : maxY, Math.max(0, rect.top))
    widget.style.left = x + 'px'
    widget.style.top = y + 'px'
    widget.style.right = 'auto'
    widget.style.bottom = 'auto'
    存位置()
    if (open) positionPanel()
  })
  window.__feiyuMoodDispose = function () {
    controller.abort()
    clearInterval(pollTimer)
    clearTimeout(存位置计时)
    widget.remove()
    themeObserver.disconnect()
    layerObserver.disconnect()
  }
})()
