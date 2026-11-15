const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })
const summarySchema = object({
  totalTokens: { type: 'integer', description: 'Token 总用量，含模型输入、输出、缓存和已记录的 RAG 用量' },
  estimatedCostCny: { type: 'number', description: '人民币估算费用，复用吃大米饭统计口径，缺少日志或定价时可能不完整' },
})
const tokensSchema = object({
  inputTokens: { type: 'integer', description: '模型输入 Token，含缓存读取及写入，不含 RAG' },
  uncachedInputTokens: { type: 'integer', description: '模型未缓存输入 Token，不含 RAG' },
  outputTokens: { type: 'integer', description: '模型输出 Token' },
  cacheReadTokens: { type: 'integer', description: '缓存命中的读取 Token' },
  cacheWriteTokens: { type: 'integer', description: '缓存写入 Token' },
  cacheTokens: { type: 'integer', description: '缓存读取与写入 Token 合计' },
  cacheHitRate: { type: 'number', description: '缓存命中率，缓存读取 Token / 模型输入 Token，范围 0–1，无模型输入时为 0' },
  ragTokens: { type: 'integer', description: '独立列出的 RAG Token，不参与模型缓存命中率计算' },
})
const periodSchema = {
  date: { type: 'string', description: '统计当天日期，YYYY-MM-DD' },
  timeZone: { type: 'string', enum: ['Asia/Shanghai'], description: '统计日期采用北京时间' },
}
const sessionSchema = { type: 'string', description: '平台从宿主执行上下文取得的调用会话 ID' }

const summary = (usage = {}) => ({ totalTokens: usage.total || 0, estimatedCostCny: usage.cost || 0 })
function tokens(usage = {}) {
  const ragTokens = usage.ragTokens || 0
  const uncachedInputTokens = (usage.input || 0) - ragTokens
  const cacheReadTokens = usage.cacheRead || 0
  const cacheWriteTokens = usage.cacheWrite || 0
  const inputTokens = uncachedInputTokens + cacheReadTokens + cacheWriteTokens
  return {
    inputTokens, uncachedInputTokens, outputTokens: usage.output || 0,
    cacheReadTokens, cacheWriteTokens, cacheTokens: cacheReadTokens + cacheWriteTokens,
    cacheHitRate: inputTokens ? cacheReadTokens / inputTokens : 0, ragTokens,
  }
}

export function riceApi(readReport) {
  const sessionReport = execution => {
    if (typeof execution.sessionId !== 'string' || !execution.sessionId) throw Error('本会话接口需要可信的调用会话，请在已授权 QQ 会话中调用')
    const report = readReport()
    return { report, row: report.会话.find(row => row.id === execution.sessionId) }
  }
  const inputSchema = { ...object({}), description: '传入空对象 {}。本会话接口由平台确定 sessionId，无需业务参数。' }
  return {
    schemaVersion: 1, id: 'rice', title: '吃大米饭', version: '1.0.0',
    description: '查询绑定工作区及本会话的 Token 用量与人民币估算费用。本会话接口始终按可信 sessionId 限定范围。',
    operations: [{
      id: 'workspace_usage', title: '查询工作区用量', readOnly: true, inputSchema, example: {},
      description: '查询当前绑定工作区今天及累计 Token 用量与人民币估算费用，含已记录的 RAG 用量，仅返回汇总。',
      outputSchema: object({ ...periodSchema, today: summarySchema, total: summarySchema }),
      handler() {
        const report = readReport()
        return {
          date: report.今天, timeZone: 'Asia/Shanghai',
          today: summary(report.days.find(day => day.date === report.今天)), total: summary(report.全部),
        }
      },
    }, {
      id: 'session_usage', title: '查询本会话用量', readOnly: true, inputSchema, example: {},
      description: '查询本会话今天及累计 Token 用量与人民币估算费用，含已记录的 RAG 用量。会话由平台确定，主人与其他会话执行相同范围规则。管理页调用需指定已授权会话请求头。',
      outputSchema: object({ ...periodSchema, sessionId: sessionSchema, today: summarySchema, total: summarySchema }),
      handler(_input, execution) {
        const { report, row } = sessionReport(execution)
        return {
          date: report.今天, timeZone: 'Asia/Shanghai', sessionId: execution.sessionId,
          today: summary(row?.今天), total: summary(row?.全部),
        }
      },
    }, {
      id: 'session_tokens', title: '查询本会话 Token 明细', readOnly: true, inputSchema, example: {},
      description: '查询本会话今天及累计输入、输出、缓存 Token 和缓存命中率。命中率为缓存读取 Token / 模型输入 Token，RAG 单列。管理页调用需指定已授权会话请求头。',
      outputSchema: object({ ...periodSchema, sessionId: sessionSchema, today: tokensSchema, total: tokensSchema }),
      handler(_input, execution) {
        const { report, row } = sessionReport(execution)
        return {
          date: report.今天, timeZone: 'Asia/Shanghai', sessionId: execution.sessionId,
          today: tokens(row?.今天), total: tokens(row?.全部),
        }
      },
    }],
  }
}
