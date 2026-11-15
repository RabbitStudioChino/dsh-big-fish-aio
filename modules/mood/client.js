/**
 * dsh-feiyu-mood —— 浏览器半端（设置里的一页「心情」）
 * ============================================================================
 * 自注册脚本（和 dsh-bili-scroll 一样的约定）：
 *
 *     window.__ModuleLoader__.load({ id: '<包名>', factory: (require) => ({ inject, apply }) })
 *
 * 这一页要满足的想法（主人 2026-10-19）：
 *   · 心情插件**也能给别人用** ⇒ 名字得能改（它叫什么叫什么、你叫什么叫什么）
 *   · 目标会话、基线、下限、注入开关、自动判断开关，都在面板里改，不用去翻 config.json
 *   · 改完**立刻生效**（宿主那边是原地改 cfg，不用重启）
 *
 * ⭐ 0.6.0：设置页分四个页签（心情 / 会话绑定 / 判断与注入 / 挂饰）。
 *    一份心情可以绑好几个会话 —— 这些会话共用一份心情、一条时间线、每天的额度；
 *    分页签只是把「看」和「改」分开，切页签不动任何设置。
 *
 * ⭐ 0.7.0：「会话绑定」页签顶上多了**模式切换**，二选一：
 *    · 会话模式：跟以前一样，按点名的会话绑；
 *    · 工作区模式：按工作区绑 —— 那个工作区下所有会话都归这一份，新开的自动进来。
 *    名字那栏的文案也改清楚了：那只是「这份叫什么」，不是称呼（称呼在「判断与注入」）。
 * ============================================================================
 */
