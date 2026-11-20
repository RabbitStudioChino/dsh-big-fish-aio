function riceTokens(n) {
  const v = Math.max(0, Number(n) || 0)
  if (v >= 1e6) return (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'
  if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K'
  return Math.round(v).toLocaleString('zh-CN')
}

function riceDate(date) { return new Date(date + 'T00:00:00Z') }
function riceDateKey(date) { return date.toISOString().slice(0, 10) }
function riceWindow(mode, today, from, to) {
  const end = riceDate(today), start = riceDate(today)
  if (mode === 'week') start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7)
  if (mode === 'month') start.setUTCDate(1)
  if (mode === 'year') start.setUTCMonth(0, 1)
  if (mode === 'total') return { from: '', to: today }
  if (mode === 'custom') {
    const valid = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number.isFinite(riceDate(value).getTime()) && riceDateKey(riceDate(value)) === value
    if (!valid(from) || !valid(to) || from > to) return { error: '请选择有效日期，开始日期不能晚于结束日期。' }
    return { from, to }
  }
  return { from: riceDateKey(start), to: riceDateKey(end) }
}
function riceSummary(days, window) {
  const total = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, ragTokens: 0, total: 0, cost: 0 }, sessions = new Map()
  if (window.error) return { ...total, sessions: [] }
  for (const day of days) {
    if (day.date < window.from || day.date > window.to) continue
    for (const key of Object.keys(total)) total[key] += Number(day[key]) || 0
    for (const session of day.sessions || []) {
      const old = sessions.get(session.id) || { id: session.id, title: session.title, total: 0 }
      old.total += Number(session.total) || 0; sessions.set(session.id, old)
    }
  }
  return { ...total, sessions: [...sessions.values()].filter(s => s.total > 0).sort((a, b) => b.total - a.total) }
}
function riceHeat(period, today, days) {
  const window = riceWindow(period, today), byDay = new Map(days.map(d => [d.date, d])), groups = []
  const count = period === 'year' ? 12 : 1
  for (let month = 0; month < count; month++) {
    const start = period === 'year' ? new Date(Date.UTC(Number(today.slice(0, 4)), month, 1)) : riceDate(window.from)
    const end = period === 'year' || period === 'month' ? new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)) : riceDate(window.to)
    if (period === 'week') end.setUTCDate(start.getUTCDate() + 6)
    const cells = Array.from({ length: (start.getUTCDay() + 6) % 7 }, () => null)
    for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const date = riceDateKey(d)
      cells.push({ date, total: byDay.get(date)?.total || 0, future: date > today })
    }
    groups.push({ label: period === 'week' ? '本周' : (start.getUTCMonth() + 1) + '月', cells })
  }
  const max = Math.max(1, ...groups.flatMap(g => g.cells.map(c => c?.total || 0)))
  return { groups, max }
}

