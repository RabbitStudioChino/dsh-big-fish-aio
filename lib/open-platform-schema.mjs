const types = ['object', 'array', 'string', 'number', 'integer', 'boolean', 'null']
const annotations = ['title', 'description', 'default', 'examples']

// shortcut: 支持下列 JSON Schema 子集，扩展规范时同时扩展注册检查和运行时校验。
export function checkSchema(schema, depth = 0) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema) || depth > 12 || !types.includes(schema.type)) throw Error('Schema 必须声明受支持的 type，嵌套不超过 12 层')
  const fields = { object: ['properties', 'required', 'additionalProperties'], array: ['items'], string: ['minLength', 'maxLength'] }
  const allowed = ['type', 'enum', ...annotations, ...(fields[schema.type] || [])]
  for (const key of Object.keys(schema)) if (!allowed.includes(key)) throw Error('不支持的 Schema 字段 ' + key)
  if (schema.enum !== undefined && (!Array.isArray(schema.enum) || !schema.enum.length || schema.enum.some(v => v !== null && typeof v === 'object'))) throw Error('enum 仅支持非空标量列表')
  if (schema.type === 'object') {
    if (!schema.properties || typeof schema.properties !== 'object' || Array.isArray(schema.properties) || schema.additionalProperties !== false) throw Error('object 必须声明 properties 和 additionalProperties=false')
    if (schema.required !== undefined && (!Array.isArray(schema.required) || schema.required.some(k => typeof k !== 'string' || !Object.hasOwn(schema.properties, k)))) throw Error('required 必须引用已声明字段')
    for (const value of Object.values(schema.properties)) checkSchema(value, depth + 1)
  }
  if (schema.type === 'array') checkSchema(schema.items, depth + 1)
  for (const key of ['minLength', 'maxLength']) if (schema[key] !== undefined && (!Number.isSafeInteger(schema[key]) || schema[key] < 0)) throw Error(key + ' 必须是非负整数')
  if (schema.minLength > schema.maxLength) throw Error('minLength 不能超过 maxLength')
}

export function validateValue(schema, value, path = 'input') {
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
  if (schema.type === 'integer' ? !Number.isSafeInteger(value) : type !== schema.type) throw Error(path + ' 必须是 ' + schema.type)
  if (type === 'number' && !Number.isFinite(value)) throw Error(path + ' 必须是有限数值')
  if (schema.enum && !schema.enum.includes(value)) throw Error(path + ' 不在 enum 范围内')
  if (type === 'string') {
    const length = [...value].length
    if (length < (schema.minLength ?? 0) || length > (schema.maxLength ?? Infinity)) throw Error(path + ' 长度不符合要求')
  }
  if (type === 'object') {
    for (const key of schema.required || []) if (!Object.hasOwn(value, key)) throw Error(path + '.' + key + ' 为必填字段')
    for (const [key, item] of Object.entries(value)) {
      if (!Object.hasOwn(schema.properties, key)) throw Error(path + '.' + key + ' 未声明')
      validateValue(schema.properties[key], item, path + '.' + key)
    }
  }
  if (type === 'array') value.forEach((item, i) => validateValue(schema.items, item, path + '[' + i + ']'))
}
