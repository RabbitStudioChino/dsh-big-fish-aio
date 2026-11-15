// 大肥鱼整合修改：供主界面直接挂载，更新入口由整合包统一提供。
// DSH 鱼的记忆 · 客户端半边（设置左侧栏一项「鱼的记忆」）
window.__ModuleLoader__.load({
  id: 'dsh-fish-memory',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'
    const inject = ['slots']
    function MemoryDialog({ id = 'memory-dialog', title, subtitle, active = true, onClose, footer, children, className = '' }) {
      const ref = React.useRef(null)
      React.useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (active && !dialog.open) dialog.showModal()
        if (!active && dialog.open) dialog.close()
        return () => { if (dialog.open) dialog.close() }
      }, [active])
      React.useEffect(() => { ref.current?.querySelector('button')?.focus() }, [title])
      return h('dialog', {
        ref, className: 'memory-dialog' + (className ? ' ' + className : ''), 'aria-labelledby': id + '-title',
        onCancel: e => { e.preventDefault(); onClose() },
        onMouseDown: e => {
          if (e.target !== e.currentTarget) return
          const box = e.currentTarget.getBoundingClientRect()
          if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) onClose()
        },
      },
      h('header', { className: 'memory-dialog-head' },
        h('div', null, subtitle ? h('p', null, subtitle) : null, h('h2', { id: id + '-title' }, title)),
        h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭' + title, onClick: onClose, autoFocus: true }, '×')),
      h('div', { className: 'memory-dialog-body' }, children),
      footer ? h('footer', { className: 'memory-dialog-foot' }, footer) : null)
    }

    function EmbeddingSettings({ session, storeId, notify, indexOnly = false }) {
      const [status, setStatus] = React.useState(null)
      const autosave = typeof useFishAutosave === 'function' ? useFishAutosave(() => config ? post('/settings', { config, ...(key ? { key } : {}) }) : true) : {}
      const [config, setConfig] = React.useState(null)
      const [key, setKey] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const base = '/dsh-fish-memory/embedding'
      const refresh = async (saved = false) => {
        const response = await fetch(base + '/status' + (session ? '?session=' + encodeURIComponent(session) : ''), { cache: 'no-store' })
        const result = await response.json()
        if (!response.ok || !result.ok) throw Error(result.error || '无法读取语义召回状态')
        setStatus(result)
        setConfig(old => saved ? result.config : old || result.config)
        setError('')
      }
      React.useEffect(() => { refresh().catch(e => setError(e.message)) }, [session])
      React.useEffect(() => {
        if (!status?.running) return
        const timer = setInterval(() => refresh().catch(e => setError(e.message)), 1000)
        return () => clearInterval(timer)
      }, [status?.running, session])
      const post = async (path, body) => {
        setBusy(true); setError('')
        try {
          const response = await fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
          const result = await response.json()
          if (!response.ok || !result.ok) throw Error(result.error || '操作失败')
          setKey('')
          await refresh(path === '/settings')
          notify?.('语义召回设置已更新', { tone: 'success' })
        } catch (e) { setError(e.message); notify?.((path === '/settings' ? '保存失败：' : '操作失败：') + e.message) } finally { setBusy(false) }
      }
      if (!config) return h('section', { className: indexOnly ? '' : 'fish-card' },
        h('p', { role: error ? 'alert' : 'status' }, error || '正在读取语义召回设置…'),
        error ? h('button', { type: 'button', className: 'fish-button', onClick: () => refresh().catch(e => setError(e.message)) }, '重试') : null)
      const field = (name, label, hint, options) => h('label', { className: 'memory-field', key: name },
        h('span', null, label),
        options ? h('select', { 'aria-label': label, value: config[name], disabled: busy, onChange: e => setConfig({ ...config, [name]: typeof config[name] === 'number' ? Number(e.target.value) : e.target.value }) }, ...options.map(value => h('option', { key: value, value }, value)))
        : h('input', { 'aria-label': label, type: typeof config[name] === 'number' ? 'number' : 'text', step: name === 'minSimilarity' ? 0.01 : 1, value: config[name], disabled: busy, onChange: e => setConfig({ ...config, [name]: typeof config[name] === 'number' ? Number(e.target.value) : e.target.value }) }),
        hint ? h('small', null, hint) : null)
      return h('section', { className: indexOnly ? 'memory-index' : 'fish-card memory-embedding', ...(indexOnly ? {} : autosave) },
        !indexOnly ? h(React.Fragment, null,
          h('div', { className: 'memory-card-head' },
            h('div', null, h('h3', null, 'RAG 语义召回')),
            h('label', { className: 'memory-switch' }, h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '启用语义召回', checked: config.enabled, disabled: busy, onChange: e => setConfig({ ...config, enabled: e.target.checked }) }), config.enabled ? '已开启' : '已关闭')),
          h('p', null, '按语义检索记忆，可匹配不同表述。例如，“忌口”可关联“不吃香菜”。记忆正文与查询将发送至云服务商，可能产生费用。QQ 来源隔离继续生效，服务异常时回退至关键词检索。'),
          h('div', { className: 'memory-form-grid' },
            field('model', 'Embedding 模型', null, ['text-embedding-v4', 'text-embedding-v3']),
            field('dimensions', '向量维度', '维度需与服务和现有索引一致。'),
            h('label', { className: 'memory-field memory-field-wide' }, h('span', null, '服务地址'), h('input', { 'aria-label': 'DashScope 完整服务地址', type: 'url', value: config.endpoint, disabled: busy, onChange: e => setConfig({ ...config, endpoint: e.target.value }) })),
            field('minSimilarity', '语义相似度门槛', '越高越严格，范围 0.5–0.99。'),
            field('topK', '候选条数上限', '最多 50 条，同时受单轮记忆预算限制。'),
            field('timeoutMs', '检索超时 / 毫秒', '超时回退关键词，不阻塞聊天。'),
            h('label', { className: 'memory-field memory-field-wide' }, h('span', null, '服务密钥'), h('input', { 'aria-label': 'Embedding 密钥', type: 'password', autoComplete: 'new-password', placeholder: status?.configured ? '已配置，留空保留现有密钥' : '输入服务密钥', value: key, disabled: busy || !status?.writable, onChange: e => setKey(e.target.value) }), h('small', null, status?.writable ? '密钥只写入宿主凭据，不会返回前端。' : '当前宿主不支持写入密钥，请使用宿主凭据或环境变量。'))),
          h('div', { className: 'memory-actions memory-save-row' },
            null,
            h('button', { type: 'button', className: 'fish-button', disabled: busy || !status?.writable || !status?.configured, onClick: () => { if (window.confirm('清除已保存的 Embedding 密钥？语义召回将无法使用该密钥。')) post('/settings', { config, clearKey: true }) } }, '清除密钥')),
          h('p', { className: 'memory-index-hint' }, '各记忆库的索引补齐与重建，统一从“记忆库 → 管理 → 语义索引”进入。')) : h(React.Fragment, null,
          h('p', { className: 'fish-muted' }, '索引仅影响语义检索。补齐和重建都会保留原始记忆正文。'),
          h('div', { className: 'memory-stats' }, ...[[status?.indexed ?? '—', '已索引'], [status?.missing ?? '—', '待补齐'], [status?.completed ?? 0, '本次完成']].map(([value, label]) => h('div', { key: label }, h('strong', null, value), h('span', null, label)))),
          status?.error ? h('p', { className: 'memory-feedback', role: 'status' }, '检索回退原因 · ' + status.error) : null,
          h('div', { className: 'memory-actions' },
            h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || status?.running || !config.enabled, onClick: () => post('/index', { session, storeId }) }, status?.running ? '正在补齐…' : '补齐缺失索引'),
            h('button', { type: 'button', className: 'fish-button', disabled: busy || status?.running || !config.enabled, onClick: () => post('/index', { session, storeId, rebuild: true }) }, '重建索引'),
            h('button', { type: 'button', className: 'fish-button', disabled: busy || !status?.running, onClick: () => post('/index', { stop: true }) }, '中断任务'),
            h(RefreshButton, { type: 'button', label: '刷新状态', onClick: () => refresh().catch(e => setError(e.message)) }, '刷新状态')),
          !config.enabled ? h('p', { className: 'memory-feedback' }, '语义召回尚未开启，请先到“RAG 语义召回”开启。') : null),
        error ? h('p', { role: 'alert', className: 'memory-feedback' }, error) : null)
    }

    const B = '/dsh-fish-memory'

    const get = (p) => fetch(B + p, { cache: 'no-store' }).then((r) => r.json())
    const rawPost = (p, body) =>
      fetch(B + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then((r) => r.json())

    const fmt = (t) => {
      if (!t) return '（未标日期）'
      const d = new Date(t)
      const p = (n) => String(n).padStart(2, '0')
      return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
    }
    const rel = (t, now) => {
      if (!t) return '（未标日期）'
      const dayIdx = (x) => Math.floor((new Date(x).getTime() + 8 * 3600000) / 86400000)
      const days = dayIdx(now) - dayIdx(t)
      if (!isFinite(days)) return fmt(t)
      // ⚠注意：2026-09-22 修（反馈：「为什么还有今天的事儿」）：
      //   原来是 `if (days <= 0) return '今天 …'` —— **负数的（未来的）也被算成今天** ✗
      //   实测：一条日期在未来的记忆→ 页面显示「今天 12:00」✗✗
      //   → 今天 / 明天 / N 天后 分开写
      if (days === 0) return '今天 ' + fmt(t).slice(6)
      if (days === -1) return '明天 ' + fmt(t).slice(6)
      if (days < 0) {
        const 后 = -days
        if (后 < 30) return 后 + ' 天后'
        return fmt(t).slice(0, 5) + '（' + Math.floor(后 / 30) + ' 个月后）'
      }
      if (days === 1) return '昨天 ' + fmt(t).slice(6)
      if (days < 30) return days + ' 天前'
      // ⭐ 2026-09-21 晚：**跨年了就必须带年份** —— 不然「09-17」看不出是哪一年 ✗
      //   （反馈：的：「过了一年会怎么显示呢？我现在看没有年份，只有月份」）
      const 今年 = new Date(new Date(now).getTime() + 8 * 3600000).getUTCFullYear()
      const 那年 = new Date(new Date(t).getTime() + 8 * 3600000).getUTCFullYear()
      if (那年 !== 今年) {
        const 差 = 今年 - 那年
        if (差 === 1) return '去年 ' + fmt(t).slice(0, 5)
        return 那年 + '-' + fmt(t).slice(0, 5) + '（' + 差 + ' 年前）'
      }
      // ⚠注意：2026-09-22 修（反馈：「不是两个月前啊」）：
      //   原来是 `Math.round(days / 30)` —— **四舍五入**把 47 天说成了「2 个月」✗
      //   47 天明明才一个半月。→ 改成**只进不退**（floor），零头够 15 天就说「个多月」✓
      const 月 = Math.floor(days / 30)
      const 零头 = days - 月 * 30
      return fmt(t).slice(0, 5) + '（' + 月 + (零头 >= 15 ? ' 个多' : ' 个') + '月前）'
    }
    const impName = (v) => (v >= 1 ? '非常重要' : v >= 0.5 ? '重要' : '一般')

    // ---------- 提炼 / 扩词的进度放在**组件外面** ----------
    // 为什么：跑一轮要十几二十分钟，她中途切走再回来，进度不该消失
    // 注意：两个**各占一格** —— 共用一个格子的话，两个一起跑会互相盖，
    //   看起来就像「点了扩词，过一会儿自己取消了」✗（2026-09-20 踩到）
    const 进度 = { 扩词: { 状态: null, 说明: null }, 提炼: { 状态: null, 说明: null }, 订阅: new Set() }
    // ⭐ 2026-09-22（反馈「点了判断，但他没有弹进度条啊，他就卡着判着呢」）：
    //   「补标不淡」原来**只有一行字、没有进度条** —— 跑起来看不出它在动 ✗
    //   （其实一直在跑，日志里一批批都有；她以为卡死了）
    //   → 给它也配一条进度条（放在组件外面，切走再回来还在）
    // 注意：2026-09-22（她的反馈）：这条原来跟提炼/扩词挤在同一张卡里，
    //   点了重判得往上翻才看得见 失败：→ 挪到按钮行下面，并记下**是哪一种**：
    //   「补标不淡」还是「重判一遍」，进度条上写清楚
    const 补标进度 = { 已: 0, 总: 0, 在跑: false, 重判: false }
// ⭐⭐ 2026-09-23：**清洗补键**的进度（老数据补事实键）✓
//   跟 补标 分开一份 —— 两条进度条同时跑的时候不许互相盖 ✗
const 洗键进度 = { 已: 0, 总: 0, 在跑: false, 干跑: false }
    const 改进度 = (格, 状态, 说明) => {
      const s = 进度[格] || (进度[格] = { 状态: null, 说明: null })
      s.状态 = 状态
      s.说明 = 说明
      for (const f of 进度.订阅) {
        try {
          f()
        } catch (e) {}
      }
    }

    // 一次别画太多行 —— 库里 800 多条的时候，全画出来整个页面都会卡（连别的插件面板一起卡）✗
    const 一次最多画 = 200

    // 权重在页面上按百分比显示（0.55 → 55）
    const toPct = (v) => Math.round(Number(v) * 1000) / 10
    const fromPct = (v) => Math.round(Number(v) * 10) / 1000

    const S = {
      wrap: { padding: '0 0 24px', fontSize: 'var(--fish-body)', lineHeight: 1.75, minWidth: 0 },
      dim: { color: 'var(--fish-muted)' },
      h: { fontFamily: 'var(--fish-title)', fontSize: 20, margin: '28px 0 16px', fontWeight: 700, lineHeight: 1.5 },
      // ⚠注意：2026-09-23（她的反馈：「右边堆的东西太多，左边的文字成了竖着的一条」）：
      //   这一行**必须能换行** ✗
      //   原来没有 flexWrap —— 行里全是 flex:'none' 的牌子/列（日期、鲜活度、重要度、原文、改、删…），
      //   它们一多，那条 flex:1 的正文就被挤成**竖着的一条**（一个字一行）。
      //   清洗补键给两百多条补上键之后，行里又多一个牌子 → 立刻犯病。
      //   加 flexWrap：装不下就让牌子们**掉到下一行**，正文始终有地方
      //   （跟上面 nameBox 那条是同一个教训）
      // ⚠注意：2026-09-24（她说的「能搜到它的词和讲的是，移到下一条的那一格里面去了」）：
      //   分隔线**原来画在「行」上** —— 可每条下面还有一两行小字
      //   （「提炼前：…」「能搜到它的词：…」「讲的是：…」），
      //   它们在线的**下面** → 看着就像属于**下一条**了 ✗
      //   → 线挪到「整条」上（见 S.条），行自己不再画线
      row: { padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 10, rowGap: 2, alignItems: 'baseline' },
      // 「一整条」的分隔线：**连着下面那几行小字一起**框住
      条: { borderBottom: '1px solid var(--fish-line)' },
      btn: { padding: '8px 12px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-border)', background: 'var(--fish-control-fill)', color: 'inherit', cursor: 'pointer', fontSize: 'var(--fish-small)' },
      inp: { width: 88, padding: '8px 12px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-control-border)', background: 'transparent', color: 'inherit', fontSize: 'var(--fish-small)' },
      link: { color: 'var(--dsw-alias-label-secondary, var(--fish-info))', cursor: 'pointer', textDecoration: 'underline' },
      confirm: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '4px 0 8px 8px', padding: '6px 10px', borderRadius: 'var(--fish-radius-mid)', background: 'var(--fish-panel)', boxShadow: 'var(--fish-small-shadow)', border: '1px solid var(--fish-danger)', fontSize: 'var(--fish-small)' },
      // 注意：flexWrap：放大或窗口窄的时候要能换行，不然会横向撑出容器（右边就看不见了）✗
      nameBox: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', margin: '10px 0', padding: '12px 0', borderBottom: '1px solid var(--fish-line)', fontSize: 'var(--fish-small)' },
      editBox: { margin: 0, padding: 0, minWidth: 0 },
      askBox: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '8px 0', padding: '16px', borderRadius: 'var(--fish-radius-mid)', background: 'var(--fish-panel)', boxShadow: 'var(--fish-small-shadow)', border: '1px solid var(--fish-warning)', fontSize: 'var(--fish-small)' },
      barOut: { height: 10, borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-line)', overflow: 'hidden', border: '1px solid var(--fish-border)' },
      barIn: { height: '100%', background: 'var(--fish-accent)' },
      area: { width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-control-border)', background: 'transparent', color: 'inherit', fontSize: 'var(--fish-small)', lineHeight: 1.7, fontFamily: 'inherit', resize: 'vertical' },
      btnDanger: { padding: '8px 12px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-danger)', background: 'var(--fish-soft)', color: 'inherit', cursor: 'pointer', fontSize: 'var(--fish-small)' },
      ok: { color: 'var(--fish-success)' },
      drop: { color: 'var(--fish-danger)' },
      warn: { color: 'var(--fish-warning)' },
    }

    const GROUPS = [
      ['weight', '权重', '设置召回评分权重。合计为 100%，修改一项后自动调整其余项。'],
      ['time', '遗忘速度', '数值越大，衰减越慢。衰减影响召回排序，不删除记忆。'],
      ['gate', '门槛与条数', '设置单轮记忆注入数量与字数上限。'],
    ]

    function Section({ page, onPageChange, notify, active = true } = {}) {
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [d, setD] = React.useState(null)
      const post = (p, body) => {
        const selected = d?.sessions?.find(s => s.id === body?.session)
        const target = d?.sessions?.find(s => s.id === body?.to)
        return rawPost(p, { ...body, ...(selected?.qq ? { storeId: selected.storeId } : {}), ...(target?.qq ? { toStoreId: target.storeId } : {}) })
      }
      const [err, setErr] = React.useState(null)
      const [open, setOpen] = React.useState(null) // 打开哪个会话（两级结构）
      const [params, setParams] = React.useState(null)
      const policyDirty = React.useRef(new Set())
      const policyQueue = React.useRef(Promise.resolve())
      const namesQueue = React.useRef(Promise.resolve())
      const saveNames = body => {
        const request = namesQueue.current.catch(() => {}).then(() => post('/names', body)).then(result => {
          if (result?.ok) 告知('记忆设置已保存', { tone: 'success' })
          return result
        })
        namesQueue.current = request
        return request
      }
      const [pin, setPin] = React.useState(null) // 她刚改的那一项权重
      const [editing, setEditing] = React.useState(null) // 正在打字的那格（原样显示她敲的字）
      const [notes, setNotes] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [confirm, setConfirm] = React.useState(null) // 正在等确认的删除（二次确认，手滑不了）
      const [showDeleted, setShowDeleted] = React.useState(false)
      const [selfDraft, setSelfDraft] = React.useState({}) // 每个会话「她自己叫什么」的草稿
      const [ownerDraft, setOwnerDraft] = React.useState({}) // 每个会话「怎么称呼对方」的草稿
      const [edit, setEdit] = React.useState(null) // 正在改的那条：{id, text, importance}
      const [imp, setImp] = React.useState(null) // 档案导入：扫描结果 + 勾选状态
      const [impBusy, setImpBusy] = React.useState(false)
      const [impNote, setImpNote] = React.useState(null)
      const [impOpen, setImpOpen] = React.useState(false)
      // 进度放在组件外面（见上面「进度」那段）—— 她切走再回来，进度不该消失
      const [exp, setExpState] = React.useState(进度.扩词.状态)
      const [expNote, setExpNoteState] = React.useState(进度.扩词.说明)
      const [rf, setRfState] = React.useState(进度.提炼.状态)
      const [rfNote, setRfNoteState] = React.useState(进度.提炼.说明)
      const [复制开, set复制开] = React.useState(false) // 「复制记忆到别的会话」展开没有
      const [复制到, set复制到] = React.useState('') // 复制到哪个会话
      const [搜词, set搜词] = React.useState('') // 记忆列表的检索词
      const setExp = (v) => 改进度('扩词', v, 进度.扩词.说明)
      const setExpNote = (v) => 改进度('扩词', 进度.扩词.状态, v)
      const setRf = (v) => 改进度('提炼', v, 进度.提炼.说明)
      const setRfNote = (v) => 改进度('提炼', 进度.提炼.状态, v)
      const [画全部, set画全部] = React.useState(false) // 记忆列表要不要一次画完（默认只画前 200）
      const [看记忆, set看记忆] = React.useState(true) // 常用记忆列表默认展开
      // ⭐ 2026-09-21：列表顺序。记忆库是 push 顺序（老的在前），而下面只画前 200 条 ——
      //   不翻过来的话，她永远看不到刚写进来的那条（851 条里画的是最老的 200 条）。
      //   '新' = 最新的在最上面（默认）；'旧' = 最早的在前（想从头翻的时候用）
      const [顺序, set顺序] = React.useState('新')
      // ⭐ 2026-09-24（反馈）：**「记了时间的」和「没记时间的」混在一坨了** ✗
      //   库里 850 条只有 188 条有日期 —— 混在一起排，「中间那一段」全是没日期的，排序就白排了。
      //   原话：「要么就是这样分类，记了时间的和没记时间的分开……
      //            不然的话记和没记的就全混在一起了，这个排序就没办法用了」
      //   她要的是**自己切**（不是固定的两块）→ 三种视图轮着切
      //     '全部' = 老样子；'有时间' = 只看有日期的；'没时间' = 只看没日期的
      const [看哪边, set看哪边] = React.useState('全部')
      // ⭐ 2026-09-22（她要的）：长期事实那个「收理的文件夹」展开没有（**默认收着**）
      const [看事实, set看事实] = React.useState(false)
      const [localPage, setLocalPage] = React.useState('记忆库')
      const requestedPage = page ?? localPage
      const memoryPage = ['语义召回', '召回与遗忘', '召回设置'].includes(requestedPage) ? 'RAG 语义召回' : ['记忆库', 'RAG 语义召回'].includes(requestedPage) ? requestedPage : '记忆库'
      const setMemoryPage = onPageChange ?? setLocalPage
      const [dialogView, setDialogView] = React.useState('memories')
      const openLibrary = (id, view = 'memories') => {
        setOpen(id); setDialogView(view); setEdit(null); set查重开(false); set生成开(false)
        set看记忆(true); set看事实(true); setShowDeleted(true); set加在谁(id); setNotes(null)
      }
      // ⭐⭐ 2026-09-22（反馈：「查重我们是不是还没找到按钮」）：
      //   去重一直有，但都是**自动**的（召回时、导入时）—— **库里已有的重复没人管** ✗
      //   这里补一个手动查重：列出来、挑、才合
      const [查重, set查重] = React.useState(null) // 查重结果：{组, 真重复组数, 汇总组数, 能少}
      const [查重选, set查重选] = React.useState({}) // 第几组 → 留哪条的 id
      // ⭐⭐ 2026-09-23（她真被坑过一次）：**哪几组要合**。
      //   原来「按我选的合」是**把每一组都合掉** —— 而每组默认都选中了，
      //   于是一点就把「汇总+明细」那 105 组也合了，**123 条记忆没了**（回收站还被清空）✗
      //   → 改成：**「汇总+明细」默认不参与**，要合得一组一组自己勾
      const [查重合, set查重合] = React.useState({}) // 第几组 → 要不要合
      const [查重开, set查重开] = React.useState(false) // 面板展开没有
      // ⭐⭐ 2026-09-22（她要的）：**批量删除**，但**必须二次确认**
      //   原话：「再出一个批量删除，但还是需要 2 次确认的」
      //   ① 勾选（每条行首一个框）② 点「批量删」→ 出一个确认条 ③ 点「确定删」才真删
      //   删掉的是**收进「已删」**（不是销毁），能找回来
      const [选中, set选中] = React.useState({}) // 勾了哪些 id
      const [批删问, set批删问] = React.useState(false) // 二次确认条出来了没
      // ⭐ 2026-09-22（反馈「回收站还没有批量删除，就批量清空」）：
      //   「已删掉的」那一栏原来只有「一条条清」和「全清空」→ 补一个**批量清掉**
      //   注意：这个是**真销毁**（不是收起来）→ 界面必须问两遍
      const [选中清, set选中清] = React.useState({}) // 「已删」里勾了哪些
      const [批清问, set批清问] = React.useState(false)
      // ⭐⭐ 2026-09-23（反馈「这里没有批量找回呀」）：批量找回的确认
      const [批回问, set批回问] = React.useState(false)
      const [mdl, setMdl] = React.useState(null) // DSH 里有哪些模型可选
      // ⭐⭐ 2026-09-22（她的第十件）：**从会话生成档案** —— 给别人用的功能
      //   用户导入自己的会话 → 模型读一遍 → 出一份档案 → 再走「从旧档案导入」变成条目
      //   注意：四步分开，因为**第三步调模型、花钱**，得一批一批停下来看
      const [生成开, set生成开] = React.useState(false) // 面板展开没有
      const [生成会话, set生成会话] = React.useState(null) // 这个工作区有哪些会话
      const [生成选, set生成选] = React.useState({}) // 勾了哪几个
      const [生成计划, set生成计划] = React.useState(null) // 算出来的：几批、多少字、多少 token
      const [生成条目, set生成条目] = React.useState([]) // 攒下来的条目
      const [生成进度, set生成进度] = React.useState(null) // {批号, 批数, 在跑, 模型}
      const [生成档, set生成档] = React.useState(null) // 存好了：{存到, 条数, 预览}
      const [生成备, set生成备] = React.useState(null) // 给模型用的备用模型（可选）
      const [生成诊断, set生成诊断] = React.useState(null) // 列表跟 DSH 对不上时，看这几个数
      // ⭐⭐ 2026-09-22（反馈：「点存档案的地方应该自定义」）：
      //   原来存到哪儿是我**写死的**（`.dsh\生成的档案.md`）失败：→ 能打、能选
      const [生成存到, set生成存到] = React.useState('')
      const [生成目录列, set生成目录列] = React.useState(null) // 文件夹选择器的列表
      const [生成选目录, set生成选目录] = React.useState(false)
      const [impDir, setImpDir] = React.useState(null) // 档案目录草稿
      const [impNames, setImpNames] = React.useState(null) // 「指她的名字」草稿
      const [impDirs, setImpDirs] = React.useState(null) // 文件夹选择器的列表
      const [找名字, set找名字] = React.useState(null) // 自动找出来的称呼候选
      const [看原文, set看原文] = React.useState({}) // 哪几条在对照「提炼前」的原文
      // ---- 2026-09-21 新加：后台手动加一条记忆 ----
      const [加内容, set加内容] = React.useState('')
      const [加时间, set加时间] = React.useState('') // 留空 = 现在
      const [加重要, set加重要] = React.useState('0.5') // 三档是快捷，也能自己填
      const [加词, set加词] = React.useState('') // 关键词，空格分开
      const [加在谁, set加在谁] = React.useState('') // 加到哪个会话（默认第一个开着的，没有就第一个）
      const set加结果 = result => {
        const text = result && result.文字
        if (text) 告知(text, result && result.ok ? { tone: 'success' } : { holdMs: 6000 })
      }

      // 「指她的名字」那一格：读出来、点一下加/减
      const 名字串 = () => (impNames !== null ? impNames : (imp.data && imp.data.用户名字 ? imp.data.用户名字 : []).join(','))
      const 名字们 = () => 名字串().split(/[,，]/).map((x) => x.trim()).filter(Boolean)
      const 已选名字 = (n) => 名字们().indexOf(n) >= 0
      const 点名字 = (n) => {
        const 有 = 名字们()
        const i = 有.indexOf(n)
        if (i >= 0) 有.splice(i, 1)
        else 有.push(n)
        setImpNames(有.join(','))
      }
      // 「这个不是名字」—— 昵称、旧事里的称呼…… 标了就存起来，以后不再出现、也不会被换掉
      const 标掉名字 = (n) => {
        const 现有 = 找名字 && Array.isArray(找名字.不是名字) ? 找名字.不是名字.slice() : []
        if (现有.indexOf(n) < 0) 现有.push(n)
        saveNames({ notNames: 现有 })
          .then(() => post('/names/scan', { session: open, dir: impDir !== null ? impDir : imp.data.dir }))
          .then((r) => {
            set找名字(r)
            const 剩 = 名字们().filter((x) => x !== n)
            setImpNames(剩.join(','))
          })
          .catch((e) => setExpNote('标不了：' + String((e && e.message) || e)))
      }

      // 一个候选名字块：点名字=加/减，点 ✕ = 标成「不是名字」✓
      const 一个名字块 = (x, 淡) =>
        React.createElement(
          'span',
          {
            key: x.name,
            style: Object.assign({}, S.btn, {
              cursor: 'pointer',
              opacity: 淡 ? 0.7 : 1,
              color: 已选名字(x.name) ? 'var(--fish-success)' : 'inherit',
            }),
          },
          React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  onClick: () => 点名字(x.name) }, (已选名字(x.name) ? '' : '') + x.name + ' ' + x.n),
          React.createElement(
            'span',
            {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
              style: Object.assign({}, S.dim, { marginLeft: 5, cursor: 'pointer' }),
              title: '标记为非称呼，后续不再识别或替换',
              onClick: (e) => {
                if (e && e.stopPropagation) e.stopPropagation()
                标掉名字(x.name)
              },
            },
            '✕',
          ),
        )

      const load = React.useCallback(() => {
        return get('/list')
          .then((x) => {
            setD(x)
            if (x && x.policy) setParams(old => Object.assign({}, x.policy, old ? Object.fromEntries([...policyDirty.current].map(key => [key, old[key]])) : {}))
            setErr(null)
          })
          .catch((e) => setErr(String((e && e.message) || e)))
      }, [])

      React.useEffect(() => {
        if (active) load()
      }, [load, active])

      // ---- 2026-09-21 新加：手动加一条（提交）----
      // 加到哪个会话：她选的；没选就挑第一个开着的，都没有就第一个
      // ⭐ 1.2.8（issue #8「手动加的记忆跑到别的会话去了」）：
      //   以前没选就**默默挑第一个开着的会话** —— 两个都开着时，她打开的是 B，记忆却加到了 A。
      //   现在优先用「你正打开的这个会话」，再退回第一个开着的。
      const 加哪个会话 = React.useCallback(() => {
        if (加在谁) return 加在谁
        if (open) return String(open)
        const 列 = (d && d.sessions) || []
        const 开着的 = 列.find((x) => x.enabled)
        return (开着的 || 列[0] || {}).id || ''
      }, [加在谁, open, d])

      const 提交一条 = React.useCallback(() => {
        const 内容 = 加内容.trim()
        if (!内容) {
          set加结果({ ok: false, 文字: '内容不能空' })
          return
        }
        const 会话 = 加哪个会话()
        if (!会话) {
          set加结果({ ok: false, 文字: '无可用目标会话' })
          return
        }
        const 重要 = Number(加重要)
        post('/add', {
          session: 会话,
          text: 内容,
          at: 加时间.trim(),
          importance: Number.isFinite(重要) ? 重要 : 0.5,
          tags: 加词.trim() ? 加词.trim().split(/[\s,，、]+/).filter(Boolean) : [],
        })
          .then((r) => {
            if (r && r.ok) {
              set加结果({ ok: true, 文字: '添加成功（当前库共 ' + r.count + ' 条）' })
              set加内容('')
              set加时间('')
              set加词('')
              load()
            } else {
              set加结果({ ok: false, 文字: (r && (r.error || r.message)) || '添加失败' })
            }
          })
          .catch((e) => set加结果({ ok: false, 文字: String((e && e.message) || e) }))
      }, [加内容, 加时间, 加重要, 加词, 加哪个会话, load])

      // 订阅外面那个「进度」—— 切走再回来也看得到还在跑
      React.useEffect(() => {
        const 同步 = () => {
          setExpState(进度.扩词.状态)
          setExpNoteState(进度.扩词.说明)
          setRfState(进度.提炼.状态)
          setRfNoteState(进度.提炼.说明)
        }
        进度.订阅.add(同步)
        同步()
        return () => {
          进度.订阅.delete(同步)
        }
      }, [])

      // 切回这个页面就重读一遍 —— 不然得手动按「刷新」才看得到别处刚发生的变化
      // 注意：但一定要**限流**：库里有 800 多条的时候，/list 要吐 1 MB 左右，
      //   每次切窗口都重读 + 重画一遍，整个页面（连带别的插件面板）都会卡住 ✗
      React.useEffect(() => {
        if (typeof window === 'undefined' || !window.addEventListener) return
        let 上次 = 0
        const 回来就重读 = () => {
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
          if ((进度.扩词.状态 && 进度.扩词.状态.running) || (进度.提炼.状态 && 进度.提炼.状态.running)) return // 正跑着提炼/扩词，别抢
          const 现在 = Date.now()
          if (现在 - 上次 < 10000) return // 10 秒内只读一次
          上次 = 现在
          load()
        }
        window.addEventListener('focus', 回来就重读)
        document.addEventListener('visibilitychange', 回来就重读)
        return () => {
          window.removeEventListener('focus', 回来就重读)
          document.removeEventListener('visibilitychange', 回来就重读)
        }
      }, [load])

      if (err && !d) return h('div', { className: 'memory-feedback', role: 'alert' }, h('p', null, '无法读取长期记忆：' + err), h('button', { type: 'button', className: 'fish-button', onClick: load }, '重试'))
      if (!d || !params) return React.createElement('div', { className: 'fish-module fish-memory', style: S.wrap }, '加载中…')

      const now = Date.now()
      const libraries = [...new Map((d.sessions || []).map(s => [s.storeId || s.id, s])).values()]
      const libraryTitle = s => s.qq && s.storeId?.endsWith('_shared') ? '普通群共享记忆' : s.title || s.id

      // ---- 第二级：某个会话的详情 ----
      const 详情视图 = (() => {
        if (!open) return null
        const s = (d.sessions || []).find((x) => x.id === open)
        if (!s) return React.createElement('div', { className: 'fish-module fish-memory', style: S.wrap }, '目标会话不存在')
        const tr = (s.traces || []).slice(-1)[0]
        const 删 = (id, action) => post('/delete', { session: open, id, action }).then(() => { setConfirm(null); load() })
        // ⭐⭐ 2026-09-23（反馈「过期条目没标作废」）：
        //   撤销「已被取代」—— 标错了、或者状态又变回来了
        //   （不删任何东西，只把那面小旗子摘掉，摘完它又能被想起来）
        const 撤销作废 = (id) => {
          setBusy(true)
          post('/delete', { session: open, action: 'unsupersede', id: id })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['撤销失败：' + ((r && r.message) || '？')])
                return
              }
              setNotes(['' + r.message])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['撤销失败：' + ((e && e.message) || e)])
            })
        }
        // 提炼改坏了 —— 退回原文（单条 / 全部）✓
        const 退原文 = (id) =>
          post('/refine/undo', id === '*' ? { session: open, all: true } : { session: open, id: id })
            .then((r) => {
              setConfirm(null)
              setExpNote('退回了 ' + ((r && r.退了) || 0) + ' 条原文')
              load()
            })
            .catch((e) => setExpNote('退不回：' + String((e && e.message) || e)))
        // 把这一份记忆复制到别的会话（新对话没有上下文，测起来最干净）✓
        const 复制过去 = () =>
          post('/copy-to', { session: open, to: 复制到 })
            .then((r) => {
              setConfirm(null)
              const 尾巴 = []
              if (r && r.复制了) 尾巴.push('新增 ' + r.复制了 + ' 条')
              else 尾巴.push('未添加任何条目')
              if (r && r.重复) 尾巴.push('重复跳过 ' + r.重复 + ' 条')
              if (r && r.保留) 尾巴.push('目标已有 ' + r.保留 + ' 条已保留')
              setExpNote(r && r.ok ? '' + 尾巴.join('，') + '；已启用目标会话记忆' : '失败：' + ((r && r.message) || '？'))
              load()
            })
            .catch((e) => setExpNote('失败：' + String((e && e.message) || e)))

        // 二次确认条（点「删」之后才出现，手滑不了）
        const 确认条 = (text, okLabel, action, id) =>
          React.createElement(
            'div',
            { style: S.confirm },
            React.createElement('span', { style: { flex: 1, minWidth: 0, overflowWrap: 'anywhere' } }, text),
            React.createElement('button', {type: 'button',  style: S.btnDanger, onClick: () => 删(id, action) }, okLabel),
            React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
          )

        // 改一条：文本框 + 重要度 + 存 / 算了
        const 改一条 = (m) =>
          React.createElement(
            'div',
            { className: 'memory-editor', style: S.editBox },
            React.createElement('textarea', {'aria-label': '记忆正文',
              style: S.area,
              rows: 3,
              value: edit.text,
              onChange: (e) => setEdit(Object.assign({}, edit, { text: e.target.value })),
            }),
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 6 } },
              React.createElement('span', { style: S.dim }, '重要度'),
              React.createElement(
                'select',
                {'aria-label': '重要度',
                  style: S.inp,
                  value: String(edit.importance),
                  onChange: (e) => setEdit(Object.assign({}, edit, { importance: Number(e.target.value) })),
                },
                React.createElement('option', { value: '0' }, '一般'),
                React.createElement('option', { value: '0.5' }, '重要'),
                React.createElement('option', { value: '1' }, '非常重要（长期保留）'),
              ),
              React.createElement('span', { style: Object.assign({}, S.dim, { flex: 1, fontSize: 'var(--fish-small)' }) }, '修改前自动备份'),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  disabled: !String(edit.text || '').trim(),
                  onClick: () =>
                    post('/edit', { session: open, id: m.id, text: edit.text, importance: edit.importance }).then(() => {
                      setEdit(null)
                      load()
                    }),
                },
                '保存修改',
              ),
              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setEdit(null) }, '取消'),
            ),
          )

        const 一条记忆 = (m) =>
          React.createElement(
            'div',
            // 注意：分隔线画在**整条**上（不是里面那个「行」）——
            //   这样下面那几行小字（能搜到它的词 / 讲的是）算在**这一条**里
            { key: m.id, className: 'memory-entry-card', style: S.条 },
            React.createElement(
              'div',
              { className: 'fish-record-row', style: S.row },
              // ⭐ 2026-09-22（她要的批量删除）：行首一个勾选框
              React.createElement('input', {'aria-label': '选择记忆：' + m.text,
                type: 'checkbox',
                checked: !!选中[m.id],
                title: '选择后可批量删除',
                onChange: () => set选中(Object.assign({}, 选中, { [m.id]: !选中[m.id] })),
              }),
              React.createElement('div', { style: Object.assign({}, S.dim, { width: 96, flex: 'none' }) }, rel(m.at, now)),
              React.createElement(
                // ⚠注意：正文这一格给个**下限**（flexBasis 260 / minWidth 200）✗
                //   光有 flex:1 是不够的：它允许被压到 0，右边牌子一多就成竖条。
                //   有了下限 + 上面那条 flexWrap，装不下时是**牌子换行**，不是正文变窄
                'div',
                { style: { flex: '1 1 260px', minWidth: 200, overflowWrap: 'anywhere', wordBreak: 'break-word' } },
                m.已被取代
                  ? React.createElement(
                      'span',
                      {
                        style: Object.assign({}, S.dim, { textDecoration: 'line-through', opacity: 1 }),
                        title: '条目已被取代（' + (m.已被取代.为什么 || '') + '），已停止召回，原文保留',
                      },
                      m.text,
                    )
                  : m.text,
              ),
              // ⭐⭐ 2026-09-23（反馈「过期条目没标作废」）：
              //   标了「已被取代」的，行里直接挂一个「已被取代」的牌子 + 一个撤销口
              m.已被取代
                ? React.createElement(
                    'div',
                    {
                      style: { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10, padding: '1px 6px', borderRadius: 8, background: 'var(--fish-soft)', color: 'var(--fish-warning)', overflowWrap: 'anywhere' },
                      title: (m.已被取代.为什么 || '') + '（' + rel(m.已被取代.作废于, now) + '），已停止注入，原文保留',
                    },
                    '已被取代',
                  )
                : null,
              m.已被取代
                ? React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }),
                      title: '撤销取代标记并恢复召回',
                      onClick: () => 撤销作废(m.id),
                    },
                    '恢复',
                  )
                : null,
              // ⭐⭐ 2026-09-23：**事实键** —— 注意：不挂在行里，改挂到下面那行小字
              //   行里每多一个固定宽的牌子，正文就被挤窄一分；
              //   键本来就是「附注」性质，跟「能搜到它的词」放一起正合适（见下面那条）
              React.createElement(
                'div',
                { style: Object.assign({}, S.dim, { whiteSpace: 'nowrap', flex: 'none', fontSize: 'var(--fish-small)' }), title: '鲜活度用于召回排序。长期事实不衰减，未标日期的条目使用配置值。' },
                // ⭐⭐ 2026-09-22（反馈：「没标时间的还是鲜活 100%」）：
                //   光显示百分比会骗人 —— 长期事实本来就不淡，写「100%」像在说「刚发生」✗
                //   → 长期事实写「**不淡**」✓
                //   ⭐ 2026-09-22 再改（发现流水账来问）：**没记时间的也会淡了**
                //     （从「记下来的那天」开始算）→ 它们照常显示百分比
                //     （原来显示「没记时间」，那是我上一版判错了 —— 它们并不是不淡）
                m.freshKind === 'fact' ? '长期'
                  : typeof m.activation === 'number' && isFinite(m.activation) ? '鲜活 ' + Math.round(m.activation * 100) + '%' : '—',
              ),
              React.createElement('div', { style: Object.assign({}, S.dim, { whiteSpace: 'nowrap', flex: 'none', fontSize: 'var(--fish-small)' }) }, impName(m.importance)),
              m.textBefore
                ? React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }),
                      title: '查看提炼前原文',
                      onClick: () => set看原文(Object.assign({}, 看原文, { [m.id]: !看原文[m.id] })),
                    },
                    看原文[m.id] ? '收起' : '原文',
                  )
                : null,
              m.textBefore
                ? React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10, color: 'var(--fish-warning)' }),
                      title: '恢复原文，可重新提炼',
                      onClick: () => setConfirm({ id: m.id, kind: 'refineundo' }),
                    },
                    '退回',
                  )
                : null,
              React.createElement(
                'div',
                {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }), onClick: () => setEdit({ id: m.id, text: m.text, importance: typeof m.importance === 'number' ? m.importance : 0.5 }) },
                '编辑',
              ),
              React.createElement('div', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)' }), onClick: () => setConfirm({ id: m.id, kind: 'delete' }) }, '删除'),
            ),
            m.qqSource ? React.createElement('div', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', overflowWrap: 'anywhere' }) },
              '来源：' + m.qqSource.type + ' ' + m.qqSource.chatId + ' · ' + ({ owner: '主人私聊', member: '群成员', peer: '私聊对象', manual: '人工记录（对象待核对）' }[m.qqSource.role] || '对象待核对') + ' · 发送者：' + ((m.qqSource.senders || []).join(', ') || '未确认')) : null,
            edit && edit.id === m.id ? 改一条(m) : null,
            confirm && confirm.id === m.id && confirm.kind === 'refineundo'
              ? React.createElement(
                  'div',
                  { style: S.confirm },
                  React.createElement('span', { style: { flex: 1 } }, '恢复提炼前原文并重置提炼状态？'),
                  React.createElement('button', {type: 'button',  style: S.btn, onClick: () => 退原文(m.id) }, '退回'),
                  React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                )
              : null,
            m.textBefore && 看原文[m.id]
              ? React.createElement(
                  'div',
                  {
                    style: Object.assign({}, S.dim, {
                      margin: '4px 0 8px',
                      fontSize: 'var(--fish-small)',
                      whiteSpace: 'pre-wrap',
                      // 注意：pre-wrap 只在空格/换行处断，长串（网址、长英文）照样横向撑破面板 —— 得补这两条
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      borderLeft: '2px solid var(--fish-warning)',
                      paddingLeft: 8,
                    }),
                  },
                  '提炼前：' + m.textBefore,
                )
              : null,
            m.related && m.related.length
              ? React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { margin: '4px 0 8px', fontSize: 'var(--fish-small)', overflowWrap: 'anywhere', wordBreak: 'break-word' }) },
                  '检索词：' + m.related.join(' '),
                )
              : null,
            // ⭐⭐ 2026-09-23：**「这条讲的是哪件事」** —— 挂在这儿（第二行小字），不占行里的宽度
            //   ⚠注意：别用「事实键」这种我自己造的词 ——
            //     她说了「让人看不懂，写通俗一点的」✗
            m.事实键
              ? React.createElement(
                  'div',
                  { style: { margin: '4px 0 8px', fontSize: 'var(--fish-small)', overflowWrap: 'anywhere', wordBreak: 'break-word' } },
                  React.createElement('span', { style: S.dim }, '关联事实：'),
                  React.createElement(
                    'span',
                    {
                      style: { padding: '1px 6px', borderRadius: 8, background: 'var(--fish-soft)', color: 'var(--fish-info)', overflowWrap: 'anywhere' },
                      title:
                        '关联事实为「' + m.事实键 + '」。' +
                        '同一事实仅保留最新条目，旧条目可恢复。',
                    },
                    m.事实键,
                  ),
                )
              : null,
            confirm && confirm.id === m.id && confirm.kind === 'delete'
              ? 确认条('将此条目移入回收站？删除后可恢复。', '移入回收站', 'delete', m.id)
              : null,
          )

        const 已删 = s.deleted || []
        // ⭐⭐ 2026-09-24（她说的「那已被取代应该回回收站呀」）：
        //   被取代的**从主列表挪走**，收进「已删掉的」那一栏
        //   理由：它们已经不再被注入了，跟「收起来的」是一个性质，
        //         摆在主列表里只是占地方（还会挂个牌子把正文挤窄）
        //
        //   ⚠注意：但**不许挪进 `s.deleted`** —— 那是「她亲手删的」那一栏，
        //     「批量清掉」「把已删掉的清空」会**真销毁**它们 ✗
        //     被取代的是**自动标的**（几百条一起），
        //     不该被那两个按钮连坐销毁 —— 那正是丢 157 条那次的教训 ✗✗
        //   → 所以：**显示上**收进回收站，**数据上**还留在 memories 里，
        //     只是带一个「已被取代」的旗子
        const 被取代的 = (s.memories || []).filter((m) => m.已被取代)
        const 活着的 = (s.memories || []).filter((m) => !m.已被取代)

        // ---- 记忆列表的检索（几百条的时候靠翻是翻不到的）----
        // 正文、提炼前的原文、检索词、来源、id 都能搜
        const 关键字 = 搜词.trim().toLowerCase()
        const 搜过 = 关键字
          ? 活着的.filter((m) => {
              const 包 = (x) => String(x || '').toLowerCase().indexOf(关键字) >= 0
              return (
                包(m.text) ||
                包(m.textBefore) ||
                包(m.source) ||
                包(m.id) ||
                (Array.isArray(m.related) && 包(m.related.join(' ')))
              )
            })
          : 活着的

        // ⭐ 2026-09-24（反馈）：**把「记了时间的」和「没记时间的」分开**
        //   上一版它们混在一个列表里 —— 188 条有日期的排在上面，下面 662 条没日期的
        //   挤成「中间一坨」，看着就像排序坏了。原话：
        //   「还有中间没有记日期的，全卡在中间一坨了……不然的话记和没记的就全混在一起了，
        //     这个排序就没办法用了」
        //   她要**自己切** → 三种视图轮着切
        const 有时间 = (m) => !!m.at
        // ⭐⭐ 2026-09-22（她要的）：**「永远不淡」单独收成一栏**
        //   原话：「改了就会归纳到那个永远不会淡的那一行里去了，就是那一行，
        //              我们是**单独做一个收理的文件夹一样**的，不然的话那些就不需要露在外面」
        //   ⭐ 又说：「**外面都是会淡的，里面才是不会淡的**，就不用管里面了」
        //   ⚠注意：2026-09-22 再改（发现两条流水账被误标）：
        //     **「不会淡」的只有一类：长期事实**
        //     上一版我拿「鲜活度是不是钉住的」当判据 —— 那是**算分的副作用**，不是语义 ✗
        //     结果把 394 条**没抠到日期的流水账**错收进「不会淡的」里 ✗✗
        //     （一眼就看出不对）
        //     没记时间的现在**也会淡**（从「记下来的那天」开始算）→ 算「会淡的」✓
        const 不会淡 = (m) => m.category === 'stable_profile'
        const 过滤后 =
          看哪边 === '有时间'
            ? 搜过.filter(有时间)
            : 看哪边 === '没时间'
              ? 搜过.filter((m) => !有时间(m))
              : 看哪边 === '长期事实'
                ? 搜过.filter(不会淡)
                : 看哪边 === '会淡的'
                  ? 搜过.filter((m) => !不会淡(m))
                  : 搜过

        // ⭐ 排好序再画 —— 按**最左边那一列的日期**排 ✗✗
        //   上一版写的是 过滤后.slice().reverse()，那是把数组倒过来（谁先记谁在前翻个个儿），
        //   **根本没看日期**。所以补完日期顺序一点没变 —— 她一眼就看出来了 ✗
        // 这一版：有日期的按日期排，**没日期的排最后**（没日期 = 不知道啥时候的事，
        //   搁在中间会把有日期的顶散）✓
        // 注意：「没时间」那个视图里全是没日期的 → 保留类里原来的相对次序（谁先记谁在前），
        //   这样「旧的在前 / 新的在前」切一下还能看出入库先后来
        const 排序 = (m) => {
          const t = m.at ? new Date(m.at).getTime() : NaN
          return isFinite(t) ? t : null
        }
        const 排好 = 过滤后.slice().sort((a, b) => {
          const ta = 排序(a)
          const tb = 排序(b)
          if (ta === null && tb === null) return 0 // 都没日期：保持原来的相对次序
          if (ta === null) return 1 // 没日期的沉到最后
          if (tb === null) return -1
          return 顺序 === '旧' ? ta - tb : tb - ta
        })
        // 「没时间」那个视图里没有日期可比 —— 想按入库先后翻的时候还得能用
        const 画这个 = 看哪边 === '没时间' && 顺序 === '新' ? 排好.slice().reverse() : 排好
        const 有时间数 = 活着的.filter(有时间).length
        const 没时间数 = 活着的.length - 有时间数
        // ⭐ 2026-09-22：**不会淡的**单独收一栏（「全部」视图里才拆）
        //   ⭐ 判据 = 鲜活度钉住的那批（长期事实 + 没时间的）——
        //     原话：「外面都是会淡的，里面才是不会淡的」
        //   注意：2026-09-24：口径换成**活着的** —— 被取代的已经收进回收站了，
        //     不该还算在「会淡的/不会淡的」这些数里 ✗
        const 事实总数 = 活着的.filter(不会淡).length
        const 会淡总数 = 活着的.length - 事实总数

        // ⭐ 2026-09-21 晚：补日期 —— 正文里写着日期、当时却没抠出来的
        //   （老版本 抠日期 必须要四位数年份，而档案里写的是「09-17」「8月26日」）
        const 没日期的 = 活着的.filter((m) => !m.at).length
        const 补日期 = () => {
          setConfirm(null)
          setBusy(true)
          post('/backfill-dates', { session: s.id })
            .then((r) => {
              setBusy(false)
              setNotes([
                r && r.补了
                  ? '已补充 ' + r.补了 + ' 条日期' + (r.猜的 ? '（其中 ' + r.猜的 + ' 条年份按最近日期推定）' : '') + '，剩余 ' + r.还是没 + ' 条正文未包含日期'
                  : '正文无可识别日期',
              ])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['补日期失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐⭐ 2026-09-22（反馈）：**补标「永远不淡」** ——
        //   提炼原来只改重要度、不碰分类（0.7.6 才修好），
        //   所以实测库里 135 条该「永远不淡」的被标成了会淡的（重要的日子就在里面）。
        //   修好提炼只影响以后的，已经记下的那些得**单独补一遍**
        //   一条条问模型太慢 → 一批一批来，界面循环调（照「补日期」的样子）
        //   ⭐⭐ 2026-09-22 晚（反馈：「有好多那种就不该是长期事实的」）：
        //     现在判**所有没判过的**（不只「会淡的」）—— 该升的升、**该降的降**
        const 没判过的 = (s.memories || []).filter((m) => !m.stableChecked).length
        // ⭐ 2026-09-22（她要的批量删除）：勾了几条
        const 已选几条 = Object.keys(选中).filter((k) => 选中[k]).length
        // ⭐ 2026-09-22：判过几条（用来显示「重判一遍」）
        const 判过的 = (s.memories || []).filter((m) => m.stableChecked).length
        // ⭐ 2026-09-22（回收站的批量清掉）：勾了几条
        const 已选清几条 = Object.keys(选中清).filter((k) => 选中清[k]).length
        const 补不淡 = (重判) => {
          setConfirm(null)
          setBusy(true)
          let 累计判 = 0
          let 累计升 = 0
          let 累计降 = 0
          let 连着失败 = 0
          let 连着空 = 0
          let 头一趟 = true
          补标进度.在跑 = true
          补标进度.重判 = !!重判
          补标进度.已 = 0
          补标进度.总 = (s.memories || []).length
          补标进度.等 = 0
          const 跑 = () => {
            // 注意：重判：只在**第一趟**带这个参数（服务端会把所有「判过」标记清掉再从头判）
            const 体 = { session: s.id, 每批: 20 }
            if (重判 && 头一趟) 体.重判 = true
            头一趟 = false
            post('/backfill-stable', 体)
              .then((r) => {
                if (!r || !r.ok) {
                  // ⚠注意：2026-09-22（反馈：跑到一半「模型报错：429 status code (no body)」）：
                  //   限流是**暂时的**，不该直接放弃 —— 等一等再试同一批
                  //   指数退避：5s → 10s → 20s → 40s → 60s，最多 6 次
                  const 是限流 = /429|rate.?limit|too many|限流|超限/i.test(String((r && r.message) || ''))
                  if (是限流 && 连着失败 < 6) {
                    连着失败++
                    const 等 = Math.min(60000, 5000 * Math.pow(2, 连着失败 - 1))
                    补标进度.等 = Math.round(等 / 1000)
                    setNotes([
                      '模型请求受限（429），等待 ' + Math.round(等 / 1000) + ' 秒后重试（第 ' + 连着失败 + ' 次）',
                      '已保存进度，可继续处理',
                    ])
                    setTimeout(跑, 等)
                    return
                  }
                  补标进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '补标失败：' + ((r && r.message) || '？'),
                    '已保存进度，重试将继续处理',
                  ])
                  return
                }
                连着失败 = 0
                补标进度.等 = 0
                累计判 += r.判了 || 0
                累计升 += r.改成不淡 || 0
                累计降 += r.降成会淡 || 0
                补标进度.已 = 累计判
                if (r.共) 补标进度.总 = r.共
                // ⚠注意：2026-09-22 修（反馈「他就卡着判着呢」）：
                //   原来这里判「完了没」用的是 `判了 > 0` ——
                //   **一批回 0 条（模型没回东西）就被当成「判完了」直接停** ✗
                //   日志实锤：07:09:21「判了 0 条，还剩 665」之后就没动静了
                //   → 改成看**服务端的 done**；一批回 0 就**接着试下一批**
                //     连着 3 批都空才停（说明模型那边真出问题了），并说清楚
                连着空 = (r.判了 || 0) === 0 ? 连着空 + 1 : 0
                setNotes([
                  '判定中：已处理 ' + 累计判 + ' 条：' + 累计升 + ' 条标记为长期事实、' +
                    累计降 + ' 条转为普通记忆' + (r.done ? '' : '，剩余 ' + r.剩 + ' 条') +
                    (r.判了 === 0 && !r.done ? '（本批次无有效输出，继续下一批）' : ''),
                ])
                // 注意：每批之间**慢一点** —— 300ms 太急，容易撞限流（反馈就是 429 挂的）
                if (!r.done) {
                  if (连着空 >= 3) {
                    补标进度.在跑 = false
                    setBusy(false)
                    setNotes([
                      '连续 3 批无有效输出，已暂停（剩余 ' + r.剩 + ' 条）。',
                      '已保存进度，重试将继续处理',
                    ])
                    return
                  }
                  setTimeout(跑, 1500)
                } else {
                  补标进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '判定完成：共 ' + 累计判 + ' 条 —— ' + 累计升 + ' 条标记为长期事实，' +
                      累计降 + ' 条改为普通记忆',
                    '（已完成全部未判定条目）',
                  ])
                  load()
                }
              })
              .catch((e) => {
                补标进度.在跑 = false
                setBusy(false)
                setNotes(['补标失败：' + ((e && e.message) || e), '已保存进度，重试将继续处理'])
              })
          }
          跑()
        }

        // ⭐⭐ 2026-09-23（第三步）：**清洗补键** —— 给老记忆补「事实键」✓
        //
        //   为什么单独一步：提炼只影响**以后**导入的；
        //   老库里那些条目是导入时进来的，**本来就没有键** ——
        //   不补的话「同一个 key 只留最新一条」对老数据一点用都没有 ✗
        //
        //   ⚠注意：**只在设置页点按钮跑，不在对话里跑**（她的死规矩）：
        //     几百条要调几百次模型，挂在对话那一轮上会把那轮卡死。
        //   注意：先「干跑」看一眼，确认了再真洗 —— 这一步要改几百条，别一上来就动库
        // 注意：算「还剩几条要洗」要跟服务端的 `要洗` **同一个口径** ——
        //   洗过的（含判了留空的）不算，不然按钮上的数字永远不消 ✗
        const 没键的 = (s.memories || []).filter((m) => !m.已被取代 && !m.refinedSkip && !m.事实键 && !m.洗键过).length
        // 判了「留空」的那些（洗过、但没键）—— 单独报个数，免得她以为漏了
        const 判留空的 = (s.memories || []).filter((m) => !m.事实键 && m.洗键过).length
        // ⚠注意：撤回按钮上的数字要跟**它真能撤的**对得上 ✗
        //   原来用的是「所有带键的」—— 把她自己手工填的也算进去了，
        //   于是按钮写「撤掉这次标的（5）」、真撤只撤掉 2 条，数对不上（她会以为坏了）
        const 可撤的 = (s.memories || []).filter((m) => m.键来源 === '清洗补键' || m.洗键过).length
        const 洗键 = (干跑) => {
          setConfirm(null)
          setBusy(true)
          let 累计洗 = 0
          let 累计给 = 0
          let 累计空 = 0
          let 累计废 = 0
          let 连着失败 = 0
          let 连着空 = 0
          洗键进度.在跑 = true
          洗键进度.干跑 = !!干跑
          洗键进度.已 = 0
          洗键进度.总 = 没键的
          const 跑 = () => {
            // 注意：干跑：只跑**一批**就停 —— 让她看几个例子再决定，
            //   不许拿几百次模型调用去"试" ✗
            const 体 = { session: s.id, 每批: 8, 干跑: !!干跑 }
            post('/wash-keys', 体)
              .then((r) => {
                if (!r || !r.ok) {
                  const 是限流 = /429|rate.?limit|too many|限流|超限/i.test(String((r && r.message) || ''))
                  if (是限流 && 连着失败 < 6) {
                    连着失败++
                    const 等 = Math.min(60000, 5000 * Math.pow(2, 连着失败 - 1))
                    setNotes([
                      '模型请求受限（429），等待 ' + Math.round(等 / 1000) + ' 秒后重试（第 ' + 连着失败 + ' 次）',
                      '已保存进度，可继续处理',
                    ])
                    setTimeout(跑, 等)
                    return
                  }
                  洗键进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '清洗失败：' + ((r && r.message) || '？'),
                    '已保存进度，重试将继续处理',
                  ])
                  return
                }
                连着失败 = 0
                累计洗 += r.洗了 || 0
                累计给 += r.给了键 || 0
                累计空 += r.留空 || 0
                累计废 += r.作废了 || 0
                洗键进度.已 = 累计洗
                if (r.总数) 洗键进度.总 = 没键的
                // ⚠注意：「模型整批没回出东西」才算失败，**不许拿「给了键 === 0」当信号** ✗
                //   模型正常地把一批全判成留空时，给了键也是 0 ——
                //   原来按那个数，连着 3 批就误报「模型没回出键」停下来（实测踩到过）
                连着空 = (r.没回出东西 || 0) >= (r.洗了 || 0) ? 连着空 + 1 : 0
                if (干跑) {
                  // 干跑：把几个例子摆出来，让她看一眼标得对不对
                  洗键进度.在跑 = false
                  setBusy(false)
                  const 例 = (r.示例 || []).map((x) => '　「' + x.键 + '」　←　' + x.正文)
                  setNotes(
                    [
                      '试运行：处理 ' + (r.洗了 || 0) + ' 条，原文保留；已标注 ' + (r.给了键 || 0) + ' 条、无需标注 ' + (r.留空 || 0) + ' 条',
                      '标注结果（事实键 → 记忆正文）',
                    ]
                      .concat(例.length ? 例 : ['　（本批次无需标注）'])
                      .concat(['', '核对结果后可执行全部标注。此操作为可选项。']),
                  )
                  return
                }
                setNotes([
                  '标注中：已处理 ' + 累计洗 + ' 条，已标注 ' + 累计给 + ' 条、无需标注 ' + 累计空 + ' 条' +
                    (累计废 ? '、归档 ' + 累计废 + ' 条' : '') +
                    (r.done ? '' : '，剩余 ' + r.剩 + ' 条'),
                ])
                if (!r.done) {
                  if (连着空 >= 3) {
                    洗键进度.在跑 = false
                    setBusy(false)
                    setNotes([
                      '连续 3 批无输出，已暂停（剩余 ' + r.剩 + ' 条）。',
                      '已保存标注进度，重试将继续处理',
                      '（无需标注的批次将自动跳过）',
                    ])
                    return
                  }
                  setTimeout(跑, 1500)
                } else {
                  洗键进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '处理完成：共 ' + 累计洗 + ' 条，已标注 ' + 累计给 + ' 条、无需标注 ' + 累计空 + ' 条' +
                      (累计废 ? '，其中 ' + 累计废 + ' 条旧事实已归档，可恢复' : ''),
                    '无需标注的条目保持原状，可撤销自动标注。',
                  ])
                  load()
                }
              })
              .catch((e) => {
                洗键进度.在跑 = false
                setBusy(false)
                setNotes(['处理失败：' + ((e && e.message) || e), '已保存标注进度，重试将继续处理'])
              })
          }
          跑()
        }

        // 整份撤回（把这次自动标的全撤掉、顺手收起来的全放回来）✓
        const 撤销洗键 = () => {
          setConfirm(null)
          setBusy(true)
          post('/wash-keys/undo', { session: s.id })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['撤回失败：' + ((r && r.message) || '？')])
                return
              }
              setNotes([
                '已撤销 ' + (r.摘了 || 0) + ' 条自动标注，恢复 ' + (r.恢复 || 0) + ' 条归档条目',
                '（仅撤销自动标注，保留手动标注）',
              ])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['撤回失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐ 2026-09-22（反馈「回收站还没有批量删除，就批量清空」）：
        //   「已删掉的」那一栏补一个**批量清掉**
        //   注意：这个是**真销毁**（不是收起来）→ 界面必须问两遍
        // ⭐⭐ 2026-09-23（反馈：「那这里没有批量找回呀」）：
        //   「已删掉的」原来只有**批量清掉**，想全捞回来只能一条条点「找回来」✗
        //   → 补一个**批量找回**（勾了哪几条就捞哪几条）
        //   注意：`只合并` = 只捞「合并掉的」那批 —— 等于**一键撤销整次合并**
        //   注意：这个**不是销毁**，是往回捞，所以不用问两遍；但界面上还是先说一句捞几条
        const 批回 = (会话, 只合并) => {
          const ids = 只合并 ? [] : Object.keys(选中清).filter((k) => 选中清[k])
          if (!只合并 && !ids.length) {
            set批回问(false)
            return
          }
          setBusy(true)
          post('/delete', Object.assign({ session: 会话.id, action: 'restorebatch', ids: ids }, 只合并 ? { 只找回合并掉的: true } : {}))
            .then((r) => {
              setBusy(false)
              set批回问(false)
              if (!r || !r.ok) {
                setNotes(['批量恢复失败：' + ((r && r.message) || '？')])
                return
              }
              set选中清({})
              setNotes(['' + r.message + '（回收站剩余 ' + r.剩 + ' 条）'])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['批量恢复失败：' + ((e && e.message) || e)])
            })
        }
        const 批清 = (会话) => {
          const ids = Object.keys(选中清).filter((k) => 选中清[k])
          if (!ids.length) {
            set批清问(false)
            return
          }
          setBusy(true)
          post('/delete', { session: 会话.id, action: 'purgebatch', ids: ids })
            .then((r) => {
              setBusy(false)
              set批清问(false)
              if (!r || !r.ok) {
                setNotes(['批量删除失败：' + ((r && r.message) || '？')])
                return
              }
              set选中清({})
              setNotes(['' + r.message + '（回收站剩余 ' + r.剩 + ' 条）'])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['批量删除失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐⭐ 2026-09-22（反馈：「查重我们是不是还没做啊？我怎么没有找到按钮」）：
        //   去重一直有，但都是**自动**的 —— 召回时（注入前只留一条）、导入时。
        //   **库里已经存着的重复没人管** ✗
        //   注意：不能一键全合：「汇总+明细」那种一长一短，合了会丢信息
        //     → 真重复给「一键合」，汇总+明细只列出来让她自己挑
        const 去查重 = (会话) => {
          setBusy(true)
          // ⚠注意：面板在**记忆列表那一块里**（跟「补标不淡」的确认框一样），
          //   列表默认是折叠的 —— 不展开就看不见面板 ✗
          //   → 点查重时**顺手把列表展开**（按钮本身在标题行，永远看得见）
          set看记忆(true)
          post('/duplicates', { session: 会话.id })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['查重失败：' + ((r && r.message) || '？')])
                return
              }
              const 选 = {}
              const 勾 = {}
              ;(r.组 || []).forEach((g, i) => {
                // 默认留**最长**的那条 —— 「汇总+明细」时长的信息更全，别默认留短的 ✗
                选[i] = g.条们.reduce((a, b) => (b.长 > a.长 ? b : a), g.条们[0]).id
                // ⭐ 「真重复」默认勾上（合了安全）；「汇总+明细」默认**不勾**（合了会丢信息）✓
                勾[i] = g.类型 === '真重复'
              })
              set查重(r)
              set查重选(选)
              set查重合(勾)
              set查重开(true)
              if (!(r.组 || []).length) setNotes(['未发现重复记忆'])
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['查重失败：' + ((e && e.message) || e)])
            })
        }
        // 合掉：每组留一条，其余交给**服务端再验一遍**（不像的会被保住）✓
        //   ⚠注意：2026-09-22 修（反馈：「把一些别的对的事实给删了」）：
        //     原来客户端自己算好「删哪些」就发过去，服务端不验 ✗
        //     现在发的是「组」（留哪条、删哪些），**服务端自己再算一遍相似度**
        const 合重复 = (会话, 只合真重复) => {
          if (!查重) return
          const 组们 = []
          ;(查重.组 || []).forEach((g, i) => {
            if (只合真重复 && g.类型 !== '真重复') return
            // ⭐⭐ 2026-09-23：「按我选的合」**只合勾上的组** ——
            //   原来它把每一组都合掉（默认全选中），一点就丢掉 123 条 ✗
            if (!只合真重复 && !查重合[i]) return
            const 留 = 查重选[i] || g.条们[0].id
            const 删 = g.条们.filter((t) => t.id !== 留).map((t) => t.id)
            if (删.length) 组们.push({ 留: 留, 删: 删 })
          })
          if (!组们.length) {
            setNotes([
              只合真重复 ? '本批次无完全重复组' : '未选择合并组。汇总与明细组需手动选择。',
            ])
            return
          }
          setBusy(true)
          post('/duplicates/merge', { session: 会话.id, 组: 组们 })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['合并：' + ((r && r.message) || '？')])
                return
              }
              const 行 = ['' + r.message + '（剩下的：' + r.剩 + ' 条）', '已合并条目移入回收站，可恢复。']
              if (r.保住) {
                行.push('注意：有 ' + r.保住 + ' 条相似度不足，已保留：')
                ;(r.保住明细 || []).forEach((x) => 行.push('　　' + x.像度 + '  ' + x.text))
              }
              setNotes(行)
              set查重(null)
              set查重开(false)
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['合并失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐⭐ 2026-09-22（她要的）：**批量删** —— 收进「已删」，不是销毁
        //   「还是需要 2 次确认的」→ 点按钮只出确认条，确认条上再点才删
        const 批删 = (会话) => {
          const ids = Object.keys(选中).filter((k) => 选中[k])
          if (!ids.length) {
            set批删问(false)
            return
          }
          setBusy(true)
          post('/delete', { session: 会话.id, action: 'batchdelete', ids: ids })
            .then((r) => {
              setBusy(false)
              set批删问(false)
              if (!r || !r.ok) {
                setNotes(['批量删失败：' + ((r && r.message) || '？')])
                return
              }
              set选中({})
              setNotes(['' + r.message + '（剩下的：' + r.剩 + ' 条）', '已删除条目移入回收站，可恢复。'])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['批量删失败：' + ((e && e.message) || e)])
            })
        }

        // ═══════════════════════════════════════════════════════════
        // ⭐⭐ 2026-09-22（她的第十件）：**从会话生成档案** —— 给别人用的功能
        //
        //   ① 看这个工作区有哪些会话、勾几个
        //   ② 算要切几批、多少字（**不花钱**）
        //   ③ 一批一批跑（注意：这一步调模型、花钱）—— 跑完一批就把条目攒起来，
        //      下一批带上「已经记过的」，同一件事不会被收两遍
        //   ④ 存成档案文件 → 再走已有的「从旧档案导入」变成记忆条目
        // ═══════════════════════════════════════════════════════════════
        const 开生成 = () => {
          set生成开(true)
          set生成会话(null)
          set生成计划(null)
          set生成条目([])
          set生成档(null)
          set生成进度(null)
          post('/gen-sessions', { session: s.id })
            .then((r) => {
              if (!r || !r.ok) {
                setNotes(['读会话列表失败：' + ((r && r.message) || '？')])
                return
              }
              set生成会话(r.会话 || [])
              set生成诊断(r.诊断 || null)
              // 建议路径（服务端按这个会话的工作目录算的）—— 用户能改
              if (r.建议存到) set生成存到(String(r.建议存到))
              // ⚠注意：2026-09-22（反馈：「默认不该全选」）：
              //   原来我默认**全勾上** —— 那等于替用户决定「全都处理一遍」，
              //   而这一步后面是要**调模型、花钱**的 ✗
              //   → 默认**一个都不勾**，让用户自己挑
              set生成选({})
            })
            .catch((e) => setNotes(['读会话列表失败：' + ((e && e.message) || e)]))
        }

        const 勾的sid = () => Object.keys(生成选).filter((k) => 生成选[k])

        const 算生成 = () => {
          const sids = 勾的sid()
          if (!sids.length) {
            setNotes(['未选择会话'])
            return
          }
          setBusy(true)
          setNotes(['正在读取、去重与分段…'])
          post('/gen-plan', { session: s.id, sids: sids })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['预估失败：' + ((r && r.message) || '？')])
                return
              }
              set生成计划(r)
              set生成条目([])
              set生成档(null)
              setNotes([])
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['预估失败：' + ((e && e.message) || e)])
            })
        }

        const 跑生成 = () => {
          const sids = 勾的sid()
          if (!sids.length || !生成计划) return
          const 总批 = 生成计划.批数
          setBusy(true)
          set生成档(null)
          const 攒 = 生成条目.slice()
          let 连着空 = 0
          const 跑一批 = (批号) => {
            if (批号 > 总批) {
              setBusy(false)
              set生成进度(null)
              setNotes(['处理完成：' + 总批 + ' 批，提取 ' + 攒.length + ' 条。' + (攒.length ? '可保存为档案文件。' : '本轮未提取到条目，可重试或更换会话。输出长度已记录到诊断日志。')])
              return
            }
            set生成进度({ 批号, 批数: 总批, 在跑: true, 模型: (生成进度 && 生成进度.模型) || '' })
            post('/gen-run', {
              session: s.id,
              sids: sids,
              批号: 批号,
              // 注意：把前面攒的条目当「已记清单」传过去 —— 这是防重复的机制
              已记: 攒.map((x) => x.章 + '|' + x.日期 + '|' + x.话),
              provider: 生成备 ? 生成备.provider : undefined,
              model: 生成备 ? 生成备.model : undefined,
            })
              .then((r) => {
                if (!r || !r.ok) {
                  setBusy(false)
                  set生成进度(null)
                  setNotes(['第 ' + 批号 + ' 批失败：' + ((r && r.message) || '？'), '已保存 ' + 攒.length + ' 条，重试将继续处理'])
                  return
                }
                if (r.条目 && r.条目.length) {
                  r.条目.forEach((x) => 攒.push(x))
                  连着空 = 0
                } else {
                  连着空++
                }
                set生成条目(攒.slice())
                set生成进度({ 批号, 批数: 总批, 在跑: true, 模型: r.模型 || '' })
                if (r.done) {
                  setBusy(false)
                  set生成进度(null)
                  setNotes(['处理完成：' + 总批 + ' 批，提取 ' + 攒.length + ' 条。' + (攒.length ? '可保存为档案文件。' : '本轮未提取到条目，可重试或更换会话。输出长度已记录到诊断日志。')])
                  return
                }
                // 一批回 0 条不算失败，但也别无限跑 —— 连着 3 批空就停
                if (连着空 >= 3) {
                  setBusy(false)
                  set生成进度(null)
                  setNotes(['连续 3 批无输出，已暂停，可重试继续。'])
                  return
                }
                setTimeout(() => 跑一批(批号 + 1), 300)
              })
              .catch((e) => {
                setBusy(false)
                set生成进度(null)
                setNotes(['第 ' + 批号 + ' 批失败：' + ((e && e.message) || e), '重试将继续处理'])
              })
          }
          跑一批(1)
        }

        const 存生成 = () => {
          if (!生成条目.length) {
            setNotes(['暂无条目'])
            return
          }
          setBusy(true)
          post('/gen-save', { session: s.id, 条目: 生成条目, 来源: (生成计划 && 生成计划.天数 + ' 天') || '', 存到: 生成存到 })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['存失败：' + ((r && r.message) || '？')])
                return
              }
              set生成档(r)
              setNotes(['档案存到：' + r.存到, '共 ' + r.条数 + ' 条' + (r.去掉重复 ? '（去掉了 ' + r.去掉重复 + ' 条重复）' : '')])
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['存失败：' + ((e && e.message) || e)])
            })
        }

        // ---- 用 DSH 自己的模型给记忆扩词 ----
        // 「直接用我们 deepseek 的可不可以」→ 可以 插件能调宿主模型，不用外部 key
        const 没扩的 = (s.memories || []).filter((m) => !m.related || !m.related.length).length
        // 要提炼的：档案导入进来的、还没提炼过的
        const 没提炼的 = (s.memories || []).filter((m) => String(m.source || '').indexOf('档案导入') === 0 && !m.refined).length
        const 扩词区 = () => {
          const 小件 = []
          小件.push(h('h3', { key: 'h' }, '提炼与扩词'))
          小件.push(h('div', { className: 'memory-methods', key: 'd' },
            h('div', null, h('strong', null, '扩词'), h('p', null, '补充关键词，帮助相关问题找到记忆。保留原始正文。')),
            h('div', null, h('strong', null, '提炼'), h('p', null, '把导入的档案整理成独立记忆。修改前保存原文，可撤销。'))))

          // ---- 选模型 ----
          const 当前 = mdl && mdl.选中的 ? mdl.选中的 : (mdl && mdl.默认) || null
          const 当前串 = 当前 ? 当前.provider + ' / ' + 当前.model : '（未读取）'
          小件.push(
            React.createElement(
              'div',
              { key: 'pick', style: S.nameBox },
              React.createElement('div', { style: { flex: 'none', width: 100 } }, '处理模型'),
              mdl
                ? React.createElement(
                    'select',
                    {'aria-label': '处理模型',
                      style: Object.assign({}, S.inp, { width: 300 }),
                      value: 当前 ? 当前.provider + '|' + 当前.model : '',
                      onChange: (e) => {
                        const v = String(e.target.value || '')
                        const i = v.indexOf('|')
                        const 选 = i > 0 ? { provider: v.slice(0, i), model: v.slice(i + 1) } : null
                        saveNames({ llmModel: 选 }).then(() => {
                          setMdl(Object.assign({}, mdl, { 选中的: 选 }))
                        })
                      },
                    },
                    React.createElement('option', { value: '' }, '（用会话自己的：' + (mdl.默认 ? mdl.默认.provider + '/' + mdl.默认.model : '？') + '）'),
                    (mdl.providers || []).map((p) =>
                      React.createElement(
                        'optgroup',
                        { key: p.id, label: p.name + '（' + (p.models || []).length + ' 个）' },
                        (p.models || []).map((m) =>
                          React.createElement('option', { key: p.id + '|' + m.id, value: p.id + '|' + m.id }, m.name + '　（' + p.id + '）'),
                        ),
                      ),
                    ),
                  )
                : React.createElement('span', { style: S.dim }, '使用当前会话模型，也可读取列表后指定。'),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () => {
                    setExpNote('读取中…')
                    post('/models', { session: open })
                      .then((r) => {
                        setMdl(r)
                        setExpNote(
                          r && r.ok
                            ? 'DSH 里有 ' + (r.providers || []).length + ' 个 provider，共 ' +
                              (r.providers || []).reduce((a, p) => a + (p.models || []).length, 0) + ' 个模型。现在用：' + 当前串
                            : '失败：' + ((r && r.message) || '？'),
                        )
                      })
                      .catch((e) => setExpNote('失败：' + String((e && e.message) || e)))
                  },
                },
                '读取模型列表',
              ),
            ),
          )

          // ⚠⚠注意：2026-09-22（她的反馈，原话）：
          //   「他那个就是重判的进度条跟那个提炼的是在一起呀。我发现我得往下翻
          //     才能看到进度条，那就不对呀。重判应该有个单独的进度条吧？如果你
          //     点了的话，它就会弹出来；如果没点，它就没有。」
          //   她说得对 —— 补标/重判的进度条原来**跟「模型与扩词」「提炼」挤在
          //   同一张卡里**，点了重判得往上翻才看得见，没点的人还会以为那条是
          //   自己点出来的 ✗
          //   → 搬走：谁点的，进度条就跟在谁的按钮旁边（下面那个按钮行里）✓
          // ---- 进度条 ----
          if (exp && exp.总) {
            const 已 = Math.max(0, exp.总 - exp.剩)
            const 百 = exp.总 ? Math.round((已 / exp.总) * 100) : 0
            小件.push(
              React.createElement(
                'div',
                { key: 'bar', style: { margin: '8px 0' } },
                React.createElement(
                  'div',
                  { style: S.barOut },
                  React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                  (exp.模式 || '扩词') + '：' + 已 + ' / ' + exp.总 + ' 条（' + 百 + '%）' + (exp.剩 ? '　剩余 ' + exp.剩 + ' 条' : '　已完成'),
                ),
              ),
            )
          }
          // 提炼的进度条（跟扩词各一条，不互相盖）✓
          if (rf && rf.总) {
            const 已 = Math.max(0, rf.总 - rf.剩)
            const 百 = rf.总 ? Math.round((已 / rf.总) * 100) : 0
            小件.push(
              React.createElement(
                'div',
                { key: 'rfbar', style: { margin: '8px 0' } },
                React.createElement(
                  'div',
                  { style: S.barOut },
                  React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                  '提炼：' + 已 + ' / ' + rf.总 + ' 条（' + 百 + '%）' + (rf.剩 ? '　剩余 ' + rf.剩 + ' 条' : '　已完成'),
                ),
              ),
            )
          }

          小件.push(
            React.createElement(
              'div',
              { key: 'b', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '8px 0' } },
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  disabled: !!(exp && exp.running),
                  onClick: () => {
                    setExpNote('测试中…')
                    post('/llm-check', { session: open })
                      .then((r) => {
                        setExpNote(
                          r && r.ok
                            ? '模型通了（' + r.provider + ' / ' + r.model + '，' + r.ms + 'ms）→ 它回了「' + String(r.text || '').slice(0, 20) + '」'
                            : '失败：不通：' + ((r && r.message) || '？'),
                        )
                      })
                      .catch((e) => setExpNote('失败：' + String((e && e.message) || e)))
                  },
                },
                '检查模型连接',
              ),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btnDanger,
                  disabled: !!(exp && exp.running) || 没扩的 === 0,
                  onClick: () => {
                    let 累计 = 0
                    let 空批 = 0 // 连着几批一条词都没扩出来
                    let 每批 = 6 // 空批就把批量减半 —— 输入越少、思考越少，越不容易被截断
                    const 跑 = () => {
                      post('/expand', { session: open, 每批: 每批 })
                        .then((r) => {
                          if (!r || !r.ok) {
                            setExp({ running: false, 累计: 累计, 总: s.memories.length, 剩: r ? r.剩 : 0 })
                            setExpNote('失败：' + ((r && r.message) || '？'))
                            load()
                            return
                          }
                          累计 += r.改了
                          setExp({ running: !r.done, 累计: 累计, 总: r.总数, 剩: r.剩, 模型: r.provider + '/' + r.model })
                          // 注意：一批没扩出词就收手的话，模型偶发抽风会让它看起来「自己取消」✗
                          //   空批就把**批量减半**（输入少 → 思考少 → 不容易被截断），
                          //   连着空三批才停，并说清楚原因
                          if (r.改了 > 0) {
                            空批 = 0
                            每批 = 6
                          } else {
                            空批++
                            每批 = Math.max(1, Math.floor(每批 / 2))
                          }
                          setExpNote(
                            r.改了
                              ? '本批次扩词 ' + r.改了 + ' 条，还剩 ' + r.剩 + ' 条（' + r.ms + 'ms/批，' + r.provider + '/' + r.model + '）'
                              : '本批次无有效关键词，下一批缩减至 ' + 每批 + ' 条后重试（剩余 ' + r.剩 + ' 条）',
                          )
                          if (!r.done && (r.改了 > 0 || 空批 < 3)) setTimeout(跑, 400)
                          else {
                            setExp({ running: false, 累计: 累计, 总: r.总数, 剩: r.剩 })
                            if (空批 >= 3) {
                              setExpNote('连续 ' + 空批 + ' 批无有效关键词（已缩减至 ' + 每批 + ' 条仍无输出），已暂停，可重试扩词')
                            }
                            load()
                          }
                        })
                        .catch((e) => {
                          setExp({ running: false, 累计: 累计, 总: s.memories.length, 剩: 没扩的 })
                          setExpNote('失败：' + String((e && e.message) || e))
                        })
                    }
                    setExp({ running: true, 累计: 0, 总: s.memories.length, 剩: 没扩的 })
                    setExpNote('开始…')
                    跑()
                  },
                },
                exp && exp.running ? '扩词中…' : '开始扩词',
              ),
              React.createElement('span', { style: S.dim }, '扩词：待处理 ' + 没扩的 + ' / ' + (s.memories || []).length + ' 条'),
            ),
          )

          // ---- 提炼（导入进来的档案原文 → 真正的记忆）----
          小件.push(
            React.createElement(
              'div',
              { key: 'rf', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '4px 0 8px' } },
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btnDanger,
                  disabled: !!(rf && rf.running) || 没提炼的 === 0,
                  onClick: () => {
                    let 累计 = 0
                    let 跳 = 0
                    let 词 = 0
                    let 日 = 0
                    let 重 = 0
                    let 没解 = 0
                    const 跑 = () => {
                      post('/refine', { session: open, 每批: 6 })
                        .then((r) => {
                          if (!r || !r.ok) {
                            setRf({ running: false, 累计: 累计, 总: s.memories.length, 剩: r ? r.剩 : 0, 模式: '提炼' })
                            setRfNote('失败：' + ((r && r.message) || '？'))
                            load()
                            return
                          }
                          累计 += r.改了
                          跳 += r.跳过 || 0
                          词 += r.出了词的 || 0
                          日 += r.出了日期的 || 0
                          重 += r.出了重要度 || 0
                          没解 += r.没解析出来 || 0
                          setRf({ running: !r.done, 累计: 累计, 总: 累计 + r.剩, 剩: r.剩, 模式: '提炼' })
                          setRfNote(
                            '本批次改写 ' + r.改了 + ' 条、跳过 ' + (r.跳过 || 0) + ' 条，还剩 ' + r.剩 + ' 条（' +
                              r.ms + 'ms/批，' + r.provider + '/' + r.model + '）',
                          )
                          if (!r.done) setTimeout(跑, 400)
                          else {
                            setRf({ running: false, 累计: 累计, 总: 累计, 剩: 0, 模式: '提炼' })
                            // 检索词是提炼顺手出的，所以跑完这趟通常不用再单独跑扩词
                            setRfNote(
                              '提炼完成：改写 ' + 累计 + ' 条，跳过 ' + 跳 + ' 条' +
                                (词 ? '；其中 ' + 词 + ' 条已生成检索词，无需扩词' : '（本批次无检索词，可执行扩词）') +
                                (日 ? '；' + 日 + ' 条已提取日期' : '') +
                                (重 ? '；' + 重 + ' 条已判定重要度' : '') +
                                (没解 ? '；有 ' + 没解 + ' 条无有效输出，可重试跳过条目' : ''),
                            )
                            load()
                          }
                        })
                        .catch((e) => {
                          setRf({ running: false, 累计: 累计, 总: s.memories.length, 剩: 没提炼的, 模式: '提炼' })
                          setRfNote('失败：' + String((e && e.message) || e))
                        })
                    }
                    setRf({ running: true, 累计: 0, 总: 没提炼的, 剩: 没提炼的, 模式: '提炼' })
                    setRfNote('开始提炼…')
                    跑()
                  },
                },
                rf && rf.running ? '提炼中…' : '开始提炼',
              ),
              React.createElement('span', { style: S.dim }, '提炼：待处理 ' + 没提炼的 + ' 条'),
            ),
          )
          // 提炼改坏了能退回 —— 单条的在下面每条记忆上，这里是整批
          {
            const 提炼过的 = (s.memories || []).filter((m) => m.textBefore).length
            if (提炼过的 > 0) {
              小件.push(
                React.createElement(
                  'div',
                  { key: 'undo', style: { margin: '2px 0 6px' } },
                  confirm && confirm.kind === 'refineundoall'
                    ? React.createElement(
                        'div',
                        { style: S.confirm },
                        React.createElement('span', { style: { flex: 1 } }, '把提炼过的 ' + 提炼过的 + ' 条恢复为原文并重置提炼状态？'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => 退原文('*') }, '全退回'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                      )
                    : React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          disabled: !!(rf && rf.running),
                          title: '将全部已提炼条目恢复为原文',
                          onClick: () => setConfirm({ id: '*', kind: 'refineundoall' }),
                        },
                        '退回全部原文（' + 提炼过的 + ' 条）',
                      ),
                ),
              )
            }
          }
          // 被「跳过」的（没改写过的）能放回队列重跑 ——
          // 模型偶尔整批回不出东西，那种不该永远躺着
          {
            const 跳过的 = (s.memories || []).filter((m) => m.refinedSkip && !m.textBefore).length
            if (跳过的 > 0) {
              小件.push(
                React.createElement(
                  'div',
                  { key: 'retry', style: { margin: '0 0 6px', fontSize: 'var(--fish-small)' } },
                  React.createElement(
                    'button',
                    {type: 'button',
                      style: S.btn,
                      disabled: !!(rf && rf.running),
                      title: '重新处理无有效输出的条目',
                      onClick: () =>
                        post('/refine/retry', { session: open })
                          .then((r) => {
                            setRfNote('放回了 ' + ((r && r.放回) || 0) + ' 条，可重新开始提炼')
                            load()
                          })
                          .catch((e) => setRfNote('放不回：' + String((e && e.message) || e))),
                    },
                    '重试跳过条目（' + 跳过的 + ' 条）',
                  ),
                ),
              )
            }
          }
          if (expNote) 小件.push(React.createElement('div', { key: 'n', style: Object.assign({}, S.ok, { fontSize: 'var(--fish-small)', margin: '4px 0' }) }, expNote))
          if (rfNote) 小件.push(React.createElement('div', { key: 'n2', style: Object.assign({}, S.ok, { fontSize: 'var(--fish-small)', margin: '4px 0' }) }, rfNote))

          // ---- 复制记忆到别的会话 ----
          // 新开一个空对话把记忆复制过去 —— 那边一点历史都没有，测起来最干净
          {
            const 别的 = (d.sessions || []).filter((x) => x.id !== open)
            if (别的.length) {
              小件.push(
                React.createElement(
                  'div',
                  { key: 'copy', style: { marginTop: 14 } },
                  React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.h, { cursor: 'pointer' }), onClick: () => set复制开(!复制开) },
                    (复制开 ? '▾ ' : '▸ ') + '复制记忆到别的会话',
                  ),
                  复制开
                    ? React.createElement(
                        'div',
                        null,
                        React.createElement(
                          'div',
                          { style: S.nameBox },
                          React.createElement('div', { style: { flex: 'none', width: 76 } }, '复制到'),
                          React.createElement(
                            'select',
                            {'aria-label': '复制到',  style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 150 }), value: 复制到, onChange: (e) => set复制到(e.target.value) },
                            React.createElement('option', { value: '' }, '（选一个会话）'),
                            别的.map((x) =>
                              React.createElement('option', { key: x.id, value: x.id }, (x.title || x.id.slice(0, 18)) + '（' + x.count + ' 条）'),
                            ),
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',
                              style: S.btnDanger,
                              disabled: !复制到 || !!(exp && exp.running) || !!(rf && rf.running),
                              onClick: () => setConfirm({ id: '*', kind: 'copyto' }),
                            },
                            '复制过去（' + (s.memories || []).length + ' 条）',
                          ),
                        ),
                        confirm && confirm.kind === 'copyto'
                          ? React.createElement(
                              'div',
                              { style: S.confirm },
                              React.createElement('span', { style: { flex: 1 } }, '将当前库的 ' + (s.memories || []).length + ' 条记忆复制到目标会话？保留已有内容并跳过重复条目。'),
                              React.createElement('button', {type: 'button',  style: S.btnDanger, onClick: 复制过去 }, '确认复制'),
                              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                            )
                          : null,
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) },
                          '选择目标会话后复制。操作将启用目标会话记忆，仅补充缺失条目。',
                        ),
                      )
                    : null,
                ),
              )
            }
          }
          return 小件
        }

        // ---- 从旧档案导入 ----
        // 原则（照 AAAAGENT 的「导入旧聊天」）：
        //   ① 先扫出候选，挑完再落库 —— 不直接写进库
        //   ② 已遗忘的内容不能因为再导一次就复活
        //   ③ 猜不到日期就 null，绝不编
        const 扫描 = () => {
          setImpBusy(true)
          setImpNote(null)
          post('/import/scan', { session: open })
            .then((r) => {
              setImpBusy(false)
              if (!r || !r.ok) {
                setImpNote('扫不了：' + ((r && r.message) || '？'))
                return
              }
              // 默认只勾「记忆卡 / 总档案」这种明显是记忆的 ——
              // 同一个文件夹里还有我自己的工程笔记，那个不能导 ✗
              //
              // ⚠注意：2026-09-24 修（反馈：「别人导入会踩什么坑」时发现的）：
              //   原来**只认「记忆卡 / 总档案」两个词** —— 别人的档案叫
              //   `my_memories.md`、`关于我.md`、`profile.txt` → **一个都不勾**，
              //   扫完看着一片空白，很容易以为没扫到 ✗
              //   → 分三层：先认像记忆的名字；一个都没认出来就**勾上有内容的**（排除明显的笔记/说明）；
              //     实在拿不准就全勾上（她还能自己取消）✓
              const 像记忆 = /记忆卡|总档案|记忆|档案|回忆|自传|memory|memoir|profile|about|diary|journal/i
              const 像笔记 = /笔记|notes?|log|readme|说明|索引|目录|index|changelog|todo|草稿|draft|脚本|script/i
              const 文件们 = r.files || []
              const files = {}
              const 第一批 = 文件们.filter((f) => 像记忆.test(f.name))
              if (第一批.length) {
                for (const f of 文件们) files[f.name] = 像记忆.test(f.name)
              } else {
                const 第二批 = 文件们.filter((f) => f.候选 > 0 && !像笔记.test(f.name))
                if (第二批.length) {
                  for (const f of 文件们) files[f.name] = f.候选 > 0 && !像笔记.test(f.name)
                } else {
                  // 实在认不出来 → 有内容的都勾上，让她自己取消（总比一个都不勾好）
                  for (const f of 文件们) files[f.name] = f.候选 > 0
                }
              }
              setImp({ data: r, files: files, off: {}, open: {} })
              setImpOpen(true)
              // ⭐ 扫到 0 条时把**原因**显示出来 —— 静默的「0 条」最坑人 ✗
              if (r.提示) setImpNote(r.提示)
            })
            .catch((e) => {
              setImpBusy(false)
              setImpNote('扫不了：' + String((e && e.message) || e))
            })
        }

        const 选中条目 = () => {
          if (!imp) return []
          return (imp.data.items || []).filter((it) => imp.files[it.file] && imp.off[it.key] !== true)
        }

        const 导入 = () => {
          const 要导 = 选中条目()
          if (!要导.length) return
          setImpBusy(true)
          setImpNote(null)
          post('/import/apply', { session: open, storeId: s.storeId, items: 要导 })
            .then((r) => {
              setImpBusy(false)
              setImpNote(
                r && r.ok
                  ? '导进去了 ' + r.added + ' 条' + (r.重复 ? '（跳过重复 ' + r.重复 + ' 条）' : '') + (r.近似 ? '（跳过相似条目 ' + r.近似 + ' 条）' : '') + (r.删过 ? '（跳过已删除条目 ' + r.删过 + ' 条）' : '')
                  : '导不了：' + ((r && r.message) || '？'),
              )
              setImp(null)
              load()
            })
            .catch((e) => {
              setImpBusy(false)
              setImpNote('导不了：' + String((e && e.message) || e))
            })
        }

        const 导入区 = () => {
          const 小件 = []
          小件.push(React.createElement('div', { key: 'h', style: S.h }, '从旧档案导入'))
          小件.push(
            React.createElement(
              'div',
              { key: 'd', style: S.dim },
              '准备 .md 或 .txt 档案，扫描后先预览并选择条目，再写入当前记忆库。',
            ),
          )
          小件.push(h('details', { className: 'memory-import-guide', key: 'how' },
            h('summary', null, '档案准备建议'),
            h('ul', null,
              h('li', null, '一个文件一个主题，每行记录一件事。'),
              h('li', null, '有日期时保留日期，不确定时留空。'),
              h('li', null, '只导入预览中勾选的内容，导入后可整批撤销。'),
              h('li', null, '需要改写正文时，可到“整理与修复”执行提炼。'))))
          小件.push(
            React.createElement(
              'div',
              { key: 'b', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '8px 0' } },
              React.createElement('button', {type: 'button',  style: S.btn, disabled: impBusy, onClick: 扫描 }, impBusy ? '扫描中…' : '扫描档案'),
              imp ? React.createElement('span', { style: S.dim }, '目录：' + imp.data.dir) : null,
              imp && imp.data.selfName
                ? React.createElement('span', { style: S.dim }, '（人称：「' + imp.data.selfName + '」→「我」）')
                : React.createElement('span', { style: S.warn, fontSize: 'var(--fish-small)' }, '未设置库内称呼，导入时将保留原有人称。可先到“库内称呼”设置。'),
            ),
          )
          // 只导哪些文件 —— 同一个文件夹里常常还堆着别的文档，得能挑
          if (imp && imp.data && (imp.data.files || []).length) {
            小件.push(
              React.createElement(
                'div',
                {
                  key: 'files',
                  style: {
                    margin: '0 0 8px',
                    padding: '6px 10px',
                    borderRadius: 'var(--fish-radius-sm)',
                    background: 'var(--fish-soft)',
                    border: '1px solid var(--fish-border)',
                    fontSize: 'var(--fish-small)',
                  },
                },
                React.createElement('div', { style: S.dim }, '选择导入文件，默认选中记忆卡和总档案。'),
                React.createElement(
                  'div',
                  { style: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 } },
                  (imp.data.files || []).map((f) =>
                    React.createElement(
                      'label',
                      {
                        key: f.name,
                        style: { cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', opacity: imp.files[f.name] ? 1 : 0.5 },
                      },
                      React.createElement('input', {'aria-label': f.name,
                        type: 'checkbox',
                        checked: !!imp.files[f.name],
                        onChange: (e) =>
                          setImp(Object.assign({}, imp, { files: Object.assign({}, imp.files, { [f.name]: e.target.checked }) })),
                      }),
                      f.name + '（' + f.候选 + ' 条）',
                    ),
                  ),
                ),
              ),
            )
          }
          if (impNote) 小件.push(React.createElement('div', { key: 'n', style: Object.assign({}, S.ok, { margin: '6px 0' }) }, impNote))

          // 导过几批 + 撤销 —— 注意：必须在 `if (!imp)` **之前**：
          // 导入完 imp 就清空了，放后面的话撤销按钮根本看不到 ✗
          const 批次 = s.importBatches || []
          if (批次.length) {
            小件.push(
              React.createElement(
                'div',
                { key: 'bt', style: { marginTop: 4 } },
                React.createElement('div', { style: { fontWeight: 600, margin: '8px 0 2px' } }, '导过 ' + 批次.length + ' 批'),
                批次.map((b) =>
                  React.createElement(
                    'div',
                    { key: b.id, style: Object.assign({}, S.row, S.条) },
                    React.createElement('div', { style: { flex: 1 } }, (b.at ? rel(b.at, Date.now()) : '（日期未知）') + '　' + b.n + ' 条'),
                    React.createElement(
                      'div',
                      {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                        style: Object.assign({}, S.drop, { flex: 'none', fontSize: 'var(--fish-small)', cursor: 'pointer' }),
                        onClick: () => {
                          setImpBusy(true)
                          post('/import/undo', { session: open, batch: b.id }).then((r) => {
                            setImpBusy(false)
                            setImpNote(
                              r && r.ok
                                ? '已撤销导入：移入回收站 ' + r.撤了 + ' 条（可在回收站恢复）'
                                : '撤销失败：' + ((r && r.message) || '？'),
                            )
                            load()
                          })
                        },
                      },
                      '撤销本次导入',
                    ),
                  ),
                ),
              ),
            )
          }

          if (!imp) return 小件

          // 档案目录（能选也能打）+ 档案里指她的名字
          const 现在目录 = impDir !== null ? impDir : imp.data.dir
          const 列目录 = (p) => {
            post('/dirs', { path: p || '' })
              .then((r) => {
                setImpDirs(r)
                if (r && r.ok && r.path) setImpDir(r.path)
              })
              .catch((e) => setExpNote('列不了目录：' + String((e && e.message) || e)))
          }
          // 注意：拆成两行、输入框用弹性宽度 ——
          //   原来四个控件挤一行，加起来 880px 撑破了 780px 的容器（放大之后更糟）✗
          小件.push(
            React.createElement(
              'div',
              { key: 'cfg', style: S.nameBox },
              React.createElement('div', { style: { flex: 'none', width: 92 } }, '档案目录'),
              React.createElement('input', {'aria-label': '档案目录',
                style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 130 }),
                value: 现在目录,
                onChange: (e) => setImpDir(e.target.value),
              }),
              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => 列目录(现在目录) }, '选文件夹'),
            ),
          )
          小件.push(
            React.createElement(
              'div',
              { key: 'cfg2', style: Object.assign({}, S.nameBox, { marginTop: -4 }) },
              React.createElement('div', { style: { flex: 'none', width: 92 } }, 'AI 名称'),
              React.createElement('input', {'aria-label': '选填，可自动识别',
                style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 130 }),
                placeholder: '选填，可自动识别',
                value: 名字串(),
                onChange: (e) => setImpNames(e.target.value),
              }),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () =>
                    post('/names/scan', { session: open, dir: 现在目录 })
                      .then((r) => set找名字(r))
                      .catch((e) => setExpNote('识别称呼失败：' + String((e && e.message) || e))),
                },
                '自动识别',
              ),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () =>
                    saveNames({
                      archiveDir: 现在目录,
                      userNames: 名字们(),
                    }).then(() => {
                      setImpDir(null)
                      setImpNames(null)
                      扫描()
                    }),
                },
                '保存并重扫',
              ),
            ),
          )
          // 自动找出来的候选 —— 点一下加进上面那格，再点一下减掉
          if (找名字) {
            小件.push(
              React.createElement(
                'div',
                { key: 'names', style: { margin: '0 0 8px', padding: '6px 10px', borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-soft)', border: '1px solid var(--fish-border)', fontSize: 'var(--fish-small)' } },
                找名字.ok === false
                  ? React.createElement('div', { style: S.drop }, '失败：' + (找名字.message || '识别失败'))
                  : React.createElement(
                      'div',
                      null,
                      React.createElement('div', null, 'AI 专用称呼，可选择添加：'),
                      React.createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0' } },
                        (找名字.候选 || []).map((x) => 一个名字块(x)),
                      ),
                      (找名字.互称 || []).length
                        ? React.createElement(
                            'div',
                            null,
                            React.createElement('div', { style: Object.assign({}, S.dim, { marginTop: 4 }) }, '共用称呼，添加后将「' + 找名字.互称[0].name + '」全换成称呼，一般别加：'),
                            React.createElement(
                              'div',
                              { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0' } },
                              (找名字.互称 || []).map((x) => 一个名字块(x, true)),
                            ),
                          )
                        : null,
                      React.createElement(
                        'div',
                        { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) },
                        '数字为出现次数。仅选择有效称呼，留空不影响导入。',
                      ),
                    ),
              ),
            )
          }
          // 现在扫的是哪个目录 —— 用文字再写一遍，不靠输入框
          小件.push(
            React.createElement(
              'div',
              { key: 'nowdir', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '2px 0 6px' }) },
              '现在扫的是：' + imp.data.dir + '　（' + (imp.data.files || []).length + ' 个文件，' + (imp.data.items || []).length + ' 条候选）',
            ),
          )
          // 文件夹选择器
          if (impDirs) {
            小件.push(
              React.createElement(
                'div',
                { key: 'dirs', style: { margin: '0 0 8px', padding: '6px 10px', borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-soft)', border: '1px solid var(--fish-border)', fontSize: 'var(--fish-small)' } },
                impDirs.ok === false
                  ? React.createElement('div', { style: S.drop }, '失败：' + (impDirs.message || '列不了'))
                  : React.createElement(
                      'div',
                      null,
                      React.createElement(
                        'div',
                        { style: Object.assign({}, S.dim, { marginBottom: 4 }) },
                        impDirs.path ? '「' + impDirs.path + '」的子文件夹：' : '选一个盘：',
                      ),
                      React.createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
                        impDirs.parent
                          ? React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: S.link, onClick: () => 列目录(impDirs.parent) }, '↑ 上一级')
                          : null,
                        (impDirs.dirs || []).map((d) =>
                          React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  key: d.path, style: S.link, onClick: () => 列目录(d.path) }, '📁 ' + d.name),
                        ),
                        (impDirs.dirs || []).length === 0 && !impDirs.parent
                          ? React.createElement('span', { style: S.dim }, '（无子文件夹）')
                          : null,
                      ),
                      React.createElement(
                        'div',
                        { style: Object.assign({}, S.dim, { marginTop: 4 }) },
                        '核对后保存并重新扫描',
                      ),
                    ),
              ),
            )
          }

          // 文件勾选
          小件.push(
            React.createElement(
              'div',
              { key: 'files', style: S.nameBox },
              React.createElement('div', { style: { flex: 'none', width: 100 } }, '已扫描文件'),
              React.createElement(
                'div',
                { style: { flex: 1 } },
                (imp.data.files || []).map((f) =>
                  React.createElement(
                    'label',
                    { key: f.name, style: { display: 'block', cursor: 'pointer' } },
                    React.createElement('input', {'aria-label': f.name,
                      type: 'checkbox',
                      checked: !!imp.files[f.name],
                      onChange: (e) => setImp(Object.assign({}, imp, { files: Object.assign({}, imp.files, { [f.name]: e.target.checked }) })),
                    }),
                    ' ' + f.name + '　' + f.候选 + ' 条',
                    /记忆卡|总档案/.test(f.name) ? null : React.createElement('span', { style: S.dim }, '（请核对并选择条目）'),
                  ),
                ),
              ),
            ),
          )

          // 按小节分组（只列勾了的文件）
          const 组 = {}
          for (const it of imp.data.items || []) {
            if (!imp.files[it.file]) continue
            const k = it.file + '｜' + (it.section || '（无分节）')
            if (!组[k]) 组[k] = { file: it.file, section: it.section || '（无分节）', items: [] }
            组[k].items.push(it)
          }
          const 组们 = Object.keys(组)
          const 选中 = 选中条目()
          const 字数 = 选中.reduce((a, it) => a + String(it.改后 || it.text).length, 0)

          小件.push(
            React.createElement(
              'div',
              { key: 'secbar', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '10px 0 4px' } },
              React.createElement('span', { style: { fontWeight: 600 } }, '按小节挑'),
              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setImp(Object.assign({}, imp, { off: {} })) }, '全选'),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () => {
                    const off = {}
                    for (const it of imp.data.items || []) if (imp.files[it.file] && it.importance < 1) off[it.key] = true
                    setImp(Object.assign({}, imp, { off: off }))
                  },
                },
                '仅保留长期事实',
              ),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () => {
                    const off = {}
                    for (const it of imp.data.items || []) if (imp.files[it.file]) off[it.key] = true
                    setImp(Object.assign({}, imp, { off: off }))
                  },
                },
                '全不选',
              ),
            ),
          )

          for (const k of 组们) {
            const g = 组[k]
            const 开 = !!imp.open[k]
            const 选了几条 = g.items.filter((it) => imp.off[it.key] !== true).length
            小件.push(
              React.createElement(
                'div',
                { key: 'sec' + k, style: { margin: '2px 0' } },
                React.createElement(
                  'div',
                  { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' } },
                  React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 1 }), onClick: () => setImp(Object.assign({}, imp, { open: Object.assign({}, imp.open, { [k]: !开 }) })) },
                    (开 ? '▾ ' : '▸ ') + g.section,
                  ),
                  React.createElement('div', { style: Object.assign({}, S.dim, { width: 90, flex: 'none' }) }, 选了几条 + ' / ' + g.items.length + ' 条'),
                  React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)' }),
                      onClick: () => {
                        const 全选这节 = 选了几条 < g.items.length
                        const off = Object.assign({}, imp.off)
                        for (const it of g.items) if (全选这节) delete off[it.key]
                        else off[it.key] = true
                        setImp(Object.assign({}, imp, { off: off }))
                      },
                    },
                    '全选本节',
                  ),
                ),
                开
                  ? g.items.map((it) =>
                      React.createElement(
                        'div',
                        { key: it.key, style: { margin: '2px 0 6px 18px', fontSize: 'var(--fish-small)' } },
                        React.createElement(
                          'label',
                          { style: { cursor: 'pointer' } },
                          React.createElement('input', {'aria-label': it.改后 || it.text,
                            type: 'checkbox',
                            checked: imp.off[it.key] !== true,
                            onChange: (e) => setImp(Object.assign({}, imp, { off: Object.assign({}, imp.off, { [it.key]: !e.target.checked }) })),
                          }),
                          ' ',
                          React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, it.file + ' 第 ' + it.line + ' 行　'),
                          String(it.改后 || it.text),
                          it.at ? React.createElement('span', { style: Object.assign({}, S.ok, { fontSize: 'var(--fish-small)' }) }, '　[' + it.at.slice(0, 10) + ']') : null,
                          it.改后 && it.改后 !== it.text
                            ? React.createElement('div', { style: Object.assign({}, S.dim, { marginLeft: 18, fontSize: 'var(--fish-small)' }) }, '原文：' + it.text)
                            : null,
                        ),
                      ),
                    )
                  : null,
              ),
            )
          }

          小件.push(
            React.createElement(
              'div',
              { key: 'go', style: Object.assign({}, S.askBox, { marginTop: 10 }) },
              React.createElement('div', { style: { flex: 1 } }, '已选 ' + 选中.length + ' 条，共约 ' + 字数 + ' 字' + (选中.length ? '（单轮最多注入 6 条）' : '')),
              React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: impBusy || !选中.length, onClick: 导入 }, impBusy ? '导入中…' : '导入选中的'),
            ),
          )
          return 小件
        }

        return (() => {
          const mode = edit ? 'edit' : 生成开 ? 'generate' : 查重 && 查重开 ? 'duplicates' : dialogView
          const titles = { memories: '记忆条目', add: '新增记忆', names: '库内称呼', organize: '整理与修复', archive: '档案导入与生成', generate: '从会话生成档案', duplicates: '重复记忆检查', trash: '回收站', recall: '召回诊断', index: '语义索引', edit: '编辑记忆' }
          const go = view => { setDialogView(view); setEdit(null); set查重开(false); set生成开(false); setConfirm(null); set批删问(false) }
          const tasks = [
            ['add', '新增记忆', '手动记录事实、时间和关键词'],
            ['names', '库内称呼', '设置 AI 与对方在当前库中的称呼'],
            ['organize', '整理与修复', '补日期、事实键、去重、提炼和扩词'],
            ['archive', '档案导入与生成', '从文件导入，或将会话整理成档案'],
            ['trash', '回收站', '恢复已删除、已合并或被取代的记忆'],
            ['recall', '召回诊断', '查看本轮命中结果与未选中的原因'],
            ['index', '语义索引', '补齐或重建当前库的向量索引'],
          ]
          const navigation = [['memories', '记忆条目', '查看、搜索和编辑已保存的记忆'], ...tasks]
          const hint = navigation.find(([view]) => view === mode)?.[2]
          let content
          if (mode === 'memories') content = h('div', { className: 'memory-records' },
            h('div', { className: 'memory-actions' }, 已选几条 > 0
              ? React.createElement(
                  'button',
                  {type: 'button',
                    style: S.btnDanger,
                    title: '将所选条目移入回收站，操作前需确认。',
                    onClick: () => set批删问(true),
                  },
                  '批量删除（' + 已选几条 + '）',
                )
              : null,
已选几条 > 0
              ? React.createElement(
                  'button',
                  {type: 'button',  style: S.btn, onClick: () => { set选中({}); set批删问(false) } },
                  '取消勾选',
                )
              : null),
            h('div', { className: 'memory-filter' }, React.createElement('input', {'aria-label': '搜索正文、原文、关键词或来源',
                    style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 140 }),
                    placeholder: '搜索正文、原文、关键词或来源',
                    value: 搜词,
                    onChange: (e) => set搜词(e.target.value),
                  }),
搜词
                    ? React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set搜词('') }, '清除')
                    : null,