function ricePoster({ summary, days, today, period, name, theme, label, artwork }) {
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
  if (!ctx) throw Error('当前浏览器不支持图片生成')
  // 给右下角的四分之一画幅留出空间，避免插画叠到热点图。
  canvas.width = 880; canvas.height = period === 'year' ? 1320 : 1020
  const style = getComputedStyle(document.querySelector('.big-fish'))
  const color = key => style.getPropertyValue('--fish-report-' + theme + '-' + key).trim()
  const bg = color('bg'), ink = color('ink'), accent = color('accent'), surface = color('surface')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height)
  const text = (value, x, y, size, fill = ink) => { ctx.font = `500 ${size}px "PingFang SC", sans-serif`; ctx.fillStyle = fill; ctx.fillText(String(value), x, y) }
  const box = (x, y, w, height) => { ctx.fillStyle = surface; ctx.beginPath(); ctx.roundRect(x, y, w, height, 20); ctx.fill() }
  text('BIG FISH / 大肥鱼', 48, 67, 20, accent)
  text('用量报告', 48, 126, 42)
  ctx.textAlign = 'right'; text(Array.from(name || '大肥鱼').slice(0, 24).join(''), 832, 72, 22); ctx.textAlign = 'left'
  text(label, 48, 164, 17)
  const heatHeight = period === 'year' ? 552 : 310
  box(36, 192, 808, heatHeight)
  text('TOKEN 热点图 · ' + ({ week: '本周', month: '本月', year: '本年' }[period]), 58, 225, 18)
  const heat = riceHeat(period, today, days)
  heat.groups.forEach((group, index) => {
    const compact = period === 'year', x = compact ? 58 + index % 3 * 262 : 90, y = compact ? 258 + Math.floor(index / 3) * 120 : 260
    const size = compact ? 14 : period === 'month' ? 28 : 70, gap = compact ? 3 : 12
    text(group.label, x, y, 15, accent)
    group.cells.forEach((cell, i) => {
      if (!cell) return
      ctx.globalAlpha = cell.future ? 0.08 : cell.total ? 0.3 + 0.7 * Math.ceil(cell.total / heat.max * 4) / 4 : 0.12
      ctx.fillStyle = accent; ctx.beginPath(); ctx.roundRect(x + i % 7 * (size + gap), y + 12 + Math.floor(i / 7) * (size + gap), size, size, 4); ctx.fill()
    })
    ctx.globalAlpha = 1
  })
  const base = period === 'year' ? 772 : 570
  box(36, base, 808, 228)
  if (artwork) {
    const bottom = canvas.height - 16
    const scale = Math.sqrt((canvas.width * canvas.height / 4) / (artwork.naturalWidth * artwork.naturalHeight))
    const width = artwork.naturalWidth * scale, height = artwork.naturalHeight * scale
    ctx.globalAlpha = 0.32
    ctx.drawImage(artwork, canvas.width - 16 - width, bottom - height, width, height)
    ctx.globalAlpha = 1
  }
  text(riceTokens(summary.total), 60, base + 60, 42)
  text('总 Token 数', 60, base + 94, 17)
  ctx.textAlign = 'right'; text('≈ ¥' + summary.cost.toFixed(4), 820, base + 60, 32, accent); text('估算费用', 820, base + 94, 17); ctx.textAlign = 'left'
  text('输入 ' + riceTokens(summary.input) + '  ·  输出 ' + riceTokens(summary.output), 60, base + 141, 20)
  text('缓存 ' + riceTokens(summary.cacheRead + summary.cacheWrite) + '  ·  RAG ' + riceTokens(summary.ragTokens), 60, base + 185, 20)
  text('大肥鱼 · 每一粒鱼粮都有记录', 48, canvas.height - 44, 19, accent)
  return canvas
}
function riceCalendarMonth(month, offset = 0) {
  const date = riceDate(month.slice(0, 7) + '-01')
  date.setUTCMonth(date.getUTCMonth() + offset)
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
  return { month: riceDateKey(date), label: date.getUTCFullYear() + '年' + (date.getUTCMonth() + 1) + '月',
    cells: [...Array((date.getUTCDay() + 6) % 7).fill(null), ...Array.from({ length: end }, (_, i) => ({ date: riceDateKey(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), i + 1))), day: i + 1 }))] }
}
function RiceDateRange({ today, from, to, position, onApply, onClose }) {
  const [month, setMonth] = React.useState(from || today)
  const [start, setStart] = React.useState(from || '')
  const [end, setEnd] = React.useState(to || '')
  const pick = date => {
    if (!start || end) { setStart(date); setEnd('') }
    else { setStart(date < start ? date : start); setEnd(date < start ? start : date) }
  }
  const valid = !riceWindow('custom', today, start, end).error
  return h(FishModal, { className: 'fish-modal rice-date-modal', onCancel: onClose, onClick: e => { if (e.target === e.currentTarget) onClose() } },
    h('div', { className: 'fish-modal-card rice-date-card', role: 'dialog', 'aria-modal': true, 'aria-label': '选择日期跨度', style: position },
      h('div', { className: 'rice-date-nav' },
        h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '上个月', onClick: () => setMonth(riceCalendarMonth(month, -1).month) }, '‹'),
        h('span', null, start ? start + (end ? ' 至 ' + end : ' · 请选择结束日期') : '请选择开始日期和结束日期'),
        h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '下个月', onClick: () => setMonth(riceCalendarMonth(month, 1).month) }, '›')),
      h('div', { className: 'rice-date-months' }, ...[0, 1].map(offset => {
        const calendar = riceCalendarMonth(month, offset)
        return h('section', { key: offset, 'aria-label': calendar.label }, h('h3', null, calendar.label),
          h('div', { className: 'rice-date-grid' }, ...['一', '二', '三', '四', '五', '六', '日'].map(day => h('span', { key: day, className: 'fish-muted' }, day)),
            ...calendar.cells.map((cell, i) => cell ? h('button', { key: cell.date, type: 'button',
              className: 'rice-date-day' + (cell.date === start || cell.date === end ? ' is-edge' : '') + (start && end && cell.date > start && cell.date < end ? ' in-range' : ''),
              'aria-label': cell.date, 'aria-pressed': cell.date === start || cell.date === end, onClick: () => pick(cell.date) }, cell.day) : h('span', { key: 'blank-' + i }))))
      })),
      h('div', { className: 'fish-modal-actions' }, h('button', { type: 'button', className: 'fish-button', onClick: onClose }, '取消'),
        h('button', { type: 'button', className: 'fish-button', onClick: () => { setStart(''); setEnd('') } }, '清除'),
        h('button', { type: 'button', className: 'fish-button fish-primary', disabled: !valid, onClick: () => { if (valid) onApply(start, end) } }, '应用'))))
}
function RiceShare({ days, today, onClose }) {
  const [theme, setTheme] = React.useState('ocean'), [period, setPeriod] = React.useState('year'), [name, setName] = React.useState('大肥鱼')
  const [selections, setSelections] = React.useState({})
  const [loaded, setLoaded] = React.useState(null)
  const [image, setImage] = React.useState(''), [error, setError] = React.useState(''), [busy, setBusy] = React.useState(false)
  const canvas = React.useRef(null)
  const backgrounds = RICE_BACKGROUNDS[theme]
  const background = selections[theme] || backgrounds[0]
  const artwork = loaded?.url === background ? loaded.artwork : null
  const artworkError = loaded?.url === background && !artwork
  React.useEffect(() => {
    let active = true
    const picture = new Image()
    picture.src = background
    picture.decode().then(
      () => { if (active) setLoaded({ url: background, artwork: picture }) },
      () => { if (active) setLoaded({ url: background, artwork: null }) },
    )
    return () => { active = false }
  }, [background])
  React.useLayoutEffect(() => {
    if (!artwork) { canvas.current = null; setImage(''); setError(''); return }
    try {
      const window = riceWindow(period, today), summary = riceSummary(days, window), label = window.from + ' 至 ' + window.to
      canvas.current = ricePoster({ summary, days, today, period, name, theme, label, artwork })
      setImage(canvas.current.toDataURL('image/png')); setError('')
    }
    catch (e) { canvas.current = null; setImage(''); setError('生成图片失败：' + e.message) }
  }, [days, today, period, name, theme, artwork])
  const exportImage = async copy => {
    setBusy(true); setError('')
    try {
      if (!canvas.current) throw Error('图片尚未生成')
      if (copy && (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined')) throw Error('当前浏览器不支持复制图片，请下载 PNG')
      const blob = new Promise((resolve, reject) => canvas.current.toBlob(b => b ? resolve(b) : reject(Error('PNG 编码失败')), 'image/png'))
      if (copy) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setError('图片已复制到剪贴板')
      } else {
        const url = URL.createObjectURL(await blob), a = document.createElement('a')
        a.href = url; a.download = '大肥鱼用量报告-' + today + '.png'; a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return h(FishModal, { className: 'fish-modal', onCancel: onClose },
    h('div', { className: 'fish-modal-card rice-share-modal', role: 'dialog', 'aria-modal': true, 'aria-label': '分享用量报告' },
      h('div', { className: 'rice-share-preview' }, image ? h('img', { src: image, alt: '用量报告图片预览' }) : h('p', { role: 'status' }, artworkError ? '背景图片加载失败，请选择其他背景。' : error || '正在生成图片…')),
      h('div', { className: 'rice-share-options' },
        h('div', { className: 'fish-section-head' }, h('h2', null, '分享你的鱼粮手帐'), h('button', { className: 'fish-modal-close', type: 'button', onClick: onClose, 'aria-label': '关闭分享' }, '×')),
        h('p', { className: 'fish-muted' }, '把用量变成一张手帐卡片。'),
        h('label', null, '显示名称', h(FishInput, { value: name, maxLength: 24, onChange: e => setName(e.target.value) })),
        h('fieldset', null, h('legend', null, '报告样式'), ...[['ocean', '大肥鱼'], ['claude', 'Claude'], ['gpt', 'GPT']].map(([key, title]) => h('button', { key, className: 'fish-button' + (theme === key ? ' fish-primary' : ''), type: 'button', 'aria-pressed': theme === key, onClick: () => setTheme(key) }, title))),
        h('fieldset', { className: 'rice-share-backgrounds' }, h('legend', null, '背景插画'),
          ...backgrounds.map((url, index) => h('button', {
            key: url, className: 'rice-share-background', type: 'button', 'aria-label': '背景 ' + (index + 1),
            'aria-pressed': background === url, onClick: () => setSelections({ ...selections, [theme]: url }),
          }, h('img', { src: url, alt: '', decoding: 'async' })))),
        h('fieldset', null, h('legend', null, '热点图维度'), ...[['week', '周'], ['month', '月'], ['year', '年']].map(([key, title]) => h('button', { key, className: 'fish-button' + (period === key ? ' fish-primary' : ''), type: 'button', 'aria-pressed': period === key, onClick: () => setPeriod(key) }, title))),
        h('div', { className: 'rice-share-footer' },
        h('div', { className: 'fish-actions rice-share-actions' }, h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !image, onClick: () => exportImage(false) }, '下载 PNG'), h('button', { type: 'button', className: 'fish-button', disabled: busy || !image, onClick: () => exportImage(true) }, '复制图片')),
        error ? h('p', { role: 'status' }, error) : null,
        h('p', { className: 'fish-muted rice-share-privacy' }, '图片只在浏览器内生成。报告不包含余额、工作区路径和会话名称，不上传到外部服务。Claude / GPT 为视觉样式。')))))
}
