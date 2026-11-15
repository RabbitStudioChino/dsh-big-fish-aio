import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, renameSync, unlinkSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createStickers } from '../modules/qq/lib/stickers.mjs'
import { recordSource } from '../modules/qq/lib/memory-sources.mjs'

const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64')
async function fixture() {
  const home = mkdtempSync(join(tmpdir(), 'fish-sticker-tools-'))
  const previous = process.env.DSH_HOME, originalFetch = globalThis.fetch
  const workspace = join(home, 'workspace (shared stickers)'), effects = [], agents = new Map(), sent = []
  const config = { 工作区: 'fish', 总开关: true, 试运行: false, 发图: true, 转私聊: true, 转群: true,
    NapCat: 'http://synthetic.invalid', 拆段间隔毫秒: 0, 绑定: [
      { 类型: '私聊', 号码: '123456', 会话: 'private' },
      { 类型: '群', 号码: '234567', 会话: 'group' },
      { 类型: '群', 号码: '345678', 会话: 'isolated' },
    ] }
  mkdirSync(workspace); mkdirSync(join(home, 'storages'))
  writeFileSync(join(home, 'storages', 'workspace.json'), JSON.stringify({ tables: { workspaces: { fish: { path: workspace } } } }))
  writeFileSync(join(home, 'fish-memory-config.json'), JSON.stringify({ qqIsolatedGroups: ['345678'] }))
  const save = () => writeFileSync(join(home, 'qq-bridge-config.json'), JSON.stringify(config))
  save(); process.env.DSH_HOME = home
  for (const row of config.绑定) recordSource(home, config, '998877', row, 'verified-' + row.会话, ['123456'])
  const addAgent = id => {
    const tools = new Map(), sections = new Map()
    const sp = { section(item) { sections.set(item.name, item); return () => sections.delete(item.name) }, assemble: async () => ({ sections: [...sections.values()] }) }
    const agent = { id, tools, sections, session: { id, snapshotEvents: () => [] }, ctx: {
      get: name => name === 'systemPrompt' ? sp : null,
      tools: { register(tool) { assert.equal(tools.has(tool.name), false); tools.set(tool.name, tool); return () => tools.delete(tool.name) } },
    } }
    agents.set(id, agent)
    return agent
  }
  for (const row of config.绑定) addAgent(row.会话)
  let tick, modelCalls = 0, closed = false
  const ctx = {
    effect(fn) { const off = fn(); if (off) effects.push(off) }, on: () => () => {}, interval(fn) { tick = fn; return () => {} },
    agents: { get: id => agents.get(id), list: () => [...agents.values()] }, sessions: { list: () => [] },
    get(name) { return this[name] }, webServer: { register: () => () => {} },
    llm: { async *stream() { modelCalls++; throw Error('表情库查询不应调用模型') } },
  }
  globalThis.fetch = async (url, options) => {
    const action = String(url).split('/').at(-1)
    if (action.startsWith('send_')) sent.push({ action, body: JSON.parse(options.body) })
    return Response.json({ status: 'ok', retcode: 0, data: action === 'get_login_info' ? { user_id: 998877 } : { messages: [], message_id: 1 } })
  }
  const host = await import('../modules/qq/lib/host.js?sticker-tools=' + home), bridge = host.apply(ctx)
  const lib = createStickers({ home, ctx })
  return { home, workspace, config, save, agents, addAgent, lib, bridge, host, sent,
    async tick() { await tick(); for (let i = 0; i < 10; i++) await new Promise(setImmediate) },
    tool: id => agents.get(id).tools.get('qq_search_stickers'),
    query: (id, args = {}) => agents.get(id).tools.get('qq_search_stickers').execute(args, { agent: agents.get(id) }),
    modelCalls: () => modelCalls,
    close() {
      if (closed) return
      closed = true
      effects.reverse().forEach(off => off()); globalThis.fetch = originalFetch
      if (previous === undefined) delete process.env.DSH_HOME
      else process.env.DSH_HOME = previous
      rmSync(home, { recursive: true, force: true })
    },
  }
}

