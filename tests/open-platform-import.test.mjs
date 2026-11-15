import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseHttpApiImport } from '../lib/open-platform-import.mjs'

const schema = { type: 'object', properties: {}, required: [], additionalProperties: false }
const definition = () => ({ schemaVersion: 1, id: 'memo', title: '备忘录', description: '本机备忘录', version: '1.0.0', operations: ['read', 'create'].map(id => ({ id, title: id, description: id, readOnly: id === 'read', url: '{{DSH_ORIGIN}}/memo/' + id, headers: { Authorization: 'Bearer {{API_TOKEN}}' }, inputSchema: schema, outputSchema: schema, example: {} })) })

test('同一清单的全部接口统一替换地址和 Token，原文件保持占位符', () => {
  const text = JSON.stringify(definition())
  const pending = parseHttpApiImport(text)
  assert.equal(pending.needsOrigin, true); assert.equal(pending.needsToken, true)
  assert.equal(pending.definition.operations[0].url, '{{DSH_ORIGIN}}/memo/read')
  const { definition: imported } = parseHttpApiImport('\uFEFF' + text, { origin: 'http://127.0.0.1:55202/', token: ' synthetic-token ' })
  assert.deepEqual(imported.operations.map(item => item.url), ['http://127.0.0.1:55202/memo/read', 'http://127.0.0.1:55202/memo/create'])
  assert.ok(imported.operations.every(item => item.headers.Authorization === 'Bearer synthetic-token'))
  assert.ok(text.includes('{{API_TOKEN}}'))
  const complete = definition()
  complete.operations.forEach(item => { item.url = 'https://example.test/' + item.id; delete item.headers })
  const ready = parseHttpApiImport(JSON.stringify(complete))
  assert.equal(ready.needsOrigin, false); assert.equal(ready.needsToken, false)
  assert.deepEqual(ready.definition.operations[0].headers, {})
})

test('拒绝错误文件、未知字段、重复 ID、错误 Schema/示例、危险 URL 和请求头', () => {
  for (const text of ['{', 'null', '[]', '{}', JSON.stringify({ openapi: '3.1.0' }), '字'.repeat(22000)]) assert.throws(() => parseHttpApiImport(text))
  const invalid = [
    value => { value.operations[1].id = 'read' },
    value => { value.operations[0].handler = 'javascript' },
    value => { value.operations[0].url = 'javascript:alert(1)' },
    value => { value.operations[0].url = '{{UNKNOWN}}/read' },
    value => { value.operations[0].headers.Host = 'evil.test' },
    value => { value.operations[0].headers.Authorization = 'Bearer {{UNKNOWN}}' },
    value => { value.operations[0].inputSchema = { ...schema, format: 'invalid' } },
    value => { value.operations[0].example = { extra: true } },
    value => { value.operations[0].readOnly = 'true' },
  ]
  for (const mutate of invalid) { const value = definition(); mutate(value); assert.throws(() => parseHttpApiImport(JSON.stringify(value))) }
  assert.throws(() => parseHttpApiImport(JSON.stringify(definition()), { origin: 'https://user:secret@example.test/' }), /DSH 地址/)
})

test('开发 prompt 要求可导入的真实 JSON 文件、三步指导和原生免填写接入', () => {
  const prompt = readFileSync(new URL('../docs/open-platform-plugin-prompt.md', import.meta.url), 'utf8')
  for (const text of ['big-fish-api.json', '30 行以内', 'ctx.inject', 'platformCtx.effect', '无需填写地址或 Token', '一个插件只创建一个提供方']) assert.ok(prompt.includes(text))
  for (const text of ['隔离开关只由开放平台卡片管理', 'execution.isolation.sessionId', "typeof execution.isOwner !== 'boolean'", '查询返回记录原有标记', 'signal.throwIfAborted()', 'isolation.assertCurrent()', 'OpenAPI 3.1 由平台根据同一清单自动生成']) assert.ok(prompt.includes(text))
  assert.equal(prompt.includes('connect({providerId'), false)
  const example = JSON.parse(prompt.match(/```json\n([\s\S]*?)\n```/)[1])
  assert.deepEqual(example, { schemaVersion: 1, transport: 'dsh', id: 'my_plugin' })
  assert.equal(parseHttpApiImport(JSON.stringify(example)).needsToken, false)
})

test('原生引用不需要地址或 Token，拒绝未支持字段和可执行清单', () => {
  const reference = { schemaVersion: 1, transport: 'dsh', id: 'big_fish_memo' }
  assert.deepEqual(parseHttpApiImport(JSON.stringify(reference)), { definition: reference, needsOrigin: false, needsToken: false })
  for (const patch of [{ transport: 'http' }, { id: '../memo' }, { schemaVersion: 2 }, { headers: {} }, { operations: [] }, { handler: 'code' }]) {
    assert.throws(() => parseHttpApiImport(JSON.stringify({ ...reference, ...patch })))
  }
})