React.createElement(
                    'button',
                    {type: 'button',
                      style: S.btn,
                      title:
                        '切换筛选：全部 → 已标日期 → 未标日期 → ' +
                        '长期事实 → 普通记忆 → 全部。' +
                        '全部视图中，长期事实单独分组。',
                      onClick: () =>
                        set看哪边(
                          看哪边 === '全部'
                            ? '有时间'
                            : 看哪边 === '有时间'
                              ? '没时间'
                              : 看哪边 === '没时间'
                                ? '长期事实'
                                : 看哪边 === '长期事实'
                                  ? '会淡的'
                                  : '全部',
                        ),
                    },
                    '筛选：' +
                      (看哪边 === '全部'
                        ? '全部'
                        : 看哪边 === '有时间'
                          ? '已标日期（' + 有时间数 + '）'
                          : 看哪边 === '没时间'
                            ? '未标日期（' + 没时间数 + '）'
                            : 看哪边 === '长期事实'
                              ? '长期事实（' + 事实总数 + '）'
                              : '普通记忆（' + 会淡总数 + '）'),
                  ),
React.createElement(
                    'button',
                    {type: 'button',
                      style: S.btn,
                      title: '按条目日期排序，未标日期的条目置后。',
                      onClick: () => set顺序(顺序 === '新' ? '旧' : '新'),
                    },
                    '日期：' + (顺序 === '新' ? '新的在前' : '老的在前'),
                  )),
            React.createElement(
            'div',
            { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
            '已标日期 ' + 有时间数 + ' 条 · 未标日期 ' + 没时间数 + ' 条' +
              (看哪边 === '全部' ? '' : '（当前筛选：' + (看哪边 === '有时间' ? '已标日期' : '未标日期') + '）'),
          ), 批删问 && 已选几条 > 0
                  ? React.createElement(
                      'div',
                      { style: S.confirm },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '删除所选 ' + 已选几条 + ' 条？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '条目将移入回收站，可恢复。操作前自动备份。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 批删(s) }, busy ? '删除中…' : '确认删除（' + 已选几条 + ' 条）'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set批删问(false) }, '取消'),
                    )
                  : null, 搜词 || 看哪边 !== '全部'
                  ? React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '0 0 6px' }) },
                      '共 ' + 过滤后.length + ' 条 / 共 ' + s.memories.length + ' 条' +
                        (看哪边 === '有时间' ? '（仅已标日期）' : 看哪边 === '没时间' ? '（仅未标日期）' : '') +
                        (过滤后.length === 0 ? '，可更换关键词或筛选范围' : ''),
                    )
                  : null, React.createElement(
                  'div',
                  { style: { marginTop: 10 } },
                  过滤后.length === 0
                    ? React.createElement(
                        'div',
                        { style: S.dim },
                        搜词 ? '（无匹配“' + 搜词 + '”的条目）' : '（当前范围无记忆）',
                      )
                    : (() => {
                        // ⭐⭐ 2026-09-22（她要的）：**「全部」视图里，不会淡的收进一个折叠的分组**
                        //   原话：「那一行，我们是单独做一个收理的文件夹一样的，
                        //              不然的话那些就不需要露在外面」
                        //   ⭐ 又说：「**外面都是会淡的，里面才是不会淡的**，就不用管里面了」
                        //   → 外面只列**会淡的**；不会淡的（长期事实 + 没时间的）
                        //     塞进「▸ 不会淡的（N 条）」里，点开才看
                        const 上 = 画这个.slice(0, 画全部 ? 画这个.length : 一次最多画)
                        // 注意：搜的时候**不许折叠** —— 不然搜到了却看不见 ✗
                        //   （自检逮到的：搜「衣服」时匹配的那条是长期事实，被收进分组里了）
                        if (看哪边 !== '全部' || 搜词) return 上.map(一条记忆)
                        const 会淡的 = 上.filter((m) => !不会淡(m))
                        const 不淡的 = 上.filter(不会淡)
                        return [
                          ...会淡的.map(一条记忆),
                          不淡的.length
                            ? React.createElement(
                                'div',
                                { key: '事实组' },
                                React.createElement(
                                  'div',
                                  {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                    style: Object.assign({}, S.h, { cursor: 'pointer', marginTop: 14 }),
                                    onClick: () => set看事实(!看事实),
                                  },
                                  (看事实 ? '▾ ' : '▸ ') + '长期事实（' + 不淡的.length + ' 条）',
                                ),
                                React.createElement(
                                  'div',
                                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginBottom: 4 }) },
                                  '长期事实不参与时间衰减。' +
                                    '普通记忆参与衰减，未标日期时从录入时间计算。',
                                ),
                                看事实 ? 不淡的.map(一条记忆) : null,
                              )
                            : null,
                        ]
                      })(),
                ), 过滤后.length > 一次最多画
                  ? React.createElement(
                      'div',
                      { style: { margin: '6px 0 0', fontSize: 'var(--fish-small)' } },
                      画全部
                        ? React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: S.link, onClick: () => set画全部(false) }, '收起（仅显示前 ' + 一次最多画 + ' 条）')
                        : React.createElement(
                            'span',
                            {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: S.link, onClick: () => set画全部(true) },
                            '另有 ' + (过滤后.length - 一次最多画) + ' 条未显示，显示全部可能影响性能。',
                          ),
                    )
                  : null)
          else if (mode === 'add') content = React.createElement(
                'div',
                { className: 'memory-editor', style: S.editBox },
                React.createElement(
                  'div',
                  { className: 'memory-editor-row', style: Object.assign({}, S.nameBox, { margin: '0 0 8px' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '目标会话'),
                  React.createElement(
                    'select',
                    {'aria-label': '目标会话',
                      style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 160 }),
                      value: 加在谁 || open || '',
                      onChange: (e) => set加在谁(e.target.value),
                    },
                    (((d && d.sessions) || []).map((x) => React.createElement(
                      'option',
                      { key: x.id, value: x.id },
                      (x.title || ('…' + String(x.id).slice(-6))) + (x.enabled ? '' : '（记忆未启用）'),
                    ))),
                  ),
                  React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '默认使用当前记忆库入口'),
                ),
                React.createElement('textarea', {'aria-label': '输入记忆正文。AI 名称和对方称呼将按库内设置归一化。',
                  style: Object.assign({}, S.area, { minHeight: 54 }),
                  placeholder: '输入记忆正文。AI 名称和对方称呼将按库内设置归一化。',
                  value: 加内容,
                  onChange: (e) => set加内容(e.target.value),
                }),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.nameBox, { margin: '8px 0 0' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '时间'),
                  React.createElement('input', {'aria-label': '发生时间，留空使用当前时间',
                    style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 150 }),
                    placeholder: '发生时间，留空使用当前时间',
                    value: 加时间,
                    onChange: (e) => set加时间(e.target.value),
                  }),
                  React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '格式：2026-09-19 或 2026-09-19 14:30'),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.nameBox, { margin: '6px 0 0' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '重要'),
                  ['0', '0.5', '1'].map((v) =>
                    React.createElement(
                      'button',
                      {type: 'button',
                        key: v,
                        style: Object.assign({}, S.btn, String(加重要) === v ? { borderColor: 'var(--fish-info)', color: 'var(--fish-info)' } : null),
                        onClick: () => set加重要(v),
                      },
                      v === '0' ? '0 一般' : v === '0.5' ? '0.5 重要' : '1 非常重要',
                    ),
                  ),
                  React.createElement('input', {'aria-label': '记忆重要度',
                    style: Object.assign({}, S.inp, { width: 88 }),
                    value: 加重要,
                    onChange: (e) => set加重要(e.target.value),
                  }),
                  React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '也能自己填 0~1'),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.nameBox, { margin: '6px 0 0' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '关键词'),
                  React.createElement('input', {'aria-label': '关键词，以空格分隔（选填）',
                    style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 150 }),
                    placeholder: '关键词，以空格分隔（选填）',
                    value: 加词,
                    onChange: (e) => set加词(e.target.value),
                  }),
                ),
                React.createElement(
                  'div',
                  { className: 'memory-editor-actions' },
                  React.createElement('button', {type: 'button', className: 'fish-primary', style: { ...S.btn, background: 'var(--fish-action)', color: 'var(--fish-on-accent)' }, onClick: 提交一条 }, '保存记忆'),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                  '保存后可在“整理与修复”中补充检索词。',
                ),
              )
          else if (mode === 'edit') content = 改一条(edit)
          else if (mode === 'names') content = React.createElement(
            'div',
            { style: { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--fish-border)', background: 'var(--fish-soft)' } },
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 } },
              React.createElement('span', { style: { flex: 'none', width: 96, fontSize: 'var(--fish-small)' } }, 'AI 名称'),
              React.createElement('input', {'aria-label': '库内 AI 名称',
                style: Object.assign({}, S.inp, { width: 160 }),
                placeholder: '库内 AI 名称',
                value: selfDraft[open] !== undefined ? selfDraft[open] : s.selfName || s.titleName || '',
                onChange: (e) => setSelfDraft(Object.assign({}, selfDraft, { [open]: e.target.value })),
                onBlur: () =>
                    saveNames({
                      session: open,
                      selfName: (selfDraft[open] !== undefined ? selfDraft[open] : s.selfName) || '',
                      ownerName: (ownerDraft[open] !== undefined ? ownerDraft[open] : s.ownerName) || '',
                    }).then(async result => {
                      if (!result || result.ok === false) throw Error(result?.error || '保存称呼失败')
                      await load()
                      setSelfDraft(old => old[open] === selfDraft[open] ? {} : old)
                      setOwnerDraft(old => old[open] === ownerDraft[open] ? {} : old)
                    }).catch(error => { setErr(error.message); 告知(error.message) }),
              }),
              s.selfName
                ? null
                : (s.titleName ? React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '默认使用会话标题，失焦后保存。') : null),
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 } },
              React.createElement('span', { style: { flex: 'none', width: 96, fontSize: 'var(--fish-small)' } }, '对方称呼'),
              React.createElement('input', {'aria-label': '库内对方称呼',
                style: Object.assign({}, S.inp, { width: 160 }),
                placeholder: '库内对方称呼',
                value: ownerDraft[open] !== undefined ? ownerDraft[open] : s.ownerName || '',
                onChange: (e) => setOwnerDraft(Object.assign({}, ownerDraft, { [open]: e.target.value })),
                onBlur: () =>
                    saveNames({
                      session: open,
                      selfName: (selfDraft[open] !== undefined ? selfDraft[open] : s.selfName) || '',
                      ownerName: (ownerDraft[open] !== undefined ? ownerDraft[open] : s.ownerName) || '',
                    }).then(async result => {
                      if (!result || result.ok === false) throw Error(result?.error || '保存称呼失败')
                      await load()
                      setSelfDraft(old => old[open] === selfDraft[open] ? {} : old)
                      setOwnerDraft(old => old[open] === ownerDraft[open] ? {} : old)
                    }).catch(error => { setErr(error.message); 告知(error.message) }),
              }),
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 } },
              null,
              React.createElement(
                'span',
                { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', flex: 1, lineHeight: 1.5 }) },
                'AI 名称归一为“我”，对方称呼归一为“你”，同时处理已有条目。',
              ),
            ),
          )
          else if (mode === 'organize') content = h('div', { className: 'memory-stack' },
            h('section', { className: 'memory-operation' }, h('h3', null, '检查与修复'), h('p', { className: 'fish-muted' }, '修改前确认并自动备份。'), h('div', { className: 'memory-actions' }, 没日期的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title: '从正文补齐缺失日期，保留已有日期，操作前自动备份。',
                          onClick: () => setConfirm({ id: '*', kind: 'backfill' }),
                        },
                        '补日期（' + 没日期的 + '）',
                      )
                    : null,
没判过的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '调用模型识别长期事实，' +
                            '跳过已判定条目，操作前自动备份。',
                          onClick: () => setConfirm({ id: '*', kind: 'stable' }),
                        },
                        '补标长期事实（' + 没判过的 + '）',
                      )
                    : null,
