import { appendFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// https://help.aliyun.com/zh/model-studio/text-embedding-synchronous-api
// 官方在线价格，元/百万输入 Token。免费额度和账号折扣以百炼账单为准。
export function embeddingRate(config) {
  const host = new URL(config.endpoint).hostname
  if (!['text-embedding-v3', 'text-embedding-v4'].includes(config.model)) return null
  if (host === 'dashscope.aliyuncs.com') return 0.5
  if (host === 'dashscope-intl.aliyuncs.com') return 0.514
  return null
}

export function recordEmbeddingUsage(home, event) {
  appendFileSync(join(home, 'fish-memory-embedding-usage.jsonl'), '\n' + JSON.stringify(event) + '\n', { mode: 0o600 })
}

export function readEmbeddingUsage(home, workspace) {
  let text
  try { text = readFileSync(join(home, 'fish-memory-embedding-usage.jsonl'), 'utf8') }
  catch (error) { if (error.code === 'ENOENT') return []; throw error }
  const requests = new Map()
  for (const line of text.split('\n')) {
    if (!line) continue
    let event
    try { event = JSON.parse(line) } catch { continue }
    if (event.phase === 'start' && event.workspace === workspace) requests.set(event.id, { ...event, status: 'pending' })
    if (event.phase === 'finish' && requests.has(event.id)) Object.assign(requests.get(event.id), event)
  }
  return [...requests.values()]
}

export function ragUsage(event) {
  const known = Number.isSafeInteger(event.tokens) && event.tokens >= 0
  const priced = typeof event.rate === 'number' && Number.isFinite(event.rate) && event.rate >= 0
  const tokens = known ? event.tokens : 0
  return {
    ragCalls: 1, ragDocumentCalls: event.type === 'document' ? 1 : 0, ragQueryCalls: event.type === 'query' ? 1 : 0,
    ragFailed: event.status === 'failed' ? 1 : 0, ragPending: event.status === 'pending' ? 1 : 0,
    ragTokens: tokens, ragUnknownTokens: known ? 0 : 1, ragUnpriced: known && !priced ? 1 : 0,
    ragCost: known && priced ? tokens * event.rate / 1000000 : 0,
  }
}

export const emptyRagUsage = () => ({ ragCalls: 0, ragDocumentCalls: 0, ragQueryCalls: 0, ragFailed: 0, ragPending: 0,
  ragTokens: 0, ragUnknownTokens: 0, ragUnpriced: 0, ragCost: 0 })
