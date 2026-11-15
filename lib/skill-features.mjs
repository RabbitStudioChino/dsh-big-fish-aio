// 仅按下列字段生成配置快照，凭据、路径、人设正文和其他会话列表不进入模型结果。
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateThresholds } from './rice-thresholds.mjs'

export function describeFeatures(module, config, definitions, active, reason = '') {
  return definitions.map(([id, title, description, gate, fields, mode = 'automatic']) => {
    if (gate !== true && !['boolean', 'number'].includes(typeof config[gate])) throw Error('功能开关缺失或无效')
    const switches = fields.split(' ').map(key => config[key]).filter(value => typeof value === 'boolean')
    const enabled = gate === true ? !switches.length || switches.some(Boolean) : (typeof config[gate] === 'number' ? config[gate] > 0 : config[gate] === true)
    return {
      id: module + '.' + id, module, title, description, mode, enabled,
      effective: mode !== 'panel' && enabled && active,
      reason: mode === 'panel' ? '面板操作功能' : !enabled ? '功能配置已关闭' : !active ? reason : '',
      parameters: fields.split(' ').filter(Boolean).map(key => {
        const value = config[key]
        if (!['boolean', 'number', 'string'].includes(typeof value) || (typeof value === 'number' && !Number.isFinite(value))) throw Error('功能参数缺失或无效')
        return { key, type: typeof value, value: JSON.stringify(value) }
      }),
    }
  })
}

export const QQ_FEATURES = [
  ['bridge', 'QQ 双向互通', '连接 QQ 私聊和群聊与绑定的 DSH 会话。', '总开关', '总开关 试运行 当前会话绑定 当前会话开启 转私聊 转群 轮询间隔毫秒'],
  ['merge', '连续消息合并接收', '同一发言人的连续消息攒成一批接收，每次新消息重置等待窗口，达到最长等待或单批条数上限时提交。窗口单位秒，0 为关闭。回答能否合并几条消息一起接收时读取这些实际参数。', '合并窗口秒', '合并窗口秒 合并最多秒 合并最多条 回复冷却秒 每分钟最多条'],
  ['group_receive', '群消息监听与点名接听', '当前群的只听点名覆盖全局监听；支持点名后继续接听。', true, '群里听所有人 当前会话只听点名 点名后接听条 点名后接听秒 点名必回 回复概率'],
  ['gate', '当前会话回复门槛与沙箱', '按当前绑定的会话设置门槛和沙箱权限。', true, '当前会话门槛 当前会话沙箱 门槛真停轮'],
  ['send', '回复发送策略', '控制 QQ 唤醒、自动触发、QQ 标记、来源标识与回复尾巴。', true, '只发标记内 只回QQ唤醒 自动触发也发 来源头 私聊署名 唤醒尾巴秒 能艾特全体'],
  ['split', '长回复拆段与按句发送', '可按空行拆段或按句拆分，间隔单位毫秒。', true, '长回复拆段 按句拆 拆段间隔毫秒'],
  ['images', '图片收发', '接收 QQ 图片并发送模型回复中的图片。', true, '收图 发图 收图最多 图上限MB'],
  ['files', '文件收发', '接收 QQ 文件和发送回复文件，受大小与私聊限制。', true, '收文件 发文件 收文件最多 收文件上限MB 文件上限MB 文件仅私聊'],
  ['archive', '图片与文件存储', '按设置归档接收的图片与文件。', true, '图片存储 文件存储'],
  ['asr', 'QQ 语音转写', '将收到的 QQ 语音转为文字，超时单位秒，依赖已配置的转写工具。', '语音转写', '语音转写 转写超时秒 转写命令已配置'],
  ['notices', 'QQ 通知接收', '接收戳一戳等上报事件，需要 QQ 后端配置上报。', '收通知', '收通知'],
  ['persona', '角色与身份设定', '角色设定与特殊身份设定开关，正文不在技能库中返回。', true, '人设开 特殊设定开 当前会话独立人设'],
  ['replay', '离线消息补投', '在补投时间窗口内处理会话关闭期间的消息，单位分钟。', '补投窗口分', '补投窗口分'],
  ['account', 'QQ 账号与审批操作', '账号资料修改、好友与群邀请审批还需通过可信主人身份及各操作权限校验。', true, '允许群聊主人指令 允许改昵称 允许改签名 允许改头像 好友申请审批 群邀请审批'],
  ['space', 'QQ 空间操作', '空间发布、浏览、定时发布、巡检、点赞与评论，包含安全投影的定时设置。', true, '允许发空间动态 空间浏览开 空间看圈开 空间看圈分 空间点赞开 空间评论开 已开启空间定时数量 空间定时表'],
  ['history', 'QQ 历史消息导入', '面板可导入历史聊天记录并维护进度，不等于 QQ 对话可直接执行导入。', true, '', 'panel'],
  ['file_manager', '文件与素材管理', '面板提供文件浏览、上传、下载及删除，遵守工作区和目录访问限制。', true, '', 'panel'],
]
export const STICKER_FEATURES = [
  ['send', '表情包语境发送', '按聊天语境选择共享素材发送，冷却单位秒。', 'autoSend', 'autoSend cooldownSeconds'],
  ['collect', '表情包自动收藏', '收藏实时接收的表情，群聊收藏受独立开关控制。', 'autoCollect', 'autoCollect collectGroupStickers collectAllImages'],
  ['classify', '表情包自动分类与标注', '素材可自动分类、生成标签，也支持面板手动导入编辑。', true, 'autoTag autoClassify'],
]
export const MEMORY_FEATURES = [
  ['memory', '长期记忆读写', '全局与当前会话开关共同控制记忆功能。', '全局开关', '全局开关 当前会话启用 模式'],
  ['recall', '关键词与长期事实召回', '实际当前记忆库的召回参数，包含条数、字数、证据门槛、问句信息量和配额。', true, 'threshold maxItems maxChars dailyQuota rarityK queryGate factsMax unknownActivation'],
  ['decay', '记忆衰减与排序', '半衰期单位天，权重控制记忆排序。', true, 'baseHalfLifeDays emotionHalfLifeDays baselineWeight activationWeight importanceWeight emotionWeight'],
  ['expand', '自动扩词', '自动补充记忆线索词的开关。', 'autoExpand', 'autoExpand'],
  ['isolation', '记忆来源隔离', 'QQ 来源分库状态，隔离群只返回数量与当前会话是否独立。', 'QQ来源分库', 'QQ来源分库 当前为独立群库 当前为私聊独立库 隔离群数量'],
  ['semantic', 'Qwen 语义召回', '向量召回开关与参数，超时单位毫秒，运行还需要有效凭据和索引。', 'embeddingEnabled', 'embeddingEnabled dimensions minSimilarity topK timeoutMs'],
  ['management', '记忆库管理与清理', '面板支持检索、编辑、导入导出和清理。', true, '', 'panel'],
]
export const MOOD_FEATURES = [
  ['judge', '自动心情判断', '按当前会话归属实例判断心情变化。', 'autoJudge', 'autoJudge 当前会话绑定 模式 moodBase moodFloor'],
  ['inject', '心情上下文注入', 'off 关闭，label 为标签，event 为事件式注入。', '注入开启', 'injectMode injectConfidence injectPerDay sigMood sigDim'],
  ['decay', '心情回归与衰减', '半衰期单位小时。', true, 'decayHalfHours'],
  ['charm', '桌面挂饰与悬浮卡片', '面板支持挂饰换图、缩放、拖动，以及心情、开销和记忆卡片。显示与透明度偏好保存在浏览器，本接口无法读取当前窗口的本地值。', true, '', 'panel'],
]

