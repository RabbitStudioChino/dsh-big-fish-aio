globalThis.useFishAutosave = save => ({ onBlurCapture: save, onChangeCapture: save })
// 「通到 QQ」网页半边冒烟测试 —— 用假的 React / 假的 slots 把设置页渲染成一棵对象树。
// 验：模块 id、inject、挂到 settings.section（id=qq-bridge 是 slot id，跟包名无关）、关键元素都渲染出来、不抛错。
// 跑法： node tests/web.mjs

let 捕获 = null
globalThis.window = { __ModuleLoader__: { load: (o) => { 捕获 = o } } }

globalThis.fetch = async (url) => {
  return {
    json: async () => ({
      ok: true, 版本: '0.1.0',
      配置: {
    总开关: false, 试运行: true, NapCat: 'http://127.0.0.1:3000', 令牌: '',
    绑定: [{ 类型: '私聊', 号码: '123', 会话: 'session-X', 称呼: '小明' }],
    收图: true, 发图: true, 收图最多: 4, 图上限MB: 5, 图片根目录: '',
  },
      NapCat状态: { 用户: 10001, 昵称: '测试号' },
      活着的会话: [{ id: 'session-X', 标题: '测试会话' }],
      目标情况: [],
      日志: [{ 时间: '01-01 00:00:00', 文本: '已装好' }],
    }),
  }
}

let 状态槽 = []
let 下标 = 0
let 引用槽 = [], 引用下标 = 0, 上次状态槽
const 造React = () => ({
  createElement: (t, p, ...kids) => ({ t, p: p || {}, kids: kids.flat(9).filter((k) => k !== null && k !== undefined && k !== false) }),
  useState: (init) => {
    const i = 下标++
    if (i === 0) {
      引用下标 = 0
      if (上次状态槽 !== 状态槽) { 引用槽 = []; 上次状态槽 = 状态槽 }
    }
    if (!(i in 状态槽)) 状态槽[i] = init
    return [状态槽[i], (v) => { 状态槽[i] = typeof v === 'function' ? v(状态槽[i]) : v }]
  },
  useEffect: () => {},
  useCallback: (f) => f,
  useRef: (v) => 引用槽[引用下标++] ||= { current: v },
})
const 假require = (n) => {
  if (n === 'react') return 造React()
  throw new Error('不该 require 这个：' + n)
}

await import(new URL('../lib/client.js', import.meta.url).href)

const exports = 捕获.factory(假require)
let 挂了 = 0
const 报 = (标签, 过, 详情) => { if (!过) 挂了++; console.log(`${过 ? 'PASS' : 'FAIL'}  ${标签}${详情 ? '  :: ' + 详情 : ''}`) }

报('模块 id = dsh-qq-link', 捕获.id === 'dsh-qq-link', 捕获.id)
报('inject 只依赖 slots', Array.isArray(exports.inject) && exports.inject.join() === 'slots')

let 注册 = null
let 组件 = null
const slots = {
  inject: (n, cb) => { if (n !== 'settings.section') throw new Error('槽位名不对：' + n); cb() },
  register: (d, c) => { 注册 = d; 组件 = c; return () => {} },
}
exports.apply({ get: (n) => (n === 'slots' ? slots : undefined) })
报('挂到 settings.section，id = qq-bridge', 注册 !== null && 注册.id === 'qq-bridge' && 注册.name === 'settings.section', JSON.stringify(注册))

// 预先填好「已经读到状态」的第一格（体），这样不用等 useEffect 拉数据，组件一次渲染就出整页
const 初始态 = {
  ok: true, 版本: '0.1.0',
  配置: { 总开关: false, 试运行: true, 目标会话: '', 私聊会话: '', 群会话: '', 私聊QQ: '', 群号: '', 转私聊: true, 转群: false, NapCat: 'http://127.0.0.1:3000',
    允许发空间动态: false, 空间定时发: [{ 时: '09:30', 权: 1, 开: true }], 空间看圈开: false, 空间看圈分: 30, 空间点赞开: false, 空间评论开: false,
    绑定: [{ 类型: '群', 号码: '123456', 会话: 'session-X', 称呼: '群里的人' }] },
  NapCat状态: { 用户: 10001, 昵称: '测试号' },
  活着的会话: [{ id: 'session-X', 标题: '测试会话' }],
  目标情况: [],
  日志: [{ 时间: '01-01 00:00:00', 文本: '已装好' }],
}
下标 = 0
状态槽 = [初始态]
const 树 = 组件()
const 可见文 = node => JSON.stringify(node, (key, value) => value?.p?.hidden ? undefined : value)
const 文 = 可见文(树)
报('不显示配置状态虚线框', !文.includes('fish-toolbar'))
const 要有 = ['连接', '绑定', '发送测试消息']
const 缺 = 要有.filter((x) => !文.includes(x))
报('关键元素都渲染出来（含连接状态 + 目标会话标题）', 缺.length === 0, 缺.length ? '缺：' + 缺.join('、') : 文.length + ' 字节')

// ⭐ 1.1.0：点进「绑定」页 —— 人设卡、那一列「单独」都得出来
const 找按钮 = (节点, 文字) => {
  if (!节点 || typeof 节点 !== 'object' || 节点.p?.hidden) return null
  if (Array.isArray(节点)) {
    for (const x of 节点) {
      const r = 找按钮(x, 文字)
      if (r) return r
    }
    return null
  }
  if (Array.isArray(节点.kids) && 节点.kids.includes(文字) && 节点.p && typeof 节点.p.onClick === 'function') return 节点
  return 找按钮(节点.kids, 文字)
}
const 绑定钮 = 找按钮(树, '绑定')
报('能找到统一配置入口', Boolean(绑定钮))
if (绑定钮) {
  绑定钮.p.onClick()
  下标 = 0
  const 树2 = 组件()
  const 文2 = 可见文(树2)
  const 要有2 = ['私聊映射', '群聊映射', '角色设定']
  const 缺2 = 要有2.filter((x) => !文2.includes(x))
  报('绑定行保留收发开关与私聊 / 群聊分组',
    文2.includes('启用收发') && !文2.includes('输入此会话的角色设定。'), '')
  报('绑定页分成私聊 / 群聊两张表', 缺2.length === 0, 缺2.length ? '缺：' + 缺2.join('、') : 文2.length + ' 字节')
  const 人设钮 = 找按钮(树2, '角色设定')
  报('找到独立的全角色设定页签', Boolean(人设钮))
  if (人设钮) {
    人设钮.p.onClick()
    下标 = 0
    const 人设文 = 可见文(组件())
    const 要有3 = ['大肥鱼专业代写', '全局角色设定', '私聊角色设定', '群聊角色设定']
    const 缺3 = 要有3.filter((x) => !人设文.includes(x))
    报('全局角色设定作为独立页签保留', 缺3.length === 0, 缺3.length ? '缺：' + 缺3.join('、') : 人设文.length + ' 字节')
  }
}

