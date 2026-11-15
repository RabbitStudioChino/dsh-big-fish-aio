import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { prepareHistoryFile, parseHistory, chunkMessages, readHistoryChunk } from '../lib/history-file.mjs'
import { registerHistoryImport } from '../lib/history-import.mjs'
import { recordSource } from '../lib/memory-sources.mjs'

const row = id => ({ message_id: String(id), time: 1793491200 + id, sender: { user_id: 12345, nickname: '群友' }, message: '消息 ' + id })
const identity = { version: 2, memoryStoreId: 'test', session: 's', type: '私聊', number: '12345', aiQQ: '', dateRange: undefined }

test('流式解析三种 JSON 包装和 TXT，与旧版排序、去重和完整分段一致', async () => {
  const root = mkdtempSync(join(tmpdir(), 'qq-stream-format-'))
  try {
    const rows = [row(3), row(1), row(1), { ...row(2), message: '长消息🐟'.repeat(2500) }]
    const sources = [JSON.stringify(rows), JSON.stringify({ messages: rows }), JSON.stringify({ status: 'ok', data: { messages: rows } }),
      '消息记录\n2026-11-01 08:02:00 群友(12345)\n第二条\n2026-11-01 08:01:00 群友(12345)\n第一条']
    for (const [index, content] of sources.entries()) {
      const filename = index === 3 ? 'qq.txt' : 'qq.json', input = join(root, 'input-' + index)
      writeFileSync(input, '\uFEFF' + content)
      const directory = mkdtempSync(join(root, 'parts-'))
      const result = await prepareHistoryFile(input, filename, directory, identity)
      const expected = parseHistory(content, filename)
      assert.equal(result.id, createHash('sha256').update(JSON.stringify({ ...identity, messages: expected.messages })).digest('hex'))
      assert.equal(result.count, expected.messages.length)
      assert.equal(result.duplicates, expected.duplicates)
      assert.deepEqual(Array.from({ length: result.total }, (_, i) => readHistoryChunk(result.chunksFile, result.offsets, i)), chunkMessages(expected.messages))
    }
    const input = join(root, 'gb18030')
    writeFileSync(input, Buffer.concat([Buffer.from('2026-11-01 08:00:00 QQ(12345)\n'), Buffer.from([0xc4, 0xe3, 0xba, 0xc3])]))
    const result = await prepareHistoryFile(input, 'qq.txt', mkdtempSync(join(root, 'gb-')), identity)
    assert.match(readHistoryChunk(result.chunksFile, result.offsets, 0).text, /你好/)
    assert.throws(() => readHistoryChunk(result.chunksFile, [0, 1000000000], 0), /索引损坏/)
    writeFileSync(input, 'PK\x03\x04\n2026-11-01 08:00:00 QQ(12345)\n伪装文本')
    await assert.rejects(prepareHistoryFile(input, 'renamed.txt', mkdtempSync(join(root, 'binary-')), identity), /二进制备份/)
  } finally { rmSync(root, { recursive: true, force: true }) }
})

async function request(handler, stream, metadata, extra = {}) {
  const req = Readable.from(stream)
  req.method = 'POST'; req.headers = { host: 'localhost', 'content-type': 'application/octet-stream',
    'x-qq-history-meta': encodeURIComponent(JSON.stringify(metadata)), ...extra }
  let result
  await handler(req, { setHeader() {}, end(value) { result = JSON.parse(value) } })
  return result
}

