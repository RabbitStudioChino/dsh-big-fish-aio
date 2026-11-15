import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runRelease } from '../scripts/release.mjs'

const rootSha = 'a'.repeat(40), headSha = 'b'.repeat(40)
const official = 'https://registry.npmjs.org/', mirror = 'https://registry.npmmirror.com'
const name = 'dsh-big-fish-aio', repo = 'RabbitStudioChino/' + name
const json = path => JSON.parse(readFileSync(path, 'utf8'))
const write = (path, data) => { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, JSON.stringify(data, null, 2) + '\n') }
const log = (version, draft = false) => ({ schemaVersion: 1, releaseId: 'v' + version, version, channel: 'stable', title: '本次更新', publishedAt: draft ? '__PUBLISHED_AT__' : '2026-11-15T09:00:00.000Z', sections: [{ id: 'changed-only', title: '本次分类', items: [{ id: 'one', title: '修复一项问题', description: '只写实际变化' }] }] })
function missingNpm() { return Object.assign(Error('npm view failed'), { stdout: JSON.stringify({ error: { code: 'E404' } }) }) }
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'release-test-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(join(root, 'package.json'), { name, version: '1.0.1' })
  write(join(root, 'package-lock.json'), { version: '1.0.1', packages: { '': { version: '1.0.1' } } })
  for (const module of ['qq', 'memory', 'mood', 'speak']) write(join(root, 'modules', module, 'package.json'), { version: '1.0.1', private: true })
  write(join(root, 'update/changelog-v1.0.0.json'), log('1.0.0'))
  write(join(root, 'update/changelog-v1.0.1.json'), log('1.0.1'))
  const calls = [], reports = []
  const state = { main: rootSha, tag: null, published: null, release: null, latest: '1.0.0', versions: ['1.0.0'], mirrorReady: true, dirty: '', shallow: 'false', writable: true, remote: `https://github.com/${repo}.git`, rootVersion: '1.0.0', historyChanged: false }
  const archive = Buffer.from('immutable release tarball'), hash = 'sha512-' + createHash('sha512').update(archive).digest('base64')
  const npmValue = () => ({ name, version: '1.0.1', dist: { integrity: hash } })
  const run = (command, args) => {
    calls.push([command, ...args])
    if (command === 'git') {
      switch (args[0]) {
        case 'status': return state.dirty
        case 'rev-parse': return args[1] === '--is-shallow-repository' ? state.shallow : args[1] === 'HEAD' ? headSha : args[1] === 'FETCH_HEAD' ? state.main : 'history-blob'
        case 'branch': return 'main'
        case 'remote': return state.remote
        case 'ls-remote': return `${state.main}\trefs/heads/main\n${rootSha}\trefs/tags/v1.0.0` + (state.tag ? `\n${state.tag}\trefs/tags/v1.0.1` : '')
        case 'fetch': case 'merge-base': return ''
        case 'rev-list': return rootSha
        case 'cat-file': return 'tree ' + 'd'.repeat(40) + (state.fakeRootParent ? '\nparent ' + headSha : '') + '\n\nRoot\n'
        case 'log': return args.includes('package.json') ? rootSha + '\n' + headSha : state.betaHistory ? 'update/changelog-v0.7.5.json' : ''
        case 'ls-tree': return 'update/changelog-v1.0.0.json'
        case 'hash-object': return state.historyChanged ? 'changed-history' : 'history-blob'
        case 'show': return JSON.stringify(args[1].endsWith(':package.json') ? { name, version: args[1].startsWith(rootSha) ? state.rootVersion : state.historyVersion || '1.0.1' } : log('1.0.0'))
        case 'push': if (args[2].includes('refs/tags/')) state.tag = headSha; else state.main = headSha; return ''
      }
    }
    if (command === 'npm') {
      if (args[0] === 'run' || args[0] === 'whoami') return ''
      if (args[0] === 'pack') {
        const destination = args[args.indexOf('--pack-destination') + 1]
        const filename = `${name}-1.0.1.tgz`
        writeFileSync(join(destination, filename), archive)
        return JSON.stringify([{ name, version: '1.0.1', filename, integrity: hash, files: [{ path: state.packBeta ? 'update/changelog-v0.7.5.json' : 'update/changelog-v1.0.1.json' }] }])
      }
      if (args[0] === 'publish') { state.published = npmValue(); state.latest = '1.0.1'; state.versions.push('1.0.1'); return '' }
      if (args[0] === 'dist-tag') { state.latest = '1.0.1'; return '' }
      if (args[0] === 'view') {
        if (state.networkError) throw Object.assign(Error('network unavailable'), { stdout: JSON.stringify({ error: { code: 'E401' } }) })
        const registry = args[args.indexOf('--registry') + 1]
        if (args[2] === 'dist-tags') return JSON.stringify({ latest: registry === mirror && !state.mirrorReady ? '1.0.0' : state.latest })
        if (args[2] === 'versions') return JSON.stringify(state.versions)
        if (!state.published) throw missingNpm()
        return JSON.stringify(state.published)
      }
    }
    if (command === 'gh') {
      if (args[0] === 'api') {
        if (!args[1].includes('/releases/')) return JSON.stringify({ full_name: repo, private: false, permissions: { push: state.writable } })
        if (!state.release) throw Object.assign(Error('not found'), { stderr: 'gh: Not Found (HTTP 404)' })
        return JSON.stringify(state.release)
      }
      if (args[0] === 'release') {
        if (state.failRelease) { state.failRelease = false; throw Error('simulated GitHub outage') }
        state.release = { tag_name: args[2], name: args[args.indexOf('--title') + 1], body: readFileSync(args[args.indexOf('--notes-file') + 1], 'utf8'), draft: false, prerelease: false }
        return ''
      }
    }
    throw Error('Unhandled mock command: ' + JSON.stringify([command, ...args]))
  }
  const invoke = args => runRelease(args, { root, run, now: () => new Date('2026-11-15T10:00:00Z'), report: value => reports.push(value) })
  const mutations = () => calls.filter(([command, verb]) => command === 'git' && verb === 'push' || command === 'npm' && ['publish', 'dist-tag'].includes(verb) || command === 'gh' && verb === 'release')
  return { root, state, calls, reports, invoke, mutations, hash }
}

