import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { writeFileAtomicSync } from '../modules/qq/lib/atomic-file.mjs'
import { ownerQQ } from '../modules/qq/lib/memory-sources.mjs'

// Token 费用累加会有浮点尾差，避免恰好到线时漏判。
export const reachedThreshold = (value, threshold) => value >= threshold || threshold - value <= Number.EPSILON * Math.max(Math.abs(value), Math.abs(threshold)) * 4

export function validateThresholds(value) {
  const out = {}
  for (const key of ['dailyLimit', 'lowBalance']) {
    const n = value?.[key]
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 1e9) throw Error('阈值必须是 0 到 10 亿之间的有效金额')
    out[key] = n
  }
  return out
}

export function createRiceThresholds({ home, config, rice, balance, send, stop, log = () => {} }) {
  const file = join(home, 'big-fish-rice-thresholds.json')
  const read = () => existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { dailyLimit: 0, lowBalance: 0, notices: {} }
  const write = data => writeFileAtomicSync(file, JSON.stringify(data, null, 2))
  let running, disposed = false, retryAt = 0
  const settings = () => validateThresholds(read())
  const save = value => {
    const next = validateThresholds(value)
    const previous = read()
    write({ ...previous, ...next, ...(previous.dailyLimit !== next.dailyLimit ? { override: null, cutoff: null } : {}) })
    retryAt = 0
    return next
  }
  const budget = (c = config(), report = null) => {
    const state = read(), { dailyLimit } = validateThresholds(state)
    if (!dailyLimit) return { exceeded: false }
    report ||= rice(c)
    const cost = report.days.find(d => d.date === report.今天)?.cost || 0
    const scope = JSON.stringify([report.今天, c.工作区, dailyLimit])
    return { exceeded: reachedThreshold(cost, dailyLimit) && state.override !== scope, scope, cost, limit: dailyLimit }
  }
  const resume = c => write({ ...read(), override: budget(c).scope })
  const alert = () => {
    const state = read()
    return config().总开关 ? null : state.cutoff || null
  }
  const check = () => {
    if (disposed) return Promise.resolve()
    if (running) return running
    running = (async () => {
      const state = read(), limits = validateThresholds(state)
      let c = config()
      if (!limits.dailyLimit && !limits.lowBalance) return
      const report = limits.dailyLimit ? rice(c) : null
      const cost = report?.days.find(d => d.date === report.今天)?.cost || 0
      const b = budget(c, report)
      if (b.exceeded && c.总开关) {
        stop(); c = config()
        state.cutoff = { id: Date.now() + ':' + b.scope, cost, limit: limits.dailyLimit }
        write({ ...read(), cutoff: state.cutoff })
      }
      if (c.试运行 || Date.now() < retryAt) return
      const readOwner = () => ownerQQ(config())
      const owner = readOwner()
      if (!owner) throw Error('鱼粮提醒需要先在私聊映射中勾选主人 QQ')
      const stamp = JSON.stringify([owner, c.NapCat, c.工作区, limits])
      const notices = state.notices?.stamp === stamp ? state.notices : { stamp }
      const current = () => !disposed && readOwner() === owner && JSON.stringify(settings()) === JSON.stringify(limits) && JSON.stringify(config()) === JSON.stringify(c)
      const persist = () => { if (current()) write({ ...read(), notices }) }
      const notify = async message => {
        if (!current()) return false
        await send(c, owner, message)
        return true
      }
      if (limits.dailyLimit && reachedThreshold(cost, limits.dailyLimit * 0.8) && (notices.daily !== report.今天 || (state.cutoff && notices.cutoff !== state.cutoff.id))) {
        if (await notify(`【大肥鱼·鱼粮提醒】今日已花费约 ¥${cost.toFixed(4)}，已达到每日鱼粮上限 ¥${limits.dailyLimit} 的 80%。${reachedThreshold(cost, limits.dailyLimit) && !c.总开关 ? '已自动关闭大肥鱼总开关。达到上限后可在大肥鱼插件中继续开启。' : '请留意今日用量。'}`)) {
          notices.daily = report.今天; notices.cutoff = state.cutoff?.id; persist()
        }
      }
      if (limits.lowBalance) {
        const remaining = await balance()
        if (!Number.isFinite(remaining)) throw Error('账户未返回有效人民币余额')
        if (remaining >= limits.lowBalance) { if (notices.low) { notices.low = false; persist() } }
        else if (!notices.low && await notify(`【大肥鱼·补充鱼粮】DeepSeek 账户人民币可用余额 ¥${remaining.toFixed(4)}，低于提醒阈值 ¥${limits.lowBalance}，请及时续费补充鱼粮。`)) {
          notices.low = true; persist()
        }
      }
    })().catch(error => { retryAt = Date.now() + 300000; log('鱼粮阈值检查失败：' + error.message) }).finally(() => { running = null })
    return running
  }
  return { settings, save, budget, resume, alert, check, dispose() { disposed = true } }
}
