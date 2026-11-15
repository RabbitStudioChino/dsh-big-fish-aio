const FISH_LOG = { pending: null, focus: null, listeners: new Set() }
function fishOpenUpdateLog(target) {
  if (!target?.ok) return
  if (typeof document !== 'undefined' && !document.activeElement?.closest('dialog')) FISH_LOG.focus = document.activeElement
  FISH_LOG.pending = { target }
  FISH_LOG.listeners.forEach(listener => listener(FISH_LOG.pending))
}
const fishUpdateTarget = value => value?.targetId || (value?.ok ? [value.channel, value.channel === 'beta' ? '' : value.latest, value.latestCommit || ''].join(':') : null)
const fishUpdateLabel = value => value?.channel === 'beta' ? String(value.latestCommit || '').slice(0, 8) || '未知提交' : 'v' + (value?.latest || '未知')

function fishInstalledLogTarget(info) {
  const version = info.packageVersion || info.version || META.version
  const channel = info.installedChannel || info.channel || 'github'
  return { ok: true, channel, current: version, latest: version, releaseId: 'v' + version,
    latestCommit: info.installedCommit || null, targetId: [channel, channel === 'beta' ? '' : version, info.installedCommit || ''].join(':') }
}
async function fishViewInstalledLog() {
  const info = await request('/dsh-big-fish-aio/version')
  fishOpenUpdateLog(fishInstalledLogTarget(info))
}
function fishAwaitUpdateLog(value) {
  try {
    const storage = window.sessionStorage
    if (value === true) storage?.setItem('big-fish:await-update-log', String(Date.now()))
    if (value === false) storage?.removeItem('big-fish:await-update-log')
    const at = Number(storage?.getItem('big-fish:await-update-log'))
    return at > 0 && Date.now() - at < 65000
  } catch { return false }
}

async function fishInstallUpdate(update, { notify = fishNotify, onVersionInfo } = {}) {
  const channel = update.channel
  fishSetInstallOutcome('idle')
  let latest
  try { latest = await request('/dsh-big-fish-aio/update?channel=' + channel + '&refresh=1') }
  catch (error) { fishSetInstallOutcome('failure'); throw error }
  if (fishUpdateTarget(latest) !== fishUpdateTarget(update)) {
    fishSetUpdateResult(latest)
    notify('安装目标已变化，已刷新版本，请再次点击立即更新确认。')
    return false
  }
  if (latest.switchRequired && !await fishAskConfirm({ title: '切换项目拉取方式？', description: '是否切换项目拉取方式，可能会因为网络问题拉取失败', confirmText: '切换并更新' })) return false
  const operationId = 'update-' + Date.now() + '-' + Math.random().toString(36).slice(2)
  const notice = notify('正在检查整合包更新…', { progress: 0 })
  let monitoring = true, progressTimer
  const poll = async () => {
    try {
      const status = await request('/dsh-big-fish-aio/install-status')
      if (monitoring && status.operationId === operationId) notice?.update({ text: status.message, progress: status.progress })
    } catch {}
    if (monitoring) progressTimer = setTimeout(poll, 500)
  }
  fishAwaitUpdateLog(true)
  标记更新后重开()
  try {
    const installation = request('/dsh-big-fish-aio/install?channel=' + channel, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ confirmSourceChange: true, operationId, expectedTarget: fishUpdateTarget(latest) }) })
    void poll()
    await installation
    fishSetInstallOutcome('success')
    notice?.update({ text: '安装已完成，正在重载大肥鱼页面。', progress: 100, tone: 'success' })
    fishSetUpdateResult({ ...latest, installedChannel: channel, hasUpdate: false, commitUpdate: false, sourceChanged: false, switchRequired: false })
    try { onVersionInfo?.(await request('/dsh-big-fish-aio/version')) } catch {}
    return true
  } catch (error) {
    fishAwaitUpdateLog(false)
    清除更新后重开()
    notice?.update({ text: error.message, progress: undefined })
    if (error.data?.targetChanged) { fishSetUpdateResult(error.data.update); notify('安装目标已变化，已刷新版本，请再次点击立即更新确认。'); return false }
    fishSetInstallOutcome('failure')
    throw error
  } finally { monitoring = false; clearTimeout(progressTimer) }
}