test('普通群、隔离群和私聊挂载同一表情库查询，独立于自动发送和模型预设', async () => {
  const f = await fixture()
  try {
    f.lib.add({ bytes: gif, name: '开心猫', scope: 'private', source: 'private-source', tags: ['开心'] })
    f.lib.add({ bytes: Buffer.concat([gif, Buffer.from('old')]), name: '历史表情', scope: 'old-group' })
    await f.tick()
    for (const id of f.agents.keys()) {
      const result = await f.query(id)
      assert.equal(result.ok, true); assert.equal(result.total, 2)
      assert.equal(result.items.length, 2)
      assert.ok(result.items.every(item => item.available && item.markdown && !('scope' in item) && !('source' in item)))
      assert.match([...f.agents.get(id).sections.values()][0].text, /共用表情包库.*qq_search_stickers/)
    }
    assert.deepEqual(await f.query('group'), await f.query('private'))
    assert.equal(f.modelCalls(), 0)
    assert.equal((await f.tool('group').execute({}, { agent: f.agents.get('private') })).ok, false)
  } finally { f.close() }
})

test('搜索分页、旧元数据、缺失原图及损坏目录均返回实际状态', async () => {
  const f = await fixture()
  try {
    await f.tick()
    assert.deepEqual((await f.query('group')).items, [])
    for (let i = 0; i < 22; i++) f.lib.add({ bytes: Buffer.concat([gif, Buffer.from(String(i))]), name: '开心猫 ' + i, tags: ['开心'], scenes: ['庆祝'] })
    const first = await f.query('group', { query: '开心 庆祝' })
    assert.equal(first.items.length, 20); assert.equal(first.next_offset, 20)
    const last = await f.query('group', { query: '开心 庆祝', offset: first.next_offset })
    assert.equal(last.items.length, 2); assert.equal(last.next_offset, null)
    assert.equal((await f.query('group', { query: '未命中的词' })).matched, 0)
    const catalog = join(f.home, 'qq-stickers', 'catalog.json'), data = JSON.parse(readFileSync(catalog, 'utf8'))
    const item = data.items[0]; delete item.tags; delete item.scenes
    unlinkSync(join(f.workspace, '表情包', item.id + '.gif'))
    writeFileSync(catalog, JSON.stringify(data))
    const missing = (await f.query('group')).items[0]
    assert.equal(missing.available, false); assert.equal(missing.markdown, null)
    assert.deepEqual(missing.tags, [])
    for (const args of [{ offset: -1 }, { offset: 1.5 }, { query: '词'.repeat(201) }]) assert.equal((await f.query('group', args)).ok, false)
    writeFileSync(catalog, 'broken')
    assert.equal((await f.query('group')).ok, false)
    assert.equal(readFileSync(catalog, 'utf8'), 'broken')
  } finally { f.close() }
})

test('换实例后重挂，解绑和禁用立即拒绝，歧义绑定及卸载撤销查询工具', async () => {
  const f = await fixture()
  try {
    await f.tick(); await f.tick()
    const oldAgent = f.agents.get('group'), oldTool = f.tool('group')
    f.addAgent('group')
    assert.equal((await oldTool.execute({}, { agent: oldAgent })).ok, false)
    await f.tick()
    assert.equal(oldAgent.tools.has('qq_search_stickers'), false)
    assert.ok(f.tool('group'))
    f.config.绑定[1].开 = false; f.save()
    assert.equal((await f.query('group')).ok, false)
    await f.tick(); assert.equal(f.tool('group'), undefined)
    f.config.绑定[1].开 = true
    f.config.绑定.push({ 类型: '群', 号码: '456789', 会话: 'group' }); f.save()
    await f.tick(); assert.equal(f.tool('group'), undefined)
    const privateTool = f.tool('private'), privateAgent = f.agents.get('private')
    f.config.绑定.shift(); f.save()
    assert.equal((await privateTool.execute({}, { agent: privateAgent })).ok, false)
    await f.tick(); assert.equal(f.tool('private'), undefined)
    const isolatedTool = f.tool('isolated'), isolatedAgent = f.agents.get('isolated')
    f.close()
    assert.equal(isolatedAgent.tools.has('qq_search_stickers'), false)
    assert.equal((await isolatedTool.execute({}, { agent: isolatedAgent })).ok, false)
  } finally { f.close() }
})