// ⭐ 1.5.0：页签改成 总览 / 绑定 / 消息 / 空间 / 门槛 / 更新，六个都得在
const 页签名们 = ['连接', '绑定', '消息策略', '角色设定', 'QQ 账号', 'QQ 空间', '表情包', '语音转写', '语音发送', '图片与文件']
const 缺页签 = 页签名们.filter((名) => !找按钮(树, 名))
报('十一个功能页签完整，常用设置直接可见', 缺页签.length === 0,
  缺页签.length ? '缺：' + 缺页签.join('、') : 页签名们.join(' / '))

// 图片与文件页：接收在顶、生成在中、文件在底，不暴露手动发送或存储入口。
找按钮(树, '图片与文件').p.onClick()
下标 = 0
const 图片树 = 组件(), 图片文 = 可见文(图片树)
const 位置 = (文字) => 图片文.indexOf(文字)
报('图片与文件页把接收放在顶部、文件放在底部', 位置('QQ 图片接收') >= 0 && 位置('DSH 生成图片转发') > 位置('QQ 图片接收')
  && 位置('发送文件（DSH → QQ）') > 位置('DSH 生成图片转发') && !图片文.includes('转写语音') && !找按钮(图片树, '发送图片到 QQ'))
报('文件转发与 QQ 文件接收分区独立', 图片文.includes('DSH 生成文件转发') && 图片文.includes('QQ 文件接收') && 图片文.includes('接收文件（QQ → DSH）') && 图片文.includes('接收单文件上限（MB）') && 图片文.includes('每次最多接收文件'))
报('图片和文件均有独立存储开关', 图片文.includes('开启图片存储') && 图片文.includes('开启文件存储'))
找按钮(树, '语音转写').p.onClick()
下标 = 0
const 语音树 = 组件(), 语音文 = 可见文(语音树)
报('独立语音页保留转写与安装设置', ['转写语音','语音识别环境','生成转写命令'].every(x => 语音文.includes(x)) && !语音文.includes('DSH 生成图片转发'))

找按钮(树, '语音发送').p.onClick()
下标 = 0
const 树语音发送 = 组件()
const 文语音发送 = 可见文(树语音发送)
const 找语音发送开关 = (节点, 出 = []) => {
  if (!节点 || typeof 节点 !== 'object' || 节点.p?.hidden) return 出
  if (Array.isArray(节点)) {
    for (const x of 节点) 找语音发送开关(x, 出)
    return 出
  }
  if (节点.t === 'input' && 节点.p?.['aria-label'] === '发送语音（QQ → DSH）') 出.push(节点)
  找语音发送开关(节点.kids, 出)
  return 出
}
const 发送开关 = 找语音发送开关(树语音发送)
报('语音发送页只有禁用的发送开关和暂不可用提示',
  文语音发送.includes('发送语音（QQ → DSH）')
    && 文语音发送.includes('目前服务暂不可用')
    && 发送开关.length === 1
    && 发送开关[0].p.disabled === true)

报('图片与文件排在最后', 页签名们.indexOf('图片与文件') === 页签名们.length - 1)
报('语音转写紧跟在表情包之后', 页签名们.indexOf('语音转写') === 页签名们.indexOf('表情包') + 1)
报('语音发送排在语音转写之后', 页签名们.indexOf('语音发送') === 页签名们.indexOf('语音转写') + 1)

// 通用查找：按类型 + 属性找控件（input 的 type / select 之类）
const 找控件 = (节点, 条件, 出 = []) => {
  if (!节点 || typeof 节点 !== 'object' || 节点.p?.hidden) return 出
  if (Array.isArray(节点)) {
    for (const x of 节点) 找控件(x, 条件, 出)
    return 出
  }
  if (条件(节点)) 出.push(节点)
  找控件(节点.kids, 条件, 出)
  return 出
}

状态槽 = [初始态]
下标 = 0
const 历史树 = 组件({ page: '历史导入', embedded: true, onPageChange: () => {} })
const 历史文 = JSON.stringify(历史树)
报('历史导入有三种入口且不再保留预览与恢复页', ['OneBot JSON', 'QQ 官方 TXT', '导入文件', '读取后端', '导入列表', 'AI 对应的 QQ'].every(t => 历史文.includes(t)) && !/预览文件|等待记录预览|恢复任务|50 MB/.test(历史文))
报('导出说明位于页面最下方且不使用卡片', 找控件(历史树, n => n.p.className === 'qq-history-page')[0].kids.at(-1).p.className === 'qq-history-export')
报('文件选择支持 OneBot JSON / TXT / BAK 提示但不宣传 QCE', 找控件(历史树, n => n.t === 'input' && n.p.type === 'file').some(n => n.p.accept === '.json,.txt,.bak') && !历史文.includes('QCE'))
报('文件入口简要说明历史 API、保存响应和多页合并', ['如何导出 OneBot JSON', 'get_group_msg_history', 'get_friend_msg_history', 'UTF-8 .json', '合并 data.messages'].every(t => 历史文.includes(t)))

// ⭐ 1.5.0：「消息」页不再有「QQ 空间」那张卡（搬到「空间」页了）
const 消息钮 = 找按钮(树, '消息策略')
报('消息设置可从配置页访问', Boolean(消息钮))
if (消息钮) {
  消息钮.p.onClick()
  下标 = 0
  const 树3 = 组件()
  const 文3 = 可见文(树3)
  const 要有3 = ['发送格式', '接收与合并']
  const 缺3 = 要有3.filter((x) => !文3.includes(x))
  报('配置页保留全部消息与媒体设置', 缺3.length === 0, 缺3.length ? '缺：' + 缺3.join('、') : 文3.length + ' 字节')
  报('消息策略页不混入空间、频率与门槛设置', !文3.includes('允许发布 QQ 空间动态') && !文3.includes('逐群读取规则') && 文3.includes('未通过门槛时终止推理'))
}

