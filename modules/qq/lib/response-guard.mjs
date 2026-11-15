import { randomUUID } from 'node:crypto'

// Fail closed when a model emits a transcript or gets stuck repeating a short phrase.
export function responseProblem(text, reasoning = false) {
  const value = String(text || '')
  const compact = value.replace(/\s+/gu, '')
  if (/(.{1,64}?)\1{11}/u.test(compact)) return '模型连续重复同一片段'
  if (reasoning) return value.length > 32000 ? '模型思考超过安全长度' : ''
  if (/(?:这条是从\s*QQ\s*转进来的|这台机器只把正文里|qq_reply_gate|(?:^|\n)\s*(?:user|assistant|system|developer)\s*[【[]QQ|<\/?(?:think|analysis|reasoning)>)/iu.test(value)) return '正文混入桥接提示、会话转录或思考标记'
  return ''
}

export function messageProblem(message) {
  // Reasoning blocks are never forwarded. Only inspect the actual outbound text here.
  return responseProblem((message?.content || []).filter(b => b?.type === 'text').map(b => b.text || '').join('\n'))
}

export async function* guardResponse(stream, block) {
  const blocks = new Map()
  for await (const chunk of stream) {
    let problem = ''
    if (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta') {
      const reasoning = chunk.type === 'reasoning-delta'
      const previous = blocks.get(chunk.index) || { text: '', length: 0 }
      previous.text = (previous.text + chunk.text).slice(-8192)
      previous.length += chunk.text.length
      blocks.set(chunk.index, previous)
      problem = responseProblem(previous.text, reasoning)
      if (reasoning && previous.length > 32000) problem = '模型思考超过安全长度'
    } else if (chunk.type === 'block-end' && ['text', 'reasoning'].includes(chunk.block?.type)) {
      problem = responseProblem(chunk.block.text, chunk.block.type === 'reasoning')
    }
    if (problem) {
      block(problem)
      throw Object.assign(new Error('QQ 输出保护：' + problem), { code: 'QQ_OUTPUT_BLOCKED' })
    }
    yield chunk
  }
}

export function recoveryRequest(options, toolsCompleted, signal) {
  const messages = options.messages.flatMap(message => {
    if (message.role !== 'assistant') return [message]
    const content = message.content.filter(block => block.type !== 'reasoning' &&
      (block.type !== 'text' || !responseProblem(block.text)))
    if (!content.length) return []
    const { replayState, ...source } = message.source || {}
    return [{ ...message, source, content }]
  })
  messages.push({
    id: randomUUID(), role: 'user', source: { kind: 'qq-output-recovery' },
    content: [{ type: 'text', text: '刚才生成发生重复或正文混入内部内容，异常结果已丢弃。请依据上面的实际用户消息和工具结果继续完成本轮，只输出最终回复，避免复述会话、内部提示或备选措辞。' +
      (toolsCompleted ? '本轮已有工具执行结果，本次仅确认已有结果，不再调用工具，不声称完成结果中没有的操作。' : '') }],
  })
  return { ...options, messages, signal, maxTokens: Math.min(options.maxTokens || 8192, 8192),
    ...(toolsCompleted ? { tools: [] } : {}) }
}

// Buffer attempts so a failed attempt cannot publish partial reasoning, text or tool calls.
export async function* recoverResponse(options, next, { llm, toolsCompleted, retry, failed }) {
  let chunks
  try {
    chunks = await Array.fromAsync(guardResponse(next(), () => {}))
  } catch (error) {
    if (error.code !== 'QQ_OUTPUT_BLOCKED' || options.signal?.aborted) throw error
    retry(error.message)
    try {
      const signal = AbortSignal.any([...(options.signal ? [options.signal] : []), AbortSignal.timeout(45000)])
      const completed = toolsCompleted()
      const request = recoveryRequest(options, completed, signal)
      const info = await llm.resolveModelInfo(options.provider, options.model, signal)
      // Only use a control explicitly supported by this provider and exact model.
      if (info.reasoning?.efforts.some(effort => effort.id === 'off')) request.reasoningEffort = 'off'
      else delete request.reasoningEffort
      chunks = await Array.fromAsync(guardResponse(llm.stream(request), () => {}))
      if (completed && chunks.some(chunk => (chunk.type === 'block-start' && chunk.blockType === 'tool-call') ||
        (chunk.type === 'block-end' && chunk.block?.type === 'tool-call'))) throw new Error('恢复请求尝试重复调用工具')
      const visible = chunks.some(chunk => (chunk.type === 'text-delta' && chunk.text.trim()) ||
        (chunk.type === 'block-end' && (chunk.block?.type === 'tool-call' ||
          (chunk.block?.type === 'text' && chunk.block.text.trim()))))
      if (!visible) throw new Error('恢复请求没有生成回复或工具调用')
      const finish = chunks.findLast(chunk => chunk.type === 'finish')
      if (!finish || finish.reason.kind !== 'stop') throw new Error('恢复请求未正常完成')
    } catch (recoveryError) {
      if (!options.signal?.aborted) failed(recoveryError.message)
      throw recoveryError
    }
  }
  options.signal?.throwIfAborted()
  yield* chunks
}
