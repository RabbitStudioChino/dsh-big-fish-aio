let openUpdatesRequested = false
let showUpdates = null
let installArtwork = 'idle'
try {
  const saved = window.sessionStorage?.getItem('big-fish:update-artwork')
  if (['success', 'failure'].includes(saved)) installArtwork = saved
  const reopening = Number(window.localStorage?.getItem('big-fish-aio.reopen-after-update'))
  if (reopening > 0 && Date.now() - reopening < 65000) fishAwaitUpdateLog(true)
} catch {}
const FISH_UPDATE = { installOutcome: installArtwork, result: null, listeners: new Set(), dismissed: new Set() }
function fishSetUpdateResult(result) {
  result = { ...result, installOutcome: FISH_UPDATE.installOutcome }
  FISH_UPDATE.result = result
  for (const listener of FISH_UPDATE.listeners) listener(result)
}

function fishSetInstallOutcome(outcome) {
  FISH_UPDATE.installOutcome = outcome
  try { window.sessionStorage?.setItem('big-fish:update-artwork', outcome) } catch {}
  if (FISH_UPDATE.result) fishSetUpdateResult(FISH_UPDATE.result)
}

function UpdateNotifier() {
  React.useEffect(() => {
    let stopped = false, running = false, checkedAt = 0, active = null, timer, failures = 0
    const queued = new Set()
    let logTimer, logActive, logRunning = false
    const checkInstalled = async () => {
      if (stopped || logRunning) return
      clearTimeout(logTimer)
      logRunning = true
      const controller = new AbortController()
      logActive = controller
      const timeout = setTimeout(() => controller.abort(), 10000)
      try {
        const info = await request('/dsh-big-fish-aio/version', { signal: controller.signal })
        const target = info.postUpdate
        if (!stopped && target && !FISH_UPDATE.dismissed.has(fishUpdateTarget(target)) && !queued.has(fishUpdateTarget(target))) {
          queued.add(fishUpdateTarget(target))
          fishSetInstallOutcome('success')
          fishAwaitUpdateLog(false)
          fishOpenUpdateLog(target)
        }
      } catch {} finally {
        clearTimeout(timeout); logActive = null; logRunning = false
        if (!stopped && fishAwaitUpdateLog()) logTimer = setTimeout(checkInstalled, 1000)
      }
    }
    const schedule = delay => {
      clearTimeout(timer)
      timer = setTimeout(() => check(true), delay * (.95 + Math.random() * .1))
    }
    const check = async (scheduled = false) => {
      if (stopped || running || (!scheduled && checkedAt && Date.now() - checkedAt < (failures ? Math.min(30, 2 ** failures) : 5) * 60000)) return
      running = true; checkedAt = Date.now()
      const controller = new AbortController()
      active = controller
      const timeout = setTimeout(() => controller.abort(), 65000)
      try {
        const result = await request('/dsh-big-fish-aio/update', { signal: controller.signal })
        if (stopped) return
        if (!result.ok) throw Error(result.error || '检查更新失败')
        failures = 0
        fishSetUpdateResult(result)
      } catch (error) {
        if (!stopped) { failures++; fishNotify('自动检查更新失败：' + error.message) }
      } finally {
        clearTimeout(timeout); active = null; running = false
        if (!stopped) schedule((failures ? Math.min(30, 2 ** failures) : 30) * 60000)
      }
    }
    const onVisible = () => { if (document.visibilityState !== 'hidden') { void check(); void checkInstalled() } }
    void check()
    void checkInstalled()
    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true; active?.abort(); logActive?.abort(); clearTimeout(timer); clearTimeout(logTimer)
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
  return null
}