// ⭐ 1.5.0：「空间」页四张卡的关键控件
const 空间钮 = 找按钮(树, 'QQ 空间')
报('空间设置可从配置页访问', Boolean(空间钮))
if (空间钮) {
  空间钮.p.onClick()
  下标 = 0
  const 树4 = 组件()
  const 文4 = 可见文(树4)
  const 要有4 = ['允许发布 QQ 空间动态', '浏览动态与评论', '定时发布', '可见范围', '所有人', '好友', '仅自己',
    '同步间隔（分钟）', '自动点赞', '递送动态给模型（评论提醒）']
  const 缺4 = 要有4.filter((x) => !文4.includes(x))
  报('空间区域保留全部关键控件', 缺4.length === 0, 缺4.length ? '缺：' + 缺4.join('、') : 文4.length + ' 字节')
  报('手动发布说说卡片已删除', !文4.includes('发布说说') && !文4.includes('发布到 QQ 空间'))
  报('定时条目保留时间、可见范围、开关与删除操作',
    Boolean(找控件(树4, (n) => n.t === 'input' && n.p.type === 'time').length)
      && Boolean(找控件(树4, (n) => n.t === 'select').length)
      && Boolean(找控件(树4, (n) => n.t === 'input' && n.p.type === 'checkbox').length)
      && Boolean(找按钮(树4, '删除')))
  const 数字框 = 找控件(树4, (n) => n.t === 'input' && n.p.type === 'number')
  报('看圈分钟是个 5～1440 的数字框', 数字框.some((n) => String(n.p.min) === '5' && String(n.p.max) === '1440'),
    JSON.stringify(数字框.map((n) => [n.p.min, n.p.max])))
  报('空间开关统一使用 switch 语义', 找控件(树4, n => n.t === 'input' && n.p.type === 'checkbox').every(n => n.p.role === 'switch'))
  报('点赞 / 评论是两个 checkbox（默认都不勾）', 找控件(树4, (n) => n.t === 'input' && n.p.type === 'checkbox' && n.p.checked === false).length >= 2)

  // 浏览开关关闭时隐藏手动浏览卡片，但不影响其他空间设置。
  状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 空间浏览开: false } }, false, false, '', 'QQ 空间']
  下标 = 0
  const 树隐藏浏览 = 组件()
  报('浏览动态与评论关闭后隐藏浏览卡片', !找按钮(树隐藏浏览, '查看好友动态'))

  // 定时表空着的时候要有一句提示（另起一次渲染，配置里清空）
  状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 空间定时发: [] } }, false, false, '', 'QQ 空间']
  下标 = 0
  const 树空 = 组件()
  报('空列表显示添加提示',
    可见文(树空).includes('暂无条目，请添加。'))
}

// ⭐ 1.5.0：「门槛」页里「转发进来会变成什么样」那张卡整块删掉了
const 门槛钮 = 找按钮(树, '消息策略')
报('回复门槛可从配置页访问', Boolean(门槛钮))
if (门槛钮) {
  状态槽[0] = { ...状态槽[0], 配置: { ...状态槽[0].配置, 群聊统一规则: { 门槛: true } } }
  门槛钮.p.onClick()
  下标 = 0
  const 树5 = 组件()
  const 文5 = 可见文(树5)
  const 要有5 = ['回复门槛', '点名后续接收上限（条）', '点名后续接收时限（秒）']
  const 缺5 = 要有5.filter((x) => !文5.includes(x))
  报('群聊区域保留后续消息数量及时限设置', 缺5.length === 0, 缺5.length ? '缺：' + 缺5.join('、') : 文5.length + ' 字节')
  报('门槛页里没有「转发进来会变成什么样」了', !文5.includes('转发进来会变成什么样'))
  报('回复门槛不再保留全局接收全部群消息开关', !找控件(树5, n => ['接收全部群消息', '群聊接收范围'].includes(n.p['aria-label'])).length)
}


// 历史导入：原始文件直传，确认后进入列表，暂停后继续写入同一记忆库。
状态槽 = [初始态]
const 渲历史 = () => { 下标 = 0; return 组件({ page: '历史导入', embedded: true, onPageChange: () => {} }) }
const 选历史来源 = label => 找控件(渲历史(), n => n.p['aria-label'] === label)[0].p.onClick()
找控件(渲历史(), n => n.p['aria-label'] === '历史导入绑定')[0].p.onChange({ target: { value: '0' } })
let 读取文件 = false
const 大文件 = { name: 'large.json', size: 600 * 1024 * 1024, arrayBuffer: async () => { 读取文件 = true; throw Error('不应整文件读取') } }
找控件(渲历史(), n => n.p.type === 'file')[0].p.onChange({ target: { files: [大文件] } })
const 历史请求们 = []
let 工作区模式 = true, 写入失败 = true, 等待分析 = false, 返回分析
let 任务 = { id: 'a'.repeat(64), session: 'session-X', binding: { 类型: '群', 号码: '123456' }, filename: 'large.json',
  createdAt: '2026-11-15T08:00:00Z', count: 2, duplicates: 0, format: 'OneBot JSON', start: null, end: null, total: 2, completed: 0, done: false }
const 旧任务 = { ...任务, id: 'b'.repeat(64), filename: 'older.json', completed: 2, done: true, createdAt: '2026-11-14T08:00:00Z' }
globalThis.fetch = async (url, options = {}) => {
  const path = String(url), upload = options.headers?.['x-qq-history-meta']
  const body = upload ? JSON.parse(decodeURIComponent(upload)) : options.body ? JSON.parse(options.body) : null
  历史请求们.push({ path, body, file: upload ? options.body : null })
  let data
  if (path.endsWith('/history/jobs')) data = { ok: true, jobs: [任务, 旧任务] }
  else if (path.endsWith('/history/prepare') || path.endsWith('/history/upload')) data = { ok: true, job: 任务 }
  else if (path.endsWith('/dsh-fish-memory/list')) data = { ok: true, 全局开关: true, 模式: 工作区模式 ? 'workspace' : 'session', sessions: [{ id: 'session-X', enabled: true }] }
  else if (path.endsWith('/history/analyze')) {
    if (等待分析) await new Promise(resolve => { 返回分析 = resolve })
    任务 = { ...任务, pending: true }
    data = { ok: true, pending: { token: 'token', items: [{ text: '记忆', importance: 0.5 }] }, job: 任务 }
  } else if (path.endsWith('/dsh-fish-memory/import/apply')) data = 写入失败 ? { ok: false, message: '模拟写入失败' } : { ok: true, added: 1 }
  else if (path.endsWith('/history/commit')) {
    任务 = { ...任务, pending: false, completed: 任务.completed + 1, done: 任务.completed + 1 === 任务.total }
    data = { ok: true, job: 任务 }
  } else throw new Error('不该请求的地址：' + path)
  return { ok: true, json: async () => data }
}
await 找按钮(渲历史(), '确认').p.onClick()
报('超过 50 MB 的文件原样上传而不整文件解码', !读取文件 && 历史请求们.find(x => x.path.endsWith('/upload'))?.file === 大文件)
报('确认后跳转导入列表且不自动调用模型', 找控件(渲历史(), n => n.p['aria-label'] === '导入列表')[0].p['aria-pressed'] === true && !历史请求们.some(x => x.path.endsWith('/analyze')))
const 列表记录 = 找控件(渲历史(), n => n.p.className === 'qq-history-job')
报('列表按接口顺序显示全部记录与已完成状态', 列表记录.length === 2 && 列表记录[0].p['aria-label'].includes('large.json') && JSON.stringify(列表记录[1]).includes('已完成'))
await 找按钮(渲历史(), '开始分析').p.onClick()
报('缺少独立目标库的旧任务不在工作区共享模式导入', !历史请求们.some(x => x.path.endsWith('/analyze')) && JSON.stringify(渲历史()).includes('缺少独立目标记忆库'))
任务.memoryStoreId = 'qq_10001_group_123456'
await 找按钮(渲历史(), '开始分析').p.onClick()
报('已验证QQ目标库的任务在工作区模式也能导入', 历史请求们.some(x => x.path.endsWith('/import/apply') && x.body.storeId === 任务.memoryStoreId))
报('写入失败不确认导入进度', !历史请求们.some(x => x.path.endsWith('/commit')) && JSON.stringify(渲历史()).includes('模拟写入失败'))
等待分析 = true
const 分析中 = 找按钮(渲历史(), '继续分析').p.onClick()
await new Promise(setImmediate)
找按钮(渲历史(), '中断分析').p.onClick()
返回分析(); await 分析中
报('中断保留待写入段且可以继续', !历史请求们.some(x => x.path.endsWith('/commit')) && Boolean(找按钮(渲历史(), '继续分析')) && JSON.stringify(渲历史()).includes('已暂停'))
等待分析 = false; 写入失败 = false
await 找按钮(渲历史(), '继续分析').p.onClick()
报('继续分析完整处理两段，记忆只发给所选会话', 任务.done && 任务.completed === 2 && 历史请求们.filter(x => x.path.endsWith('/import/apply')).every(x => x.body.session === 'session-X'))
报('完成后按钮禁用，不会发送 QQ 消息', 找按钮(渲历史(), '已完成')?.p.disabled === true && 历史请求们.every(x => !x.path.includes('send_')))
for (const name of ['官方备份.bak', 'third-party.csv']) {
  选历史来源('导入文件')
  const 请求数 = 历史请求们.length
  找控件(渲历史(), n => n.p.type === 'file')[0].p.onChange({ target: { files: [{ ...大文件, name }] } })
  await 找按钮(渲历史(), '确认').p.onClick()
  报(name + ' 不读取也不上传', !读取文件 && 历史请求们.length === 请求数)
}

