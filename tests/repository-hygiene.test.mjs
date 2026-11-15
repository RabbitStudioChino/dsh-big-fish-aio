import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../scripts/check-public-files.mjs', import.meta.url))
const ignore = readFileSync(new URL('../.gitignore', import.meta.url))
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'bigfish-public-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  execFileSync('git', ['init', '-q', root])
  writeFileSync(join(root, '.gitignore'), ignore)
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'synthetic-public-fixture', version: '1.0.0', files: ['index.js'] }))
  writeFileSync(join(root, 'index.js'), 'export const synthetic = true\n')
  return root
}

test('私有数据在根目录及嵌套模块均忽略，公开源码、测试和许可仍可跟踪', t => {
  const root = fixture(t)
  for (const prefix of ['', 'modules/qq/']) {
    for (const path of ['AGENTS.md', '.env', '.env.production', '.npmrc', 'secret.key', 'credentials.json', 'local/probe.test.mjs', 'private/report.md',
      'big-fish-open-platform-apis.json', 'qq-bridge-config.json', 'fish-memory/session.json', 'fish-memory-config.json',
      'feiyu-mood/config.json', 'speak-up-config.json', 'her-words-config.json', 'artifacts/screenshot.png', 'chat.jsonl', 'voice.wav', 'Wasapi.dll']) {
      const result = spawnSync('git', ['check-ignore', '--no-index', prefix + path], { cwd: root })
      assert.equal(result.status, 0, prefix + path)
    }
  }
  for (const path of ['index.js', 'client.js', 'src/theme.css', 'assets/themes/dark.css', 'tests/sample.test.mjs', 'docs/architecture.md', '.env.example', 'LICENSE', 'modules/memory/lib/notices/jieba-LICENSE']) {
    assert.equal(spawnSync('git', ['check-ignore', '--no-index', path], { cwd: root }).status, 1, path)
  }
})

test('检查拒绝被强制跟踪的私有文件，打包也拒绝绕过忽略规则的内容', t => {
  const root = fixture(t)
  const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' })
  assert.equal(run().status, 0)
  writeFileSync(join(root, '.env'), 'SYNTHETIC_VALUE=not-a-secret\n')
  execFileSync('git', ['add', '-f', '.env'], { cwd: root })
  assert.match(run().stderr, /Private files are tracked/)
  rmSync(join(root, '.env'))
  assert.match(run().stderr, /Private files are tracked/, '工作树删除不能代替从 Git 索引移除')
  execFileSync('git', ['rm', '--cached', '-f', '.env'], { cwd: root })
  mkdirSync(join(root, 'local'))
  writeFileSync(join(root, 'local', 'report.md'), 'Synthetic private report\n')
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'synthetic-public-fixture', version: '1.0.0', files: ['index.js', 'local/report.md'] }))
  assert.match(run().stderr, /Package contains an ignored or unreviewed file/)
})

test('正式源码拒绝旧内测日志，私有内测保留自己的日志', t => {
  const root = fixture(t)
  const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' })
  const meta = { name: 'synthetic-public-fixture', version: '1.0.0', files: ['index.js', 'update/'] }
  writeFileSync(join(root, 'package.json'), JSON.stringify(meta))
  mkdirSync(join(root, 'update'))
  writeFileSync(join(root, 'update/changelog-v0.9.0.json'), '{}\n')
  assert.notEqual(run().status, 0)
  rmSync(join(root, 'update/changelog-v0.9.0.json'))
  writeFileSync(join(root, 'update/changelog-v1.0.0.json'), '{}\n')
  assert.equal(run().status, 0)
  meta.version = '0.9.0'
  writeFileSync(join(root, 'package.json'), JSON.stringify(meta))
  writeFileSync(join(root, 'update/changelog-v0.9.0.json'), '{}\n')
  assert.equal(run().status, 0)
})
