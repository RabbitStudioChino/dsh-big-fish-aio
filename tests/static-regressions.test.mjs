import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')

for (const draft of [null, '/synthetic/edited']) {
  test(`排除候选名字后使用当前档案目录重新扫描（${draft === null ? '已保存' : '草稿'}）`, async () => {
    const source = read('modules/memory/lib/client.js')
    const start = source.indexOf('const 标掉名字 =')
    const end = source.indexOf('// 一个候选名字块', start)
    assert.ok(start >= 0 && end > start)
    const requests = [], errors = [], names = []
    const context = {
      找名字: { 不是名字: [] }, open: 'synthetic-session', impDir: draft, imp: { data: { dir: '/synthetic/saved' } },
      saveNames: async body => requests.push(['/names', body]),
      post: async (path, body) => { requests.push([path, body]); return { ok: true } },
      set找名字() {}, 名字们: () => ['测试名字', '保留名字'],
      setImpNames: value => names.push(value), setExpNote: value => errors.push(value),
    }
    vm.runInNewContext(source.slice(start, end) + '\n标掉名字("测试名字")', context)
    await new Promise(resolve => setImmediate(resolve))
    assert.deepEqual(errors, [])
    assert.equal(requests[1]?.[0], '/names/scan')
    assert.equal(requests[1][1].dir, draft ?? '/synthetic/saved')
    assert.deepEqual(names, ['保留名字'])
  })
}

test('系统没有 ffmpeg 时使用语音环境的 Python 查找 imageio-ffmpeg', async () => {
  const source = read('modules/qq/lib/host.js')
  const start = source.indexOf('let ffmpeg缓存 = null')
  const end = source.indexOf('// ---------- 配置读写', start)
  assert.ok(start >= 0 && end > start)
  const commands = []
  const context = {
    process: { env: {} },
    spawn: () => ({ on(event, fn) { if (event === 'close') fn(1) } }),
    跑命令: async command => { commands.push(command); return { ok: true, 文字: '/synthetic/ffmpeg' } },
    existsSync: path => path === '/synthetic/ffmpeg',
  }
  vm.runInNewContext(source.slice(start, end), context)
  assert.equal(await context.找ffmpeg('/synthetic/python'), '/synthetic/ffmpeg')
  assert.match(commands[0], /^"\/synthetic\/python" -c /)
})