// 后端确认仍要求合法日期，并统一进入列表。
选历史来源('读取后端')
报('后端提供起止日期且移除页数输入', 找控件(渲历史(), n => n.t === 'input' && n.p.type === 'date').length === 2 && !JSON.stringify(渲历史()).includes('历史读取上限'))
const 范围请求数 = 历史请求们.length
await 找按钮(渲历史(), '确认').p.onClick()
报('缺少日期时不请求后端', 历史请求们.length === 范围请求数 && JSON.stringify(渲历史()).includes('请选择开始日期和结束日期'))
找控件(渲历史(), n => n.p['aria-label'] === '开始日期')[0].p.onChange({ target: { value: '2026-11-03' } })
找控件(渲历史(), n => n.p['aria-label'] === '结束日期')[0].p.onChange({ target: { value: '2026-11-02' } })
await 找按钮(渲历史(), '确认').p.onClick()
报('倒置日期时不请求后端', 历史请求们.length === 范围请求数 && JSON.stringify(渲历史()).includes('开始日期不能晚于结束日期'))
找控件(渲历史(), n => n.p['aria-label'] === '开始日期')[0].p.onChange({ target: { value: '2026-11-01' } })
任务 = { ...任务, dateRange: { start: '2026-11-01', end: '2026-11-02' } }
await 找按钮(渲历史(), '确认').p.onClick()
const 范围请求 = 历史请求们.at(-2)?.body
报('日期区间传给后端且不发送页数', 范围请求?.startDate === '2026-11-01' && 范围请求?.endDate === '2026-11-02' && !('maxPages' in 范围请求))
报('后端确认后进入列表并显示所选日期与时区', 找控件(渲历史(), n => n.p['aria-label'] === '导入列表')[0].p['aria-pressed'] === true && JSON.stringify(渲历史()).includes('2026-11-01 ～ 2026-11-02（北京时间，含结束日）'))

// 主动回应沿用只听点名配置，显示和保存方向相反。
const 渲绑定 = config => {
  const 配置 = { ...初始态.配置, ...config }
  状态槽 = [{ ...初始态, 配置 }, false, false, '', '绑定']
  // 真实页面由挂载时的 /state 填充；测试里直接给已保存绑定，替代被删掉的手动刷新按钮。
  状态槽[19] = Array.isArray(配置.绑定) ? 配置.绑定 : []
  下标 = 0
  return 组件()
}
let 绑定界面 = 渲绑定({})
const 帮助们 = 找控件(绑定界面, n => n.p.className === 'qq-field-help')
报('私聊 / 群聊称呼、主人、回复门槛和主动回应都有自绘悬浮说明', 帮助们.length === 8 && 帮助们.every(n => typeof n.p.onMouseEnter === 'function' && n.p['data-help'] && n.p['aria-label']))
报('主人问号提示使用指定原文', 帮助们.some(n => n.p['data-help'] === '大肥鱼的主人，有且仅有一个 QQ 号可以绑定'))
报('主动回应说明保留引用和关键词，排除全体', 帮助们.some(n => n.p['data-help'].includes('引用大肥鱼') && n.p['data-help'].includes('点名关键词') && n.p['data-help'].includes('@全体不算')))
报('绑定页提示自动创建会话', 可见文(绑定界面).includes('添加映射时自动创建工作区会话'))
报('刷新会话列表按钮已删除', !找按钮(绑定界面, '刷新会话列表'))
const 标记们 = 找控件(绑定界面, n => n.p.className === 'qq-bind-mark')
报('非编辑态回复门槛与主动回应用勾叉而非开关', 标记们.length === 3 && 标记们.every(n => n.kids.includes('✓') || n.kids.includes('✗')) && !找控件(绑定界面, n => n.p['aria-label'] === '主动回应').length)

const 渲绑定编辑 = config => {
  渲绑定(config)
  下标 = 0
  const 初始树 = 组件()
  const 修改们 = 找控件(初始树, n => n.t === 'button' && n.kids.includes('修改'))
  修改们[0]?.p.onClick()
  下标 = 0
  return 组件()
}
const 主动回应 = tree => 找控件(tree, n => n.p['aria-label'] === '主动回应')[0]