function UpdateLogHost({ readiness } = {}) {
  const [opened, setOpened] = React.useState(null)
  const active = React.useRef(null)
  React.useEffect(() => {
    let pending = FISH_LOG.pending
    const pump = () => {
      if (!pending || readiness?.getSnapshot?.()?.syncing || document.visibilityState === 'hidden' || document.querySelector('dialog[open], [aria-modal="true"]')) return
      active.current = pending.target.channel; setOpened(pending); pending = null; FISH_LOG.pending = null
    }
    const receive = value => {
      if (active.current === value.target.channel) { FISH_LOG.pending = null; return }
      pending = value; pump()
    }
    FISH_LOG.listeners.add(receive)
    const unsubscribe = readiness?.subscribe?.(pump)
    const observer = new MutationObserver(pump)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] })
    document.addEventListener('visibilitychange', pump)
    pump()
    return () => { FISH_LOG.listeners.delete(receive); unsubscribe?.(); observer.disconnect(); document.removeEventListener('visibilitychange', pump) }
  }, [readiness])
  return opened ? h(UpdateLog, { initial: opened, onClose: () => {
    active.current = null; setOpened(null)
    const previous = FISH_LOG.focus
    requestAnimationFrame(() => { if (previous?.isConnected) previous.focus({ preventScroll: true }) })
  } }) : null
}

