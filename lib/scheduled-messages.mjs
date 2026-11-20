import { randomUUID } from 'node:crypto'
import { mkdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { writeFileAtomicSync } from '../modules/qq/lib/atomic-file.mjs'
import { 会话键, 找agent, 取标题, 搭话工作区 } from '../modules/speak/lib/host.js'
import { validateValue } from './open-platform-schema.mjs'
import { nextScheduleAt, scheduleCalendarThrough, scheduleRepeats, usesHolidayCalendar } from './schedule-calendar.mjs'

const GRACE = 15 * 60_000
const LIMIT = 200
const object = (properties, optional = {}) => ({ type: 'object', properties: { ...properties, ...optional }, required: Object.keys(properties), additionalProperties: false })
const sessionId = { type: 'string', minLength: 1, maxLength: 128 }
const taskId = { ...sessionId, description: '定时任务 ID，可通过查询授权目标会话及任务取得' }
const enabledSchema = { type: 'boolean' }
const taskInput = object({ id: taskId })
const switchInput = object({ id: taskId, enabled: enabledSchema })
const fields = {
  sessionId,
  at: { type: 'string', description: '开始时间，使用带时区的 ISO 8601。重复任务从该时间起按北京时间匹配规则。' },
  repeat: { type: 'string', enum: Object.keys(scheduleRepeats), description: Object.entries(scheduleRepeats).map(([id, label]) => `${id} 为${label}`).join('，') },
  message: { type: 'string', minLength: 1, maxLength: 2000, description: '仅填写要提醒的事项和必要细节。大肥鱼的人设、口吻和简洁程度由后台处理，请勿附加默认话术。' },
}
const input = object(fields)
const storedTask = object({
  id: sessionId, sessionId, message: fields.message, repeat: fields.repeat,
  nextAt: { type: 'integer' }, lastAt: { type: 'integer' },
  status: { type: 'string', enum: ['pending', 'running', 'triggered', 'failed', 'missed', 'interrupted'] },
}, { startAt: { type: 'integer' }, enabled: enabledSchema })

function reminderBody(text) {
  // 匹配已知默认尾句，保留提醒本身的句末标点。
  return text.trim().replace(/(?:^|(?<=[。！？.!?])\s*|[\s，,；;]+)用大肥鱼的口吻说一句\s*[，,]\s*别太[啰罗]嗦[。.!！]?$/u, '').trimEnd()
}

export function createScheduledMessages(ctx, home = process.env.DSH_HOME || join(homedir(), '.dsh')) {
  const path = join(home, 'big-fish-scheduled-messages.json')
  const workspace = () => 搭话工作区(ctx, home)
  let tasks = [], warning = '', stopped = false, logged = false
  try {
    const saved = JSON.parse(readFileSync(path, 'utf8'))
    validateValue({ type: 'array', items: storedTask }, saved)
    if (saved.length > LIMIT || new Set(saved.map(task => task.id)).size !== saved.length || saved.some(task =>
      [task.startAt ?? 0, task.nextAt, task.lastAt].some(at => at < 0 || at > 8.64e15))) throw Error('定时任务数据无效')
    tasks = saved.map(task => {
      const status = task.status === 'running' ? 'interrupted' : task.status
      const startAt = task.startAt || task.lastAt
      const enabled = task.enabled ?? (task.repeat !== 'once' || Boolean(task.nextAt))
      const nextAt = task.nextAt || (enabled && startAt && usesHolidayCalendar(task.repeat)
        ? nextScheduleAt(task.repeat, startAt, Math.max(Date.now(), task.lastAt + 1)) : 0)
      return { ...task, status, nextAt, enabled, message: reminderBody(task.message) || task.message }
    })
  } catch (error) {
    if (error.code !== 'ENOENT') warning = '定时任务文件无法读取，请检查 big-fish-scheduled-messages.json'
  }

  function save(next) {
    if (warning) throw Error(warning)
    mkdirSync(home, { recursive: true })
    writeFileAtomicSync(path, JSON.stringify(next, null, 2))
    tasks = next
  }
  const update = task => save(tasks.map(row => row.id === task.id ? task : row))
  function managedTask(id, canManage) {
    if (warning) throw Error(warning)
    const task = tasks.find(row => row.id === id)
    if (!task || (canManage && !canManage(task))) throw Error('未找到可管理的定时任务')
    if (task.status === 'running') throw Error('任务正在触发，请稍后操作')
    return task
  }
  function sessions(scope) {
    return [...new Map(scope.sessions.map(id => [会话键(id), id])).values()]
      .map(id => {
        const agent = 找agent(ctx, id)
        return { id, title: 取标题(ctx, id, agent?.session).标题 || id, online: typeof agent?.followup === 'function' }
      }).sort((a, b) => a.title.localeCompare(b.title, 'zh'))
  }

  function create(values) {
    validateValue(input, values)
    const { at, repeat } = values, message = reminderBody(values.message)
    const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)(Z|[+-]\d{2}:\d{2})$/.exec(at)
    const startAt = Date.parse(at)
    const wallTime = match ? Date.parse(match[1] + 'Z') : NaN
    if (!Number.isFinite(startAt) || !Number.isFinite(wallTime) || !new Date(wallTime).toISOString().startsWith(at.slice(0, 16))) throw Error('请选择有效时间并指定时区')
    if (startAt <= Date.now()) throw Error('开始时间必须晚于当前时间')
    if (!message) throw Error('请填写提醒内容')
    const scope = workspace()
    const target = scope.sessions.find(id => 会话键(id) === 会话键(values.sessionId))
    if (!target) throw Error('目标会话不在绑定工作区内或已归档')
    const nextAt = nextScheduleAt(repeat, startAt)
    const existing = tasks.find(task => 会话键(task.sessionId) === 会话键(target) && task.nextAt === nextAt &&
      (nextAt || task.startAt === startAt) && task.message === message && task.repeat === repeat)
    if (existing) {
      if (!existing.enabled) throw Error('已有相同的停用任务，请在定时任务页面重新开启')
      return existing
    }
    if (tasks.length >= LIMIT) throw Error('定时任务已达上限，请先删除旧任务')
    const task = { id: randomUUID(), sessionId: target, message, repeat, startAt, nextAt, lastAt: 0, status: 'pending', enabled: true }
    save([...tasks, task])
    return task
  }

  async function dispatch(task, run, agent) {
    let status = 'triggered'
    try {
      const preparePersona = ctx.get?.('bigFishReminderPersona')
      const qqMarked = preparePersona ? await preparePersona(agent, task.sessionId) : false
      if (stopped) return
      if (!workspace().members.has(会话键(task.sessionId)) || 找agent(ctx, task.sessionId) !== agent ||
        (agent.status !== undefined && agent.status !== 'idle') || Date.now() - task.nextAt > GRACE) {
        update(task)
        return
      }
      await agent.followup({ id: randomUUID(), role: 'user', source: { kind: 'big-fish-schedule' }, content: [{
        type: 'text', text: '【定时提醒】这是你安排好的提醒。请用当前会话的人设、称呼和口吻，简短自然地说出提醒，尽量用一句话。保留时间、事项等关键信息，只输出提醒，不调用工具。'
          + (qqMarked ? '请把完整提醒放在 [QQ]…[/QQ] 中。' : '') + '\n提醒要点（JSON 字符串）：' + JSON.stringify(task.message),
      }] })
    } catch { status = 'failed' }
    if (!stopped) {
      const next = tasks.map(row => row.id === task.id ? { ...run, status } : row)
      try { save(next) }
      catch { tasks = next; reportError() }
    }
  }

  function reportError() {
    if (logged) return
    logged = true
    try { ctx.logger?.warn?.('big-fish-schedule: 定时任务读取或写入失败，请检查任务文件和宿主服务') } catch {}
  }

  function tick() {
    if (stopped || warning) return
    try {
      const now = Date.now()
      const due = tasks.filter(task => task.enabled && task.nextAt && task.nextAt <= now && task.status !== 'running').sort((a, b) => a.nextAt - b.nextAt)
      if (!due.length) return
      const { members } = workspace()
      const running = new Set(tasks.filter(task => task.status === 'running').map(task => 会话键(task.sessionId)))
      for (const task of due) {
        const key = 会话键(task.sessionId)
        const missed = now - task.nextAt > GRACE || !members.has(key)
        const agent = missed ? undefined : 找agent(ctx, task.sessionId)
        if (!missed && (running.has(key) || typeof agent?.followup !== 'function' || (agent.status !== undefined && agent.status !== 'idle'))) continue
        const nextAt = nextScheduleAt(task.repeat, task.startAt || task.nextAt, now + 1)
        const run = { ...task, nextAt, lastAt: task.nextAt, status: missed ? 'missed' : 'running', enabled: task.repeat !== 'once' }
        // 先保存本次触发标记，宿主重启时避免重复发送。
        update(run)
        if (!missed) {
          running.add(key)
          void dispatch(task, run, agent).catch(reportError)
        }
      }
    } catch { reportError() }
  }

  ctx.interval(tick, 1000)
  ctx.effect(() => () => { stopped = true })
  return {
    create,
    workspace,
    list() {
      const scope = workspace()
      return { ok: true, workspaceId: scope.id, sessions: sessions(scope), tasks, warning, calendarThrough: scheduleCalendarThrough }
    },
    remove(values, canManage) {
      validateValue(taskInput, values)
      const task = managedTask(values.id, canManage)
      save(tasks.filter(row => row !== task))
    },
    setEnabled(values, canManage) {
      validateValue(switchInput, values)
      const { id, enabled } = values
      const task = managedTask(id, canManage)
      if (task.enabled === enabled) return task
      const now = Date.now()
      let nextAt = task.nextAt
      if (enabled && nextAt <= now) {
        if (task.repeat === 'once') throw Error('一次性任务的计划时间已过，请重新创建')
        const anchor = task.startAt || task.nextAt || task.lastAt
        nextAt = anchor ? nextScheduleAt(task.repeat, anchor, Math.max(now + 1, task.lastAt + 1)) : 0
      }
      const next = { ...task, enabled, nextAt }
      update(next)
      return next
    },
  }
}