判过的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '重置判定标记并重新识别长期事实。' +
                            '适用于判据调整后，会调用模型，操作前自动备份。',
                          onClick: () => setConfirm({ id: '*', kind: 'restable' }),
                        },
                        '重判一遍（' + 判过的 + '）',
                      )
                    : null,
没键的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '为旧记忆生成事实键。\n' +
                            '同一属性的不同记录将关联为同一事实，' +
                            '保留最新条目，旧条目归档并可恢复。\n' +
                            '此操作需逐条调用模型。\n' +
                            '建议先试运行 8 条，核对后执行全部。',
                          onClick: () => setConfirm({ id: '*', kind: 'washkeys' }),
                        },
                        '标注事实键（' + 没键的 + '）',
                      )
                    : null,
可撤的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '撤销本次自动标注并恢复关联归档条目。\n' +
                            '保留手动标注。',
                          onClick: () => setConfirm({ id: '*', kind: 'unwashkeys' }),
                        },
                        '撤销本次标注（' + 可撤的 + '）',
                      )
                    : null, React.createElement(
              'button',
              {type: 'button',
                style: S.btn,
                title:
                  '检查库内重复条目。' +
                  '完全重复可直接合并，汇总与明细需手动选择。合并前自动备份。',
                onClick: () => 去查重(s),
              },
              '查重',
            )), 没键的 > 0
                  ? React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '4px 0 0' }) },
                      '事实键用于关联同一事实的不同记录。' +
                        '关联后保留最新条目，旧条目归档并可恢复。',
                    )
                  : null,