function UpdateLog({ initial, onClose }) {
  const [target, setTarget] = React.useState(initial.target)
  const [releaseId, setReleaseId] = React.useState(initial.target.releaseId || null)
  const [data, setData] = React.useState(null), [error, setError] = React.useState(''), [loading, setLoading] = React.useState(false)
  const [history, setHistory] = React.useState([]), [historyError, setHistoryError] = React.useState('')
  const [category, setCategory] = React.useState(null), [retry, setRetry] = React.useState(0)
  const selection = React.useRef(0)
  const content = React.useRef(null)
  React.useEffect(() => { content.current?.scrollTo(0, 0) }, [releaseId, category])
  React.useEffect(() => {
    const receive = value => {
      if (value.target.channel !== target.channel) return
      setTarget(value.target); setReleaseId(value.target.releaseId); setRetry(value => value + 1)
    }
    FISH_LOG.listeners.add(receive)
    return () => FISH_LOG.listeners.delete(receive)
  }, [target.channel, fishUpdateTarget(target)])
  React.useEffect(() => {
    const controller = new AbortController(), id = ++selection.current
    setLoading(true); setError(''); setData(null)
    request('/dsh-big-fish-aio/changelog?channel=' + target.channel + (releaseId ? '&releaseId=' + encodeURIComponent(releaseId) : '') + (retry ? '&refresh=1' : ''), { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted || id !== selection.current) return
        if (result.status !== 'ready') { setError(result.message || '更新日志暂不可用'); return }
        setData(result.changelog); setCategory(result.changelog.sections.find(section => section.items.length)?.id || null)
      }).catch(error => { if (!controller.signal.aborted && id === selection.current) setError('更新日志读取失败：' + error.message) })
      .finally(() => { if (!controller.signal.aborted && id === selection.current) setLoading(false) })
    return () => controller.abort()
  }, [target.channel, releaseId, retry])
  React.useEffect(() => {
    const controller = new AbortController()
    setHistoryError('')
    request('/dsh-big-fish-aio/releases?channel=' + target.channel + (retry ? '&refresh=1' : ''), { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) { setHistory(result.releases || []); if (result.status !== 'ready') setHistoryError(result.message) } })
      .catch(error => { if (!controller.signal.aborted) setHistoryError(error.message) })
    return () => controller.abort()
  }, [target.channel, retry])
  const close = () => {
    const targetId = fishUpdateTarget(target)
    FISH_UPDATE.dismissed.add(targetId)
    onClose()
    void request('/dsh-big-fish-aio/reminder', { method: 'POST', headers: { 'content-type': 'application/json' },
      signal: AbortSignal.timeout(10000), body: JSON.stringify({ targetId }) })
      .catch(error => fishNotify('关闭提醒的状态暂未保存：' + error.message))
  }
  const sections = data?.sections.filter(section => section.items.length) || []
  const active = sections.find(section => section.id === category)
  const offset = sections.slice(0, sections.indexOf(active)).reduce((sum, section) => sum + section.items.length, 0)
  const sources = { mirror: '国内镜像', github: 'GitHub 正式版', beta: '私有内测' }
  const currentRelease = target.releaseId || 'v' + target.latest
  return h('div', { className: 'big-fish fish-release-host' }, h(FishModal, { className: 'fish-modal', onCancel: event => { event.preventDefault(); void close() } },
    h('section', { className: 'fish-modal-card fish-release-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-release-title',
      onKeyDown: event => {
        if (event.key === 'Escape') { event.preventDefault(); void close(); return }
        if (event.key !== 'Tab') return
        const controls = Array.from(event.currentTarget.querySelectorAll('button, a[href], input, select, textarea, [tabindex]'))
          .filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length)
        const edge = event.shiftKey ? controls[0] : controls.at(-1)
        if (event.target === edge) { event.preventDefault(); (event.shiftKey ? controls.at(-1) : controls[0])?.focus() }
      } },
      h('header', { className: 'fish-release-head' },
        h('div', null, h('h2', { id: 'fish-release-title' }, '更新日志'), h('span', { className: 'fish-muted' }, '版本说明')),
        h('button', { type: 'button', className: 'fish-modal-close', onClick: close, 'aria-label': '关闭更新日志', autoFocus: true }, '×')),
      h('div', { className: 'fish-release-columns' },
        h('aside', { className: 'fish-release-nav' },
          h('div', { className: 'fish-release-version' },
            h('strong', null, data?.version ? 'v' + data.version : releaseId || currentRelease),
            data?.publishedAt ? (Number.isFinite(Date.parse(data.publishedAt)) ? h('time', { dateTime: data.publishedAt }, new Date(data.publishedAt).toLocaleDateString()) : h('span', { className: 'fish-muted' }, '待发布草稿')) : null),
          h('div', { className: 'fish-release-categories' },
            h('span', { className: 'fish-kicker' }, '更新分类'),
            h('nav', { 'aria-label': '更新日志分类' }, ...sections.map(section => h('button', { type: 'button', key: section.id, className: 'fish-button fish-release-category', 'aria-pressed': category === section.id, onClick: () => setCategory(section.id) },
              h('span', null, section.title), h('span', { className: 'fish-release-count' }, String(section.items.length).padStart(2, '0')))))),
          h('div', { className: 'fish-release-history' },
            h('label', { htmlFor: 'fish-release-version' }, '历史版本'),
            h(FishSelect, { id: 'fish-release-version', 'aria-label': '历史版本', value: releaseId || currentRelease, onChange: event => setReleaseId(event.target.value) },
              h('option', { value: currentRelease }, currentRelease + ' · 当前安装'),
              ...history.filter(item => item.releaseId !== currentRelease).map(item => h('option', { key: item.releaseId, value: item.releaseId }, item.title))),
            historyError ? h('div', { className: 'fish-release-history-error', role: 'status' }, h('span', null, historyError), h('button', { type: 'button', className: 'fish-button', onClick: () => setRetry(value => value + 1) }, '重试')) : null,
            h('small', { className: 'fish-muted' }, sources[target.channel] + ' · 已安装 ' + fishUpdateLabel(target)))),
        h('main', { ref: content, className: 'fish-release-content', 'aria-busy': loading },
          loading ? h('p', { role: 'status' }, '正在读取更新日志…') : null,
          error ? h('div', { role: 'status' }, h('p', null, error), h('button', { type: 'button', className: 'fish-button', onClick: () => setRetry(value => value + 1) }, '重试')) : null,
          data ? h('header', { className: 'fish-release-content-head' }, h('h3', null, data.title || 'v' + data.version), data.summary ? h('p', { className: 'fish-release-summary' }, data.summary) : null) : null,
          active ? h('section', { 'aria-label': active.title },
            h('div', { className: 'fish-release-section-head' }, h('h4', null, active.title), h('span', { className: 'fish-muted' }, active.items.length + ' 项')),
            h('ol', { start: offset + 1 }, ...active.items.map((item, index) => h('li', { key: item.id },
              h('span', { className: 'fish-release-number', 'aria-hidden': true }, String(offset + index + 1).padStart(2, '0')),
              h('div', null, h('h5', null, item.title),
                item.description ? h('p', { className: 'fish-release-description' }, item.description) : null,
                ...(item.links || []).filter(link => { try { const url = new URL(link.url); return url.protocol === 'https:' && !url.username && !url.password } catch { return false } }).map(link => h('a', { key: link.url, href: link.url, target: '_blank', rel: 'noopener noreferrer' }, link.label))))))) : data ? h('p', null, '此版本暂无更新条目') : null))),
    h('style', null, FISH_THEME_CSS)))
}
