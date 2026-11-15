import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const formal = version => VERSION.test(version) && !version.startsWith('0.')

export function assertFormalFiles(version, paths) {
  assert.ok(typeof version === 'string' && VERSION.test(version), '发布版本格式无效')
  if (!formal(version)) return
  const excluded = paths.filter(path => /(?:^|\/)changelog-v0\.[^/]*\.json$/.test(path.replaceAll('\\', '/')))
  assert.deepEqual(excluded, [], '正式源码与 npm 包不得包含 v1.0.0 之前的整合版日志；仅从独立正式快照移除，私有内测原件保留')
}

export function assertFormalSource(root = process.cwd(), version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version) {
  const directory = join(root, 'update')
  assertFormalFiles(version, existsSync(directory) ? readdirSync(directory, { recursive: true }).map(path => 'update/' + path) : [])
}

export function assertFormalHistory(git, sha, packageName) {
  // Deleted beta logs still belong to published Git history.
  assert.equal(git('log', '--format=', '--name-only', '--full-history', '-m', '--no-renames', sha, '--', ':(glob)**/changelog-v0.*.json'), '',
    '正式 Git 历史包含 v1.0.0 之前的日志；不能用后续删除代替独立快照')
  const commits = new Set(git('log', '--format=%H', '--full-history', '-m', sha, '--', 'package.json').split('\n').filter(Boolean))
  assert.ok(commits.size, '正式 Git 历史缺少根包版本')
  for (const commit of commits) {
    const meta = JSON.parse(git('show', commit + ':package.json'))
    assert.ok(meta.name === packageName && typeof meta.version === 'string' && formal(meta.version), '正式 Git 历史包含内测版本提交：' + commit)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { assertFormalSource() }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