window.__ModuleLoader__.load({
  id: 'dsh-feiyu-mood',
  factory: (require) => {
    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'

    const API = '/dsh-feiyu-mood'

    // 四个页签（默认第一个）
    const 页签 = [
      ['mood', '心情'],
      ['bind', '会话绑定'],
      ['judge', '判断与注入'],
      ['charm', '挂饰'],
    ]

    // 心情值与表情分档：用的就是挂饰那五张图（assets/face-*.png，448×352）
    const faceImg = (v, faces) => {
      const m = Number(v)
      const tier = !Number.isFinite(m) ? 'ok' : m >= 80 ? 'great' : m >= 62 ? 'good' : m >= 42 ? 'ok' : m >= 25 ? 'worry' : 'sad'
      return faces?.[tier]?.url || API + '/face-' + tier + '.png'
    }

    const getJson = async (url) => {
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    }
    const postJson = async (url, body) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    }

    function updatePortraitOutline(img) {
      const button = img.parentElement
      if (!img.naturalWidth || !img.naturalHeight) return
      button.style.setProperty('--portrait-ratio', String(img.naturalWidth / img.naturalHeight))
      const svg = button.querySelector('svg')
      svg.replaceChildren()
      button.dataset.outline = 'fallback'
      try {
        const scale = Math.min(1, 192 / Math.max(img.naturalWidth, img.naturalHeight))
        const width = Math.max(1, Math.round(img.naturalWidth * scale))
        const height = Math.max(1, Math.round(img.naturalHeight * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.drawImage(img, 0, 0, width, height)
        const pixels = context.getImageData(0, 0, width, height).data
        const opaque = (x, y) => x >= 0 && y >= 0 && x < width && y < height && pixels[(y * width + x) * 4 + 3] >= 40
        // Marching Squares 按左上、右上、右下、左下取样，连接透明边界的中点。
        const cases = [[], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 1], [2, 3]], [[0, 2]], [[0, 3]],
          [[3, 0]], [[0, 2]], [[3, 0], [1, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], []]
        const neighbors = new Map()
        for (let y = 0; y <= height; y++) {
          for (let x = 0; x <= width; x++) {
            const mask = (opaque(x - 1, y - 1) ? 8 : 0) | (opaque(x, y - 1) ? 4 : 0)
              | (opaque(x, y) ? 2 : 0) | (opaque(x - 1, y) ? 1 : 0)
            if (!cases[mask].length) continue
            const points = [[2 * x, 2 * y - 1], [2 * x + 1, 2 * y], [2 * x, 2 * y + 1], [2 * x - 1, 2 * y]]
            for (const [from, to] of cases[mask]) {
              const start = points[from].join(',')
              const end = points[to].join(',')
              if (!neighbors.has(start)) neighbors.set(start, [])
              if (!neighbors.has(end)) neighbors.set(end, [])
              neighbors.get(start).push(end)
              neighbors.get(end).push(start)
            }
          }
        }
        const visited = new Set()
        const paths = []
        for (const start of neighbors.keys()) {
          if (visited.has(start)) continue
          const points = []
          let current = start
          let previous = null
          while (current && !visited.has(current)) {
            visited.add(current)
            points.push(current)
            const next = neighbors.get(current).find(point => point !== previous)
            previous = current
            current = next
          }
          paths.push('M' + points.join('L') + 'Z')
        }
        if (!paths.length) return
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', paths.join(' '))
        svg.setAttribute('viewBox', '0 0 ' + 2 * width + ' ' + 2 * height)
        svg.replaceChildren(path)
        button.dataset.outline = 'contour'
      } catch {
        // 图片像素不可读取时仍保留可见的上传反馈。
      }
    }

    const CSS = `
.big-fish [data-fm-wrap]{display:flex;flex-direction:column;gap:24px;min-width:0;padding-bottom:24px}
.big-fish [data-fm-hero]{display:flex;align-items:center;gap:24px;padding:24px;background:var(--fish-panel);border:1px solid var(--fish-border);border-radius:var(--fish-radius);box-shadow:var(--fish-shadow);flex-wrap:wrap}
.big-fish [data-fm-face]{width:112px;height:auto;aspect-ratio:448/352;object-fit:contain;flex:none}
.big-fish [data-fm-big]{font:700 32px/1.4 var(--fish-title)}
.big-fish [data-fm-sub],.big-fish [data-fm-note]{font-size:14px;line-height:1.75;color:var(--fish-muted);overflow-wrap:anywhere}
.big-fish [data-fm-sec]{display:flex;flex-direction:column;gap:16px;padding:8px 0 24px;border-bottom:1px solid var(--fish-border)}
.big-fish [data-fm-h]{font:700 20px/1.5 var(--fish-title);margin-bottom:4px}
.big-fish [data-fm-row]{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:8px 0}
.big-fish [data-fm-grow]{flex:1 1 220px;min-width:0}
.big-fish [data-fm-label]{font-size:16px}
.big-fish [data-fm-input]{padding:8px 12px;border-radius:var(--fish-radius-sm);border:1px solid var(--fish-control-border);background:var(--fish-surface);color:var(--fish-text);font-size:14px;max-width:100%;min-width:0}
.big-fish [data-fm-num]{width:104px}
.big-fish [data-fm-btn],.big-fish [data-fm-pick]{padding:8px 16px;border-radius:var(--fish-radius-sm);border:1px solid var(--fish-border);background:var(--fish-control-fill);color:var(--fish-text);font-size:14px;cursor:pointer}
.big-fish [data-fm-msg]{font-size:14px;min-height:24px;color:var(--fish-text)}
.big-fish [data-fm-tabs]{display:flex;gap:8px;overflow-x:auto;padding-bottom:16px;border-bottom:1px solid var(--fish-border)}
.big-fish [data-fm-tab]{padding:8px 16px;border-radius:var(--fish-radius-sm);border:1px solid transparent;background:transparent;color:var(--fish-muted);font-size:14px;white-space:nowrap;flex:none}
.big-fish [data-fm-on]{background:var(--fish-accent-soft);border-color:var(--fish-border);color:var(--fish-action);font-weight:600}
.big-fish [data-fm-pane]{display:flex;flex-direction:column;gap:24px;min-width:0}
.big-fish [data-fm-slot]{display:flex;flex-direction:column;gap:16px;padding:24px;border:1px solid var(--fish-border);border-radius:var(--fish-radius);box-shadow:var(--fish-shadow);background:var(--fish-panel)}
.big-fish [data-fm-sess]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:8px 0}
.big-fish [data-fm-sessname]{flex:1;min-width:0;font-size:14px;overflow-wrap:anywhere}
.big-fish [data-fm-faces]{display:flex;gap:24px;flex-wrap:wrap}
.big-fish [data-fm-faces] img{width:84px;height:auto;aspect-ratio:448/352;object-fit:contain;display:block}
.big-fish [data-fm-quote]{font-size:16px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;padding:24px;border-radius:var(--fish-radius-sm);background:var(--fish-soft)}
.big-fish [data-fm-quote][data-fm-dim]{color:var(--fish-muted)}
.big-fish [data-fm-tl]{display:flex;flex-direction:column;max-height:400px;overflow:auto}
.big-fish [data-fm-tlrow]{display:grid;grid-template-columns:136px 40px 48px minmax(0,1fr);gap:12px;padding:16px 0;border-bottom:1px solid var(--fish-line);font-size:14px;line-height:1.75}
.big-fish [data-fm-time]{color:var(--fish-muted)}
.big-fish [data-fm-mood]{font-weight:600}
.big-fish [data-fm-delta]{color:var(--fish-action)}
.big-fish [data-fm-reason]{overflow-wrap:anywhere}
.big-fish [data-fm-ver]{display:flex;align-items:center;gap:16px;padding:16px;border-radius:var(--fish-radius-sm);background:var(--fish-soft)}
@container(max-width:520px){.big-fish [data-fm-tlrow]{grid-template-columns:minmax(0,1fr) 40px 48px}.big-fish [data-fm-reason]{grid-column:1/-1}.big-fish [data-fm-slot]{padding:16px}}
`

    function Panel({ page, onPageChange, notify, Dialog } = {}) {
      const [cfg, setCfg] = React.useState(null)
      const configDraft = React.useRef({})
      const configQueue = React.useRef(Promise.resolve())
      const editConfig = patch => { Object.assign(configDraft.current, patch); setCfg(old => ({ ...old, ...patch })) }
      const [st, setSt] = React.useState(null)
      const [sessions, setSessions] = React.useState([])
      const [工作区们, set工作区们] = React.useState([])   // 工作区模式的下拉清单
      const [看哪份, set看哪份] = React.useState('')      // 多份心情时看的是哪一份
      const 看哪份Ref = React.useRef('')
      const keyNow = () => (看哪份Ref.current ? '?key=' + encodeURIComponent(看哪份Ref.current) : '')
      const [models, setModels] = React.useState([])
      const [busy, setBusy] = React.useState('')
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [localPage, setLocalPage] = React.useState('mood')
      const 页 = page ?? localPage
      const [historyOpen, setHistoryOpen] = React.useState(false)
      const [historyDay, setHistoryDay] = React.useState('')
      const [scale, setScale] = React.useState(() => {
        try { return Math.min(160, Math.max(60, Math.round((Number(localStorage.getItem('fm-widget-scale')) || 1) * 100))) } catch { return 100 }
      })
      const [transparency, setTransparency] = React.useState(() => {
        try {
          const stored = localStorage.getItem('fm-widget-transparency')
          const value = stored == null ? 35 : Number(stored)
          return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 35
        } catch { return 35 }
      })
      const [popupMode, setPopupMode] = React.useState(() => {
        try {
          const value = localStorage.getItem('fm-widget-panel')
          return ['mood', 'cost', 'memory'].includes(value) ? value : 'mood'
        } catch { return 'mood' }
      })
      const uploading = React.useRef(false)
      const uploadInputRef = React.useRef(null)
      const uploadTargetRef = React.useRef(null)
      const set页 = onPageChange ?? setLocalPage       // 页签：mood / bind / judge / charm

      const flash = (t, options) => 告知(t, options)

      const load = React.useCallback(async () => {
        try {
          const [c, s] = await Promise.all([getJson(API + '/config'), getJson(API + '/state' + keyNow())])
          if (c && c.config) setCfg({ ...c.config, ...configDraft.current })
          if (s && s.ok) {
            setSt(s)
            if (看哪份Ref.current && !s.slots.some(slot => slot.id === 看哪份Ref.current)) {
              看哪份Ref.current = s.key
              set看哪份(s.key)
            }
          }
        } catch (e) {
          flash('读取失败：' + (e && e.message), { holdMs: 6000 })
        }
      }, [])

      React.useEffect(() => {
        load()
        getJson(API + '/sessions').then((r) => setSessions((r && r.sessions) || [])).catch(() => {})
        getJson(API + '/workspaces').then((r) => set工作区们((r && r.workspaces) || [])).catch(() => {})
        getJson(API + '/models').then((r) => setModels((r && r.providers) || [])).catch(() => {})
        const t = setInterval(() => { getJson(API + '/state' + keyNow()).then((s) => s && s.ok && setSt(s)).catch(() => {}) }, 20000)
        return () => clearInterval(t)
      }, [load])

      // ⭐ 0.7.5（最小化的时候心情以前不刷新，得点一下才变）：
      //   页面在后台时浏览器会把定时器节流到一分钟以上，切回来那一瞬间还显示旧值。
      //   所以「重新可见 / 重新获得焦点」时立刻拉一次 —— 不用她点任何东西。
      React.useEffect(() => {
        const 立刻刷 = () => {
          if (document.hidden) return
          getJson(API + '/state' + keyNow()).then((s) => { if (s && s.ok) setSt(s) }).catch(() => {})
        }
        document.addEventListener('visibilitychange', 立刻刷)
        window.addEventListener('focus', 立刻刷)
        return () => {
          document.removeEventListener('visibilitychange', 立刻刷)
          window.removeEventListener('focus', 立刻刷)
        }
      }, [])

      const patch = async (p, label) => {
        editConfig(p)
        try {
          const request = configQueue.current.catch(() => {}).then(() => postJson(API + '/config', p))
          configQueue.current = request
          const r = await request
          for (const key of Object.keys(p)) if (configDraft.current[key] === p[key]) delete configDraft.current[key]
          if (r && r.config) setCfg({ ...r.config, ...configDraft.current })
          await load()
          flash((label || '设置') + ' 已保存', { tone: 'success' })
        } catch (e) { flash('保存失败：' + (e && e.message)) }
      }

      /* ⭐ 一份心情可以绑好几个会话（或一个工作区）：这里照这份清单画
         （没配置过就当成「第一份」；id 尽量沿用宿主给的 st.key，别凭空造一个） */
      const 模式 = cfg?.模式 === 'memory' ? 'memory' : cfg?.模式 === 'workspace' ? 'workspace' : 'session'
      const 份列表 = (() => {
        const raw = 模式 === 'memory' ? (st?.slots || []) : Array.isArray(cfg && cfg.slots) && cfg.slots.length
          ? cfg.slots
          : [{ id: String((st && st.key) || ''), label: '', selfName: '', ownerName: '', 工作区: '', sessions: [] }]
        return raw.map((s) => ({
          id: String((s && s.id) || ''),
          label: String((s && s.label) || ''),
          selfName: String((s && s.selfName) || ''),
          ownerName: String((s && s.ownerName) || ''),
          工作区: String((s && s.工作区) || (s && s.workspace) || ''),
          sessions: Array.isArray(s && s.sessions)
            ? s.sessions.map((x) => String(x || ''))
            : ((s && s.session) ? [String(s.session)] : []),
        }))
      })()
      const 会话名 = (id) => {
        const hit = (sessions || []).find((x) => x.id === id)
        return (hit && hit.title) || String(id)
      }
      const 份标题 = (sl) => sl.label
        || (sl.sessions || []).map(会话名).filter(Boolean).join('、')
        || (sl.工作区 ? String(sl.工作区) : '')
        || '（未绑定会话）'
      const 已绑 = new Set()
      份列表.forEach((p) => p.sessions.forEach((s) => 已绑.add(s)))
      const 可加会话 = (sessions || []).filter((x) => !已绑.has(x.id))

      const 改份 = (i, 变) => patch({ slots: 份列表.map((x, j) => (j === i ? { ...x, ...变 } : x)) }, '绑定')

      const 切份 = (e) => {
        const v = e.target.value
        set看哪份(v)
        看哪份Ref.current = v
        getJson(API + '/state?key=' + encodeURIComponent(v)).then((x) => { if (x && x.ok) setSt(x) }).catch(() => {})
      }

      const onReset = async () => {
        setBusy('reset')
        try {
          await postJson(API + '/reset', { key: 看哪份 || (st && st.key) || '' })
          await load()
          flash('已重置当前实例')
        } catch (e) { flash('重置失败：' + (e && e.message)) }
        setBusy('')
      }

      if (!cfg) return h('div', { 'data-fm-wrap': '' }, h('div', { 'data-fm-note': '' }, '读取中…'))

      const sw = (key, label) => h(Switch, {
        type: 'checkbox', role: 'switch', 'aria-label': label,
        checked: Boolean(cfg[key]),
        onChange: (e) => patch({ [key]: e.target.checked }, label),
      })

      const formRow = (label, control, note) => h('div', { key: label, className: 'fish-form-row mood-form-row' },
        h('div', { className: 'fish-form-label' }, label),
        h('div', { className: 'fish-control' }, control, note ? h('p', { className: 'fish-muted' }, note) : null))
      const numInput = (key, label, note, min, max) => formRow(label,
        h('input', { 'data-fm-input': '', 'data-fm-num': '', type: 'number', min, max, 'aria-label': label,
          value: String(cfg[key] ?? ''),
          onChange: e => editConfig({ [key]: e.target.value }),
          onBlur: () => patch({ [key]: Math.max(min, Math.min(Number(cfg[key]) || 0, max)) }, label),
        }), note)
      const changeScale = value => {
        const next = Math.min(160, Math.max(60, Number(value) || 100))
        setScale(next)
        try { localStorage.setItem('fm-widget-scale', String(next / 100)) } catch {}
        window.dispatchEvent(new CustomEvent('fish-charm-scale', { detail: next / 100 }))
      }
      const changePopupMode = value => {
        if (!['mood', 'cost', 'memory'].includes(value)) return
        setPopupMode(value)
        try { localStorage.setItem('fm-widget-panel', value) } catch {}
        window.dispatchEvent(new CustomEvent('fish-charm-panel', { detail: value }))
      }
      const changeTransparency = value => {
        const next = Math.min(100, Math.max(0, Number(value)))
        if (!Number.isFinite(next)) return
        setTransparency(next)
        try { localStorage.setItem('fm-widget-transparency', String(next)) } catch {}
        window.dispatchEvent(new CustomEvent('fish-charm-transparency', { detail: next }))
      }
      const applyCharmImages = result => {
        setSt(old => ({ ...old, charmImages: result.images, charmFaces: result.faces }))
        window.dispatchEvent(new CustomEvent('fish-charm-updated', { detail: { images: result.images, faces: result.faces } }))
        try { localStorage.setItem('fish-charm-update', JSON.stringify({ images: result.images, faces: result.faces })) } catch {}
      }
      const choosePortrait = (tier, kind) => {
        if (uploading.current) return
        uploadTargetRef.current = { tier, kind }
        uploadInputRef.current?.click()
      }
      const resetCharm = async (tier, kind) => {
        if (uploading.current) return
        uploading.current = true
        setBusy('reset-' + kind + '-' + tier)
        try {
          const response = await fetch(API + '/charm-image?tier=' + tier + '&kind=' + kind, { method: 'DELETE' })
          const result = await response.json()
          if (!response.ok || !result.ok) throw new Error(result.error || '恢复失败')
          applyCharmImages(result)
          flash('当前图片已恢复默认', { tone: 'success' })
        } catch (error) { flash(error.message) }
        finally { uploading.current = false; setBusy('') }
      }
      const uploadCharm = async (tier, kind, input) => {
        const file = input.files?.[0]
        if (!file || uploading.current) return
        uploading.current = true
        setBusy('upload-' + kind + '-' + tier)
        try {
          if (!file.size || file.size > 4 * 1024 * 1024) throw new Error('请选择不超过 4 MB 的图片')
          const bitmap = await createImageBitmap(file)
          bitmap.close()
          const response = await fetch(API + '/charm-image?tier=' + tier + '&kind=' + kind, { method: 'POST', body: file })
          const result = await response.json()
          if (!response.ok || !result.ok) throw new Error(result.error || '上传失败')
          applyCharmImages(result)
          flash('挂饰图片已更新', { tone: 'success' })
        } catch (error) { flash('上传失败，' + error.message) }
        finally { uploading.current = false; setBusy(''); input.value = '' }
      }
      const dayOf = value => {
        const date = new Date(value)
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
      }
      const history = (st?.timeline || []).slice().reverse().filter(item => !historyDay || dayOf(item.at) === historyDay)
      const historyDialog = historyOpen && Dialog ? h(Dialog, { id: 'mood-history', title: '心情变化记录', subtitle: st?.label || st?.name,
        active: 页 === 'mood', onClose: () => setHistoryOpen(false) },
        h('div', { className: 'mood-history-toolbar' },
          h('label', { className: 'mood-history-date' }, '日期', h('input', { type: 'date', 'aria-label': '筛选记录日期', value: historyDay, onChange: e => setHistoryDay(e.target.value) })),
          h('button', { type: 'button', className: 'fish-button', onClick: () => setHistoryDay('') }, '全部日期'),
          h('span', { role: 'status', className: 'fish-muted' }, history.length + ' 条记录')),
        history.length ? h('div', { 'data-fm-tl': '' }, ...history.map((item, index) => h('div', { key: item.at + '-' + index, 'data-fm-tlrow': '' },
          h('time', { 'data-fm-time': '' }, new Date(item.at).toLocaleString()),
          h('span', { 'data-fm-mood': '' }, String(item.mood)),
          h('span', { 'data-fm-delta': '' }, (item.delta > 0 ? '+' : '') + (item.delta ?? 0)),
          h('span', { 'data-fm-reason': '' }, item.reason || '—', item.kind === 'decay' ? '（自然衰减）' : '',
            item.minor ? '（低于单次显著变化阈值）' : '', item.conf != null && item.kind !== 'decay' ? '（置信度 ' + item.conf + '）' : ''))))
          : h('p', { className: 'fish-muted' }, '所选日期暂无记录。')) : null

      /* ── 页签 1：心情（当前心情 / 它会听到的话 / 心情变化记录） ── */
      const 心情页 = (() => {
        const 项 = []
        if (st && st.multi) {
          项.push(h('div', { key: 'pick', 'data-fm-sec': '' },
            h('div', { 'data-fm-h': '' }, '当前心情实例'),
            h('div', { 'data-fm-note': '' },
              '共 ' + (st.slots || []).length + ' 个心情实例，各自保存状态、时间线和注入次数。此选择仅切换查看对象。'),
            h('select', {'aria-label': '选择心情',
              'data-fm-input': '', value: 看哪份 || (st.key || ''),
              onChange: 切份,
            },
              (st.slots || []).map((sl) => h('option', { key: sl.id, value: sl.id }, 份标题(sl))))))
        }
        项.push(h('div', { key: 'hero', 'data-fm-hero': '' },
          h('img', { 'data-fm-face': '', src: faceImg(st && st.mood, st?.charmFaces), alt: '' }),
          h('div', { 'data-fm-grow': '' },
            h('div', { 'data-fm-big': '' }, (st && st.mood != null ? st.mood : '—')
              + (st && st.moodLabel ? '　' + st.moodLabel : '')),
            h('div', { 'data-fm-sub': '' },
              ((st && st.lastReason) || '暂无心情变化记录。已绑定会话完成对话且判定有变化后生成记录。'),
              (st && st.updatedAt ? '（' + new Date(st.updatedAt).toLocaleString() + '）' : ''),
              (st && st.lastReason
                ? (st.injectMode === 'off'
                  ? '　· 上下文注入已关闭'
                  : (st.injectable ? '　· 满足注入条件' : '　· 当前不注入'))
                : ''))),
          h('button', {type: 'button',  'data-fm-btn': '', disabled: busy === 'reset', onClick: onReset }, '重置当前实例')))
        项.push(h('div', { key: 'reset-note', 'data-fm-note': '' }, '重置会将当前实例恢复到心情基线，并清空情绪维度、时间线及注入记录。'))
        项.push(h('div', { key: 'dimensions', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '七维情绪'),
          h('div', { className: 'fish-dimensions' },
            [['happy', '开心'], ['calm', '踏实'], ['sweet', '甜蜜'], ['heartache', '心疼'], ['worry', '担心'], ['sad', '难过'], ['jealous', '吃醋']].map(([key, label]) => {
              const dimension = (st?.dims || []).find(item => item.key === key)
              const value = Number(dimension?.value)
              const available = dimension && Number.isFinite(value)
              return h('div', { key }, h('div', { className: 'fish-dimension-label' }, h('span', null, label), h('span', null, available ? value + ' / 100' : '暂无数据')),
                h('div', { className: 'fish-dimension-track', 'aria-hidden': true }, h('span', { style: { width: available ? Math.max(0, Math.min(100, value)) + '%' : '0%' } })))
            }))))
        项.push(h('div', { key: 'preview', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '上下文注入内容'),
          (st && st.injectPreview && st.injectPreview.state === 'off')
            ? h('div', { 'data-fm-note': '' }, '已关闭上下文注入。心情判断与记录仍由自动判断开关控制。')
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'pending')
            ? h('div', {},
              h('div', { 'data-fm-note': '' }, '以下为下一次生成回复时可注入的上下文预览。'),
              h('div', { 'data-fm-quote': '' }, st.injectPreview.text || '（暂无可注入内容）'))
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'minor')
            ? h('div', { 'data-fm-note': '' }, '本次变化未达到显著变化或累计变化阈值，仅更新状态和时间线。')
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'blocked')
            ? h('div', {},
              h('div', { 'data-fm-note': '' },
                '当前实例今日已注入 ' + (st.injectPreview.said != null ? st.injectPreview.said : st.saidToday)
                + ' 次（上限 ' + (st.injectPreview.cap != null ? st.injectPreview.cap : st.injectPerDay)
                + '）。每日次数按宿主本地时间在零点重新统计，超限后已处理的变化不会自动补发。'),
              st.lastInjectedText
                ? h('div', {},
                  h('div', { 'data-fm-note': '' },
                    '最近一次实际注入内容'
                    + (st.lastInjectedAt ? '（' + new Date(st.lastInjectedAt).toLocaleString() + '）' : '')
                    + '，仅供历史参考。'),
                  h('div', { 'data-fm-quote': '', 'data-fm-dim': '' }, st.lastInjectedText))
                : null)
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'said')
            ? h('div', {},
              h('div', { 'data-fm-note': '' },
                '最近一次注入内容'
                + (st.lastInjectedAt ? '（' + new Date(st.lastInjectedAt).toLocaleString() + '）' : '')
                + (st.injectPreview.replay
                  ? '。以下内容由记录重建，可能与原文存在差异。'
                  : '。同一条状态更新仅注入一次。')),
              h('div', { 'data-fm-quote': '', 'data-fm-dim': st.lastInjectedText ? undefined : '' },
                st.lastInjectedText || '（暂无实际注入记录）'))
            : null))
        项.push(h('div', { key: 'timeline', className: 'fish-actions' },
          h('button', { type: 'button', className: 'fish-button', onClick: () => { setHistoryDay(''); setHistoryOpen(true) } }, '查看心情变化记录'),
          h('span', { className: 'fish-muted' }, (st?.timeline?.length || 0) + ' 条记录')))
        return h('div', { 'data-fm-pane': '' }, ...项)
      })()

      /* ── 页签 2：绑定（会话模式按会话绑 / 工作区模式按工作区绑，二选一） ── */
      const 工作区显示 = (name) => {
        const 命中 = (工作区们 || []).find((w) => w.name === name)
        return (命中 && (命中.path || 命中.name)) || String(name || '')
      }
      const 刷新工作区 = () => {
        return getJson(API + '/workspaces').then((r) => set工作区们((r && r.workspaces) || [])).catch(() => {})
      }
      const 绑定页 = (() => {
        const 项 = []
        const 模式钮 = (id, 名) => h('button', {type: 'button',
          key: id,
          'data-fm-pick': '',
          'data-fm-on': 模式 === id ? '' : undefined,
          'aria-pressed': 模式 === id,
          onClick: () => {
            if (模式 !== id) patch({ 模式: id }, '模式')
            if (id === 'workspace') 刷新工作区()
          },
        }, 名)
        项.push(h('div', { key: 'mode', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '心情归属模式'),
          h('div', { 'data-fm-note': '' },
            '按已核验 QQ 记忆库分组，私聊与隔离群独立、普通群共享，自动同步映射及隔离设置。'
            + '会话模式为每个已绑定会话分配独立心情。'
            + '工作区模式按会话存储目录分组，包含该目录下后续新增的顶层会话。'),
          h('div', { 'data-fm-row': '' },
            模式钮('memory', '跟随记忆库（默认）'),
            模式钮('session', '会话模式'),
            模式钮('workspace', '工作区模式'))))
        if (模式 === 'memory') {
          项.push(h('div', { key: 'memory-note', 'data-fm-note': '' }, '同一写入库对应一个心情实例，共享心情值、情绪维度、时间线及每日注入次数。可切换会话模式或工作区模式自定义归属。'))
          份列表.forEach(sl => 项.push(h('div', { key: sl.id, 'data-fm-sec': '' },
            h('div', { 'data-fm-h': '' }, sl.label),
            h('div', { 'data-fm-note': '' }, '记忆库 ' + sl.id),
            ...sl.sessions.map(sid => h('div', { key: sid, 'data-fm-sess': '' }, 会话名(sid))))))
          if (!份列表.length) 项.push(h('div', { key: 'empty', role: 'status', 'data-fm-note': '' }, '尚无已核验的 QQ 映射，请启用 QQ 映射并接收消息后查看。'))
          return h('div', { 'data-fm-pane': '' }, ...项)
        }
        项.push(h('div', { key: 'h', 'data-fm-h': '' }, 模式 === 'workspace' ? '工作区绑定' : '会话绑定'))
        项.push(h('div', { key: 'note', 'data-fm-note': '' },
          模式 === 'workspace'
            ? '每个实例绑定一个工作区目录，目录内顶层会话共享状态。两种模式分别保存绑定。'
            : '每个实例绑定一个会话，独立维护状态、时间线和每日注入次数。'
              + '一个会话仅归属一个实例，重复绑定时保留列表中靠前的归属。'))
        份列表.forEach((sl, i) => {
          const 标题 = '实例 ' + (i + 1)
          const 这块工作区 = (工作区们 || []).find((w) => w.name === (sl.工作区 || ''))
          // 会话模式：这一份绑的会话，能删能加
          const 会话块 = h('div', {},
            sl.sessions.length
              ? sl.sessions.map((sid) => h('div', { key: sid, 'data-fm-sess': '' },
                h('span', { 'data-fm-sessname': '', title: sid }, 会话名(sid)),
                h('button', {type: 'button',
                  'data-fm-btn': '', style: { padding: '2px 8px', fontSize: 'var(--fish-small)', flex: '0 0 auto' },
                  onClick: () => 改份(i, { sessions: sl.sessions.filter((x) => x !== sid) }),
                }, '移除')))
              : h('div', { 'data-fm-note': '' }, '尚未绑定会话，请通过下方列表添加。'),
            h('div', { style: { marginTop: '6px' } },
              h('select', {'aria-label': '添加绑定会话',
                'data-fm-input': '', value: '', disabled: sl.sessions.length > 0,
                onChange: (e) => {
                  const v = e.target.value
                  if (v) 改份(i, { sessions: [v] })
                },
              },
                h('option', { value: '' }, '+ 添加会话'),
                ((sessions || []).filter((x) => !已绑.has(x.id))).map((x) => h('option', { key: x.id, value: x.id }, x.title || x.id)))))
          // 工作区模式：这一份只填一个工作区（工作区里所有会话都归它）
          const 工作区块 = h('div', {},
            h('div', { 'data-fm-row': '' },
              h('select', {'aria-label': '绑定工作区',
                'data-fm-input': '', 'data-fm-grow': '', value: sl.工作区 || '',
                onChange: (e) => 改份(i, { 工作区: e.target.value }),
              },
                h('option', { value: '' }, '（未选择工作区）'),
                (工作区们 || []).map((w) => h('option', { key: w.name, value: w.name },
                  (w.path ? w.path + (w.title ? '（' + w.title + '）' : '') : w.name)
                  + ' · ' + (w.sessions || 0) + ' 个会话')),
                sl.工作区 && !(工作区们 || []).some((w) => w.name === sl.工作区)
                  ? h('option', { value: sl.工作区 }, sl.工作区 + '（当前未发现此目录）')
                  : null),
              h(RefreshButton, { type: 'button', label: '刷新工作区', onClick: 刷新工作区 }, '刷新')),
            h('div', { 'data-fm-note': '' },
              sl.工作区
                ? (这块工作区
                  ? '当前工作区目录包含 ' + (这块工作区.sessions || 0) + ' 个会话目录，其中已打开的顶层会话可挂载此实例。'
                  : '当前未发现此工作区目录。目录及会话出现后按已保存的目录标识匹配。')
                : '请选择用于匹配会话的工作区目录。'))
          项.push(h('div', { key: 'slot' + i, 'data-fm-slot': '' },
            h('div', { 'data-fm-row': '' },
              h('div', { 'data-fm-grow': '', style: { fontWeight: 600, fontSize: 'var(--fish-small)' } },
                标题 + (模式 === 'workspace'
                  ? (sl.工作区 ? ' · ' + 工作区显示(sl.工作区) : ' · 未选择工作区')
                  : (sl.sessions.length ? ' · ' + sl.sessions.length + ' 个会话' : ' · 未绑定会话'))),
              h('button', {type: 'button',
                'data-fm-btn': '', style: { padding: '2px 8px', fontSize: 'var(--fish-small)' },
                onClick: () => patch({ slots: 份列表.filter((_, j) => j !== i) }, '删除心情实例'),
              }, '移除')),
            h('div', { 'data-fm-row': '' },
              h('div', { 'data-fm-grow': '' },
                h('div', { 'data-fm-label': '', style: { fontSize: 'var(--fish-small)' } },
                  '实例显示名称')),
              h('input', {'aria-label': '心情名称',
                'data-fm-input': '', value: sl.label || '', placeholder: '用于区分心情实例',
                onChange: (e) => {
                  const v = e.target.value
                  editConfig({ slots: 份列表.map((x, j) => (j === i ? { ...x, label: v } : x)) })
                },
                onBlur: () => patch({ slots: 份列表 }, '名字'),
              })),
            模式 === 'workspace' ? 工作区块 : 会话块))
        })
        项.push(份列表.length < 6
          ? h('div', { key: 'add', 'data-fm-row': '' },
            h('button', {type: 'button',
              'data-fm-btn': '',
              onClick: () => patch({ slots: [...份列表, { id: '', label: '', selfName: '', ownerName: '', 工作区: '', sessions: [] }] }, '添加心情实例'),
            }, '+ 添加心情实例'))
          : h('div', { key: 'max', 'data-fm-note': '' }, '界面最多可配置 6 个自定义实例。'))
        项.push(h('div', { key: 'tip', 'data-fm-note': '' },
          模式 === 'workspace'
            ? '工作区列表优先显示可解析的路径，其余显示会话存储目录标识。'
            : '会话列表排除归档、空白及子代理会话。绑定保存后即时生效。'))
        return h('div', { 'data-fm-pane': '' }, ...项)
      })()

      /* ── 页签 3：判断与注入（称呼 / 模型 / 开关 / 数值） ── */
      const 判断页 = (() => {
        const 项 = []
        项.push(h('section', { key: 'names', className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '称呼与身份'),
          h('p', { className: 'fish-muted' }, '用于心情判断及原因中的人称归一化，实例设置优先于全局设置。'),
          模式 === 'memory' ? h('p', { className: 'fish-muted' }, '跟随记忆库时，对方称呼使用 QQ 映射称呼，群聊按实际参与者区分。') : null,
          ...[
            ['ownerName', '对方称呼', '用户', '用于判断对方发言及变化原因中的指代。'],
            ['selfName', 'AI 名称', '伙伴', '用于指定具有心情状态的 AI 名称。'],
            ['selfAliases', 'AI 昵称及别名', '小鱼,大肥鱼', '以逗号分隔多个称呼。判断提示词将这些词标记为对 AI 的称呼，辅助识别句子中的指代。'],
            ['selfPronoun', 'AI 第一人称称谓', '我', '用于指定判断原因中 AI 的第一人称，默认使用「我」，最多 8 个字符。'],
          ].map(([key, label, placeholder, note]) => formRow(label,
            h('input', { 'data-fm-input': '', 'aria-label': label, placeholder, value: cfg[key] || '',
              onChange: e => editConfig({ [key]: e.target.value }), onBlur: () => patch({ [key]: cfg[key] }, label) }), note))))
        项.push(h('section', { key: 'model', className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '心情判断模型'),
          h('p', { className: 'fish-muted' }, '每次自动判断单独调用一次模型。提供方与型号均已指定时使用所选模型，否则使用当前会话模型。'),
          formRow('模型提供方', h('select', { 'data-fm-input': '', 'aria-label': '模型提供方', value: cfg.judgeProvider || '',
            onChange: e => { const provider = e.target.value; patch({ judgeProvider: provider, judgeModel: models.find(p => p.id === provider)?.models?.[0]?.id || '' }, '判断模型') } },
            h('option', { value: '' }, '（使用会话模型）'),
            ...models.map(p => h('option', { key: p.id, value: p.id }, p.name || p.id)),
            cfg.judgeProvider && !models.some(p => p.id === cfg.judgeProvider) ? h('option', { value: cfg.judgeProvider }, cfg.judgeProvider) : null)),
          formRow('模型型号', h('select', { 'data-fm-input': '', 'aria-label': '模型型号', disabled: !cfg.judgeProvider, value: cfg.judgeModel || '',
            onChange: e => patch({ judgeModel: e.target.value }, '判断模型') },
            h('option', { value: '' }, '（使用会话模型）'),
            ...(models.find(p => p.id === cfg.judgeProvider)?.models || []).map(m => h('option', { key: m.id, value: m.id }, m.name || m.id)),
            cfg.judgeModel && !(models.find(p => p.id === cfg.judgeProvider)?.models || []).some(m => m.id === cfg.judgeModel) ? h('option', { value: cfg.judgeModel }, cfg.judgeModel) : null))))
        项.push(h('section', { key: 'switch', className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '自动判断与注入'),
          formRow('自动判断心情', sw('autoJudge', '自动判断心情'), '启用后，在已绑定会话结束对话回合时调用模型判断变化。关闭后停止自动判断，自然衰减仍按时间计算。'),
          formRow('上下文注入方式', h('select', { 'data-fm-input': '', 'aria-label': '心情注入方式', value: cfg.injectMode || 'event',
            onChange: e => patch({ injectMode: e.target.value }, '上下文注入方式') },
            h('option', { value: 'off' }, '关闭注入'), h('option', { value: 'label' }, '仅注入心情状态'), h('option', { value: 'event' }, '注入心情状态与变化原因')),
            '同一次状态更新最多注入一次。注入还需满足置信度、变化阈值及每日次数限制。'),
          numInput('injectConfidence', '注入置信度阈值', '判断模型返回的置信度达到此值才允许注入。低于阈值仍可更新心情和时间线。范围 0–100，默认 60。', 0, 100)))
        项.push(h('div', { key: 'num', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '数值与注入阈值'),
          numInput('moodBase', '心情基线', '自然衰减的目标值，也是重置后的心情值。范围 30–100，默认 70。', 30, 100),
          numInput('moodFloor', '判定更新下限', '模型判定更新心情时使用的最小值。范围 0–100，默认 0。自然衰减仍向心情基线收敛。', 0, 100),
          numInput('decayHalfHours', '心情偏差半衰期（小时）', '心情与基线差值减半所需时间，范围 1–168 小时，默认 12。七维情绪独立向零衰减，半衰期固定为 90 分钟。', 1, 168),
          h('div', { 'data-fm-note': '' }, '下列变化阈值控制上下文注入资格。低于阈值的有效变化仍会更新状态和时间线。'),
          numInput('sigMood', '心情显著变化阈值', '按模型返回的原始心情变化绝对值比较。范围 1–30，默认 3。已记录且未达单次阈值的小变化按原始绝对值累计，累计达到此值也可获得注入资格。实际心情变化按原始值的三分之一取整。心情值达到 85 时正向变化减半，不高于 40 时负向变化减半。', 1, 30),
          numInput('sigDim', '情绪显著变化阈值', '任一情绪维度的判定变化绝对值达到此值，即视为显著变化。范围 1–100，默认 5。当前模型输出会被限制在每维每次 ±10，设置超过 10 时无法由单次情绪变化触发。', 1, 100),
          numInput('injectPerDay', '每日注入次数上限',
            '当前实例今日已注入 ' + String((st && st.saidToday) || 0) + ' 次，共享此实例的会话合并计数。按宿主本地时间每日零点重新统计。范围 0–50，默认 6，设为 0 时停止注入。', 0, 50)))
        return h('div', { 'data-fm-pane': '' }, ...项)
      })()

      /* ── 页签 4：挂饰 ── */
      const 调整挂饰 = h('section', { className: 'fish-card mood-scale-card', 'data-fm-sec': '', 'aria-label': '调整挂饰' },
        h('h2', { 'data-fm-h': '' }, '调整挂饰'),
        h('div', { className: 'mood-charm-sliders' },
          formRow('挂饰大小', h('div', { className: 'mood-scale' },
            h('input', { type: 'range', min: 60, max: 160, step: 5, 'aria-label': '挂饰大小', value: scale, onInput: e => changeScale(e.currentTarget.value) }),
            h('output', null, scale + '%'))),
          formRow('卡片透明度', h('div', { className: 'mood-scale' },
            h('input', { type: 'range', min: 0, max: 100, step: 5, 'aria-label': '卡片透明度', value: transparency, onInput: e => changeTransparency(e.currentTarget.value) }),
            h('output', null, transparency + '%')))),
        formRow('挂饰弹出卡片', h('select', { 'data-fm-input': '', 'data-fish-select-compact': 'true', 'aria-label': '挂饰弹出卡片', value: popupMode,
          onChange: e => changePopupMode(e.target.value) },
          h('option', { value: 'mood' }, '展示今日心情'),
          h('option', { value: 'cost' }, '展示今日开销'),
          h('option', { value: 'memory' }, '随机展示记忆'))))
      const 挂饰页 = h('div', { 'data-fm-pane': '' },
        h('section', { className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '五档心情挂饰'),
          h('p', { className: 'fish-muted' }, '每档分别配置全身像与半身像。支持 PNG、JPEG、GIF 或 WebP 图片，单张不超过 4 MB。上传成功后立即更新挂饰，图片保存在本机用户数据目录。'),
          h('input', { ref: uploadInputRef, type: 'file', hidden: true, accept: 'image/png,image/jpeg,image/gif,image/webp',
            'aria-label': '选择挂饰图片', disabled: !!busy, onChange: e => {
              const target = uploadTargetRef.current
              if (target) return uploadCharm(target.tier, target.kind, e.currentTarget)
            } }),
          h('div', { className: 'mood-charm-grid' }, ...[
            ['great', '≥ 80 欢喜', 'feiyu-great.png'], ['good', '62–79 开心', 'feiyu-good.png'], ['ok', '42–61 一般', 'feiyu.png'], ['worry', '25–41 心疼', 'feiyu-worry.png'], ['sad', '< 25 难过', 'feiyu-sad.png'],
          ].map(([tier, label, file]) => h('div', { key: tier, className: 'mood-charm-card' },
            h('strong', null, label),
            ...[['body', '全身像', st?.charmImages?.[tier], API + '/' + file], ['face', '半身像', st?.charmFaces?.[tier], API + '/face-' + tier + '.png']].map(([kind, title, image, fallback]) =>
              h('div', { key: kind, className: 'mood-charm-portrait' },
                h('div', { className: 'mood-portrait-stage' },
                  h('button', { type: 'button', className: 'mood-portrait-upload', disabled: !!busy,
                    'aria-label': '上传' + label + title, onClick: () => choosePortrait(tier, kind) },
                    h('img', { src: image?.url || fallback, alt: label + ' ' + title, onLoad: e => updatePortraitOutline(e.currentTarget) }),
                    h('svg', { className: 'mood-portrait-outline', 'aria-hidden': true, focusable: 'false' }),
                    h('span', { className: 'mood-portrait-plus', 'aria-hidden': true }, '+'))),
                h('span', null, title),
                h('div', { className: 'mood-portrait-caption' },
                  h('small', { className: 'fish-muted' }, image?.custom ? '自定义' : '默认图片'),
                  image?.custom ? h('button', { type: 'button', className: 'mood-portrait-reset', disabled: !!busy,
                    'aria-label': '恢复' + label + title + '默认图片', onClick: () => resetCharm(tier, kind) }, '恢复默认') : null),
                busy === 'upload-' + kind + '-' + tier || busy === 'reset-' + kind + '-' + tier
                  ? h('small', { role: 'status' }, busy.startsWith('reset-') ? '恢复中…' : '上传中…') : null)))))),
        调整挂饰)



      return h('div', { 'data-fm-wrap': '', className: 'fish-mood ' + (['bind', 'judge'].includes(页) ? 'mood-settings' : '') },
        historyDialog,
        !cfg.autoJudge ? h('div', { role: 'status', 'data-fm-note': '' }, '自动判断已关闭，可在「判断与注入」页面启用。')
          : !st?.mountedSessions ? h('div', { role: 'status', 'data-fm-note': '' }, '当前实例尚未挂载到已打开的会话，请检查绑定配置及目标会话状态。') : null,
        onPageChange ? null : h('div', { 'data-fm-tabs': '', role: 'tablist', 'aria-label': '心情页面' },
          页签.map(([id, 名]) => h('button', {type: 'button',
            key: id, role: 'tab', 'aria-selected': 页 === id, tabIndex: 页 === id ? 0 : -1, onKeyDown: e => { const i = 页签.findIndex(item => item[0] === id); const next = e.key === 'ArrowRight' ? (i + 1) % 页签.length : e.key === 'ArrowLeft' ? (i + 页签.length - 1) % 页签.length : e.key === 'Home' ? 0 : e.key === 'End' ? 页签.length - 1 : null; if (next !== null) { e.preventDefault(); set页(页签[next][0]); e.currentTarget.parentElement.querySelectorAll('[role=tab]')[next].focus() } }, 'data-fm-tab': '', 'data-fm-on': 页 === id ? '' : undefined,
            onClick: () => set页(id),
          }, 名))),
        页 === 'mood' ? 心情页 : null,
        页 === 'bind' ? 绑定页 : null,
        页 === 'judge' ? 判断页 : null,
        页 === 'charm' ? 挂饰页 : null,
      )
    }

    return { Section: function MoodSection(props) { return h('div', null, h('style', null, CSS), h(Panel, props)) } }
  },
})
