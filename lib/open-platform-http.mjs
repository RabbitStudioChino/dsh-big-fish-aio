// 手动接入只声明 HTTP 数据，不接收或执行用户填写的 JavaScript。
export function httpManifest(value) {
  if (!value || !Array.isArray(value.operations)) throw Error('请填写接口清单')
  return {
    schemaVersion: value.schemaVersion, id: value.id, title: value.title, description: value.description, version: value.version,
    operations: value.operations.map(operation => {
      let url, headers
      try {
        url = new URL(operation.url)
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw Error()
      } catch { throw Error('目标地址必须是 HTTP(S) URL，认证信息请放在请求头中') }
      const supplied = operation.headers ?? {}
      if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied)) throw Error('请求头必须是 JSON 对象')
      try {
        for (const [name, content] of Object.entries(supplied)) {
          if (typeof content !== 'string' || /^(host|connection|content-length|transfer-encoding|upgrade|content-type)$/i.test(name)) throw Error()
        }
        headers = new Headers(supplied)
        headers.set('Content-Type', 'application/json')
      } catch { throw Error('请求头无效，Content-Type 由平台统一设置') }
      return {
        id: operation.id, title: operation.title, description: operation.description, readOnly: operation.readOnly,
        inputSchema: operation.inputSchema, outputSchema: operation.outputSchema, example: operation.example,
        async handler(input, { signal }) {
          let response
          try {
            response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(input), signal, redirect: 'error' })
          } catch { throw Error('远端 API 网络请求失败，请检查地址、认证和网络') }
          if (!response.ok) {
            await response.body?.cancel()
            throw Error('远端 API 返回 HTTP ' + response.status)
          }
          const chunks = []; let size = 0
          if (response.body) for await (const chunk of response.body) {
            size += chunk.byteLength
            if (size > 1048576) throw Error('远端 API 响应超过 1 MB')
            chunks.push(Buffer.from(chunk))
          }
          let result
          try { result = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
          catch { throw Error('远端 API 未返回有效 JSON') }
          if (!result || result.ok !== true || !Object.hasOwn(result, 'data')) throw Error('远端 API 返回业务失败或结果不符合 ok/data 规范')
          return result.data
        },
      }
    }),
  }
}