test('群里按查询结果发送私聊入库的原 GIF，兼容带空格与括号的路径', async () => {
  const f = await fixture()
  try {
    const item = f.lib.add({ bytes: gif, name: '开心[猫]', scope: 'private', tags: ['开心'] })
    const catalog = join(f.home, 'qq-stickers', 'catalog.json'), data = JSON.parse(readFileSync(catalog, 'utf8'))
    data.items[0].fileName = '开心 [猫] (动图).gif'
    const path = join(f.workspace, '表情包', data.items[0].fileName)
    renameSync(join(f.workspace, '表情包', item.id + '.gif'), path)
    writeFileSync(catalog, JSON.stringify(data))
    await f.tick()
    const result = await f.query('group', { query: '开心' }), markdown = result.items[0].markdown
    assert.deepEqual(f.host.抠正文图(markdown).图, [{ kind: 'path', value: path, sticker: true }])
    for (const sid of ['group', 'private', 'isolated']) await f.bridge.发到QQ(f.config, markdown, [], sid)
    assert.deepEqual(f.sent.map(message => message.body.group_id || message.body.user_id), [234567, 123456, 345678])
    for (const message of f.sent) {
      assert.equal(message.body.message[0].data.sub_type, 1)
      assert.deepEqual(Buffer.from(message.body.message[0].data.file.slice(9), 'base64'), gif)
    }
    assert.equal(f.modelCalls(), 0)
  } finally { f.close() }
})


test('群聊与私聊发图回执记录缺失文件、无效图片、后端失败和成功，不触发新轮次', async () => {
  const f = await fixture()
  try {
    const receipts = new Map()
    for (const [id, agent] of f.agents) {
      receipts.set(id, [])
      agent.session.append = (type, message) => receipts.get(id).push({ type, message })
      agent.followup = () => assert.fail('投递回执不得触发模型轮次')
    }
    await f.tick()
    const prompt = [...f.agents.get('group').sections.values()].map(item => item.text).join('\n')
    assert.match(prompt, /web_search.*web_fetch.*read_image/)
    assert.match(prompt, /输出本地图片前先确认文件存在/)
    const missing = join(f.workspace, 'missing.png')
    let result = await f.bridge.发到QQ(f.config, '![图片](<' + missing + '>)', [], 'group')
    assert.equal(result[0].ok, false)
    assert.equal(result[0].action, 'prepare_image')
    assert.equal(f.sent.length, 0)
    const invalid = join(f.workspace, 'invalid.png')
    writeFileSync(invalid, '<html>download failed</html>')
    result = await f.bridge.发到QQ(f.config, '![图片](<' + invalid + '>)', [], 'group')
    assert.equal(result[0].ok, false)
    assert.match(result[0].数据.错, /只接受/)
    assert.equal(f.sent.length, 0)
    const lastReceipt = id => {
      const event = receipts.get(id).at(-1)
      assert.equal(event.type, 'user/message')
      assert.equal(event.message.source.kind, 'runtime-context')
      return JSON.parse(event.message.content[0].text.split('\n').at(-1))
    }
    assert.equal(lastReceipt('group').results[0].ok, false)
    assert.equal(receipts.get('private').length, 0)
    const successfulFetch = globalThis.fetch
    let attempts = 0
    globalThis.fetch = async (url, options) => {
      if (String(url).endsWith('/send_group_msg')) {
        attempts++
        return Response.json({ status: 'failed', retcode: 1200, message: '图片上传失败' })
      }
      return successfulFetch(url, options)
    }
    result = await f.bridge.发到QQ(f.config, '![图片](https://example.com/image.png)', [], 'group')
    assert.equal(result[0].ok, false)
    assert.equal(attempts, 1)
    assert.equal(lastReceipt('group').results[0].error, '图片上传失败')
    globalThis.fetch = successfulFetch
    const item = f.lib.add({ bytes: gif, name: '共享动图' })
    const markdown = (await f.query('group')).items.find(row => row.id === item.id).markdown
    for (const id of ['group', 'private']) {
      result = await f.bridge.发到QQ(f.config, markdown, [], id)
      assert.ok(result.every(row => row.ok))
      assert.equal(lastReceipt(id).results[0].ok, true)
      assert.equal(lastReceipt(id).target.type, id === 'group' ? '群' : '私聊')
    }
    assert.equal(f.modelCalls(), 0)
  } finally { f.close() }
})
