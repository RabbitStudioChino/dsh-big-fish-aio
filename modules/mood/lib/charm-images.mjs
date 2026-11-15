import { mkdirSync, readFileSync, statSync, rmSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { imageType } from '../../qq/lib/stickers.mjs'
import { writeFileAtomicSync } from '../../qq/lib/atomic-file.mjs'

export const MAX_CHARM_BYTES = 4 * 1024 * 1024
const defaults = { great: 'feiyu-great.png', good: 'feiyu-good.png', ok: 'feiyu.png', worry: 'feiyu-worry.png', sad: 'feiyu-sad.png' }
const mediaTypes = { png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }

export function createCharmImages(home) {
  const directory = join(home, 'feiyu-mood', 'charm-images')
  const path = (tier, kind = 'body', extension = 'image') => {
    if (!Object.hasOwn(defaults, tier)) throw new Error('无效的心情档位')
    if (!['body', 'face'].includes(kind)) throw new Error('无效的图片类型')
    return join(directory, (kind === 'face' ? 'face-' : '') + tier + '.' + extension)
  }
  const reference = (tier, kind) => {
    let saved
    try { saved = JSON.parse(readFileSync(path(tier, kind, 'json'), 'utf8')) }
    catch (error) { if (error.code === 'ENOENT') return null; throw error }
    if (!/^[a-f0-9]{64}\.(png|jpg|gif|webp)$/.test(saved?.file)) throw new Error('挂饰图片引用无效')
    return saved.file
  }
  const cleanup = file => {
    if (!file) return
    for (const kind of ['body', 'face']) {
      for (const tier of Object.keys(defaults)) {
        if (reference(tier, kind) === file) return
      }
    }
    rmSync(join(directory, file), { force: true })
  }
  const list = (kind = 'body') => Object.fromEntries(Object.entries(defaults).map(([tier, file]) => {
    try {
      const saved = reference(tier, kind)
      const stats = statSync(saved ? join(directory, saved) : path(tier, kind), { bigint: true })
      const version = saved ? saved.split('.')[0] : String(stats.mtimeNs)
      return [tier, { custom: true, url: '/dsh-feiyu-mood/charm-image?tier=' + tier + '&kind=' + kind + '&v=' + version }]
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      return [tier, { custom: false, url: '/dsh-feiyu-mood/' + (kind === 'face' ? 'face-' + tier + '.png' : file) }]
    }
  }))
  const save = (tier, bytes, kind = 'body') => {
    const target = path(tier, kind, 'json')
    if (!bytes.length || bytes.length > MAX_CHARM_BYTES) throw new Error('图片文件须为 1 字节至 4 MB')
    const type = imageType(bytes)
    const file = createHash('sha256').update(bytes).digest('hex') + '.' + type
    const previous = reference(tier, kind)
    mkdirSync(directory, { recursive: true })
    if (!existsSync(join(directory, file))) writeFileAtomicSync(join(directory, file), bytes)
    if (previous !== file) writeFileAtomicSync(target, JSON.stringify({ file }))
    rmSync(path(tier, kind), { force: true })
    if (previous !== file) cleanup(previous)
    return list(kind)
  }
  // 将旧的逐档图片迁为内容寻址文件，先保存引用再移除原件。
  for (const kind of ['body', 'face']) {
    for (const tier of Object.keys(defaults)) {
      const legacy = path(tier, kind)
      if (!existsSync(legacy)) continue
      const saved = reference(tier, kind)
      if (saved && existsSync(join(directory, saved))) rmSync(legacy)
      else save(tier, readFileSync(legacy), kind)
    }
  }
  return {
    list,
    save,
    reset(tier, kind = 'body') {
      const previous = reference(tier, kind)
      rmSync(path(tier, kind, 'json'), { force: true })
      rmSync(path(tier, kind), { force: true })
      cleanup(previous)
    },
    read(tier, kind = 'body') {
      const saved = reference(tier, kind)
      const bytes = readFileSync(saved ? join(directory, saved) : path(tier, kind))
      return { bytes, contentType: mediaTypes[imageType(bytes)] }
    },
  }
}
