// Only the host can authenticate management requests; missing or failed auth denies access.
export async function managementRejection(ctx, req) {
  try {
    const connection = ctx.get?.('connection')
    if (typeof connection?.requestRejection !== 'function') return 503
    const rejection = await connection.requestRejection(req)
    if (rejection == null || rejection === false || rejection === 0) return 0
    return rejection === 401 || rejection === 403 ? rejection : 503
  } catch { return 503 }
}