export function scheduledMessagesApi(schedule, allowedSessions) {
  function targets(execution) {
    if (!execution.isOwner) throw Error('请由 QQ 主人发送定时任务指令')
    return allowedSessions()
  }
  const within = sessions => {
    const keys = new Set(sessions.map(session => 会话键(session.id)))
    return task => keys.has(会话键(task.sessionId))
  }
  const nextAtSchema = { type: 'string', description: '下次触发时间，停用、已结束或等待节假日安排时为空字符串' }
  const nextAtValue = task => task.enabled && task.nextAt ? new Date(task.nextAt).toISOString() : ''
  return {
    schemaVersion: 1, id: 'schedule', version: '1.0.0', title: '定时任务',
    description: '允许 QQ 主人通过聊天创建、停用和删除定时提醒。调用会话和目标会话都需要授权。',
    operations: [{
      id: 'list_sessions', title: '查询授权目标会话及任务', readOnly: true,
      inputSchema: object({}, { includeTasks: { type: 'boolean', description: '查询、删除或停用提醒时传 true，可取得授权会话的任务 ID' } }), example: {},
      description: '查询可用目标。传入 includeTasks=true 时一并列出已授权会话的定时任务。目标不明确时先询问用户。',
      outputSchema: object({ sessions: { type: 'array', items: object({ id: sessionId, title: { type: 'string' } }) } }, {
        tasks: { type: 'array', items: object({ id: taskId, sessionId, message: fields.message, repeat: fields.repeat, enabled: enabledSchema, at: nextAtSchema }) },
      }),
      handler({ includeTasks }, execution) {
        const sessions = targets(execution)
        if (!includeTasks) return { sessions }
        const tasks = schedule.list().tasks.filter(within(sessions)).map(({ id, sessionId, message, repeat, enabled, nextAt }) =>
          ({ id, sessionId, message, repeat, enabled, at: nextAtValue({ enabled, nextAt }) }))
        return { sessions, tasks }
      },
    }, {
      id: 'create', title: '创建定时提醒', readOnly: false,
      description: '仅在 QQ 主人明确要求定时发送提醒时调用。默认在本会话发送，指定其他会话时先查询授权目标。请核对日期、时间和时区，根据接口结果回复。管理测试须提供目标会话 ID。',
      inputSchema: { ...input, required: ['at', 'repeat', 'message'], properties: { ...fields, sessionId: { ...sessionId, description: '授权目标会话 ID，省略时使用当前调用会话' } } },
      example: { at: '2030-06-01T09:00:00+08:00', repeat: 'once', message: '记得带雨伞' },
      outputSchema: object({ id: taskId, sessionId, at: nextAtSchema, repeat: fields.repeat }),
      handler(values, execution) {
        const id = values.sessionId ?? execution.sessionId
        const target = targets(execution).find(row => row.id === id)
        if (!target) throw Error('请选择已获授权的目标会话')
        const task = schedule.create({ ...values, sessionId: target.id })
        return { id: task.id, sessionId: task.sessionId, at: nextAtValue(task), repeat: task.repeat }
      },
    }, {
      id: 'disable', title: '停用定时任务', readOnly: false, inputSchema: taskInput, example: { id: '任务ID' }, outputSchema: switchInput,
      description: '按 ID 停用指定任务，保留任务供用户在页面重新开启。ID 未知时先查询任务，目标不明确时先询问。',
      handler({ id }, execution) {
        const task = schedule.setEnabled({ id, enabled: false }, within(targets(execution)))
        return { id: task.id, enabled: task.enabled }
      },
    }, {
      id: 'remove', title: '删除定时任务', readOnly: false, inputSchema: taskInput, example: { id: '任务ID' }, outputSchema: taskInput,
      description: '仅在用户明确要求删除时按 ID 删除任务。ID 未知时先查询任务，目标不明确时先询问。',
      handler({ id }, execution) {
        schedule.remove({ id }, within(targets(execution)))
        return { id }
      },
    }],
  }
}
