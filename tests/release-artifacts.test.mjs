import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { validateChangelog } from '../lib/update-service.mjs'

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
const json = path => JSON.parse(read(path))
const logPath = releaseId => 'update/changelog-' + releaseId + '.json'

test('随包日志与唯一版本一致，草稿只允许在本地明确显示', () => {
  const meta = json('package.json'), log = json(logPath('v' + meta.version))
  assert.equal(meta.repositoryVersion, undefined)
  assert.equal(log.version, meta.version)
  assert.equal(log.releaseId, 'v' + meta.version)
  assert.equal(Buffer.byteLength(read(logPath(log.releaseId))) < 512 * 1024, true)
  if (log.publishedAt === '__PUBLISHED_AT__') assert.throws(() => validateChangelog(log), /publishedAt/)
  validateChangelog(log, { channel: 'stable', releaseId: log.releaseId, version: meta.version }, { allowDraft: true })
  assert.throws(() => validateChangelog(log, { channel: 'stable', releaseId: 'v99.0.0' }, { allowDraft: true }), /不对应/)
  assert.ok(meta.files.includes('update/changelog-v*.json'))
})

test('内置模块统一版本且不独立发布，日志无需罗列未变更功能', () => {
  const meta = json('package.json')
  const lock = json('package-lock.json')
  assert.equal(lock.name, meta.name)
  assert.equal(lock.version, meta.version)
  assert.equal(lock.packages[''].name, meta.name)
  assert.equal(lock.packages[''].version, meta.version)
  for (const module of ['qq', 'memory', 'mood', 'speak']) {
    const bundled = json('modules/' + module + '/package.json')
    assert.equal(bundled.version, meta.version)
    assert.equal(bundled.private, true)
  }
})


test('更新目录只保存逐版本日志，不维护 Web 版本清单', () => {
  for (const path of ['version.json', 'changelog.json', 'update/latest/version.json', 'update/releases.json']) {
    assert.equal(existsSync(new URL('../' + path, import.meta.url)), false)
  }
  for (const entry of readdirSync(new URL('../update/', import.meta.url), { withFileTypes: true })) {
    assert.equal(entry.isFile(), true)
    assert.match(entry.name, /^changelog-v\d+\.\d+\.\d+\.json$/)
    const releaseId = entry.name.slice(10, -5)
    validateChangelog(json(logPath(releaseId)), { channel: 'stable', releaseId, version: releaseId.slice(1) }, { allowDraft: true })
  }
})