判留空的 > 0
                  ? React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '4px 0 0' }) },
                      '（另外 ' + 判留空的 + ' 条无需标注或无法判定。' +
                        '原文保留，后续跳过）',
                    )
                  : null,
confirm && confirm.kind === 'stable'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '使用模型判断 ' + 没判过的 + ' 条是否属于长期事实？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '使用 DSH 模型，每批 20 条，跳过已判定条目。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 补不淡(false) }, busy ? '判定中…' : '开始'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
confirm && confirm.kind === 'restable'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '把 ' + 判过的 + ' 条判定标记并重新识别？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '将重新调用模型（共 ' +
                            (s.memories || []).length + ' 条，每批 20 条），操作前自动备份。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 补不淡(true) }, busy ? '判定中…' : '重判'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
confirm && confirm.kind === 'washkeys'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '所选 ' + 没键的 + ' 条旧记忆生成事实键？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '生成事实键并关联相同事实，保留最新条目，' +
                            '旧条目归档并可恢复。' +
                            '使用 DSH 模型，每批 8 条，不向会话发送消息。操作前自动备份。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btn, disabled: busy, onClick: () => 洗键(true) }, busy ? '处理中…' : '试运行 8 条'),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 洗键(false) }, busy ? '处理中…' : '全部开始'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
