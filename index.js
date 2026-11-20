import * as memory from './modules/memory/lib/index.js'
import * as qq from './modules/qq/lib/host.js'
import * as mood from './modules/mood/lib/index.js'
import * as speak from './modules/speak/lib/host.js'
import { createSelfUpdate } from './lib/selfupdate.mjs'
import { fileURLToPath } from 'node:url'
import { createOpenPlatform } from './lib/open-platform.mjs'
import { createScheduledMessages } from './lib/scheduled-messages.mjs'

import { registerBigfishAssets } from './lib/bigfish-assets.mjs'

export const name = 'big-fish-aio'
export const inject = [...new Set([...memory.inject, ...qq.inject, ...mood.inject, ...speak.inject])]

export function apply(ctx) {
  registerBigfishAssets(ctx)
  createOpenPlatform(ctx, { schedule: createScheduledMessages(ctx), readFeatures(execution) {
    const sid = execution.sessionId || ''
    const agents = ctx.agents?.list?.() || []
    const session = sid ? agents.find(agent => String(agent.session?.id || agent.id) === sid)?.session || ctx.sessions?.get?.(sid) : undefined
    return [['qq', () => qq.readSkillFeatures(sid)], ['memory', () => memory.readSkillFeatures(sid, session)],
      ['mood', () => mood.readSkillFeatures(sid)], ['speak', () => speak.readSkillFeatures(sid, ctx)]].flatMap(([module, read]) => {
      try { return read() }
      catch { return [{ id: module + '.unavailable', module, title: module + ' 配置状态未知', description: '配置读取失败，请勿推断此模块的开关和参数。',
        mode: 'unknown', enabled: false, effective: false, reason: '无法读取模块配置', parameters: [] }] }
    })
  } })
  ctx.plugin(memory)
  ctx.plugin(qq)
  ctx.plugin(mood)
  ctx.plugin(speak)
  createSelfUpdate({ packageRoot: fileURLToPath(new URL('.', import.meta.url)) })
    .register(ctx, '/dsh-big-fish-aio')
}
