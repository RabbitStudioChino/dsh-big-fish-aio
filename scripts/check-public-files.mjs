import assert from 'node:assert/strict'
import { execFileSync, execSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { assertFormalFiles } from './release-policy.mjs'

// .gitignore cannot protect an already tracked file, so check the index explicitly.
const candidates = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' })
  .split('\0').filter(Boolean)
const meta = JSON.parse(readFileSync('package.json', 'utf8'))
assertFormalFiles(meta.version, candidates)
const ignored = paths => {
  const result = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
    input: paths.join('\0') + '\0', encoding: 'utf8',
  })
  if (result.error) throw result.error
  assert.ok(result.status === 0 || result.status === 1, result.stderr)
  return result.stdout.split('\0').filter(Boolean)
}
const privateFiles = ignored(candidates)
assert.equal(privateFiles.length, 0, 'Private files are tracked: ' + privateFiles.join(', '))
const files = candidates.filter(path => existsSync(path))

// A fixed command works with npm.cmd on Windows as well; no input enters the shell.
const [pack] = JSON.parse(execSync('npm pack --dry-run --ignore-scripts --json', {
  encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
}))
const paths = pack.files.map(file => file.path)
assertFormalFiles(meta.version, paths)
const publicFiles = new Set(files)
assert.deepEqual(paths.filter(path => !publicFiles.has(path)), [], 'Package contains an ignored or unreviewed file')
assert.deepEqual(ignored(paths), [], 'Package contains private files')
assert.deepEqual(paths.filter(path => /(^|\/)(?:tests?|local|private|artifacts|\.github)(\/|$)/.test(path)), [], 'Package contains development material')
console.log(`Public-file check passed: ${files.length} repository files, ${paths.length} package files.`)