test('prepare 同步唯一版本、四模块和锁文件，只修改新草稿并填写同一时间', t => {
  const f = fixture(t), old = readFileSync(join(f.root, 'update/changelog-v1.0.0.json'), 'utf8')
  write(join(f.root, 'update/changelog-v1.0.2.json'), log('1.0.2', true))
  f.invoke(['prepare', '1.0.2'])
  for (const path of ['package.json', 'package-lock.json', ...['qq', 'memory', 'mood', 'speak'].map(module => `modules/${module}/package.json`)]) assert.equal(json(join(f.root, path)).version, '1.0.2')
  assert.equal(json(join(f.root, 'package-lock.json')).packages[''].version, '1.0.2')
  assert.equal(json(join(f.root, 'update/changelog-v1.0.2.json')).publishedAt, '2026-11-15T10:00:00.000Z')
  assert.equal(readFileSync(join(f.root, 'update/changelog-v1.0.0.json'), 'utf8'), old)
  assert.equal(f.calls.length, 0)
  assert.throws(() => f.invoke(['prepare', '1.0.0']), /降低版本/)
  assert.throws(() => f.invoke(['prepare', '1.0.2']), /尚未发布/)
})

test('无参数 check 接受当前草稿且没有任何发布、登录、Git 远端操作', t => {
  const f = fixture(t)
  write(join(f.root, 'update/changelog-v1.0.1.json'), log('1.0.1', true))
  assert.equal(f.invoke([]).action, 'check')
  assert.deepEqual(f.calls.map(call => call.slice(0, 2)), [['npm', 'run'], ['npm', 'pack']])
  assert.equal(existsSync(join(f.root, 'local')), false)
})

test('发布读取固定 JSON，精确包与标签、Release 核验后才推 main，双源实际下载', t => {
  const f = fixture(t), result = f.invoke(['publish'])
  assert.equal(result.integrity, f.hash)
  assert.equal(f.state.main, headSha)
  assert.equal(f.state.latest, '1.0.1')
  assert.equal(f.mutations().filter(call => call[0] === 'npm' && call[1] === 'publish').length, 1)
  const mainIndex = f.calls.findIndex(call => call[0] === 'git' && call[1] === 'push' && call[3].endsWith('refs/heads/main'))
  assert.ok(mainIndex > f.calls.findIndex(call => call[0] === 'gh' && call[1] === 'release'))
  assert.ok(f.calls.some(call => call[0] === 'npm' && call[1] === 'pack' && call.includes(official)))
  assert.ok(f.calls.some(call => call[0] === 'npm' && call[1] === 'pack' && call.includes(mirror)))
  const artifactDir = join(f.root, 'local/releases', readdirSync(join(f.root, 'local/releases'))[0])
  assert.equal(json(join(artifactDir, 'manifest.json')).commit, headSha)
  assert.ok(f.state.release.body.includes('本次分类'))
  assert.equal(f.calls.some(call => call.includes('--force')), false)
})