// 主人只能在私聊映射选择；切换自动撤销旧主人，取消编辑恢复旧选择。
const 主人绑定 = [
  { 类型: '私聊', 号码: '10001', 会话: 'owner', 主人QQ: true },
  { 类型: '私聊', 号码: '10002', 会话: 'other' },
  { 类型: '群', 号码: '10001', 会话: 'group' },
]
let 主人页面 = 渲绑定({ 绑定: 主人绑定 })
const 私聊表头 = 找控件(主人页面, n => n.p.className === 'qq-bind-row qq-bind-row-private qq-bind-head')[0]
报('主人列在私聊沙箱列前面', 可见文(私聊表头).indexOf('主人 QQ') < 可见文(私聊表头).indexOf('沙箱环境'))
const 群聊表头 = 找控件(主人页面, n => n.p.className === 'qq-bind-row qq-bind-row-group qq-bind-head')[0]
报('群聊映射不提供主人列', !可见文(群聊表头).includes('主人 QQ'))
找控件(主人页面, n => n.t === 'button' && n.kids.includes('修改'))[1].p.onClick()
下标 = 0; 主人页面 = 组件()
找控件(主人页面, n => n.p['aria-label'] === '主人 QQ')[0].p.onChange({ target: { checked: true } })
报('勾选新主人自动清除原勾选', 状态槽[0].配置.绑定[0].主人QQ === false && 状态槽[0].配置.绑定[1].主人QQ === true)
下标 = 0; 主人页面 = 组件()
找按钮(主人页面, '完成').p.onClick()
报('完成编辑保留即时修改且同号群不被标记', 状态槽[0].配置.绑定[0].主人QQ === false && 状态槽[0].配置.绑定[1].主人QQ === true && !状态槽[0].配置.绑定[2].主人QQ)
报('默认仅点名时主动回应为关闭', 主动回应(渲绑定编辑({}))?.p.checked === false)
let 编辑界面 = 渲绑定编辑({})
主动回应(编辑界面).p.onChange({ target: { checked: true } })
报('开启主动回应保存为只听点名=false', 状态槽[0].配置.绑定[0].只听点名 === false)
下标 = 0
编辑界面 = 组件()
报('开启后显示选中状态', 主动回应(编辑界面)?.p.checked === true)
主动回应(编辑界面).p.onChange({ target: { checked: false } })
报('关闭主动回应保存为只听点名=true', 状态槽[0].配置.绑定[0].只听点名 === true)
报('旧配置缺少只听点名时仍按保存前的全局值显示', 主动回应(渲绑定编辑({ 群里听所有人: true }))?.p.checked === true)
报('群聊单独关闭覆盖旧全局开启', 主动回应(渲绑定编辑({ 群里听所有人: true, 绑定: [{ ...初始态.配置.绑定[0], 只听点名: true }] }))?.p.checked === false)

// 新增和编辑态：只保留保存 / 取消，添加按钮无效化。
绑定界面 = 渲绑定({})
const 添加群钮 = 找按钮(绑定界面, '+ 添加群聊')
报('非编辑态添加按钮可用', 添加群钮.p['aria-disabled'] == null)
添加群钮.p.onClick()
下标 = 0
const 弹窗树 = 组件()
const 弹窗 = 找控件(弹窗树, n => String(n.p?.className || '').includes('qq-bind-add-modal'))[0]
const 弹窗文 = 可见文(弹窗)
报('新增映射弹出竖向表单且不显示目标会话', Boolean(弹窗)
  && ['添加群聊映射', '群号', '群名', '启用回复门槛', '主动回应', '启用收发'].every(x => 弹窗文.includes(x))
  && !弹窗文.includes('目标会话'))
报('新增映射表单不直接写入表格', 状态槽[0].配置.绑定.length === 初始态.配置.绑定.length)
找按钮(弹窗树, '取消').p.onClick()

// 沙箱列和两种新增表单共用逐映射开关。
for (const 类型 of ['私聊', '群']) {
  渲绑定({ 绑定: [{ 类型, 号码: '123456', 会话: 'session-X', 沙箱环境: true }] })
  状态槽[27] = []
  下标 = 0
  const 页面 = 组件()
  const 表头 = 找控件(页面, n => String(n.p.className || '').includes('qq-bind-head'))
  报(类型 + '表头沙箱列在操作前且带问号', 表头.some(n => {
    const text = 可见文(n)
    return text.indexOf('沙箱环境') < text.indexOf('操作') && text.includes('沙箱环境说明')
  }))
  报(类型 + '表格只显示沙箱勾叉', 找控件(页面, n => n.p['aria-label'] === '沙箱环境：已开启').length === 1
    && 找控件(页面, n => n.p['aria-label'] === '沙箱环境').length === 0)
  报(类型 + '记忆隔离仅群聊显示勾叉', 找控件(页面, n => n.p['aria-label'] === '记忆隔离：未开启').length === (类型 === '群' ? 1 : 0)
    && !找控件(页面, n => String(n.p['aria-label'] || '').startsWith('隔离群聊记忆 ')).length)
  找按钮(页面, 类型 === '群' ? '+ 添加群聊' : '+ 添加私聊').p.onClick()
  下标 = 0
  let 新页 = 组件()
  报(类型 + '添加表单仅私聊提供主人勾选', 找控件(新页, n => n.p['aria-label'] === '主人 QQ').length === (类型 === '私聊' ? 1 : 0))
  const 开关 = 找控件(新页, n => n.p['aria-label'] === '沙箱环境')[0]
  报(类型 + '添加表单沙箱默认关闭', 开关?.p.checked === false)
  开关.p.onChange({ target: { checked: true } })
  下标 = 0
  新页 = 组件()
  报(类型 + '添加表单沙箱开关可打开', 找控件(新页, n => n.p['aria-label'] === '沙箱环境')[0]?.p.checked === true)
  报(类型 + '新增表单仅群聊提供记忆隔离开关', 找控件(新页, n => n.p['aria-label'] === '记忆隔离').length === (类型 === '群' ? 1 : 0))
  找按钮(新页, '取消').p.onClick()
  找按钮(页面, '修改').p.onClick()
  下标 = 0
  const 修改页 = 组件()
  报(类型 + '修改时仅群聊提供记忆隔离开关', 找控件(修改页, n => n.p['aria-label'] === '隔离群聊记忆 123456').length === (类型 === '群' ? 1 : 0))
}

// 删除先弹确认，取消保留，确认后才从草稿移除。
let 删除确认参数 = null
let 删除确认结果 = false
const 确认删除 = async (opts) => { 删除确认参数 = opts; return 删除确认结果 }
状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 绑定: [{ ...初始态.配置.绑定[0] }] } }, false, false, '', '绑定']
下标 = 0
const 删除树 = 组件({ page: '绑定', confirm: 确认删除 })
await 找按钮(删除树, '删除').p.onClick()
报('删除前弹出确认框', Boolean(删除确认参数) && 删除确认参数.title.includes('删除') && 删除确认参数.confirmText === '删除')
报('取消确认不删除草稿', 状态槽[0].配置.绑定.length === 1)
删除确认结果 = true
await 找按钮(删除树, '删除').p.onClick()
报('确认后才删除草稿', 状态槽[0].配置.绑定.length === 0)

// 保存旧群时把保存前的全局接收范围固化到每条绑定，之后不再依赖全局开关。
let 迁移保存体 = null
const 原fetch = globalThis.fetch
globalThis.fetch = async (url, options = {}) => {
  if (String(url).endsWith('/save')) {
    迁移保存体 = JSON.parse(options.body)
    return { json: async () => ({ ok: true, 配置: 迁移保存体, 说: 'ok' }) }
  }
  return { json: async () => ({ ok: true, 配置: 初始态.配置 }) }
}
状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 群里听所有人: true, 绑定: [{ 类型: '群', 号码: '1', 会话: 'session-X', 称呼: '旧群', 只听点名: null }] } }, true, false, '', '绑定']
下标 = 0
const 迁移树 = 组件()
await 迁移树.p.onBlurCapture()
报('保存旧群时固化全局接收范围', 迁移保存体 && 迁移保存体.绑定[0].只听点名 === false)
globalThis.fetch = 原fetch

