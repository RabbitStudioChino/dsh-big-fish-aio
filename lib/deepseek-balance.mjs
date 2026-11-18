import { readFileSync } from 'node:fs'

// 复用宿主已登录的官方账户通道，不向前端暴露认证信息。
export async function deepseekBalance(ctx) {
  const account = ctx.get('deepseekAccount')
  if (!account?.getBalance) throw Error('宿主未提供 DeepSeek 官方余额服务，请检查登录状态')
  const result = await account.getBalance({ version: JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, locale: 'zh-CN', timezoneOffsetSeconds: 28800 })
  if (result?.status !== 'ready' || !Array.isArray(result.value)) throw Error('请检查 DeepSeek 登录状态和余额查询')
  const wallets = [...result.value, ...(result.bonusWallets || [])].filter(w => w.currency === 'CNY')
  if (!wallets.length || wallets.some(w => typeof w.balance !== 'string' || !w.balance.trim() || !Number.isFinite(Number(w.balance)))) throw Error('账户未返回有效人民币余额')
  return { currency: 'CNY', balance: wallets.reduce((sum, w) => sum + Number(w.balance), 0), updatedAt: Date.now() }
}
