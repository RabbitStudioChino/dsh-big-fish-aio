import { httpManifest } from './open-platform-http.mjs'
import { checkSchema, validateValue } from './open-platform-schema.mjs'

export function nativeApiReference(value) {
  if (!value || Array.isArray(value) || value.schemaVersion !== 1 || value.transport !== 'dsh' || typeof value.id !== 'string' || !/^[a-z][a-z0-9_]{0,23}$/.test(value.id)) throw Error('原生接入文件须包含 schemaVersion=1、transport=dsh 和有效的提供方 ID')
  for (const key of Object.keys(value)) if (!['schemaVersion', 'transport', 'id'].includes(key)) throw Error('原生接入文件包含不支持的字段 ' + key)
  return value
}

// 文件只携带原生提供方引用或 HTTP 清单，禁止导入可执行代码。
export function parseHttpApiImport(text, { origin = '', token = '' } = {}) {
  if (new TextEncoder().encode(text).length > 65536) throw Error('接入文件不能超过 64 KB')
  let definition
  try { definition = JSON.parse(text.replace(/^\uFEFF/, '')) } catch { throw Error('请选择有效的 JSON 接入文件') }
  if (definition?.transport !== undefined) return { definition: nativeApiReference(definition), needsOrigin: false, needsToken: false }
  const rootKeys = ['schemaVersion', 'id', 'title', 'description', 'version', 'operations']
  const operationKeys = ['id', 'title', 'description', 'readOnly', 'url', 'headers', 'inputSchema', 'outputSchema', 'example']
  const idPattern = /^[a-z][a-z0-9_]{0,23}$/
  if (!definition || Array.isArray(definition) || definition.schemaVersion !== 1 || !Array.isArray(definition.operations) || !definition.operations.length) throw Error('请选择 big-fish-api.json 接入清单，文件须包含 schemaVersion=1 和 operations')
  for (const key of Object.keys(definition)) if (!rootKeys.includes(key)) throw Error('接入文件包含不支持的字段 ' + key)
  for (const key of ['id', 'title', 'description', 'version']) if (typeof definition[key] !== 'string' || !definition[key].trim()) throw Error('接入文件缺少提供方字段 ' + key)
  if (!idPattern.test(definition.id)) throw Error('提供方 ID 格式错误')
  let needsOrigin = false, needsToken = false
  const ids = new Set()
  const operations = definition.operations.map((operation, index) => {
    try {
      if (!operation || typeof operation !== 'object' || Array.isArray(operation)) throw Error('接口必须是对象')
      for (const key of Object.keys(operation)) if (!operationKeys.includes(key)) throw Error('不支持的接口字段 ' + key)
      for (const key of ['id', 'title', 'description', 'url']) if (typeof operation[key] !== 'string' || !operation[key].trim()) throw Error('缺少字段 ' + key)
      if (!idPattern.test(operation.id) || ids.has(operation.id)) throw Error('接口 ID 无效或重复')
      ids.add(operation.id)
      if (typeof operation.readOnly !== 'boolean') throw Error('readOnly 必须是布尔值')
      checkSchema(operation.inputSchema); checkSchema(operation.outputSchema)
      if (operation.inputSchema.type !== 'object') throw Error('请求 Schema 根类型必须为 object')
      validateValue(operation.inputSchema, operation.example ?? {}, 'example')
      let url = operation.url
      if (url.startsWith('{{DSH_ORIGIN}}/')) {
        needsOrigin = true
        const base = new URL(origin || 'https://placeholder.invalid')
        if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) throw Error('DSH 地址只填写协议、主机与端口')
        url = base.origin + url.slice('{{DSH_ORIGIN}}'.length)
      }
      if (/\{\{|\}\}/.test(url)) throw Error('地址仅支持 {{DSH_ORIGIN}} 占位符')
      const supplied = operation.headers ?? {}
      if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied)) throw Error('headers 必须是对象')
      const headers = Object.fromEntries(Object.entries(supplied).map(([key, value]) => {
        if (typeof value !== 'string') throw Error('请求头值必须是字符串')
        if (value.includes('{{API_TOKEN}}')) needsToken = true
        const content = value.replaceAll('{{API_TOKEN}}', token.trim() || 'IMPORT_TOKEN')
        if (/\{\{|\}\}/.test(content)) throw Error('请求头仅支持 {{API_TOKEN}} 占位符')
        return [key, content]
      }))
      return { ...operation, url, headers, example: operation.example ?? {} }
    } catch (error) { throw Error('接口 ' + (index + 1) + ' · ' + error.message) }
  })
  const resolved = { ...definition, operations }
  httpManifest(resolved)
  const missingOrigin = needsOrigin && !origin.trim(), missingToken = needsToken && !token.trim()
  return { definition: missingOrigin || missingToken ? definition : resolved, needsOrigin, needsToken }
}