// 角色页只编辑已保存映射，保存失败时不推进快照，不串改其他会话。
let 角色态 = { ...初始态, 配置: { ...初始态.配置, 人设: '默认角色', 特殊设定开: true, 特殊设定: '有且仅有一条大肥鱼', 绑定: [
  { 类型: '私聊', 号码: '123456', 会话: 'session-private', 人设: '私聊旧角色' },
  { 类型: '群', 号码: '654321', 会话: 'session-group', 人设: '群聊旧角色', 只听点名: true, 点名例外: '987654' },
] } }
let 角色保存失败 = false, 角色保存体
let 应用次数 = 0
globalThis.fetch = async (url, options = {}) => {
  if (String(url).endsWith('/save')) {
    角色保存体 = JSON.parse(options.body)
    if (角色保存失败) return { json: async () => ({ ok: false, 说: '模拟角色保存失败' }) }
    角色态 = { ...角色态, 配置: { ...角色保存体, 绑定: 角色保存体.绑定.filter(b => b.号码 && b.会话) } }
  }
  if (String(url).endsWith('/persona-apply')) 应用次数++
  return { json: async () => structuredClone(角色态) }
}
let 角色绑定界面 = 渲绑定(角色态.配置)
报('绑定表不再提供角色编辑按钮', 找控件(角色绑定界面, n => n.t === 'button' && (n.kids.includes('角色') || n.kids.includes('角色 ✓'))).length === 0)
const 修改们 = 找控件(角色绑定界面, n => n.t === 'button' && n.kids.includes('修改'))
报('保存后的映射提供修改与删除动作', 修改们.length === 2 && 找控件(角色绑定界面, n => n.t === 'button' && n.kids.includes('删除')).length === 2)
修改们[1].p.onClick()
下标 = 0; 角色绑定界面 = 组件()
报('进入编辑后不提供保存按钮并允许完成', 找控件(角色绑定界面, n => n.t === 'button' && n.kids.includes('修改')).length === 1
  && 找控件(角色绑定界面, n => n.t === 'button' && n.kids.includes('保存')).length === 0
  && 找控件(角色绑定界面, n => n.t === 'button' && n.kids.includes('完成')).length === 1)
const 群表头 = 找控件(角色绑定界面, n => n.p.className && n.p.className.includes('qq-bind-row-group') && n.p.className.includes('qq-bind-head'))[0]
报('编辑态隐藏启用表头', Boolean(群表头) && !可见文(群表头).includes('启用'))
报('移动角色后仍可编辑群点名豁免名单', 找控件(角色绑定界面, n => n.p['aria-label'] === '点名豁免名单').length === 1)
找按钮(角色绑定界面, '完成').p.onClick()
下标 = 0; 角色绑定界面 = 组件()
找按钮(角色绑定界面, '+ 添加私聊').p.onClick()
let 编辑角色参数 = null
let 删除角色参数 = null
const 假编辑 = async (opts) => { 编辑角色参数 = opts; return '群聊新角色' }
const 假确认 = async (opts) => { 删除角色参数 = opts; return true }
const 渲角色 = (extra = {}) => { 下标 = 0; return 组件({ page: '角色设定', editRole: 假编辑, confirm: 假确认, ...extra }) }
let 角色页 = 渲角色()
const 角色文 = 可见文(角色页)
报('角色页有代写按钮、全局设定和两张映射表', ['大肥鱼专业代写', '全局角色设定', '私聊角色设定', '群聊角色设定'].every(x => 角色文.includes(x)))
报('角色表只列出已保存的两个映射', 找控件(角色页, n => n.t === 'tr').length === 4)
报('原有私聊和群聊设定完整保留', 角色文.includes('私聊旧角色') && 角色文.includes('群聊旧角色'))
报('全局角色下方显示独立特殊设定和指定说明', 角色文.indexOf('全局角色设定') < 角色文.indexOf('启用特殊设定')
  && 角色文.includes('全局生效，优先于会话独立设定。默认约束为“有且仅有一个大肥鱼”。'))
报('特殊设定预填统一身份并展示独立开关', 找控件(角色页, n => n.p['aria-label'] === '特殊设定')[0]?.p.value === '有且仅有一条大肥鱼'
  && 找控件(角色页, n => n.p['aria-label'] === '启用特殊设定')[0]?.p.checked === true)
const 群编辑钮 = 找控件(角色页, n => n.t === 'button' && n.p['aria-label'] === '编辑 群 654321 的角色设定')[0]
报('群角色行有编辑图标', Boolean(群编辑钮))
群编辑钮.p.onClick()
await Promise.resolve()
报('编辑图标打开多行设定', Boolean(编辑角色参数) && 编辑角色参数.title === '编辑角色设定' && 编辑角色参数.value === '群聊旧角色')
报('编辑后写入群角色设定', 状态槽[0].配置.绑定[1].人设 === '群聊新角色')
角色页 = 渲角色()
角色保存失败 = true
await 角色页.p.onBlurCapture()
报('保存失败不清除未保存状态或丢失角色草稿', 状态槽[1] === true && 可见文(渲角色()).includes('群聊新角色'))
角色保存失败 = false
await 渲角色().p.onBlurCapture()
报('保存角色只更新对应映射，不覆盖默认或私聊设定', 角色保存体.绑定[1].人设 === '群聊新角色' && 角色保存体.绑定[0].人设 === '私聊旧角色' && 角色保存体.人设 === '默认角色')
角色页 = 渲角色()
const 群删除钮 = 找控件(角色页, n => n.t === 'button' && n.p['aria-label'] === '删除 群 654321 的角色设定')[0]
报('群角色行有删除图标', Boolean(群删除钮))
群删除钮.p.onClick()
await Promise.resolve()
报('删除前确认还原到全局角色设定', Boolean(删除角色参数) && 删除角色参数.title === '删除后本会话的角色设定将还原到全局角色设定，是否确认删除？')
报('删除角色只清空单独设定', 状态槽[0].配置.绑定[1].人设 === '' && 状态槽[0].配置.绑定[0].人设 === '私聊旧角色')
角色页 = 渲角色()
报('删除后显示继承全局角色设定', 可见文(角色页).includes('继承全局角色设定'))

