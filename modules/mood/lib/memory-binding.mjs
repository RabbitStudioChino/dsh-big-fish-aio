import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { qqScope } from '../../memory/lib/qq-scope.mjs'

export function memorySlots(home) {
  let bridge, settings
  try { bridge = JSON.parse(readFileSync(join(home, 'qq-bridge-config.json'), 'utf8')) } catch { return [] }
  try { settings = JSON.parse(readFileSync(join(home, 'fish-memory-config.json'), 'utf8').replace(/^\uFEFF/, '')) } catch (error) {
    if (error.code !== 'ENOENT') return []
    settings = {}
  }
  const slots = new Map()
  const rows = Array.isArray(bridge.绑定) ? bridge.绑定 : [
    { 类型: '私聊', 号码: bridge.私聊QQ, 会话: bridge.私聊会话 || bridge.目标会话 },
    { 类型: '群', 号码: bridge.群号, 会话: bridge.群会话 },
  ].filter(row => row.号码 && row.会话)
  for (const row of rows) {
    const scope = qqScope(home, row.会话, settings)
    if (!scope || scope.blocked) continue
    let slot = slots.get(scope.writeId)
    if (!slot) {
      const group = scope.source.type === '群'
      const shared = scope.writeId.endsWith('_shared')
      slot = {
        id: scope.writeId,
        label: shared ? '普通群共享心情' : (group ? '隔离群 · ' : '私聊 · ') + (row.称呼 || row.号码),
        selfName: '',
        ownerName: group ? '群成员' : String(row.称呼 || '对方'),
        工作区: '',
        sessions: [],
        group,
      }
      slots.set(slot.id, slot)
    }
    slot.sessions.push(String(row.会话))
  }
  return [...slots.values()]
}
