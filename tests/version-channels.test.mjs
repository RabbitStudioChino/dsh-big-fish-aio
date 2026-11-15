import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createSelfUpdate } from '../lib/selfupdate.mjs'

test('正式 GitHub 与 npm 共用正式版本，忽略内测开发编号', async () => {
  const home = mkdtempSync(join(tmpdir(), 'fish-version-'))
  const root = join(home, 'node_modules', 'dsh-big-fish-aio')
  mkdirSync(root, { recursive: true })
  const original = globalThis.fetch
  let internal = '0.1.1', external = '0.0.1'
  try {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'dsh-big-fish-aio', version: '0.0.1', repositoryVersion: '0.1.1', repository: 'https://github.com/RabbitStudioChino/dsh-big-fish-aio' }))
    globalThis.fetch = async url => Response.json(String(url).includes('api.github.com') ? { object: { sha: 'd'.repeat(40) } } : { name: 'dsh-big-fish-aio', version: external, repositoryVersion: internal, dist: { integrity: 'sha512-' + 'a'.repeat(86) + '==' } })
    const updater = createSelfUpdate({ packageRoot: root })
    assert.equal((await updater.check(true, 'github')).hasUpdate, false)
    assert.equal((await updater.check(true, 'mirror')).hasUpdate, false)
    internal = '0.1.2'
    assert.equal((await updater.check(true, 'github')).hasUpdate, false)
    external = '0.0.2'
    assert.equal((await updater.check(true, 'github')).hasUpdate, true)
    const installed = []
    assert.equal((await updater.install({ pluginManager: { installBundle: async spec => { installed.push(spec); return { applied: true } } } }, 'github', { confirmSourceChange: true })).ok, true)
    assert.deepEqual(installed, ['github:RabbitStudioChino/dsh-big-fish-aio#' + 'd'.repeat(40)])
    assert.equal((await updater.check(true, 'mirror')).hasUpdate, false)
    internal = '0.1.1'; external = '0.0.2'
    assert.equal((await updater.check(true, 'github')).hasUpdate, false)
    assert.equal((await updater.check(true, 'mirror')).hasUpdate, false)
    internal = 'invalid'
    assert.equal((await updater.check(true, 'github')).ok, true)
  } finally { globalThis.fetch = original; rmSync(home, { recursive: true, force: true }) }
})
