import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../modules/memory/lib/index.js', import.meta.url), 'utf8')
const route = source.slice(source.indexOf("    mroute('/dsh-fish-memory/qq-settings'"), source.indexOf("    mroute('/dsh-fish-memory/qq-migrate'"))

test('群映射逐群修改隔离设置时保留其他群，校验输入并报告保存失败', async () => {
  let handler, saved = true, config = { qqIsolatedGroups: ['10001'], other: 'preserved' }
  vm.runInNewContext(route, { mroute: (_, fn) => { handler = fn }, loadCfg: () => structuredClone(config), saveCfg: next => { if (saved) config = next; return saved } })
  const request = async body => {
    let response
    await handler({ async *[Symbol.asyncIterator]() { yield JSON.stringify(body) } }, { writeHead() {}, end: body => { response = JSON.parse(body) } })
    return response
  }
  assert.deepEqual((await request({ group: '20002', isolated: true })).qqIsolatedGroups, ['10001', '20002'])
  await request({ group: '20002', isolated: true })
  assert.deepEqual(Array.from(config.qqIsolatedGroups), ['10001', '20002'])
  await request({ group: '10001', isolated: false })
  assert.deepEqual(Array.from(config.qqIsolatedGroups), ['20002'])
  assert.equal(config.other, 'preserved')
  await assert.rejects(request({ group: 'invalid', isolated: true }))
  await assert.rejects(request({ group: '20002', isolated: 'false' }))
  saved = false
  await assert.rejects(request({ group: '20002', isolated: false }), /设置保存失败/)
  assert.deepEqual(Array.from(config.qqIsolatedGroups), ['20002'])
})
