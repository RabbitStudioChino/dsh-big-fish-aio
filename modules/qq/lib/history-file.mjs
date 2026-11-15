import { createHash } from 'node:crypto'
import { createReadStream, openSync, closeSync, writeSync, readSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Readable, compose } from 'node:stream'
import { createInterface } from 'node:readline'
import parser from 'stream-json'
import Assembler from 'stream-json/assembler.js'

const CHUNK_CHARS = 6000
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')

function oneBotRow(row) {
  if (!row || typeof row !== 'object' || !(typeof row.message === 'string' || Array.isArray(row.message) || typeof row.raw_message === 'string')) {
    throw new Error('OneBot JSON 消息须包含 message 或 raw_message 字段')
  }
  return row
}

function textHeader(text) {
  if (text.startsWith('PK\x03\x04') || text.startsWith('SQLite header 3')) throw new Error('文件内容是 QQ 二进制备份，不能作为 JSON / TXT 导入；改扩展名不会解密数据库')
}

export function dateOf(value) {
  if (value == null || value === '') return null
  const n = Number(value)
  const t = Number.isFinite(n) ? (n < 1e12 ? n * 1000 : n)
    : Date.parse(String(value).trim().replace(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})[ T](\d{1,2}:\d{2}(?::\d{2})?)$/, (_, y, m, d, time) =>
      `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${time.split(':').map(n => n.padStart(2, '0')).concat(time.split(':').length === 2 ? ['00'] : []).join(':')}+08:00`))
  if (!Number.isFinite(t) || !Number.isFinite(new Date(t).getTime())) throw new Error('无法识别消息时间：' + value)
  return new Date(t).toISOString()
}

function segmentText(value, depth = 0) {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) throw new Error('无法识别 OneBot 消息正文')
  if (depth > 20) throw new Error('消息嵌套超过 20 层，请先展开记录')
  return value.map(s => {
    const d = s.data || {}
    if (s.type === 'text') return String(d.text ?? s.text ?? '')
    if (s.type === 'node') return `\n[转发 ${d.nickname || d.user_id || '未知'}] ${segmentText(d.content || [], depth + 1)}`
    if (s.type === 'at') return '@' + (d.name || d.qq || d.uid || '未知')
    if (s.type === 'reply') return `[引用 ${d.id || d.message_id || ''}]`
    if (s.type === 'json' || s.type === 'xml') return `[${s.type}] ${typeof d.data === 'string' ? d.data : JSON.stringify(d)}`
    return `[${s.type || '未知附件'}${d.name || d.file || d.id ? ' ' + (d.name || d.file || d.id) : ''}]`
  }).join('')
}

export function normalizeMessages(rows) {
  if (!Array.isArray(rows) || !rows.length) throw new Error('没有可导入的消息')
  const seen = new Set()
  const messages = []
  let duplicates = 0
  for (const [i, r] of rows.entries()) {
    if (!r || typeof r !== 'object') throw new Error(`第 ${i + 1} 条不是消息对象`)
    const sender = r.sender || {}
    const senderId = String(sender.user_id ?? sender.uin ?? sender.uid ?? r.user_id ?? '')
    const name = String(sender.card || sender.groupCard || sender.name || sender.nickname || r.senderName || senderId || '未知发言人')
    let text
    if (r.content && !Array.isArray(r.content) && typeof r.content === 'object') {
      text = r.content.elements?.length ? segmentText(r.content.elements) : String(r.content.text || '')
      if (!text && r.content.resources?.length) text = r.content.resources.map(x => `[${x.type} ${x.filename || ''}]`).join('')
    } else text = segmentText(r.message ?? r.content ?? r.raw_message ?? r.text)
    if (!text.trim()) text = '[空消息]'
    const m = { id: String(r.message_id ?? r.id ?? ''), at: dateOf(r.timestamp || r.time || r.msgTime), senderId, name, text }
    // 同一时刻的无 ID 同文消息也可能是真实连发，只去掉有可靠 ID 的重复。
    const key = m.id && m.id !== '0' ? hash(m) : null
    if (key && seen.has(key)) { duplicates++; continue }
    if (key) seen.add(key)
    messages.push(m)
  }
  messages.sort((a, b) => String(a.at || '').localeCompare(String(b.at || '')))
  return { messages, duplicates }
}

