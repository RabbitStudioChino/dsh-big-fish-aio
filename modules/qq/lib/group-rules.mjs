const integer = (value, fallback, min, max) => Number.isFinite(Number(value)) && value !== null && value !== ''
  ? Math.max(min, Math.min(max, Math.round(Number(value)))) : fallback

export function groupRules(binding, config = {}) {
  return {
    启用读取间隔: binding.启用读取间隔 !== false,
    读取间隔分: integer(binding.读取间隔分, 10, 0, 1440),
    读取最多条: integer(binding.读取最多条, 30, 1, 100),
    回复概率: integer(binding.回复概率, integer(config.回复概率, 100, 0, 100), 0, 100),
    点名必回: binding.点名必回 == null ? config.点名必回 !== false : binding.点名必回 === true,
    回复冷却秒: integer(binding.回复冷却秒, integer(config.回复冷却秒, 5, 0, 300), 0, 300),
    每分钟最多条: integer(binding.每分钟最多条, integer(config.每分钟最多条, 4, 1, 120), 1, 120),
    合并最多条: integer(binding.合并最多条, integer(config.合并最多条, 8, 1, 50), 1, 50),
  }
}

export function effectiveGroupRules(binding, config) {
  const rules = groupRules(binding, config)
  return { ...rules, ...(rules.启用读取间隔 ? {} : { 读取间隔分: 0, 回复概率: 100, 点名必回: true, 回复冷却秒: 0, 每分钟最多条: 120 }), 门槛: binding.门槛 === true }
}

export function groupSample(messages, rules, last, now, named) {
  const due = !last || now - last >= rules.读取间隔分 * 60000
  return { due, messages: due ? messages.slice(-rules.读取最多条) : rules.点名必回 ? messages.filter(named) : [] }
}
