import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { writeFileAtomicSync } from './atomic-file.mjs'
import { bindingSource, endpointKey, exclusiveBinding, sessionKey, ownerQQ } from './memory-sources.mjs'
import { latestUserId, qqScope } from '../../memory/lib/qq-scope.mjs'
import { readGroupHistory } from './group-history.mjs'
import { responseProblem } from './response-guard.mjs'

const DAY = 86400000
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const text = value => String(value || '').replace(/[\r\n\x00-\x1f]/g, ' ').slice(0, 300)

export function createAccountOperations({ home, config, findAgent, call, loadAvatar, getSession = async () => null, log = () => {}, now = Date.now }) {
  const path = join(home, 'qq-account-requests.json')
  const deliveryPath = join(home, 'qq-owner-group-deliveries.json')
  const mounted = new Map()
  let notifying = false, stopped = false, nextNotice = 0
  const read = () => {
    if (!existsSync(path)) return []
    const data = JSON.parse(readFileSync(path, 'utf8'))
    if (!Array.isArray(data.items) || data.items.some(item => !item || !/^[A-F0-9]{12}$/.test(item.id)
      || !['friend', 'group'].includes(item.kind) || typeof item.flag !== 'string'
      || !/^[a-f0-9]{64}$/.test(item.stamp) || !Number.isFinite(item.createdAt)
      || !['pending', 'processing', 'approved', 'rejected', 'expired', 'uncertain'].includes(item.status))) {
      throw new Error('申请记录损坏，已停止操作')
    }
    return data.items
  }
  const save = items => writeFileAtomicSync(path, JSON.stringify({ version: 1, items }, null, 2))
  const update = (id, patch) => save(read().map(item => item.id === id ? { ...item, ...patch } : item))
  const settings = () => {
    const file = join(home, 'fish-memory-config.json')
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  }
  const target = () => {
    const c = config(), owner = ownerQQ(c)
    if (!owner) throw new Error('请先在 QQ 私聊映射中勾选唯一的主人 QQ')
    const row = (c.绑定 || []).find(b => b.类型 === '私聊' && String(b.号码) === owner)
    if (!row || !exclusiveBinding(c.绑定, row.会话)) throw new Error('主人 QQ 需要独占的已启用私聊绑定')
    const source = bindingSource(home, row)
    if (!source || source.unverified || source.endpoint !== endpointKey(c)) throw new Error('请先由主人发送私聊消息完成来源核验')
    return { c, owner, row, bot: source.botId, stamp: hash([endpointKey(c), owner, row.会话, source.botId]) }
  }
  const active = (t, permission) => {
    if (stopped || !t.c.总开关 || t.c.试运行) throw new Error('请开启总开关并关闭试运行')
    if (permission && t.c[permission] !== true) throw new Error('此项 QQ 操作权限已关闭')
  }
  const verify = async (t, permission, signal) => {
    active(t, permission)
    const login = await call(t.c, 'get_login_info', {}, signal)
    const fresh = t.caller ? authorize(t.caller.agent, undefined, t.caller.group) : target()
    active(fresh, permission)
    if (fresh.stamp !== t.stamp || String(login?.user_id) !== t.bot || (t.caller && fresh.caller.stamp !== t.caller.stamp)) throw new Error('QQ 账号、主人、绑定或当前消息已变化，本次操作取消')
  }
  const authorize = (agent, messageId = latestUserId(agent?.session), allowGroup = false) => {
    const t = target()
    const row = exclusiveBinding(t.c.绑定, agent?.session?.id)
    if (!agent || !row || findAgent(row.会话) !== agent) throw new Error('仅当前独占绑定的大肥鱼会话可调用')
    const scope = qqScope(home, row.会话, settings(), messageId)
    if (!scope || scope.blocked || !scope.source.messageId || scope.source.botId !== t.bot) throw new Error('本轮 QQ 来源未核验或机器人账号不一致')
    const group = row.类型 === '群'
    if (group) {
      if (!allowGroup || t.c.允许群聊主人指令 !== true) throw new Error('此操作需要主人私聊授权，或先开启群聊主人指令开关')
      if (scope.source.senders.length !== 1 || scope.source.senders[0] !== t.owner) throw new Error('仅接受本轮由主人单独发送的群聊指令，多人混合消息请主人单独重发')
    } else if (!scope.owner || sessionKey(row.会话) !== sessionKey(t.row.会话)) throw new Error('仅接受主人本轮可信 QQ 私聊授权')
    return { ...t, caller: { agent, group, stamp: hash([row, messageId]) } }
  }
  const sendOwner = async (t, message, permission) => {
    await verify(t, permission)
    await call(t.c, 'send_private_msg', { user_id: Number(t.owner), message: [{ type: 'text', data: { text: message } }] })
  }
  const permissionFor = item => item.kind === 'friend' ? '好友申请审批' : '群邀请审批'
  const publicItem = ({ id, kind, user, group, comment, status, createdAt, notifiedAt }) => ({
    id, kind, user, group, comment, createdAt, notifiedAt,
    status: status === 'pending' && now() - createdAt > DAY ? 'expired' : status,
  })
  const view = () => {
    try {
      const t = target()
      return { ok: true, owner: t.owner, session: t.row.会话, requests: read().filter(item => item.stamp === t.stamp).map(publicItem) }
    } catch (e) { return { ok: true, owner: ownerQQ(config()), requests: [], setupError: e.message } }
  }
  const capture = event => {
    if (event?.post_type !== 'request' || stopped) return false
    const kind = event.request_type === 'friend' ? 'friend' : event.request_type === 'group' && event.sub_type === 'invite' ? 'group' : null
    if (!kind) return false
    if (config()[permissionFor({ kind })] !== true) return false
    const t = target()
    active(t, permissionFor({ kind }))
    const flag = String(event.flag || ''), user = String(event.user_id || ''), group = String(event.group_id || '')
    if (String(event.self_id) !== t.bot || !flag || flag.length > 1024 || !/^\d+$/.test(user) || (kind === 'group' && !/^\d+$/.test(group))) return false
    const id = hash([t.stamp, kind, flag]).slice(0, 12).toUpperCase()
    const items = read()
    if (items.some(item => item.id === id)) return false
    const kept = items.filter(item => now() - item.createdAt < 7 * DAY || item.status === 'processing')
    if (kept.length >= 200) throw new Error('申请记录已满，请处理已有申请')
    kept.push({ id, kind, flag, user, group, comment: text(event.comment), stamp: t.stamp, createdAt: now(), status: 'pending', notifiedAt: 0 })
    save(kept)
    return true
  }
  const notifyNext = async () => {
    if (notifying || stopped || now() < nextNotice) return
    notifying = true
    try {
      const t = target()
      active(t)
      const item = read().find(row => row.stamp === t.stamp && row.status === 'pending' && !row.notifiedAt && t.c[permissionFor(row)])
      if (!item) return
      if (now() - item.createdAt > DAY) { update(item.id, { status: 'expired' }); return }
      await verify(t, permissionFor(item))
      const detail = item.kind === 'friend' ? `QQ ${item.user} 申请添加我为好友` : `QQ ${item.user} 邀请我加入群 ${item.group}`
      await sendOwner(t, `主人，${detail}，可以接受吗？\n对方填写的留言：${JSON.stringify(item.comment)}\n申请编号 ${item.id}\n同意请单独回复：同意申请 ${item.id}\n拒绝请单独回复：拒绝申请 ${item.id}\n授权在收到申请后 24 小时内有效。`, permissionFor(item))
      update(item.id, { notifiedAt: now() })
    } catch (e) { log('QQ 申请询问暂未完成：' + e.message) }
    finally { nextNotice = now() + 5000; notifying = false }
  }
  const handleOwnerReply = async ({ session, messageId, text: message }) => {
    const match = /^(同意|拒绝)申请\s+([A-F0-9]{12})$/i.exec(String(message || '').trim())
    if (!match) return null
    const agent = findAgent(session)
    let t
    try { t = authorize(agent, messageId) } catch { return null }
    const id = match[2].toUpperCase(), item = read().find(row => row.id === id && row.stamp === t.stamp)
    let messageText
    try {
      if (!item) throw new Error('申请不存在或所属账号、主人绑定已变化')
      if (item.status !== 'pending') throw new Error('该申请已处理或结果待核验，请查看账号与申请页面')
      if (!item.notifiedAt) throw new Error('该申请尚未完成询问，请稍后再授权')
      if (now() - item.createdAt > DAY) { update(id, { status: 'expired' }); throw new Error('授权已过期，请在 QQ 中核查申请') }
      await verify(t, permissionFor(item))
      // 最后一次 await 后重新读盘并占用，避免重复回复并发审批。
      if (read().find(row => row.id === id)?.status !== 'pending') throw new Error('该申请正在处理')
      update(id, { status: 'processing', decisionMessage: messageId })
      const approve = match[1] === '同意'
      try {
        await call(t.c, item.kind === 'friend' ? 'set_friend_add_request' : 'set_group_add_request', {
          flag: item.flag, approve, ...(item.kind === 'group' ? { sub_type: 'invite' } : {}),
        })
        update(id, { status: approve ? 'approved' : 'rejected', decidedAt: now() })
        messageText = `申请 ${id} 已${approve ? '同意' : '拒绝'}。`
      } catch (e) {
        update(id, { status: 'uncertain', decidedAt: now() })
        throw new Error('后端未确认处理结果，请在 QQ 核查，不会自动重复审批。' + e.message)
      }
    } catch (e) { messageText = e.message }
    try { await sendOwner(t, messageText) } catch (e) { log('QQ 审批结果通知失败：' + e.message) }
    return { ok: true, message: messageText }
  }
  const groupsFor = (agent, t) => {
    const memorySettings = settings()
    const ownerScope = qqScope(home, t.row.会话, memorySettings, latestUserId(agent.session))
    return (t.c.绑定 || []).filter(row => row.类型 === '群').map(row => {
      const scope = qqScope(home, row.会话, memorySettings)
      const readable = Boolean(ownerScope?.owner && scope && !scope.blocked && scope.source?.botId === t.bot && ownerScope.readIds.includes(scope.writeId))
      return { group: String(row.号码), name: row.称呼 || String(row.号码), session: row.会话, readable,
        reason: readable ? '' : '群绑定未启用、不独占、来源未核验或所属机器人账号不同' }
    })
  }
  const loadGroups = async (agent, t, signal) => {
    let names = []
    try { names = await call(t.c, 'get_group_list', {}, signal) } catch { /* 部分后端不提供群名清单，仍可使用绑定称呼和群号。 */ }
    await verify(t, null, signal)
    authorize(agent)
    return groupsFor(agent, target()).map(group => ({ ...group,
      qqName: (Array.isArray(names) ? names : []).find(row => String(row.group_id) === group.group)?.group_name || '',
    }))
  }
  const selectGroup = async (agent, t, query, signal) => {
    if (typeof query !== 'string' || !query.trim()) throw new Error('请指定群号或群名')
    query = query.trim()
    const groups = await loadGroups(agent, t, signal)
    const exact = groups.filter(group => group.group === query || group.name === query || group.qqName === query)
    const matches = exact.length ? exact : groups.filter(group => group.name.includes(query) || group.qqName.includes(query))
    if (matches.length !== 1) return { ok: false, message: matches.length ? '匹配多个群，请确认群号' : '没有找到该群的已登记绑定，请先查看群列表', groups: matches.length ? matches : groups }
    const selected = matches[0]
    if (!selected.readable) throw new Error(selected.reason + '，请先由群内真实消息完成来源核验')
    return { ok: true, ...selected }
  }
  const readDeliveries = () => {
    if (!existsSync(deliveryPath)) return { stamp: '', items: [] }
    const data = JSON.parse(readFileSync(deliveryPath, 'utf8'))
    if (!data || !/^[a-f0-9]{64}$/.test(data.stamp) || !Array.isArray(data.items)
      || data.items.some(item => !item || !/^[a-f0-9]{64}$/.test(item.id) || typeof item.result?.ok !== 'boolean')) {
      throw new Error('群消息发送记录损坏，请先检查记录文件')
    }
    return data
  }
  const saveDeliveries = data => writeFileAtomicSync(deliveryPath, JSON.stringify(data, null, 2))
  const makeTool = (agent, name, description, parameters, permission, run, required = Object.keys(parameters)) => ({
    name, description, parameters: { type: 'object', properties: parameters, required, additionalProperties: false },
    output: { schema: { type: 'object', additionalProperties: true }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
    async execute(args, exec) {
      try {
        if (exec?.agent !== agent) throw new Error('此工具仅授权给主人绑定的大肥鱼会话')
        const t = authorize(agent, undefined, Boolean(permission))
        await verify(t, permission, exec.signal)
        return await run(args, exec, t)
      } catch (e) { return { ok: false, message: e.message } }
    },
  })
  const profileTools = agent => [
    makeTool(agent, 'qq_set_nickname', '修改机器人自己的 QQ 昵称。仅主人本轮可信指令且修改昵称开关开启时可用。群聊另需开启群聊主人指令开关，并且本轮只有主人发言。', { nickname: { type: 'string', minLength: 1, maxLength: 255 } }, '允许改昵称', async (args, exec, t) => {
      if (typeof args.nickname !== 'string' || !args.nickname.trim() || args.nickname.length > 255) throw new Error('请提供 1～255 字符的 QQ 昵称')
      await verify(t, '允许改昵称', exec.signal)
      await call(t.c, 'set_qq_profile', { nickname: args.nickname }, exec.signal)
      return { ok: true, message: 'QQ 昵称已修改' }
    }),
    makeTool(agent, 'qq_set_signature', '修改机器人自己的 QQ 个性签名。仅主人本轮可信指令且设置开关开启时可用。群聊另需开启群聊主人指令开关，并且本轮只有主人发言。', { signature: { type: 'string', maxLength: 255 } }, '允许改签名', async (args, exec, t) => {
      if (typeof args.signature !== 'string' || args.signature.length > 255) throw new Error('个性签名最多 255 个字符')
      await verify(t, '允许改签名', exec.signal)
      await call(t.c, 'set_self_longnick', { longNick: args.signature }, exec.signal)
      return { ok: true, message: 'QQ 个性签名已修改' }
    }),
    makeTool(agent, 'qq_set_avatar', '修改机器人自己的 QQ 头像。image 填图片直链或本地图片路径。仅主人本轮可信指令且设置开关开启时可用。群聊另需开启群聊主人指令开关，并且本轮只有主人发言。', { image: { type: 'string', maxLength: 4096 } }, '允许改头像', async (args, exec, t) => {
      if (typeof args.image !== 'string' || !args.image.trim() || args.image.length > 4096) throw new Error('请提供有效的头像图片')
      const file = await loadAvatar(args.image, agent.session.id, exec.signal)
      await verify(t, '允许改头像', exec.signal)
      await call(t.c, 'set_qq_avatar', { file }, exec.signal)
      return { ok: true, message: 'QQ 头像已修改' }
    }),
  ]
  const tools = agent => [
    makeTool(agent, 'qq_list_group_chats', '列出已绑定 QQ 群、群名和对应 DSH 会话。readable 为 true 的群可由主人私聊查询历史或主动发文字。先定位群，再调用 qq_read_group_history 或 qq_send_group_message；多个群重名时向主人确认群号。', {}, null,
      async (_args, exec, t) => ({ ok: true, groups: await loadGroups(agent, t, exec.signal) })),
    makeTool(agent, 'qq_read_group_history', '只读查询已授权 QQ 群指定日期的原始聊天记录，默认北京时间今天，支持昨天及 YYYY-MM-DD。群号、绑定称呼或群名均可定位。返回 next_cursor 时可继续翻页。后端不可用时尝试对应 DSH 群会话，并明确覆盖范围。只能由主人可信私聊调用。', {
      group: { type: 'string', description: '群号、绑定称呼或 QQ 群名，重名时先询问主人确认群号' },
      date: { type: 'string', description: '今天、昨天或 YYYY-MM-DD，省略时为今天' },
      cursor: { type: 'string', description: '首次省略，继续读取时原样填写返回的 next_cursor' },
    }, null, async (args, exec, t) => {
      const selected = await selectGroup(agent, t, args.group, exec.signal)
      if (!selected.ok) return selected
      const check = () => {
        const current = authorize(agent)
        if (current.stamp !== t.stamp || !current.c.总开关) throw new Error('主人或连接配置已变化，群记录读取取消')
        const group = groupsFor(agent, current).find(row => row.group === selected.group && row.session === selected.session && row.readable)
        if (!group) throw new Error('群绑定或读取权限已变化，群记录读取取消')
      }
      check()
      const row = t.c.绑定.find(row => row.类型 === '群' && String(row.号码) === selected.group)
      const result = await readGroupHistory({ row, bot: t.bot, date: args.date, cursor: args.cursor,
        call: async (action, body) => { check(); return { status: 'ok', retcode: 0, data: await call(t.c, action, body, exec.signal) } },
        getSession: async sid => { check(); return getSession(sid) }, now: now(),
      })
      await verify(t, null, exec.signal)
      check()
      return result
    }, ['group']),
    makeTool(agent, 'qq_send_group_message', '按主人本轮可信私聊中的明确要求，向一个指定的已授权 QQ 群发送文字。group 填群号、绑定称呼或群名；message 只填准备发到群里的正文。只允许同一机器人下已启用、独占且已核验的绑定群，遵守总开关与试运行。返回 message_id 才表示后端确认成功；uncertain 时须核查 QQ，不能自动重试。同一轮同群同文只发送一次。', {
      group: { type: 'string', description: '群号、绑定称呼或 QQ 群名，重名时先向主人确认群号' },
      message: { type: 'string', minLength: 1, maxLength: 4000, description: '要发送的纯文字正文，保留换行，最多 4000 字符' },
    }, null, async (args, exec, t) => {
      if (typeof args.message !== 'string' || !args.message.trim() || args.message.length > 4000) throw new Error('群消息须为 1～4000 字符的非空文字')
      const problem = responseProblem(args.message)
      if (problem) throw new Error('QQ 输出保护：' + problem)
      const selected = await selectGroup(agent, t, args.group, exec.signal)
      if (!selected.ok) return selected
      const groupId = Number(selected.group)
      if (!/^[1-9]\d*$/.test(selected.group) || !Number.isSafeInteger(groupId)) throw new Error('群号无效或超出安全整数范围')
      await verify(t, null, exec.signal)
      const current = authorize(agent)
      active(current)
      if (!groupsFor(agent, current).some(group => group.group === selected.group && group.session === selected.session && group.readable)) throw new Error('群绑定或权限已变化，发送取消')
      exec.signal?.throwIfAborted()
      // 仅保留当前主人消息的投递记录，先落盘占用，超时和重启也不重复发。
      const stamp = hash([t.stamp, latestUserId(agent.session)]), id = hash([selected.group, args.message])
      const saved = readDeliveries(), items = saved.stamp === stamp ? saved.items : []
      const previous = items.find(item => item.id === id)
      if (previous) return { ...previous.result, duplicate: true }
      const pending = { ok: false, uncertain: true, group: selected.group, message: '群消息正在发送或结果待核查，请在 QQ 确认，勿自动重试' }
      saveDeliveries({ stamp, items: [...items, { id, result: pending }] })
      let result
      try {
        const data = await call(current.c, 'send_group_msg', { group_id: groupId, message: [{ type: 'text', data: { text: args.message } }] }, exec.signal)
        const messageId = data?.message_id
        if (!Number.isSafeInteger(messageId) && !(typeof messageId === 'string' && /^-?\d{1,20}$/.test(messageId))) throw new Error('后端未返回有效消息编号')
        result = { ok: true, group: selected.group, name: selected.qqName || selected.name, message_id: messageId }
      } catch (error) {
        result = { ...pending, message: '群消息发送结果未确认，请在 QQ 核查，勿自动重试。' + error.message }
      }
      try {
        const latest = readDeliveries()
        if (latest.stamp === stamp) saveDeliveries({ stamp, items: latest.items.map(item => item.id === id ? { id, result } : item) })
      } catch (error) { log('群消息投递结果记录失败：' + error.message) }
      return result
    }),
    ...profileTools(agent),
    makeTool(agent, 'qq_pending_requests', '查看待主人处理的好友申请与群聊邀请。必须询问主人，并让主人单独回复“同意申请 编号”或“拒绝申请 编号”。工具不能代替主人授权。', {}, null, async () => view()),
  ]
  const unmount = () => {
    for (const record of mounted.values()) {
      for (const off of record.off) off()
    }
    mounted.clear()
  }
  const tick = () => {
    try {
      const t = target(), wanted = new Map()
      if (!stopped) for (const row of t.c.绑定 || []) {
        const group = row.类型 === '群'
        if (group) {
          if (t.c.允许群聊主人指令 !== true) continue
          const scope = qqScope(home, row.会话, settings())
          if (!scope || scope.blocked || scope.source.botId !== t.bot) continue
        } else if (sessionKey(row.会话) !== sessionKey(t.row.会话)) continue
        const agent = findAgent(row.会话)
        if (agent?.ctx?.tools?.register) wanted.set(agent, { group, stamp: hash([t.stamp, row]) })
      }
      for (const [agent, record] of mounted) {
        if (record.stamp === wanted.get(agent)?.stamp) continue
        for (const off of record.off) off()
        mounted.delete(agent)
      }
      for (const [agent, entry] of wanted) {
        if (mounted.has(agent)) continue
        const record = { stamp: entry.stamp, off: [] }
        mounted.set(agent, record)
        for (const tool of entry.group ? profileTools(agent) : tools(agent)) record.off.push(agent.ctx.tools.register(tool))
      }
    } catch { unmount() }
    if (config().好友申请审批 || config().群邀请审批) void notifyNext()
  }
  return { capture, handleOwnerReply, tick, view, stop() { stopped = true; unmount() } }
}