export function parseHistory(content, filename = '') {
  if (/\.bak$/i.test(filename)) throw new Error('QQ .bak 是加密数据库备份，暂不能直接导入；需要原导出账号的数据库解密密钥，其他 QQ 账号的后端不能替代。请使用 OneBot JSON、QQ 官方 TXT，或读取原账号后端记录')
  if (!/\.(txt|json)$/i.test(filename)) throw new Error('文件导入仅支持 OneBot JSON 或 QQ 官方 TXT')
  if (typeof content !== 'string') throw new Error('文件内容为空或未解码')
  // 旧版接口保留同步解析；文件上传使用下面的流式处理。
  const text = content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  textHeader(text)
  if (/\.json$/i.test(filename)) {
    let json
    try { json = JSON.parse(text) } catch { throw new Error('JSON 格式错误；请保存完整的 OneBot 历史接口响应或消息数组') }
    if (json?.chatInfo) throw new Error('不支持 QCE JSON，请使用 OneBot JSON 或 QQ 官方 TXT')
    if (json && typeof json === 'object' && !Array.isArray(json) && ('status' in json || 'retcode' in json)
      && (json.status !== 'ok' || Number(json.retcode || 0) !== 0)) throw new Error('OneBot 响应失败，请先确认历史接口调用成功')
    const rows = Array.isArray(json) ? json : (json?.messages ?? json?.data?.messages)
    if (!Array.isArray(rows) || !rows.length) throw new Error('OneBot JSON 没有可导入的 messages 数组')
    rows.forEach(oneBotRow)
    return { ...normalizeMessages(rows), format: 'OneBot JSON', chatInfo: null }
  }
  if (/^\s*[[{]/.test(text)) throw new Error('JSON 内容请使用 .json 扩展名导入')
  // QQ 原生 TXT：日期 时间 昵称(QQ)，后面可以有多行正文。
  const rows = []
  let current = null
  for (const line of text.split('\n')) {
    const m = line.match(/^(\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/)
    if (m) {
      const who = m[2].match(/^(.*?)\s*[（(<]([^（）()<>]+)[）)>]$/)
      current = { time: m[1], sender: { name: who ? who[1] : m[2], uin: who ? who[2] : '' }, message: '' }
      rows.push(current)
    } else if (current) current.message += (current.message ? '\n' : '') + line
  }
  if (!rows.length) throw new Error('未找到 QQ TXT 消息头（例如 2026-11-01 12:30:00 昵称(12345)）；请使用 QQ 官方导出的 TXT')
  return { ...normalizeMessages(rows), format: 'QQ TXT', chatInfo: null }
}

export function chunkMessages(messages, limit = CHUNK_CHARS) {
  const chunks = []
  let text = '', start = null, end = null
  const flush = () => { if (text) chunks.push({ text, start, end }); text = ''; start = null; end = null }
  for (const m of messages) {
    const header = `[${m.at || '时间未知'}] ${m.name}(${m.senderId || '未知'})：\n`
    // 超长的单条也完整切开，每段重带发言人，绝不 slice 后丢掉尾部。
    const size = limit - header.length - 32
    if (size < 2) throw new Error('发言人名称过长')
    let offset = 0
    while (offset < m.text.length) {
      let cut = Math.min(offset + size, m.text.length)
      if (cut < m.text.length && /[\uD800-\uDBFF]/.test(m.text[cut - 1])) cut--
      const part = header + (offset ? '[接上一段]\n' : '') + m.text.slice(offset, cut) + '\n'
      if (text.length + part.length > limit) flush()
      if (!text) start = m.at
      text += part; end = m.at; offset = cut
    }
  }
  flush()
  return chunks
}

async function* decodedFile(file, encoding, signal) {
  const decoder = new TextDecoder(encoding, { fatal: true })
  for await (const bytes of createReadStream(file, { signal })) yield decoder.decode(bytes, { stream: true })
  yield decoder.decode()
}

async function* jsonRows(file, signal) {
  const tokens = compose(Readable.from(decodedFile(file, 'utf-8', signal)), parser({ streamValues: false, maxDepth: 128 }))
  let depth = 0, rootObject = false, rootKey = '', dataKey = '', dataObject = false
  let arrayDepth = 0, found = false, assembler = null, count = 0
  const metadata = {}
  try {
    for await (const token of tokens) {
      signal?.throwIfAborted()
      const { name, value } = token
      const start = name === 'startObject' || name === 'startArray'
      const end = name === 'endObject' || name === 'endArray'
      if (!depth && name === 'startObject') rootObject = true
      if (rootObject && depth === 1 && name === 'keyValue') {
        rootKey = value
        if (rootKey === 'chatInfo') throw new Error('不支持 QCE JSON，请使用 OneBot JSON 或 QQ 官方 TXT')
      }
      if (rootObject && depth === 1 && name.endsWith('Value') && name !== 'keyValue') metadata[rootKey] = value
      if (rootObject && depth === 1 && start && ['status', 'retcode'].includes(rootKey)) throw new Error('OneBot 响应状态格式错误')
      if (rootObject && depth === 1 && rootKey === 'data' && name === 'startObject') dataObject = true
      if (dataObject && depth === 2 && name === 'keyValue') dataKey = value
      if (name === 'startArray' && (!depth || rootObject && depth === 1 && rootKey === 'messages' || dataObject && depth === 2 && dataKey === 'messages')) {
        if (found) throw new Error('OneBot JSON 只能包含一个消息数组')
        arrayDepth = depth + 1; found = true
      } else if (arrayDepth && depth === arrayDepth && name === 'endArray') arrayDepth = 0
      else if (arrayDepth) {
        if (!assembler) {
          if (name !== 'startObject') throw new Error('OneBot JSON 消息须为对象')
          assembler = new Assembler()
        }
        assembler.consume(token)
        if (assembler.done) { count++; yield oneBotRow(assembler.current); assembler = null }
      }
      if (dataObject && depth === 2 && name === 'endObject') dataObject = false
      if (start) depth++
      if (end) depth--
    }
    if (('status' in metadata || 'retcode' in metadata) && (metadata.status !== 'ok' || Number(metadata.retcode || 0) !== 0)) throw new Error('OneBot 响应失败，请先确认历史接口调用成功')
    if (!found || !count) throw new Error('OneBot JSON 没有可导入的 messages 数组')
  } finally { tokens.destroy() }
}

async function* txtRows(file, signal) {
  let encoding = 'utf-8'
  try { for await (const _text of decodedFile(file, encoding, signal)) { /* 先核验编码，避免文件尾部的旧编码损坏前面的记录。 */ } }
  catch (error) { if (error.code !== 'ERR_ENCODING_INVALID_ENCODED_DATA') throw error; encoding = 'gb18030' }
  const input = Readable.from(decodedFile(file, encoding, signal))
  const lines = createInterface({ input, crlfDelay: Infinity })
  let current = null
  try {
    for await (const line of lines) {
      signal?.throwIfAborted()
      const match = line.match(/^(\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/)
      if (match) {
        if (current) yield current
        const who = match[2].match(/^(.*?)\s*[（(<]([^（）()<>]+)[）)>]$/)
        current = { time: match[1], sender: { name: who ? who[1] : match[2], uin: who ? who[2] : '' }, message: '' }
      } else if (current) current.message += (current.message ? '\n' : '') + line
    }
    if (!current) throw new Error('未找到 QQ TXT 消息头；请使用 QQ 官方导出的 TXT')
    yield current
  } finally { lines.close(); input.destroy() }
}

async function* runRows(file, signal) {
  const input = createReadStream(file, { encoding: 'utf8', signal })
  const lines = createInterface({ input, crlfDelay: Infinity })
  try { for await (const line of lines) yield JSON.parse(line) }
  finally { lines.close(); input.destroy() }
}

// 分批排序，内存只保留一批记录和各批的下一条，保持旧版按时间排序的行为。
async function* sortedRows(files, signal) {
  const readers = files.map(file => runRows(file, signal))
  const next = await Promise.all(readers.map(reader => reader.next()))
  try {
    while (true) {
      let index = -1
      for (let i = 0; i < next.length; i++) {
        if (!next[i].done && (index < 0 || String(next[i].value.at || '') < String(next[index].value.at || ''))) index = i
      }
      if (index < 0) return
      yield next[index].value
      next[index] = await readers[index].next()
    }
  } finally { await Promise.all(readers.map(reader => reader.return())) }
}

export async function prepareHistoryFile(file, filename, staging, identity, signal) {
  if (!/\.(json|txt)$/i.test(filename)) throw new Error('文件导入仅支持 OneBot JSON 或 QQ 官方 TXT')
  const input = openSync(file, 'r'), prefix = Buffer.alloc(32)
  try { readSync(input, prefix, 0, prefix.length, 0) } finally { closeSync(input) }
  textHeader(prefix.toString('utf8').replace(/^\uFEFF/, ''))
  const rows = /\.json$/i.test(filename) ? jsonRows(file, signal) : txtRows(file, signal)
  const runs = []
  let batch = [], bytes = 0
  const flush = () => {
    if (!batch.length) return
    batch.sort((a, b) => String(a.at || '').localeCompare(String(b.at || '')))
    const path = join(staging, 'run-' + runs.length)
    writeFileSync(path, batch.map(row => JSON.stringify(row) + '\n').join(''), { mode: 0o600 })
    runs.push(path); batch = []; bytes = 0
  }
  for await (const row of rows) {
    const message = normalizeMessages([row]).messages[0]
    bytes += Buffer.byteLength(JSON.stringify(message)); batch.push(message)
    if (bytes >= 8 * 1024 * 1024 || batch.length >= 10000) flush()
  }
  flush()
  const chunksFile = join(staging, 'chunks.jsonl'), fd = openSync(chunksFile, 'wx', 0o600)
  const offsets = [0], digest = createHash('sha256')
  digest.update(JSON.stringify(identity).slice(0, -1) + ',"messages":[')
  let count = 0, duplicates = 0, start = null, end = null, preview = '', lastTime = null
  const seen = new Set()
  let chunk = { text: '', start: null, end: null }
  const writeChunk = () => {
    if (!chunk.text) return
    const buffer = Buffer.from(JSON.stringify(chunk) + '\n')
    let written = 0
    while (written < buffer.length) written += writeSync(fd, buffer, written, buffer.length - written)
    offsets.push(offsets.at(-1) + buffer.length)
    if (!preview) preview = chunk.text.slice(0, 1000)
    chunk = { text: '', start: null, end: null }
  }
  try {
    for await (const message of sortedRows(runs, signal)) {
      signal?.throwIfAborted()
      if (message.at !== lastTime) { seen.clear(); lastTime = message.at }
      const key = message.id && message.id !== '0' ? hash(message) : null
      if (key && seen.has(key)) { duplicates++; continue }
      if (key) seen.add(key)
      if (!count) start = message.at
      end = message.at
      digest.update((count++ ? ',' : '') + JSON.stringify(message))
      for (const part of chunkMessages([message])) {
        if (chunk.text.length + part.text.length > CHUNK_CHARS) writeChunk()
        if (!chunk.text) chunk.start = part.start
        chunk.text += part.text; chunk.end = part.end
      }
    }
    writeChunk(); digest.update(']}')
  } finally { closeSync(fd) }
  return { id: digest.digest('hex'), count, duplicates, start, end, preview, offsets, chunksFile, total: offsets.length - 1,
    format: /\.json$/i.test(filename) ? 'OneBot JSON' : 'QQ TXT' }
}

export function readHistoryChunk(file, offsets, index) {
  const start = offsets[index], end = offsets[index + 1]
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start || end - start > 128 * 1024) throw new Error('导入分段索引损坏')
  const fd = openSync(file, 'r'), buffer = Buffer.alloc(end - start)
  try {
    let size = 0
    while (size < buffer.length) {
      const read = readSync(fd, buffer, size, buffer.length - size, start + size)
      if (!read) throw new Error('导入分段文件不完整')
      size += read
    }
    return JSON.parse(buffer.toString('utf8'))
  } finally { closeSync(fd) }
}