test('上传超过 100 MB、10 万条记录，流式排序并按创建时间倒序列出，当前段可恢复分析', { timeout: 120000 }, async () => {
  const home = mkdtempSync(join(tmpdir(), 'qq-stream-upload-')), routes = new Map(), effects = []
  const binding = { 类型: '私聊', 号码: '12345', 会话: 's' }, config = { 绑定: [binding] }
  const agent = { session: { id: 's', requestHeader: () => ({ config: { provider: 'test', model: 'test' } }) } }
  let modelCalls = 0
  const server = createServer((req, res) => routes.get(new URL(req.url, 'http://localhost').pathname)(req, res))
  const mount = () => registerHistoryImport({ home, route: (path, handler) => routes.set(path, handler), config: () => config,
    findAgent: () => agent, headers: () => ({}), ctx: { effect(fn) { effects.push(fn()) }, llm: { async *stream() {
      modelCalls++; yield { type: 'text-delta', text: JSON.stringify({ summary: '承接摘要', memories: [] }) }
      yield { type: 'finish', reason: { kind: 'stop' } }
    } } } })
  const metadata = { type: '私聊', number: '12345', session: 's', filename: 'large.json' }
  writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify(config))
  recordSource(home, config, '99999', binding, 'fixture', ['12345'])
  const api = async (name, body = {}) => request(routes.get('/dsh-qq-bridge/history/' + name), [JSON.stringify(body)], {}, { 'content-type': 'application/json' })
  try {
    mount()
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    const count = 100002, message = 'm'.repeat(1100)
    let bytes = 0
    async function* input() {
      yield '['
      for (let i = count; i > 0; i--) {
        const text = (i === count ? '' : ',') + JSON.stringify({ ...row(i), message })
        bytes += Buffer.byteLength(text); yield text
      }
      yield ']'
    }
    const upload = await fetch('http://127.0.0.1:' + server.address().port + '/dsh-qq-bridge/history/upload', {
      method: 'POST', headers: { 'content-type': 'application/octet-stream', 'x-qq-history-meta': encodeURIComponent(JSON.stringify(metadata)) },
      body: Readable.from(input()), duplex: 'half',
    })
    const response = await upload.json()
    assert.equal(response.ok, true, response.说)
    assert.ok(bytes > 100 * 1024 * 1024)
    assert.equal(response.job.count, count)
    assert.ok(response.job.total > 10000)
    const id = response.job.id, source = JSON.parse(readFileSync(join(home, 'qq-history-imports', id + '.source.json'), 'utf8'))
    assert.equal(source.messages, undefined)
    assert.ok(statSync(join(home, 'qq-history-imports', id + '.source.json')).size < 1024 * 1024)
    assert.match(readHistoryChunk(join(home, 'qq-history-imports', id + '.chunks.jsonl'), source.offsets, 0).text, /群友\(12345\)/)
    assert.equal(modelCalls, 0, '确认上传不会调用模型')
    const first = await api('analyze', { id })
    mount()
    assert.equal((await api('analyze', { id })).pending.token, first.pending.token)
    assert.equal(modelCalls, 1, '中断后保留已分析但未确认的一段')
    assert.equal((await api('commit', { id, token: first.pending.token, result: { ok: true } })).job.completed, 1)
    const newer = await request(routes.get('/dsh-qq-bridge/history/upload'), [JSON.stringify([row(1)])], { ...metadata, filename: 'newer.json' })
    const jobs = (await api('jobs')).jobs
    assert.equal(jobs[0].id, newer.job.id)
    assert.equal(jobs[1].id, id)
    assert.equal(jobs[1].completed, 1)
    assert.equal(readdirSync(join(home, 'qq-history-imports')).some(name => name.startsWith('.upload-')), false)
    for (const content of ['{"data":{"messages":[', JSON.stringify({ data: { messages: [row(1)] }, status: 'failed', retcode: 1 }),
      JSON.stringify({ data: { messages: [row(1)] }, status: 'ok', retcode: {} }), '{"chatInfo":{},"messages":[]}']) {
      const invalid = await request(routes.get('/dsh-qq-bridge/history/upload'), [content], metadata)
      assert.equal(invalid.ok, false)
      assert.equal((await api('jobs')).jobs.length, 2)
    }
    const interrupted = await request(routes.get('/dsh-qq-bridge/history/upload'), ['[]'], metadata, { 'content-length': '100' })
    assert.match(interrupted.说, /上传中断/)
    const crossSite = await request(routes.get('/dsh-qq-bridge/history/upload'), ['[]'], metadata, { origin: 'https://evil.example' })
    assert.equal(crossSite.ok, false)
    const invalidEncoding = await request(routes.get('/dsh-qq-bridge/history/upload'), [Buffer.from([0xff, 0xfe])], metadata)
    assert.equal(invalidEncoding.ok, false)
    assert.equal(readdirSync(join(home, 'qq-history-imports')).some(name => name.startsWith('.upload-')), false)
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    effects.forEach(fn => fn?.())
    rmSync(home, { recursive: true, force: true })
  }
})
