import test from 'node:test'
import assert from 'node:assert/strict'
import { describeFeatures, QQ_FEATURES } from '../lib/skill-features.mjs'
import { 归一化 } from '../modules/qq/lib/host.js'

const mergeDefinition = QQ_FEATURES.filter(feature => feature[0] === 'merge')
const feature = (raw, active = true) => describeFeatures('qq', 归一化(raw), mergeDefinition, active, 'QQ 总开关已关闭')[0]

test('消息合并参数跟随运行时归一化，保留 0、当前值和父级关闭状态', () => {
  const defaultValue = feature({})
  assert.equal(defaultValue.enabled, true)
  assert.equal(defaultValue.parameters.find(parameter => parameter.key === '合并窗口秒').value, '3')
  const changed = feature({ 合并窗口秒: 5, 合并最多条: 12, 合并最多秒: 30, 令牌: 'never-export-this-secret', 人设: 'private-persona' })
  assert.equal(changed.parameters.find(parameter => parameter.key === '合并窗口秒').value, '5')
  assert.equal(changed.parameters.find(parameter => parameter.key === '合并最多条').value, '12')
  assert.equal(JSON.stringify(changed).includes('never-export-this-secret'), false)
  assert.equal(JSON.stringify(changed).includes('private-persona'), false)
  const disabled = feature({ 合并窗口秒: 0 })
  assert.equal(disabled.enabled, false)
  assert.equal(disabled.effective, false)
  assert.equal(disabled.parameters.find(parameter => parameter.key === '合并窗口秒').value, '0')
  const blocked = feature({ 合并窗口秒: 3 }, false)
  assert.equal(blocked.enabled, true)
  assert.equal(blocked.effective, false)
  assert.equal(blocked.reason, 'QQ 总开关已关闭')
})

test('组合功能明确返回子开关，未知参数拒绝输出，面板功能不会冒充当前对话可执行', () => {
  const definitions = [['images', '图片收发', '收发开关', true, '收图 发图']]
  assert.equal(describeFeatures('qq', { 收图: false, 发图: false }, definitions, true)[0].enabled, false)
  const partial = describeFeatures('qq', { 收图: true, 发图: false }, definitions, true)[0]
  assert.equal(partial.parameters.find(parameter => parameter.key === '发图').value, 'false')
  assert.throws(() => describeFeatures('qq', {}, definitions, true), /参数缺失/)
  const panel = describeFeatures('qq', {}, [['history', '导入', '面板导入', true, '', 'panel']], true)[0]
  assert.equal(panel.mode, 'panel')
  assert.equal(panel.effective, false)
})
