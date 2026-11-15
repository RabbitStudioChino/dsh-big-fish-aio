import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, renameSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { createStickers } from '../modules/qq/lib/stickers.mjs'

const gif = Buffer.from('R0lGODlhAgACAIEAAP8AAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAAAgACAAAIBgABCAQQEAAh+QQBCgABACwAAAAAAgACAIEAAP8AAAAAAAAAAAAIBgABCAQQEAA7', 'base64')
const otherGif = Buffer.from('R0lGODlhAgACAIEAAP8AAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAAAgACAAAIBgABCAQQEAAh+QQBCgABACwAAAAAAgACAIEAgAAAAAAAAAAAAAAIBgABCAQQEAA7', 'base64')
const preview = Buffer.from('UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoCAAIAAUAmJaACdLoB+AADsAD+8ut//NgVzXPv9//S4P0uD9Lg/9KQAAA=', 'base64')

async function fixture() {
  const home = mkdtempSync(join(tmpdir(), 'fish-gif-original-')), previous = process.env.DSH_HOME, originalFetch = globalThis.fetch
  const workspace = join(home, 'workspace'), cleanups = [], sent = [], logs = []
  const config = { 工作区: 'fish', 总开关: true, 试运行: false, 发图: true, 图片存储: false, 转私聊: true,
    NapCat: 'http://synthetic.invalid', 拆段间隔毫秒: 0, 绑定: [{ 类型: '私聊', 号码: '123456', 会话: 'gif-session' }] }
  const hash = createHash('sha256').update(preview).digest('hex')
  const path = join(home, 'attachments', 'v1', 'objects', hash.slice(0, 2), hash)
  const ref = { attachmentId: 'sha256:' + hash, mediaType: 'image/webp', width: 2, height: 2, bytes: preview.length }
  mkdirSync(workspace); mkdirSync(join(home, 'storages')); mkdirSync(join(home, 'attachments', 'v1', 'objects', hash.slice(0, 2)), { recursive: true })
  writeFileSync(path, preview)
  writeFileSync(join(home, 'storages', 'workspace.json'), JSON.stringify({ tables: { workspaces: { fish: { path: workspace } } } }))
  const save = patch => { Object.assign(config, patch); writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify(config)) }
  save({}); process.env.DSH_HOME = home
  let admitted = 0, waitForNormalization = null
  const ctx = {
    effect(fn) { const off = fn(); if (off) cleanups.push(off) }, on: () => () => {}, interval: () => () => {},
    agents: { list: () => [] }, sessions: { list: () => [] }, webServer: { register: () => () => {} }, logger: { info: text => logs.push(text) },
    get(name) { return this[name] },
    attachments: {
      async admitPromptContent(content) {
        admitted++
        if (waitForNormalization) await waitForNormalization
        return content.map(part => part.type === 'image' ? { type: 'image', attachment: ref } : part)
      },
      imageHostPath: () => path,
    },
  }
  globalThis.fetch = async (url, options) => {
    assert.ok(String(url).startsWith(config.NapCat + '/'))
    if (String(url).endsWith('/send_private_msg')) sent.push(JSON.parse(options.body))
    return Response.json({ status: 'ok', data: { user_id: 998877, message_id: 1 } })
  }
  const { apply } = await import('../modules/qq/lib/host.js?gif=' + home)
  const bridge = apply(ctx)
  const create = () => createStickers({ home, ctx, log: text => logs.push(text) })
  const lib = create(), item = lib.add({ bytes: gif, name: '两帧 GIF', scope: 'gif-session' })
  return { home, workspace, config, save, path, ref, lib, item, bridge, create, sent, logs, admitted: () => admitted,
    wait: promise => { waitForNormalization = promise },
    close() {
      cleanups.reverse().forEach(off => off()); globalThis.fetch = originalFetch
      if (previous === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = previous
      rmSync(home, { recursive: true, force: true })
    },
  }
}