export function readRiceFeatures(home, { trial, ownerConfigured, workspaceConfigured } = {}) {
  let settings
  try { settings = validateThresholds(JSON.parse(readFileSync(join(home, 'big-fish-rice-thresholds.json'), 'utf8'))) }
  catch (error) { if (error.code !== 'ENOENT') throw error; settings = { dailyLimit: 0, lowBalance: 0 } }
  const features = describeFeatures('rice', settings, [
    ['usage', 'Token 用量与估算费用统计', '面板可查看今日、累计、按会话的用量与费用，模型查询需授权吃大米饭接口。', true, '', 'panel'],
    ['daily_limit', '每日鱼粮上限与自动停机', '人民币估算金额上限，0 关闭，达到上限时自动关闭 QQ 总开关。', 'dailyLimit', 'dailyLimit'],
    ['low_balance', '低余额提醒', '人民币余额提醒阈值，0 关闭，通知依赖有效的主人 QQ 与 QQ 后端。', 'lowBalance', 'lowBalance'],
  ], true)
  const limit = features.find(feature => feature.id === 'rice.daily_limit')
  limit.effective = limit.enabled && Boolean(workspaceConfigured)
  if (limit.enabled && !workspaceConfigured) limit.reason = '未绑定工作区'
  const balance = features.find(feature => feature.id === 'rice.low_balance')
  balance.effective = balance.enabled && !trial && Boolean(ownerConfigured)
  if (balance.enabled && !balance.effective) balance.reason = trial ? 'QQ 试运行已开启' : '尚未配置有效主人 QQ'
  return features
}
export const SPEAK_FEATURES = [
  ['schedule', '主动搭话', '按间隔与命中线尝试主动发言，受总开关、试运行、目标会话、工作区、安静时段和冷却限制。', '总开关', '总开关 试运行 当前会话选中 间隔分钟 搭话冷却分钟'],
  ['quiet', '安静时段', '小时制，起止相同表示关闭，支持跨午夜。峰谷时区为空时跟随主机时区，生效时区给出当前解析结果。', '安静开启', '安静起 安静止 峰谷时区 生效时区'],
  ['timing', '峰谷命中线与时机因子', '配置值为命中线而非保证触发概率，阈值单位分钟。', true, '峰时命中线 谷时命中线 近阈值分钟 近因子 远阈值分钟 远因子 没中加成 加成上限'],
]