confirm && confirm.kind === 'unwashkeys'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '撤销本次自动标注的 ' + 可撤的 + ' 条自动标注并恢复关联归档条目？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '恢复操作前状态，保留手动标注。' +
                            '记忆本身一条都不会被删。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: 撤销洗键 }, busy ? '撤销中…' : '撤销'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
洗键进度.在跑 && 洗键进度.总 > 0
                  ? (() => {
                      const 百 = Math.round((洗键进度.已 / 洗键进度.总) * 100)
                      return React.createElement(
                        'div',
                        { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                        React.createElement(
                          'div',
                          { style: { fontSize: 'var(--fish-small)', marginBottom: 4 } },
                          '正在标注事实键' + (洗键进度.干跑 ? '（试运行）' : '') + '　处理中',
                        ),
                        React.createElement(
                          'div',
                          { style: { fontSize: 'var(--fish-small)', color: 'var(--fish-warning)' } },
                          '已处理 ' + 洗键进度.已 + ' / ' + 洗键进度.总 + ' 条（' + 百 + '%）' +
                            '　剩余 ' + Math.max(0, 洗键进度.总 - 洗键进度.已) + ' 条（每批 8 条）',
                        ),
                      )
                    })()
                  : null,
补标进度.在跑 && 补标进度.总 > 0
                  ? (() => {
                      const 百 = Math.round((补标进度.已 / 补标进度.总) * 100)
                      return React.createElement(
                        'div',
                        { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                        React.createElement(
                          'div',
                          { style: { fontSize: 'var(--fish-small)', marginBottom: 4 } },
                          '⭐ ' + (补标进度.重判 ? '重判一遍' : '补标长期事实') + '　处理中',
                        ),
                        React.createElement(
                          'div',
                          { style: S.barOut },
                          React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                        ),
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                          '已判 ' + 补标进度.已 + ' / ' + 补标进度.总 + ' 条（' + 百 + '%）' +
                            '　剩余 ' + Math.max(0, 补标进度.总 - 补标进度.已) + ' 条' +
                            (补标进度.等 ? '　请求受限，等待 ' + 补标进度.等 + ' 秒' : '（每批 20 条）'),
                        ),
                      )
                    })()
                  : null, confirm && confirm.kind === 'backfill'
                  ? React.createElement(
                      'div',
                      { style: S.confirm },
                      React.createElement('span', { style: { flex: 1 } }, '补齐 ' + 没日期的 + ' 条缺失日期的记忆？保留已有日期并自动备份。'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: 补日期 }, '补'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null),
            h('section', { className: 'memory-operation' }, 扩词区()))
          else if (mode === 'archive') content = h('div', { className: 'memory-stack' }, h('div', { className: 'memory-callout' }, h('div', null, h('strong', null, '从已有会话生成档案'), h('p', null, '先预览会话和用量，再分批生成，可继续导入当前记忆库。')), h('button', { type: 'button', className: 'fish-button', onClick: () => 开生成() }, '选择会话')), ...导入区().slice(1))
          else if (mode === 'generate') content = React.createElement(
                      'div',
                      { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                      [
                        React.createElement(
                          'div',
                          { key: 'h', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                          React.createElement('b', null, '从会话生成档案'),
                          React.createElement(
                            'span',
                            { style: S.dim },
                            '从会话提取九章长期档案，保存后可扫描导入记忆库。',
                          ),
                          React.createElement('div', { style: { flex: 1 } }),
                          React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set生成开(false) }, '收起'),
                        ),

                        // ① 选会话
                        React.createElement(
                          'div',
                          { key: 's', style: { marginTop: 8 } },
                          React.createElement('div', { style: S.dim }, '① 选会话' + (生成会话 ? '（当前工作区共 ' + 生成会话.length + ' 个）' : '（读取中…）')),
                          生成会话 && 生成会话.length
                            ? React.createElement(
                                'div',
                                { style: { margin: '4px 0 0 8px', maxHeight: 260, overflow: 'auto' } },
                                生成会话.map((x) =>
                                  React.createElement(
                                    'label',
                                    { key: x.sid, style: { display: 'block', fontSize: 'var(--fish-small)', cursor: 'pointer', padding: '2px 0' } },
                                    React.createElement('input', {'aria-label': x.标题 || x.sid,
                                      type: 'checkbox',
                                      checked: !!生成选[x.sid],
                                      onChange: () => set生成选(Object.assign({}, 生成选, { [x.sid]: !生成选[x.sid] })),
                                    }),
                                    // ⚠注意：2026-09-22（反馈：「不显示名字」）：
                                    //   光有 `session-a1b2c3d4-…` 这种**没法挑** —— 得显示标题
                                    ' ',
                                    React.createElement('span', { style: x.标题 ? null : S.dim }, x.标题 || '（未命名）'),
                                    React.createElement(
                                      'span',
                                      { style: Object.assign({}, S.dim, { marginLeft: 6 }) },
                                      (x.话数 ? x.话数 + ' 句　' : '') + x.MB + ' MB　' + x.sid.slice(0, 12) + '…',
                                    ),
                                  ),
                                ),
                              )
                            : 生成会话
                              ? React.createElement(
                                  'div',
                                  { style: Object.assign({}, S.dim, { marginTop: 4 }) },
                                  '暂无可用会话，已排除归档、子代理和空白会话。',
                                )
                              : null,
                          // 注意：默认一个都不勾 —— 让用户自己挑（后面是要花钱的）✓
                          生成会话 && 生成会话.length
                            ? React.createElement(
                                'div',
                                { style: { marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                                React.createElement(
                                  'button',
                                  {type: 'button',
                                    style: S.btn,
                                    onClick: () => {
                                      const 勾 = {}
                                      生成会话.forEach((x) => {
                                        勾[x.sid] = true
                                      })
                                      set生成选(勾)
                                    },
                                  },
                                  '全选',
                                ),
                                React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set生成选({}) }, '全不选'),
                                React.createElement('span', { style: S.dim }, '勾了 ' + 勾的sid().length + ' 个'),
                              )
                            : null,
                          // 注意：诊断：列表跟 DSH 对不上时，这几个数能看出卡在哪一道
                          // 注意：2026-11-03：诊断只在**一个会话都没列出来**时才显示。
                          //   有列表的时候它就是一大坨内部数字，挤在勾选框下面很难看。
                          生成诊断 && 生成会话 && 生成会话.length === 0
                            ? React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { marginTop: 4, fontSize: 'var(--fish-small)' }) },
                                '磁盘上 ' + 生成诊断.文件夹里 + ' 个会话文件　归档 ' + 生成诊断.归档 + ' 个　可挑 ' + 生成诊断.筛完剩 + ' 个',
                                (生成诊断.被我筛掉的 || []).length
                                  ? React.createElement(
                                      'div',
                                      { style: { marginTop: 2 } },
                                      '筛掉的：' +
                                        (生成诊断.被我筛掉的 || [])
                                          .map((x) => (x.标题 || x.sid) + '（' + x.因 + '）')
                                          .join('　'),
                                    )
                                  : null,
                              )
                            : null,
                          React.createElement(
                            'div',
                            { style: { marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8 } },
                            React.createElement(
                              'button',
                              {type: 'button',  style: S.btn, disabled: busy || 勾的sid().length === 0, onClick: () => 算生成() },
                              '预估处理用量',
                            ),
                            React.createElement(
                              'span',
                              { style: S.dim },
                              !勾的sid().length ? '请选择会话' : '（仅读取、去重与分段，不调用模型）',
                            ),
                          ),
                        ),

                        // ② 计划
                        生成计划
                          ? React.createElement(
                              'div',
                              { key: 'p', style: { marginTop: 8 } },
                              React.createElement(
                                'div',
                                { style: S.dim },
                                '预估结果：' + 生成计划.批数 + ' 批　' + 生成计划.天数 + ' 天　' +
                                  生成计划.总字.toLocaleString() + ' 字，估算约 ' + 生成计划.token.toLocaleString() + ' token',
                              ),
                              React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { marginTop: 2 }) },
                                '（每批最多 ' + 生成计划.每批字上限.toLocaleString() + ' 字；已排除非聊天记录 ' +
                                  生成计划.挑出来 + ' 条）',
                              ),
                              React.createElement(
                                'div',
                                { style: { marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                                React.createElement(
                                  'button',
                                  {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 跑生成() },
                                  busy ? '处理中…' : '开始生成（消耗模型额度）',
                                ),
                                React.createElement(
                                  'span',
                                  { style: S.dim },
                                  '按批提取并保存进度，后续批次参考已有条目以减少重复。',
                                ),
                              ),
                              (生成计划.会话 || []).length
                                ? React.createElement(
                                    'div',
                                    { style: Object.assign({}, S.dim, { marginTop: 4, fontSize: 'var(--fish-small)' }) },
                                    '会话情况：' +
                                      生成计划.会话
                                        .map((x) => (x.标题 || x.sid.slice(0, 12)) + '（独有 ' + x.独有 + '／副本 ' + x.副本 + '）')
                                        .join('　'),
                                  )
                                : null,
                            )
                          : null,

                        // ③ 进度
                        生成进度 && 生成进度.在跑
                          ? (() => {
                              const 百 = Math.round(((生成进度.批号 - 1) / 生成进度.批数) * 100)
                              return React.createElement(
                                'div',
                                { key: 'bar', style: { marginTop: 8 } },
                                React.createElement(
                                  'div',
                                  { style: S.barOut },
                                  React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                                ),
                                React.createElement(
                                  'div',
                                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                                  '第 ' + 生成进度.批号 + ' / ' + 生成进度.批数 + ' 批（' + 百 + '%）' +
                                    '　已提取 ' + 生成条目.length + ' 条' +
                                    (生成进度.模型 ? '　' + 生成进度.模型 : ''),
                                ),
                              )
                            })()
                          : null,

                        // ④ 存到哪儿 —— ⚠注意：2026-09-22（反馈：「选了文件夹点了过后
                        //   再想换的话就会卡住，就没有那个选项了，就不能再修改了」）
                        //   两个毛病：
                        //     ① 这块原来在 `生成条目.length` 里面 —— **跑完才出现** ✗
                        //        → 挪到外面，面板一开就能设
                        //     ② 再点「选文件夹」时**不重新读目录**（`if (!生成目录列)`）——
                        //        看到的还是上次那份，像卡住 失败：→ 每次打开都重读
                        React.createElement(
                          'div',
                          { key: 'save', style: { marginTop: 8 } },
                          React.createElement(
                            'div',
                            { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                            React.createElement('b', null, '保存位置'),
                            React.createElement('span', { style: S.dim }, '指定输出文件，可直接修改路径或选择文件夹。'),
                          ),
                          React.createElement(
                            'div',
                            { style: Object.assign({}, S.nameBox, { marginTop: 6 }) },
                            React.createElement('div', { style: { flex: 'none', width: 72 } }, '存到'),
                            React.createElement('input', {'aria-label': '输出文件完整路径（如 D:\\档案\\生成的档案.md）',
                              style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 140 }),
                              value: 生成存到,
                              placeholder: '输出文件完整路径（如 D:\\档案\\生成的档案.md）',
                              onChange: (e) => set生成存到(e.target.value),
                            }),
                            React.createElement(
                              'button',
                              {type: 'button',
                                style: S.btn,
                                onClick: () => {
                                  const 要开 = !生成选目录
                                  set生成选目录(要开)
                                  // 注意：每次打开都**重读一遍**（原来只在第一次读，再打开看到的是旧的）
                                  if (要开) {
                                    // 从当前路径所在的目录开始（拿不到就从盘符列表开始）
                                    const 起点 = /[\\/]/.test(生成存到) ? 生成存到.replace(/[\\/][^\\/]*$/, '') : ''
                                    post('/dirs', { path: 起点 })
                                      .then((r) => set生成目录列(r))
                                      .catch((e) => setNotes(['列不了目录：' + ((e && e.message) || e)]))
                                  }
                                },
                              },
                              生成选目录 ? '收起' : '选文件夹',
                            ),
                          ),
                          // 文件夹选择器（跟「从旧档案导入」那个是同一个接口）
                          生成选目录 && 生成目录列
                            ? React.createElement(
                                'div',
                                { style: { margin: '4px 0 0', padding: '6px 10px', borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-soft)', border: '1px solid var(--fish-border)', fontSize: 'var(--fish-small)' } },
                                React.createElement(
                                  'div',
                                  { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 4 } },
                                  React.createElement('span', { style: S.dim }, 生成目录列.path ? '当前：' + 生成目录列.path : '选一个盘'),
                                  React.createElement('div', { style: { flex: 1 } }),
                                  // 注意：选择器里也放一个「收起」—— 别只能靠上面那个按钮
                                  React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set生成选目录(false) }, '收起'),
                                ),
                                生成目录列.ok === false
                                  ? React.createElement('div', { style: S.drop }, '失败：' + (生成目录列.message || '列不了'))
                                  : React.createElement(
                                      'div',
                                      null,
                                      React.createElement(
                                        'div',
                                        { style: Object.assign({}, S.dim, { marginBottom: 4 }) },
                                        生成目录列.path
                                          ? '「' + 生成目录列.path + '」的子文件夹：'
                                          : '选一个盘：',
                                      ),
                                      React.createElement(
                                        'div',
                                        { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
                                        生成目录列.parent
                                          ? React.createElement(
                                              'span',
                                              {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                                style: S.link,
                                                onClick: () =>
                                                  post('/dirs', { path: 生成目录列.parent }).then((r) => set生成目录列(r)).catch(() => {}),
                                              },
                                              '↑ 上一级',
                                            )
                                          : null,
                                        (生成目录列.dirs || []).map((d) =>
                                          React.createElement(
                                            'span',
                                            {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                              key: d.path,
                                              style: S.link,
                                              onClick: () =>
                                                post('/dirs', { path: d.path }).then((r) => set生成目录列(r)).catch(() => {}),
                                            },
                                            '📁 ' + d.name,
                                          ),
                                        ),
                                      ),
                                      // 「就用这个文件夹」—— 把路径拼成 <文件夹>\生成的档案.md
                                      生成目录列.path
                                        ? React.createElement(
                                            'div',
                                            { style: { marginTop: 6 } },
                                            React.createElement(
                                              'button',
                                              {type: 'button',
                                                style: S.btn,
                                                onClick: () => {
                                                  const p = String(生成目录列.path).replace(/[\\/]+$/, '')
                                                  set生成存到(p + '\\生成的档案.md')
                                                  set生成选目录(false)
                                                },
                                              },
                                              '使用此文件夹',
                                            ),
                                            React.createElement(
                                              'span',
                                              { style: Object.assign({}, S.dim, { marginLeft: 8 }) },
                                              '保存为“生成的档案.md”',
                                            ),
                                          )
                                        : React.createElement(
                                            'div',
                                            { style: Object.assign({}, S.dim, { marginTop: 6 }) },
                                            '请选择磁盘和目标文件夹。',
                                          ),
                                    ),
                              )
                            : null,
                        ),

                        // 攒下来的条目 + 存文件
                        // 注意：2026-10-26：原来只在「条目 > 0」时渲染 —— 0 条时界面上只留一句
                        //   「点『存成档案文件』」，按钮根本不存在，用户只能到处找 ✗
                        //   → 算过计划就画出来；0 条时按钮置灰、旁边写明为什么。
                        生成计划
                          ? React.createElement(
                              'div',
                              { key: 'r', style: { marginTop: 8 } },
                              React.createElement(
                                'div',
                                { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                                React.createElement('b', null, '已提取 ' + 生成条目.length + ' 条'),
                                React.createElement(
                                  'button',
                                  {type: 'button',
                                    style: S.btn,
                                    disabled: busy || !!(生成进度 && 生成进度.在跑) || !生成条目.length,
                                    onClick: () => 存生成(),
                                  },
                                  '存成档案文件',
                                ),
                                React.createElement(
                                  'span',
                                  { style: S.dim },
                                  生成条目.length
                                    ? '保存为 Markdown 后，返回“档案导入与生成”扫描并选择条目。'
                                    : '暂无可保存条目。若输出截断，可查看诊断日志。',
                                ),
                              ),
                              生成条目.length
                                ? React.createElement(
                                    'div',
                                    { style: Object.assign({}, S.dim, { marginTop: 4, maxHeight: 200, overflow: 'auto', fontSize: 'var(--fish-small)', whiteSpace: 'pre-line' }) },
                                    生成条目.slice(0, 40).map((x) => x.章 + '|' + x.日期 + '|' + x.话).join('\n') +
                                      (生成条目.length > 40 ? '\n…（还有 ' + (生成条目.length - 40) + ' 条）' : ''),
                                  )
                                : null,
                            )
                          : null,

                        // 存好了
                        生成档
                          ? React.createElement(
                              'div',
                              { key: 'ok', style: { marginTop: 8 } },
                              React.createElement('div', null, '档案存到：' + 生成档.存到),
                              React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { marginTop: 2 }) },
                                '共 ' + 生成档.条数 + ' 条' + (生成档.去掉重复 ? '（去掉了 ' + 生成档.去掉重复 + ' 条重复）' : ''),
                              ),
                            )
                          : null,
                      ],
                    )
          else if (mode === 'duplicates') content = React.createElement(
                      'div',                      { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                      [
                        React.createElement(
                          'div',
                          { key: '头', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                          React.createElement('b', null, '查重：'),
                          React.createElement('span', null, (查重.组 || []).length + ' 组、能少 ' + 查重.能少 + ' 条'),
                          React.createElement(
                            'span',
                            { style: S.dim },
                            '（真重复 ' + 查重.真重复组数 + ' 组 / 汇总+明细 ' + 查重.汇总组数 + ' 组）',
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',  style: S.btn, disabled: busy || !查重.真重复组数, onClick: () => 合重复(s, true) },
                            '一键合真重复（' + 查重.真重复组数 + ' 组）',
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',
                              style: S.btn,
                              disabled: busy || !(查重.组 || []).some((g, i) => 查重合[i]),
                              onClick: () => 合重复(s, false),
                            },
                            '合并所选组（' + (查重.组 || []).filter((g, i) => 查重合[i]).length + ' 组、少 ' +
                              (查重.组 || []).reduce((a, g, i) => a + (查重合[i] ? g.条们.length - 1 : 0), 0) + ' 条）',
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',
                              style: S.btn,
                              title: '选择汇总与明细组，合并可能丢失细节。',
                              onClick: () => {
                                const 全 = {}
                                ;(查重.组 || []).forEach((g, i) => {
                                  全[i] = true
                                })
                                set查重合(全)
                              },
                            },
                            '全选汇总与明细组',
                          ),
                          React.createElement('button', {type: 'button',  style: S.btn, onClick: () => { set查重(null); set查重开(false) } }, '收起'),
                        ),
                        React.createElement(
                          'div',
                          { key: '说明', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                          '完全重复组默认选中；' +
                            '汇总与明细组默认不选，' +
                            '需核对细节后手动选择。' +
                            '合并条目移入回收站，可恢复。',
                        ),
                      ]
                        .concat(
                          (查重.组 || []).slice(0, 60).map((g, i) =>
                            React.createElement(
                              'div',
                              {
                                key: 'g' + i,
                                style: { marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--fish-line)' },
                              },
                              [
                                React.createElement(
                                  'div',
                                  {
                                    key: 'h',
                                    style: { fontSize: 'var(--fish-small)', marginBottom: 4, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
                                  },
                                  // ⭐⭐ 2026-09-23：每组一个「要合」的勾 —— 不勾的组「按我勾的合」不会碰
                                  React.createElement('input', {'aria-label': '合并第 ' + (i + 1) + ' 组',
                                    key: 'c',
                                    type: 'checkbox',
                                    checked: !!查重合[i],
                                    title: '选择后参与合并',
                                    onChange: () => set查重合(Object.assign({}, 查重合, { [i]: !查重合[i] })),
                                  }),
                                  '第 ' + (i + 1) + ' 组 · ' + g.条们.length + ' 条 · ',
                                  React.createElement('b', { style: g.类型 === '真重复' ? S.ok : S.warn }, g.类型),
                                  查重合[i]
                                    ? null
                                    : React.createElement(
                                        'span',
                                        { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) },
                                        '（不参与）',
                                      ),
                                ),
                              ].concat(
                                g.条们.map((t) =>
                                  React.createElement(
                                    'label',
                                    {
                                      key: t.id,
                                      style: { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start', padding: '3px 0', cursor: 'pointer' },
                                    },
                                    [
                                      React.createElement('input', {'aria-label': '保留记忆：' + t.text,
                                        key: 'r',
                                        type: 'radio',
                                        name: '查重组' + i,
                                        checked: 查重选[i] === t.id,
                                        onChange: () => set查重选(Object.assign({}, 查重选, { [i]: t.id })),
                                      }),
                                      React.createElement(
                                        'span',
                                        { key: 't', style: { flex: 1, minWidth: 0, overflowWrap: 'anywhere' } },
                                        t.text,
                                      ),
                                      React.createElement(
                                        'span',
                                        { key: 'n', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', overflowWrap: 'anywhere' }) },
                                        t.长 + ' 字',
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        )
                        .concat(
                          (查重.组 || []).length > 60
                            ? [
                                React.createElement(
                                  'div',
                                  { key: '更多', style: Object.assign({}, S.dim, { marginTop: 8 }) },
                                  '（显示前 60 组，处理后可再次检查）',
                                ),
                              ]
                            : [],
                        ),
                    )
          else if (mode === 'trash') content = React.createElement(
                  'div',
                  { style: { marginTop: 6 } },
                  // ⭐⭐ 2026-09-22（反馈「你放在最下面的呀，你改到最上面去，
                  //     谁那么多条？如果有100条，我得翻到最下面才能全选吗？」）：
                  //   工具条原来在**列表最下面** —— 68 条就得翻到底才能点「全选」✗
                  //   → 挪到**最上面**，跟标题挨着
                  // ⭐⭐ 2026-09-23（反馈「点『清空』之后提示在最下面，看都看不到」）：
                  //   确认条原来渲染在**列表下面** —— 68 条就得翻到底才看得见那两句问话 ✗
                  //   （跟 0.9.7 修过的「工具条在最下面」是同一个毛病）
                  //   → 改成**就地替换工具条**：两样都在最上面，点了「清空」，
                  //     工具条那一格立刻变成确认条，不用滚
                  已删.length > 0 && confirm && confirm.kind === 'purgeall'
                    ? 确认条('将回收站中的 ' + 已删.length + ' 条永久删除？此操作不可恢复。', '清空回收站', 'purgeall', '*')
                    : null,
                  // ⭐⭐ 2026-09-23（反馈「这里没有批量找回呀」）：批量找回的确认
                  //   注意：这个**不是销毁**（是往回捞），所以文案跟「清掉」正好相反
                  已删.length > 0 && !(confirm && confirm.kind === 'purgeall') && 批回问
                    ? React.createElement(
                        'div',
                        { style: S.confirm },
                        React.createElement(
                          'div',
                          { style: { flex: 1 } },
                          批回问.只合并
                            ? '恢复因合并删除的 ' + 已删.filter((m) => m.合并掉的 === true).length + ' 条？'
                            : '将所选 ' + 已选清几条 + ' 条恢复？',
                          React.createElement(
                            'div',
                            { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                            '恢复后重新参与召回，仍可再次删除。',
                          ),
                        ),
                        React.createElement('button', {type: 'button',  style: S.btn, disabled: busy, onClick: () => 批回(s, 批回问.只合并) }, busy ? '恢复中…' : '确认恢复'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set批回问(false) }, '取消'),
                      )
                    : null,
                  已删.length > 0 && !(confirm && confirm.kind === 'purgeall') && !批回问 && 批清问 && 已选清几条 > 0
                    ? React.createElement(
                        'div',
                        { style: S.confirm },
                        React.createElement(
                          'div',
                          { style: { flex: 1 } },
                          '永久删除所选 ' + 已选清几条 + ' 条？',
                          React.createElement(
                            'div',
                            { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                            '永久删除后无法从回收站恢复，备份可能仍保留副本。',
                          ),
                        ),
                        React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 批清(s) }, busy ? '删除中…' : '确认删除（' + 已选清几条 + ' 条）'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set批清问(false) }, '取消'),
                      )
                    : null,
                  已删.length > 0 && !(confirm && confirm.kind === 'purgeall') && !批回问 && !(批清问 && 已选清几条 > 0)
                    ? React.createElement(
                        'div',
                        { style: { margin: '8px 0', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                        // ⭐ 一键全选
                        React.createElement(
                          'button',
                          {type: 'button',
                            style: S.btn,
                            title: '全选或取消当前列表',
                            onClick: () => {
                              if (已选清几条 === 已删.length) {
                                set选中清({})
                                set批清问(false)
                                return
                              }
                              const 全 = {}
                              for (const m of 已删) 全[m.id] = true
                              set选中清(全)
                            },
                          },
                          已选清几条 === 已删.length && 已删.length > 0 ? '取消全选' : '全选（' + 已删.length + '）',
                        ),
                        // ⭐ 批量清掉（勾了几条就显示几条）—— 点了**不直接清**，先问一遍
                        已选清几条 > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',  style: S.btnDanger, onClick: () => set批清问(true) },
                              '批量永久删除（' + 已选清几条 + '）',
                            )
                          : null,
                        // ⭐⭐ 2026-09-23（反馈「这里没有批量找回呀」）：**批量找回**
                        已选清几条 > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',
                                style: S.btn,
                                title: '恢复所选回收站条目',
                                onClick: () => set批回问({ 只合并: false }),
                              },
                              '批量恢复（' + 已选清几条 + '）',
                            )
                          : null,
                        // ⭐ 一键撤销整次合并：把「合并掉的」那批全捞回来
                        已删.filter((m) => m.合并掉的 === true).length > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',
                                style: S.btn,
                                title: '恢复全部已合并条目，撤销本次合并',
                                onClick: () => set批回问({ 只合并: true }),
                              },
                              '撤销合并：全部恢复（' + 已删.filter((m) => m.合并掉的 === true).length + '）',
                            )
                          : null,
                        已选清几条 > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',  style: S.btn, onClick: () => { set选中清({}); set批清问(false); set批回问(false) } },
                              '取消勾选',
                            )
                          : null,
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm({ id: '*', kind: 'purgeall' }) }, '把「已删掉的」清空'),
                      )
                    : null,
                  已删.length === 0
                    ? React.createElement('div', { style: S.dim }, '（空的）')
                    : 已删.map((m) =>
                        React.createElement(
                          'div',
                          { key: m.id, style: S.条 },
                          React.createElement(
                            'div',
                            { className: 'fish-record-row', style: S.row },
                            // ⭐ 批量清掉：行首一个勾选框（跟上面那栏一样）
                            React.createElement('input', {'aria-label': '选择已删记忆：' + m.text,
                              type: 'checkbox',
                              checked: !!选中清[m.id],
                              title: '选择后可批量永久删除',
                              onChange: () => set选中清(Object.assign({}, 选中清, { [m.id]: !选中清[m.id] })),
                            }),
                            React.createElement('div', { style: Object.assign({}, S.dim, { width: 108, flex: 'none' }) }, '收于 ' + rel(m.deletedAt, now)),
                            React.createElement('div', { style: Object.assign({}, S.dim, { flex: 1, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }) }, m.text),
                            React.createElement('div', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }), onClick: () => 删(m.id, 'restore') }, '恢复'),
                            React.createElement('div', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.drop, { flex: 'none', fontSize: 'var(--fish-small)', cursor: 'pointer' }), onClick: () => setConfirm({ id: m.id, kind: 'purge' }) }, '永久删除'),
                          ),
                          confirm && confirm.id === m.id && confirm.kind === 'purge'
                            ? 确认条('永久删除后无法恢复，备份可能仍保留副本。', '确认删除', 'purge', m.id)
                            : null,
                        ),
                      ),
                  // ⭐⭐ 2026-09-24（她说的「那已被取代应该回回收站呀」）：
                  //   **被取代的**从主列表挪出来，收在回收站里（就在这一栏下面）✓
                  //   注意：放在 `showDeleted ?` **里面** —— 跟回收站一起折叠
                  //     （放外面的话，回收站收起来了它们还杵在那儿，看着像两栏）
                  //
                  //   ⚠注意：它们**不在 `s.deleted` 里** —— 所以上面那排
                  //     「全选 / 批量清掉 / 把已删掉的清空」**碰不到它们**，
                  //     这是故意的：被取代是自动标的（可能几百条），
                  //     不该被「清空」连坐销毁（丢 157 条那次的教训）✗✗
                  被取代的.length
                    ? React.createElement(
                        'div',
                        null,
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.h, { marginTop: 16 }) },
                          '被取代的（' + 被取代的.length + '）',
                        ),
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginBottom: 4 }) },
                          '同一事实的旧条目已归档，停止注入并保留原文。',
                        ),
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginBottom: 4 }) },
                          '清空回收站不影响已取代条目，可单独恢复。',
                        ),
                        被取代的.map((m) =>
                          React.createElement(
                            'div',
                            { key: m.id, style: S.条 },
                            React.createElement(
                              'div',
                              { className: 'fish-record-row', style: S.row },
                              React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { width: 108, flex: 'none' }) },
                                m.已被取代 && m.已被取代.作废于 ? '收于 ' + rel(m.已被取代.作废于, now) : '已归档',
                              ),
                              React.createElement(
                                'div',
                                { style: { flex: '1 1 260px', minWidth: 200, overflowWrap: 'anywhere', wordBreak: 'break-word' } },
                                React.createElement(
                                  'span',
                                  { style: Object.assign({}, S.dim, { textDecoration: 'line-through', opacity: 1 }) },
                                  m.text,
                                ),
                              ),
                              React.createElement(
                                'div',
                                {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)' }),
                                  title: '恢复此条目并重新参与召回',
                                  onClick: () => 撤销作废(m.id),
                                },
                                '恢复',
                              ),
                            ),
                            m.已被取代 && m.已被取代.为什么
                              ? React.createElement(
                                  'div',
                                  {
                                    style: Object.assign({}, S.dim, {
                                      margin: '4px 0 8px',
                                      fontSize: 'var(--fish-small)',
                                      overflowWrap: 'anywhere',
                                      wordBreak: 'break-word',
                                    }),
                                  },
                                  '归档原因：' + m.已被取代.为什么,
                                )
                              : null,
                          ),
                        ),
                      )
                    : null,
                  // 注意：工具条和两个确认条**都在上面**了（见前面那段）——
                  //   原来「批量清掉」和「清空」的确认条渲染在这儿（列表最下面），
                  //   条数一多就看不见 失败：→ 挪走了，这里不再重复
                )
          else if (mode === 'index') content = h(EmbeddingSettings, { session: s.id, storeId: s.storeId, notify, indexOnly: true })
          else if (mode === 'recall') content = tr ? React.createElement(
                'div',
                null,
                React.createElement('div', { style: S.h }, '最近一次召回'),
                React.createElement('div', { style: S.dim }, '线索：「' + String(tr.query || '').slice(0, 50) + '」'),
                tr.semantic ? React.createElement('div', { style: S.dim }, '语义：缺失向量 ' + tr.semantic.missing + '；耗时 ' + tr.semantic.latencyMs + 'ms；回退 ' + (tr.semantic.fallback || '无')) : null,
                (() => {
                  // 注意：按分数排再显示 —— 老记录是按**入库顺序**存的，
                  //   直接取前 12 条全是 0 分的老条目，看不出到底挑中了什么 ✗
                  //   （反馈：「这里为什么只有这些，该显示最近标中的」）
                  const 排好 = (tr.rows || []).slice().sort((a, b) => (b.P || 0) - (a.P || 0) || (b.C || 0) - (a.C || 0))
                  const 进去的 = 排好.filter((r) => !r.omission)
                  return React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '2px 0 4px' }) },
                      进去的.length
                        ? '已注入 ' + 进去的.length + ' 条（优先显示）'
                        : '本轮无匹配记忆',
                    ),
                    排好.slice(0, 20).map((r, i) => {
                      const origin = r.storeId ? d.sessions.find(x => x.storeId === r.storeId) || s : s
                      const mm = origin.memories.find((x) => x.id === r.id) || (origin.deleted || []).find((x) => x.id === r.id)
                      const why = r.resident ? '常驻事实' : r.omission
                        ? { hard_gate: '无匹配线索', below_threshold: '评分未达阈值', limit: '超过条数上限', budget: '超过字数上限', duplicate: '重复条目', fact_cap: '超过长期事实上限' }[r.omission] || r.omission
                        : { assembled: '已注入', consumed: '疑似使用', invalidated: '已失效' }[r.status] || '已注入'
                      const 色 = r.omission
                        ? S.drop
                        : r.status === 'consumed'
                          ? S.ok
                          : S.dim
                      return React.createElement(
                        'div',
                        { key: i, style: Object.assign({}, S.row, S.条) },
                        React.createElement(
                          'div',
                          { style: { flex: 1 } },
                          (r.omission ? '　' : '') + String((mm && mm.text) || r.id).slice(0, 60),
                          r.storeId ? React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setOpen(origin.id) }, '原库：' + r.storeId) : null,
                        ),
                        React.createElement('div', { style: Object.assign({}, S.dim, { width: 54 }) }, 'C ' + r.C + (r.vectorMissing ? ' / 向量缺失' : '') + (r.semantic !== null && r.semantic !== undefined ? ' / cos ' + r.semantic.toFixed(3) + ' / R ' + r.R : '')),
                        React.createElement('div', { style: Object.assign({}, S.dim, { width: 54 }) }, 'P ' + r.P),
                        React.createElement('div', { style: Object.assign({}, 色, { width: 96 }) }, why + (r.timeHit ? ' ⭐' : '')),
                      )
                    }),
                  )
                })(),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 6 }) },
                  '已注入表示纳入本轮上下文；疑似使用基于回复词项匹配推测；已失效表示条目已删除或修改。',
                ),
              ) : h('div', { className: 'memory-empty' }, '暂无召回记录，接收新消息后生成。')
          return h(MemoryDialog, { className: 'memory-library-dialog', title: libraryTitle(s), subtitle: '记忆库 · ' + titles[mode], active, onClose: () => setOpen(null), footer: h('span', null, s.count + ' 条记忆 · ' + (s.qq ? 'QQ 来源库' : '会话记忆库')) },
            h('div', { className: 'memory-library-workspace' },
              h('nav', { className: 'memory-library-nav', 'aria-label': '记忆库工具' },
                ...navigation.map(([view, title, hint], index) =>
                  h('button', { key: view, type: 'button', className: 'fish-button', title: hint, 'aria-label': title,
                    'aria-current': (mode === view || mode === 'edit' && view === 'memories' || mode === 'generate' && view === 'archive' || mode === 'duplicates' && view === 'organize') ? 'page' : undefined,
                    onClick: () => go(view) },
                    h('span', { className: 'memory-nav-number', 'aria-hidden': true }, String(index + 1).padStart(2, '0')),
                    h('span', { className: 'memory-nav-copy' }, h('strong', null, title), h('small', null, hint))))),
              h('div', { className: 'memory-library-content' },
                h('header', { className: 'memory-content-heading' }, h('h3', null, titles[mode]), hint ? h('p', null, hint) : null),
                ['edit', 'generate', 'duplicates'].includes(mode) ? h('button', { type: 'button', className: 'fish-button', onClick: () => go(mode === 'edit' ? 'memories' : mode === 'generate' ? 'archive' : 'organize') }, '返回' + (mode === 'edit' ? '记忆条目' : mode === 'generate' ? '档案导入与生成' : '整理与修复')) : null,
                notes?.length ? h('div', { className: 'memory-feedback', role: 'status' }, notes.join('\n')) : null,
                content)))
        })()
      })()
      // ---- 第一级：会话列表 + 参数 ----
      const spec = (d.spec || []).slice()
      const byKey = {}
      for (const s of spec) byKey[s.key] = s
      const WK = spec.filter((s) => s.group === 'weight').map((s) => s.key)

      const setOne = (k, native) => {
        policyDirty.current.add(k)
        // 函数式更新 —— 连着改两格不会互相覆盖
        setParams((prev) => Object.assign({}, prev, { [k]: native }))
        if (WK.indexOf(k) >= 0) setPin(k)
        setNotes(null)
      }

      const wSum = WK.length ? Math.round(WK.reduce((a, k) => a + toPct(params[k] || 0), 0) * 10) / 10 : 0

      // 2026-09-21 修版式：原来五个东西挤在一行里（标签写死 110px ＋ 一整句长提示），
      // flexWrap 一装不下就拆散成「一行一个」；而 9 个字的标签在 110px 盒子里还会自己折行
      // —— 她看到那个孤零零的「活」就是「没写时间的算多鲜活」的尾巴。
      // 现在拆两行：① 标签＋数字＋单位＋范围（短，不会挤）② 提示独占一行，自己换行。
      // 单位没写就不占位（原来会留一个空的 20px 盒子）。
      const oneRow = (s) => {
        const isW = s.group === 'weight'
        const lo = isW ? toPct(s.min) : s.min
        const hi = isW ? toPct(s.max) : s.max
        const cur = isW ? toPct(params[s.key]) : params[s.key]
        const typing = editing && editing.key === s.key
        const unit = isW ? '%' : s.unit || ''
        const head = [
          React.createElement('span', { key: 'lbl', style: { flex: '0 0 auto' } }, s.label),
          React.createElement('input', {'aria-label': s.label,
            key: 'inp',
            type: 'number',
            style: S.inp,
            min: lo,
            max: hi,
            step: isW ? 0.1 : s.step,
            value: typing ? editing.text : String(cur),
            onChange: (e) => {
              const t = e.target.value
              setEditing({ key: s.key, text: t })
              const n = Number(t)
              if (t !== '' && isFinite(n)) setOne(s.key, isW ? fromPct(n) : n)
            },
            onBlur: () => { setEditing(null); save(Object.assign({}, params, { pin })) },
          }),
        ]
        if (unit) head.push(React.createElement('span', { key: 'unit', style: S.dim }, unit))
        head.push(React.createElement('span', { key: 'rng', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', opacity: 1 }) }, '（' + lo + ' ~ ' + hi + '）'))
        return React.createElement(
          'div',
          { key: s.key, className: 'memory-policy-field' },
          React.createElement('div', { className: 'memory-policy-input' }, head),
          s.tip
            ? React.createElement('div', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2, lineHeight: 1.5 }) }, s.tip)
            : null,
        )
      }

      const save = (body) => {
        setBusy(true)
        setNotes(null)
        const request = policyQueue.current.catch(() => {}).then(() => post('/policy', body))
        policyQueue.current = request
        return request.then((r) => {
            if (!r || r.ok === false) throw Error(r?.error || '保存召回设置失败')
            if (r && r.policy) {
              setParams(old => Object.fromEntries(Object.entries(r.policy).map(([key, value]) => {
                if (!body.reset && old[key] !== body[key]) return [key, old[key]]
                policyDirty.current.delete(key)
                return [key, value]
              })))
              setD(old => ({ ...old, policy: r.policy }))
            }
            setNotes(null)
            告知(['召回设置已保存', ...(r.notes || [])].join('\n'), { tone: 'success' })
            setBusy(false)
          })
          .catch((e) => {
            setBusy(false)
            告知('保存失败：' + ((e && e.message) || e))
          })
      }

      const blocks = GROUPS.map(([gid, name, hint]) => {
        const rows = spec.filter(item => item.group === gid)
        if (!rows.length) return null
        return h('section', { className: 'memory-policy-group', key: gid }, h('div', { className: 'memory-policy-head' }, h('h4', null, name), h('p', null, hint), gid === 'weight' ? h('span', { className: 'memory-badge' }, '合计 ' + wSum + '%') : null), h('div', { className: 'memory-policy-fields' }, ...rows.map(oneRow)))
      })

      return h(
        'div',
        { className: 'fish-module fish-memory memory-page' },
        onPageChange
          ? null
          : h(
              'nav',
              { className: 'fish-subnav', 'aria-label': '长期记忆页面' },
              ...['记忆库', 'RAG 语义召回'].map((name) =>
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'fish-button' + (memoryPage === name ? ' fish-primary' : ''),
                    key: name,
                    'aria-current': memoryPage === name ? 'page' : undefined,
                    onClick: () => setMemoryPage(name),
                  },
                  name,
                ),
              ),
            ),
        h(
          'div',
          { className: 'memory-page-toolbar' },
          onPageChange ? null : h('h2', null, memoryPage),
          h(RefreshButton, { type: 'button', label: '刷新', disabled: busy, onClick: load }, '刷新'),
        ),
        err ? h('div', { className: 'memory-feedback', role: 'alert' }, err) : null,
        memoryPage === '记忆库'
          ? h(
              React.Fragment,
              null,
              h(
                'section',
                { className: 'fish-card memory-summary' },
                h(
                  'div',
                  null,
                  h('h3', null, '长期记忆'),
                  h('p', null, '按 QQ 来源管理记忆，私聊独立，普通群共享，指定群单独隔离。'),
                ),
                h(
                  'div',
                  { className: 'memory-switch' },
                  h(Switch, {
                    type: 'checkbox',
                    role: 'switch',
                    'aria-label': '启用长期记忆',
                    checked: d.全局开关 !== false,
                    disabled: busy,
                    onChange: async () => {
                      setBusy(true)
                      try {
                        const r = await post('/global', { on: d.全局开关 === false })
                        if (!r.ok) throw Error(r.error || r.message || '保存失败')
                        load()
                      } catch (e) {
                        告知(e.message)
                      } finally {
                        setBusy(false)
                      }
                    },
                  }),
                  h('span', null, d.全局开关 !== false ? '已开启' : '已关闭'),
                ),
              ),
              h(
                'div',
                { className: 'memory-stats' },
                ...[
                  [libraries.length, '记忆库'],
                  [libraries.reduce((sum, s) => sum + s.count, 0), '记忆条目'],
                  [(d.sessions || []).length, '关联入口'],
                ].map(([value, label]) =>
                  h('div', { key: label }, h('strong', null, value), h('span', null, label)),
                ),
              ),
              h(
                'section',
                { className: 'fish-card memory-libraries' },
                h(
                  'div',
                  { className: 'memory-card-head' },
                  h(
                    'div',
                    null,
                    h('h3', null, '工作区记忆库'),
                    h('p', null, '相同存储库合并展示，可管理条目、档案与语义索引。'),
                  ),
                ),
                !libraries.length
                  ? h(
                      'div',
                      { className: 'memory-empty' },
                      '暂无记忆库，绑定会话并接收消息后生成。',
                    )
                  : h(
                      'div',
                      { className: 'memory-library-list' },
                      ...libraries.map((s) =>
                        h(
                          'article',
                          { key: s.storeId || s.id, className: 'memory-library-row' },
                          h(
                            'div',
                            { className: 'memory-library-copy' },
                            h(
                              'div',
                              { className: 'memory-library-title' },
                              h('strong', null, libraryTitle(s)),
                              h(
                                'span',
                                { className: 'memory-badge' },
                                s.qq
                                  ? s.storeId?.endsWith('_shared')
                                    ? '群共享'
                                    : s.storeId?.includes('_group_')
                                      ? '群独立'
                                      : '私聊独立'
                                  : d.模式 === 'workspace'
                                    ? '工作区共享'
                                    : '会话独立',
                              ),
                            ),
                            h(
                              'p',
                              null,
                              s.count +
                                ' 条记忆 · ' +
                                (d.sessions || []).filter((x) => (x.storeId || x.id) === (s.storeId || s.id))
                                  .length +
                                ' 个入口 · ' +
                                (s.lastTrace ? '最近召回 ' + rel(s.lastTrace, now) : '暂无召回记录'),
                            ),
                          ),
                          h(
                            'div',
                            { className: 'memory-actions' },
                            h(
                              'button',
                              {
                                type: 'button',
                                className: 'fish-button',
                                onClick: () => openLibrary(s.id),
                              },
                              '管理',
                            ),
                          ),
                        ),
                      ),
                    ),
              ),
            )
          : null,
        h(
          'div',
          { className: 'memory-stack', hidden: memoryPage !== 'RAG 语义召回' },
          h(EmbeddingSettings, { notify }),
          h(
            'section',
            { className: 'fish-card' },
            h(
              'div',
              { className: 'memory-card-head' },
              h(
                'div',
                null,
                h('h3', null, '召回与遗忘'),
                h('p', null, '设置关键词召回、记忆预算与淡忘速度，和语义召回共同生效。'),
              ),
            ),
            ...blocks,
            h(
              'div',
              { className: 'memory-actions memory-save-row' },
              null,
              h(
                'button',
                {
                  type: 'button',
                  className: 'fish-button',
                  disabled: busy,
                  onClick: () => save({ reset: true }),
                },
                '恢复默认',
              ),
            ),
          ),
        ),
        notes?.length && !open
          ? h('div', { className: 'memory-feedback', role: 'status' }, notes.join('\n'))
          : null,
        详情视图,
      )

    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('settings.section', () =>
        slots.register(
          {
            name: 'settings.section',
            id: 'memory',
            order: 51,
            label: () => '长期记忆',
          },
          () => React.createElement('div', null, null, React.createElement(Section)),
        ),
      )
    }

    exports.Section = Section
    exports.MemoryDialog = MemoryDialog
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
