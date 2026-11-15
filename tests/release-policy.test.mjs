import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assertFormalFiles, assertFormalHistory, assertFormalSource } from '../scripts/release-policy.mjs'
import { runCommand, runRelease } from '../scripts/release.mjs'

const name = 'dsh-big-fish-aio'
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'formal-policy-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const env = { ...process.env }
  delete env.GIT_NO_REPLACE_OBJECTS
  delete env.GIT_GRAFT_FILE
  const git = (...args) => execFileSync('git', args, { cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.name', 'Synthetic release test')
  git('config', 'user.email', 'synthetic@example.invalid')
  const write = (path, value) => { mkdirSync(join(root, path, '..'), { recursive: true }); writeFileSync(join(root, path), value) }
  const version = value => write('package.json', JSON.stringify({ name, version: value, files: ['index.js', 'update/'] }) + '\n')
  const commit = () => { git('add', '.'); git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'Synthetic fixture'); return git('rev-parse', 'HEAD') }
  const secureGit = (...args) => runCommand('git', args, { cwd: root })
  return { root, git, secureGit, write, version, commit }
}

test('正式文件边界拒绝旧整合日志，私有内测与上游资料保留', () => {
  const files = ['update/changelog-v0.7.5.json', 'modules/mood/CHANGELOG.md', 'LICENSE', 'NOTICE']
  assert.doesNotThrow(() => assertFormalFiles('0.7.5', files))
  for (const version of ['1.0.0', '2.0.0']) assert.throws(() => assertFormalFiles(version, files), /v1.0.0 之前/)
  assert.throws(() => assertFormalFiles('1.0.0', ['docs/archive/changelog-v0.9.0.json']), /v1.0.0 之前/)
  assert.throws(() => assertFormalFiles('1.0.0', ['update\\changelog-v0.9.0.json']), /v1.0.0 之前/)
  assert.doesNotThrow(() => assertFormalFiles('1.0.0', ['update/changelog-v1.0.0.json', ...files.slice(1)]))
})

test('正式源码检查不修改私有原件，真实 npm 打包也校验文件清单', t => {
  const f = fixture(t)
  f.version('1.0.0')
  f.write('index.js', 'export const synthetic = true\n')
  f.write('update/changelog-v1.0.0.json', '{}\n')
  f.write('update/changelog-v0.7.5.json', '{}\n')
  assert.throws(() => assertFormalSource(f.root), /v1.0.0 之前/)
  assert.equal(readFileSync(join(f.root, 'update/changelog-v0.7.5.json'), 'utf8'), '{}\n')
  const pack = () => JSON.parse(runCommand('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], { cwd: f.root }))[0]
  assert.throws(() => assertFormalFiles('1.0.0', pack().files.map(file => file.path)), /v1.0.0 之前/)
  rmSync(join(f.root, 'update/changelog-v0.7.5.json'))
  assert.doesNotThrow(() => assertFormalSource(f.root))
  const paths = pack().files.map(file => file.path)
  assert.ok(paths.includes('update/changelog-v1.0.0.json'))
  assert.doesNotThrow(() => assertFormalFiles('1.0.0', paths))
})

test('真实 Git 历史中旧日志先提交后删除，仍阻止正式发布', t => {
  const f = fixture(t)
  f.version('1.0.0')
  f.write('update/changelog-v0.7.5.json', '{}\n')
  f.commit()
  rmSync(join(f.root, 'update/changelog-v0.7.5.json'))
  f.write('update/changelog-v1.0.0.json', '{}\n')
  const sha = f.commit()
  assert.doesNotThrow(() => assertFormalSource(f.root))
  assert.throws(() => assertFormalHistory(f.secureGit, sha, name), /Git 历史包含/)
})

test('真实 Git 分支中曾混入 0.x 版本提交，即使版本已修正仍拒绝', t => {
  const f = fixture(t)
  f.version('1.0.0'); f.commit()
  f.version('0.7.5'); f.commit()
  f.version('1.0.1'); const sha = f.commit()
  assert.throws(() => assertFormalHistory(f.secureGit, sha, name), /内测版本提交/)
})

test('真实独立正式根和后续版本通过历史检查', t => {
  const f = fixture(t)
  f.version('1.0.0'); f.write('update/changelog-v1.0.0.json', '{}\n'); f.commit()
  f.version('1.0.1'); f.write('update/changelog-v1.0.1.json', '{}\n'); const sha = f.commit()
  assert.doesNotThrow(() => assertFormalHistory(f.secureGit, sha, name))
})

test('Git replace 不能把内测父历史伪装为独立正式根', t => {
  const f = fixture(t)
  f.version('0.7.5'); const beta = f.commit()
  f.version('1.0.0'); const formal = f.commit()
  f.git('replace', '--graft', formal)
  assert.equal(f.git('rev-list', '--max-parents=0', 'HEAD'), formal)
  assert.equal(f.secureGit('rev-list', '--max-parents=0', 'HEAD'), beta)
  assert.throws(() => assertFormalHistory(f.secureGit, formal, name), /内测版本提交/)
})

test('旧式 grafts 伪造的根仍能从原始 commit 头发现真实父提交', t => {
  const f = fixture(t)
  f.version('0.7.5'); const beta = f.commit()
  f.version('1.0.0'); const formal = f.commit()
  f.write('.git/info/grafts', formal + '\n')
  assert.equal(f.secureGit('rev-list', '--max-parents=0', 'HEAD'), formal)
  const header = f.secureGit('cat-file', 'commit', formal).split('\n\n')[0]
  assert.ok(header.includes('parent ' + beta))
})

test('grafts 隐藏中间内测提交时，即使可见根完全合法也拒绝发布', t => {
  const f = fixture(t)
  f.version('1.0.0'); const root = f.commit()
  f.version('0.7.5'); const beta = f.commit()
  f.version('1.0.1')
  f.write('package-lock.json', JSON.stringify({ version: '1.0.1', packages: { '': { version: '1.0.1' } } }))
  for (const module of ['qq', 'memory', 'mood', 'speak']) f.write(`modules/${module}/package.json`, JSON.stringify({ version: '1.0.1', private: true }))
  f.write('update/changelog-v1.0.1.json', JSON.stringify({ schemaVersion: 1, channel: 'stable', version: '1.0.1', releaseId: 'v1.0.1', title: 'Synthetic', publishedAt: '2026-11-15T00:00:00Z', sections: [{ id: 'test', title: 'Test', items: [{ id: 'test', title: 'Test' }] }] }))
  const head = f.commit()
  f.write('.git/info/grafts', head + ' ' + root + '\n')
  assert.equal(f.secureGit('rev-list', '--max-parents=0', 'HEAD'), root)
  assert.ok(f.secureGit('cat-file', 'commit', head).includes('parent ' + beta))
  assert.doesNotThrow(() => assertFormalHistory(f.secureGit, head, name), 'grafts 确实隐藏了中间提交，不能只相信遍历结果')
  assert.throws(() => runRelease(['publish'], { root: f.root, run(command, args) {
    assert.equal(command, 'git', '拒绝发生在任何 npm / GitHub 动作前')
    return f.secureGit(...args)
  } }), /info\/grafts/)
})