// 全局角色开关：无文字时禁止打开，有文字后打开会先保存再应用。
状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 人设: '', 人设开: false, 绑定: [
  { 类型: '私聊', 号码: '123456', 会话: 'session-private', 人设: '私聊旧角色' },
  { 类型: '群', 号码: '654321', 会话: 'session-group', 人设: '群聊旧角色', 只听点名: true },
] } }, false, false, '', '角色设定']
状态槽[19] = 状态槽[0].配置.绑定
下标 = 0
let 开关页 = 组件({ page: '角色设定', editRole: 假编辑, confirm: 假确认 })
const 开关 = (tree) => 找控件(tree, n => n.p['aria-label'] === '启用角色设定')[0]
报('全局角色未填写时开关禁止打开', 开关(开关页)?.p.disabled === true)
const 全局框 = 找控件(开关页, n => n.p['aria-label'] === '人设')[0]
全局框.p.onChange({ target: { value: '全局新设定' } })
下标 = 0
开关页 = 组件({ page: '角色设定', editRole: 假编辑, confirm: 假确认 })
报('填写全局角色后开关可打开', 开关(开关页)?.p.disabled === false)
应用次数 = 0
await 开关(开关页).p.onChange({ target: { checked: true } })
报('打开开关先自动保存再应用', 应用次数 === 1 && 角色保存体.人设 === '全局新设定' && 角色保存体.人设开 === true && 状态槽[1] === false)

// 特殊设定复用保存与应用流程，独立开关及失败回滚均不改原角色。
const 特殊开关 = tree => 找控件(tree, n => n.p['aria-label'] === '启用特殊设定')[0]
let 特殊页 = 渲角色()
找控件(特殊页, n => n.p['aria-label'] === '特殊设定')[0].p.onChange({ target: { value: '统一身份新设定' } })
特殊页 = 渲角色()
await 特殊开关(特殊页).p.onChange({ target: { checked: true } })
报('特殊设定开关保存草稿并立即应用，保留原角色和独立设定', 角色保存体.特殊设定 === '统一身份新设定' && 角色保存体.特殊设定开 === true
  && 角色保存体.人设 === '全局新设定' && 角色保存体.人设开 === true && 角色保存体.绑定[0].人设 === '私聊旧角色' && 应用次数 === 2)
角色保存失败 = true
await 特殊开关(渲角色()).p.onChange({ target: { checked: false } })
报('特殊设定保存失败恢复开关并保留文字', 特殊开关(渲角色()).p.checked === true && 状态槽[0].配置.特殊设定 === '统一身份新设定' && 应用次数 === 2)
角色保存失败 = false
await 开关(渲角色()).p.onChange({ target: { checked: false } })
报('关闭全局角色后特殊设定仍开启', 角色保存体.人设开 === false && 角色保存体.特殊设定开 === true)
await 特殊开关(渲角色()).p.onChange({ target: { checked: false } })
报('关闭特殊设定保留原文和其他配置', 角色保存体.特殊设定开 === false && 角色保存体.特殊设定 === '统一身份新设定' && 角色保存体.人设 === '全局新设定')

// 保存按钮不得把 React 点击事件作为覆盖配置传入。
const 归档原fetch = globalThis.fetch
let 归档保存体
try {
  globalThis.fetch = async (url,options) => {
    if (String(url).endsWith('/save')) 归档保存体 = JSON.parse(options.body)
    return { json: async () => ({ ...初始态, ok: true, 配置: 归档保存体 || 初始态.配置 }) }
  }
  状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 图片存储: true, 文件存储: true } }, true, false, '', '图片与文件']
  下标 = 0
  const 归档保存树 = 组件({page:'图片与文件'})
  await 归档保存树.p.onBlurCapture()
  报('保存按钮保存两个归档开关而非点击事件', 归档保存体?.图片存储 === true && 归档保存体?.文件存储 === true && !归档保存体?.nativeEvent)
} finally { globalThis.fetch = 归档原fetch }

// 工作区列表与保存：选择 ID，不提交目录；刷新列表不覆盖当前草稿。
const 工作区原fetch = globalThis.fetch
let 工作区保存体
try {
  const 工作区列表 = [{id:'home-a',title:'伙伴',path:'/one/project',available:true},{id:'home-b',title:'伙伴',path:'/another/project',available:true},{id:'gone',title:'失效',path:'/missing',available:false}]
  globalThis.fetch = async (url, options) => {
    if (String(url).endsWith('/save')) 工作区保存体 = JSON.parse(options.body)
    return {json:async()=>({...初始态,ok:true,工作区列表,配置:工作区保存体 || 初始态.配置})}
  }
  状态槽 = [{...初始态,工作区列表,配置:{...初始态.配置,工作区:'home-a'}},false,false,'','连接']
  下标 = 0
  let 工作区树 = 组件({page:'连接'})
  const 工作区下拉 = 找控件(工作区树,n=>n.t==='select'&&n.p['aria-label']==='绑定工作区')[0]
  报('连接页更名并在总开关下方提示绑定工作区', 可见文(工作区树).includes('大肥鱼，启动！') && 可见文(工作区树).includes('选择 QQ 绑定工作区'))
  报('工作区下拉显示全部注册项并禁用失效目录', 工作区下拉?.p.value === 'home-a' && 工作区下拉.kids.filter(n=>n.t==='option').length === 4 && 工作区下拉.kids.find(n=>n.p?.value==='gone')?.p.disabled)
  工作区下拉.p.onChange({target:{value:'home-b'}})
  await 工作区下拉.p.onFocus()
  下标 = 0
  工作区树 = 组件({page:'连接'})
  报('刷新工作区列表保留未保存的选择', 找控件(工作区树,n=>n.t==='select'&&n.p['aria-label']==='绑定工作区')[0]?.p.value === 'home-b')
  await 工作区树.p.onBlurCapture()
  报('工作区选择随配置保存且不提交路径', 工作区保存体?.工作区 === 'home-b' && !工作区保存体?.path)
} finally { globalThis.fetch = 工作区原fetch }

// 总开关：打开/关闭都直接调用 /power 立即生效，不再依赖保存设置。
const 启动原fetch = globalThis.fetch
let 放行启动, 启动结果, 启动请求体, 启动保存次数 = 0
const 启动提示 = []
const 渲启动 = () => { 下标 = 0; return 组件({page:'连接',notify:text=>启动提示.push(text)}) }
const 找启动 = tree => 找控件(tree,n=>n.p['aria-label']==='大肥鱼总开关')[0]
try {
  globalThis.fetch = async (url, options) => {
    if (String(url).endsWith('/power')) {
      启动请求体 = JSON.parse(options.body)
      await new Promise(resolve=>{放行启动=resolve})
      return {json:async()=>启动结果}
    }
    if (String(url).endsWith('/save')) { 启动保存次数++;return {json:async()=>({ok:false,说:'不应调用保存'})} }
    return {json:async()=>初始态}
  }
  状态槽 = [{...初始态,配置:{...初始态.配置,总开关:false,试运行:false,人设:'未保存的角色草稿'}},true,false,'','连接']
  let 启动树 = 渲启动()
  报('总开关初始关闭', 找启动(启动树)?.p.checked === false)
  启动结果 = {ok:false,问题:['关闭试运行','打开目标会话'],说:'大肥鱼暂时无法启动：请关闭试运行并打开目标会话'}
  const 失败任务 = 找启动(启动树).p.onChange({target:{checked:true}})
  启动树 = 渲启动()
  报('切换中保持关闭并禁止重复点击', 找启动(启动树)?.p.checked === false && 找启动(启动树)?.p.disabled === true)
  放行启动();await 失败任务
  报('启动失败保持关闭并列出操作', 状态槽[0].配置.总开关 === false && 启动提示.some(text=>text.includes('关闭试运行')&&text.includes('打开目标会话')))
  报('失败保留其他草稿', 状态槽[0].配置.人设 === '未保存的角色草稿' && 状态槽[1] === true && 启动保存次数 === 0)
  启动结果 = {ok:true,用户:998877,昵称:'测试号',说明:'已启动',配置:{...状态槽[0].配置,总开关:true},说:'大肥鱼已启动'}
  const 成功任务 = 找启动(渲启动()).p.onChange({target:{checked:true}})
  放行启动();await 成功任务
  报('完整草稿交给后端并立即打开', 启动请求体?.开 === true && 启动请求体?.配置?.人设 === '未保存的角色草稿' && 启动请求体?.配置?.总开关 === true && 状态槽[0].配置?.总开关 === true && 启动保存次数 === 0)
  启动结果 = {ok:true,配置:{...状态槽[0].配置,总开关:false},说:'大肥鱼已停止'}
  const 关闭任务 = 找启动(渲启动()).p.onChange({target:{checked:false}})
  放行启动();await 关闭任务
  报('关闭立即停止且不需要保存', 启动请求体?.开 === false && 状态槽[0].配置?.总开关 === false && 启动保存次数 === 0)
} finally { globalThis.fetch = 启动原fetch }