test('图片存储关闭时，历史 Markdown 和图片附件均发送表情库的原 GIF 字节', async () => {
  const f = await fixture()
  try {
    await f.bridge.发到QQ(f.config, '![表情包：动图](' + f.path + ')', [], 'gif-session')
    await f.bridge.发到QQ(f.config, '', [{ type: 'image', name: '表情包：动图', attachment: f.ref }], 'gif-session')
    assert.equal(f.sent.length, 2)
    for (const message of f.sent) {
      const image = message.message[0]
      assert.deepEqual(Buffer.from(image.data.file.slice(9), 'base64'), gif)
      assert.equal(image.data.sub_type, 1)
      assert.equal(image.data.summary, '[动画表情]')
    }
    assert.equal(f.admitted(), 1, '索引后的重复回发无需再次归一化')
    assert.equal(existsSync(join(f.workspace, 'QQ图片')), false)
    assert.equal(existsSync(join(f.home, 'qq-bridge-received.json')), false)
    assert.deepEqual(readFileSync(f.path), preview)
    assert.deepEqual(readFileSync(join(f.workspace, '表情包', f.item.id + '.gif')), gif)
  } finally { f.close() }
})

test('关联持久保存，素材改名和重建服务后仍可恢复，删除后不复活原件', async () => {
  const f = await fixture()
  try {
    await f.lib.originalForAttachment(f.path)
    const catalog = join(f.home, 'qq-stickers', 'catalog.json'), data = JSON.parse(readFileSync(catalog, 'utf8'))
    assert.deepEqual(data.items[0].attachmentAliases.ids, [f.ref.attachmentId])
    const name = '改名后的动图.gif'
    renameSync(join(f.workspace, '表情包', f.item.id + '.gif'), join(f.workspace, '表情包', name))
    data.items[0].fileName = name; writeFileSync(catalog, JSON.stringify(data))
    const reloaded = f.create()
    assert.equal(await reloaded.originalForAttachment(f.path), join(f.workspace, '表情包', name))
    assert.equal(f.admitted(), 1)
    reloaded.remove(f.item.id)
    assert.equal(await reloaded.originalForAttachment(f.path), '')
    assert.equal(existsSync(join(f.workspace, '表情包', name)), false)
  } finally { f.close() }
})

test('同一静态预览存在不同 GIF 原件时，拒绝任意选取或回退成静态图片', async () => {
  const f = await fixture()
  try {
    f.lib.add({ bytes: otherGif, name: '另一段动画' })
    await assert.rejects(f.lib.originalForAttachment(f.path), /多个不同 GIF/)
    await f.bridge.发到QQ(f.config, '![表情包：动图](' + f.path + ')', [], 'gif-session')
    assert.equal(f.sent.length, 0)
    assert.ok(f.logs.some(text => text.includes('多个不同 GIF')))
  } finally { f.close() }
})

test('关联期间删除或替换素材，不返回过期原件；普通路径不触发归一化', async () => {
  const f = await fixture(); let release
  try {
    assert.equal(await f.lib.originalForAttachment(join(f.workspace, '表情包', f.item.id + '.gif')), '')
    assert.equal(f.admitted(), 0)
    f.wait(new Promise(resolve => { release = resolve }))
    const pending = f.lib.originalForAttachment(f.path)
    await new Promise(setImmediate)
    f.lib.remove(f.item.id); release()
    assert.equal(await pending, '')
    assert.equal(f.lib.view().items.length, 0)
    f.wait(null)
    const added = f.lib.add({ bytes: gif })
    f.wait(new Promise(resolve => { release = resolve }))
    const replaced = f.lib.originalForAttachment(f.path)
    await new Promise(setImmediate)
    writeFileSync(join(f.workspace, '表情包', added.id + '.gif'), otherGif)
    release()
    assert.equal(await replaced, '')
  } finally { release?.(); f.close() }
})

test('回查原图期间关闭总开关，取消本轮 QQ 发送', async () => {
  const f = await fixture(); let release
  try {
    f.wait(new Promise(resolve => { release = resolve }))
    const pending = f.bridge.发到QQ({ ...f.config }, '![表情包：动图](' + f.path + ')', [], 'gif-session')
    for (let i = 0; i < 100 && !f.admitted(); i++) await new Promise(setImmediate)
    assert.equal(f.admitted(), 1)
    f.save({ 总开关: false }); release(); await pending
    assert.equal(f.sent.length, 0)
  } finally { release?.(); f.close() }
})