test('GitHub 中途失败可以重跑同一包，不重复 npm 发布，不移动已存在的标签', t => {
  const f = fixture(t)
  f.state.failRelease = true
  assert.throws(() => f.invoke(['publish']), /GitHub outage/)
  assert.equal(f.state.main, rootSha)
  f.invoke(['publish'])
  assert.equal(f.mutations().filter(call => call[0] === 'npm' && call[1] === 'publish').length, 1)
  assert.equal(f.mutations().filter(call => call[0] === 'git' && call[3]?.includes('refs/tags/')).length, 1)
})

test('镜像包存在但 latest 未同步时明确保留正式发布，重试只验证', t => {
  const f = fixture(t)
  f.state.mirrorReady = false
  assert.throws(() => f.invoke(['publish']), /latest 尚未同步/)
  assert.equal(f.state.main, headSha)
  assert.ok(f.reports.some(value => value.includes('正式 GitHub 与 npm 已发布')))
  const mutations = f.mutations().length
  f.state.mirrorReady = true
  f.invoke(['publish'])
  assert.equal(f.mutations().length, mutations)
})

for (const [name, change, expected] of [
  ['脏工作区', state => { state.dirty = ' M package.json' }, /干净/],
  ['浅克隆', state => { state.shallow = 'true' }, /完整历史/],
  ['GitHub 只读账号', state => { state.writable = false }, /写入权限/],
  ['私有仓库', state => { state.remote = 'https://github.com/CHINOSAMAAA/dsh-big-fish-aio-demo.git' }, /正式仓库/],
  ['内测历史', state => { state.rootVersion = '0.7.5' }, /独立快照/],
  ['伪造独立根', state => { state.fakeRootParent = true }, /真实父提交/],
  ['已删除的内测日志历史', state => { state.betaHistory = true }, /Git 历史包含/],
  ['后续混入内测版本提交', state => { state.historyVersion = '0.7.5' }, /内测版本提交/],
  ['npm 包混入内测日志', state => { state.packBeta = true }, /v1.0.0 之前/],
  ['历史日志变化', state => { state.historyChanged = true }, /日志不可修改/],
  ['同版异包', state => { state.published = { name: 'dsh-big-fish-aio', version: '1.0.1', dist: { integrity: 'other' } } }, /内容不同/],
  ['已有较高版本但 latest 已回退', state => { state.versions = ['1.0.0', '1.2.0'] }, /更高正式版本/],
  ['同版异标签', state => { state.tag = 'c'.repeat(40) }, /另一提交/],
  ['鉴权失败不可当成包不存在', state => { state.networkError = true }, /network unavailable/],
]) test('发布预检拒绝：' + name, t => {
  const f = fixture(t)
  change(f.state)
  assert.throws(() => f.invoke(['publish']), expected)
  assert.deepEqual(f.mutations(), [])
})

test('发布拒绝草稿、空分类和错误调用，输入检查先于外部动作', t => {
  const f = fixture(t)
  write(join(f.root, 'update/changelog-v1.0.1.json'), log('1.0.1', true))
  assert.throws(() => f.invoke(['publish']), /publishedAt/)
  const empty = log('1.0.1'); empty.sections[0].items = []
  write(join(f.root, 'update/changelog-v1.0.1.json'), empty)
  assert.throws(() => f.invoke(['publish']), /非空分类/)
  assert.throws(() => f.invoke(['prepare', '1.0.2;evil']), /用法/)
  assert.throws(() => f.invoke(['publish', '--force']), /用法/)
  assert.deepEqual(f.calls, [])
})


test('正式 prepare/check/publish 在任何外部动作前拒绝源码中的内测日志', t => {
  const f = fixture(t)
  write(join(f.root, 'update/changelog-v0.7.5.json'), log('0.7.5', true))
  write(join(f.root, 'update/changelog-v1.0.2.json'), log('1.0.2', true))
  for (const args of [['prepare', '1.0.2'], ['check'], ['publish']]) assert.throws(() => f.invoke(args), /v1.0.0 之前/)
  assert.deepEqual(f.calls, [])
  assert.equal(json(join(f.root, 'package.json')).version, '1.0.1')
  assert.equal(existsSync(join(f.root, 'update/changelog-v0.7.5.json')), true)
})

test('发布拒绝 GIT_GRAFT_FILE 环境覆盖，即使目标文件暂不存在', t => {
  const f = fixture(t), previous = process.env.GIT_GRAFT_FILE
  try {
    process.env.GIT_GRAFT_FILE = join(f.root, 'synthetic-grafts')
    assert.throws(() => f.invoke(['publish']), /GIT_GRAFT_FILE/)
    assert.deepEqual(f.mutations(), [])
  } finally {
    if (previous === undefined) delete process.env.GIT_GRAFT_FILE
    else process.env.GIT_GRAFT_FILE = previous
  }
})