const 账号原fetch = globalThis.fetch
try {
  let 保存账号配置
  状态槽 = [{ ...初始态, 配置: { ...初始态.配置, 允许改签名: true } }, false]
  const 渲账号 = () => { 下标 = 0; return 组件({ page: 'QQ 账号' }) }
  globalThis.fetch = async (url, options) => {
    if (String(url).endsWith('/save')) 保存账号配置 = JSON.parse(options.body)
    return { json: async () => ({ ...初始态, 配置: 保存账号配置 || 状态槽[0].配置 }) }
  }
  let 账号树 = 渲账号()
  const 账号开关们 = 找控件(账号树, n => n.t === 'input' && n.p.role === 'switch')
  报('账号页群聊主人开关第一行、昵称开关第二行', 账号开关们[0]?.p['aria-label'] === '允许执行主人在群聊中的要求'
    && 账号开关们[1]?.p['aria-label'] === '允许修改 QQ 昵称')
  报('两个新开关默认关闭', 账号开关们[0]?.p.checked === false && 账号开关们[1]?.p.checked === false)
  账号开关们[0].p.onChange({ target: { checked: true } })
  账号树 = 渲账号()
  找控件(账号树, n => n.p['aria-label'] === '允许修改 QQ 昵称')[0].p.onChange({ target: { checked: true } })
  await 渲账号().p.onBlurCapture()
  报('新开关保存且保留原有权限', 保存账号配置?.允许群聊主人指令 === true && 保存账号配置?.允许改昵称 === true && 保存账号配置?.允许改签名 === true)
  找控件(渲账号(), n => n.p['aria-label'] === '允许执行主人在群聊中的要求')[0].p.onChange({ target: { checked: false } })
  await 渲账号().p.onBlurCapture()
  报('群聊开关可独立关闭，昵称开关保留', 保存账号配置?.允许群聊主人指令 === false && 保存账号配置?.允许改昵称 === true)
} finally { globalThis.fetch = 账号原fetch }

const 频率原fetch = globalThis.fetch
try {
  let 保存频率配置
  状态槽 = [{ ...初始态, 配置: { ...初始态.配置,
    群聊统一规则: { 读取间隔分: 10, 读取最多条: 30, 点名必回: true, 门槛: false },
    绑定: [
      { 类型: '群', 号码: '123456', 会话: 'session-X' },
      { 类型: '群', 号码: '654321', 会话: 'session-Y', 读取间隔分: 15, 读取最多条: 20, 点名必回: false },
    ] } }, false]
  const 渲频率 = () => { 下标 = 0; return 组件({ page: '群聊频率' }) }
  globalThis.fetch = async (url, options) => {
    if (String(url).endsWith('/save')) 保存频率配置 = JSON.parse(options.body)
    return { json: async () => ({ ...初始态, 配置: 保存频率配置 || 状态槽[0].配置 }) }
  }
  const 规则卡片 = tree => 找控件(tree, n => n.t === 'section' && /的频率规则$/.test(n.p['aria-label'] || ''))
  const 数框 = () => 找控件(规则卡片(渲频率())[0], n => n.t === 'input' && n.p.type === 'number')
  const 群选择 = () => 找控件(渲频率(), n => n.t === 'select' && n.p['aria-label'] === '选择群聊')[0]
  const 间隔开关 = () => 找控件(渲频率(), n => / 启用读取间隔$/.test(n.p['aria-label'] || ''))[0]
  const 字段集 = () => 找控件(渲频率(), n => n.t === 'fieldset')[0]
  报('默认可以选择群聊，一次显示一套独立规则', !群选择().p.disabled && 群选择().p.value === '123456' && 规则卡片(渲频率()).length === 1)
  报('删除统一配置和频率页的门槛开关卡片', !可见文(渲频率()).includes('按群单独配置') && !可见文(渲频率()).includes('所有群聊') && !找控件(渲频率(), n => /启用回复门槛/.test(n.p['aria-label'] || '') || n.p.id === 'qq-reply-threshold').length)
  报('读取间隔默认启用，参数可编辑', 间隔开关().p.checked && !字段集().p.disabled)
  间隔开关().p.onChange({ target: { checked: false } })
  报('关闭读取间隔后全部参数置灰', 字段集().p.disabled && 字段集().p.style.opacity < 1)
  await 渲频率().p.onBlurCapture()
  报('读取间隔开关保存到当前群', 保存频率配置?.绑定[0].启用读取间隔 === false && 保存频率配置?.绑定[1].读取间隔分 === 15)
  群选择().p.onChange({ target: { value: '654321' } })
  报('切换群聊显示独立参数和开关', 数框()[0].p.value === '15' && 数框()[1].p.value === '20' && !字段集().p.disabled)
  数框()[0].p.onChange({ target: { value: '7' } })
  await 渲频率().p.onBlurCapture()
  报('单群修改不覆盖其他群', 保存频率配置?.绑定[1].读取间隔分 === 7 && 保存频率配置?.绑定[0].启用读取间隔 === false)
  状态槽 = [{ ...初始态, 配置: { 绑定: [] } }, false]
  报('没有群映射时下拉框禁用并显示添加提示', 群选择().p.disabled && 可见文(渲频率()).includes('暂无群聊映射'))
} finally { globalThis.fetch = 频率原fetch }

console.log(`\n${挂了 === 0 ? '全部通过 ✅' : `有 ${挂了} 条没过 ❌`}`)
process.exitCode = 挂了 === 0 ? 0 : 1
