// DSH「主动搭话」· 网页半边
//
// 只干一件事：在 **DSH 设置** 左侧栏加一项「主动搭话」，
// 把那 7 组设置全摆出来，外加两个安全的试法（演练 / 真发一次）和一份最近掷骰记录。
//
// 注意：这里**不碰会话、不发消息**，只是往宿主那几条 /dsh-speak-up/* 路由上读写。
//   真正的掷骰和 followup 都在宿主半边（lib/host.js），这样只有一份逻辑。
//
// 注意：槽位名 'settings.section' 跟 dsh-write / dsh-fish-memory 用的是同一个，
//   是在这个环境里已经跑通的路子（不确定换 DSH 版本会不会变，见 README）。

window.__ModuleLoader__.load({
  id: 'dsh-speak-up',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const inject = ['slots']

    const B = '/dsh-speak-up'
    const get = (p) => fetch(B + p, { cache: 'no-store' }).then((r) => r.json()).catch(() => null)
    const post = (p, body) =>
      fetch(B + p, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
        .then((r) => r.json())
        .catch(() => null)

    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'

    // 样式贴着主题变量走，换皮肤/换深浅色都跟着变（照 dsh-write 的做法）
    const S = {
      wrap: { display: 'grid', gap: 24, padding: '0 0 24px', fontSize: 'var(--fish-body)', lineHeight: 1.75, minWidth: 0 },
      h: { fontFamily: 'var(--fish-title)', fontSize: 20, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.5 },
      dim: { color: 'var(--fish-muted)', fontSize: 'var(--fish-small)' },
      card: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius)', padding: '24px', marginBottom: 0, display: 'grid', gap: 16, minWidth: 0, background: 'var(--fish-panel)', boxShadow: 'var(--fish-shadow)' },
      row: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' },
      lab: { flex: '0 1 200px', paddingTop: 8, fontSize: 'var(--fish-label)', fontWeight: 550 },
      ctl: { flex: '1 1 260px', minWidth: 0 },
      hint: { color: 'var(--fish-muted)', fontSize: 'var(--fish-small)', marginTop: 8, lineHeight: 1.75 },
      input: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: '100%', maxWidth: '100%', boxSizing: 'border-box' },
      small: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: 136, maxWidth: '100%', boxSizing: 'border-box' },
      wide: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: '100%', boxSizing: 'border-box' },
      ta: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-body)', width: '100%', minHeight: 112, boxSizing: 'border-box', lineHeight: 1.75, fontFamily: 'inherit', resize: 'vertical' },
      ok: { color: 'var(--fish-success)', fontSize: 'var(--fish-small)' },
      warn: { color: 'var(--fish-warning)', border: '1px solid var(--fish-border)', background: 'var(--fish-soft)', borderRadius: 'var(--fish-radius-sm)', padding: 16, marginBottom: 16 },
      已同步: { margin: '8px 0 20px', fontSize: 'var(--fish-small)', color: 'var(--fish-success)' },
      未保存: { margin: '8px 0 20px', fontSize: 'var(--fish-small)', color: 'var(--fish-warning)', fontWeight: 550 },
      btn: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 16px', background: 'var(--fish-control-fill)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', cursor: 'pointer' },
      btnOn: { border: '1px solid var(--fish-action)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 16px', background: 'var(--fish-action)', color: 'var(--fish-on-accent)', fontSize: 'var(--fish-label)', cursor: 'pointer' },
      tabBar: { display: 'flex', gap: 8, overflowX: 'auto', margin: '16px 0 24px', paddingBottom: 16, borderBottom: '1px solid var(--fish-border)' },
      stack: { display: 'grid', gap: 20 },
      grid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, alignItems: 'start' },
      group: { borderTop: '1px solid var(--fish-border)', padding: '20px 0' },
      summary: { fontWeight: 600, fontSize: 16, cursor: 'pointer', padding: '8px 0 16px' },
      日志行: { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 'var(--fish-small)', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: '8px 0', borderBottom: '1px solid var(--fish-line)' },
      表头: {}, 表格行: {}, 空间表头: {}, 空间行: {},
      表头字: { fontSize: 'var(--fish-small)', color: 'var(--fish-muted)' },
      已勾: { border: '1px solid var(--fish-border)', background: 'var(--fish-soft)', borderRadius: 'var(--fish-radius-sm)', padding: '12px 16px', fontSize: 'var(--fish-small)' },
      清单: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius-sm)', marginTop: 12, maxHeight: 320, overflowY: 'auto' },
      会话行: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--fish-line)' },
      会话行勾上: { background: 'var(--fish-accent-soft)', fontWeight: 550 },
      tag: { display: 'inline-block', border: '1px solid var(--fish-border)', borderRadius: 20, padding: '2px 8px', fontSize: 'var(--fish-small)', marginRight: 8 }
    }

    // ---------- 小控件 ----------

    const 提示 = (文本) => h('div', { style: S.hint }, 文本)
    const 行 = (标签, 控件, 说明) =>
      h(
        'div',
        { className: 'fish-form-row', style: S.row },
        h('div', { className: 'fish-form-label', style: S.lab }, 标签),
        h('div', { className: 'fish-control', style: S.ctl }, (['input', 'select', 'textarea', Switch].includes(控件?.type) ? React.cloneElement(控件, { 'aria-label': 标签 }) : 控件), 说明 ? 提示(说明) : null),
      )
    const 按钮 = (文字, onClick, 亮, 关) =>
      h(
        'button',
        { type: 'button', className: 亮 ? 'fish-primary' : '', style: 亮 ? S.btnOn : S.btn, onClick, disabled: !!关, title: 文字 },
        文字,
      )
    const 勾 = (值, onChange) =>
      h(Switch, {'aria-label': '设置值',  type: 'checkbox', role: 'switch', checked: !!值, onChange: (e) => onChange(e.target.checked) })
    const 数 = (值, onChange, 步, 标签 = '设置值') =>
      h('input', {'aria-label': 标签,
        type: 'number',
        value: 值 === undefined || 值 === null ? '' : 值,
        step: 步 || 1,
        style: S.small,
        onChange: (e) => onChange(e.target.value),
      })
    /** 会话 id 的后 8 位 —— 前面那截（session- 和 uuid 开头）全都一样，只有尾巴分得出谁是谁。 */
    const 短id = (id) => {
      const s = String(id)
      return s.length <= 8 ? s : s.slice(-8)
    }

    /** 标题拿不到就明说「（还没起名）」，**绝不留空白**（空白会让人以为坏了）。 */
    const 题 = (s) => (s && typeof s.标题 === 'string' && s.标题.trim() !== '' ? s.标题 : '（未命名）')

    /** 逗号/空格/顿号都能当分隔（照抄老版输入框的行为）。 */
    const 拆id = (文) => String(文 || '').split(/[\s,;，、]+/).filter((x) => x !== '')

    // ---------- 设置页 ----------

    function Section({ guard, notify } = {}) {
      const [态, 设态] = React.useState(null)
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [忙, 设忙] = React.useState(false)
      // 次要路径（手填 id）的草稿：null = 没动过，直接显示配置里那份
      const [手填, 设手填] = React.useState(null)
      // 「改了但还没按保存」——填了不按保存等于没填，这个标志就是让这件事写在脸上
      const [脏, 设脏] = React.useState(false)
      const [同步话, 设同步话] = React.useState('')
      const handRef = React.useRef(手填)
      handRef.current = 手填
      const saveRef = React.useRef(null)
      const autosave = typeof useFishAutosave === 'function' ? useFishAutosave(() => saveRef.current?.()) : {}
      const queueRef = React.useRef(Promise.resolve())
      const draftRef = React.useRef({})

      React.useEffect(() => {
        if (!guard) return
        guard.current = { dirty: 脏, save: () => saveRef.current?.() }
        return () => { if (guard) guard.current = { dirty: false, save: null } }
      }, [脏, guard])

      const 拉 = React.useCallback(
        () => get('/state').then((r) => { if (r && r.ok) 设态(旧 => 旧 ? { ...r, 配置: { ...r.配置, ...draftRef.current } } : r); else 告知('无法读取宿主状态，请检查插件加载情况。', { holdMs: 6000 }) }),
        [],
      )

      React.useEffect(() => { 拉() }, [拉])

      if (!态 || !态.配置) {
        return h('div', { className: 'fish-module fish-speak', style: S.wrap, ...autosave }, h('div', { className: 'fish-section-title', style: S.h }, '主动搭话'), h('div', { style: S.dim }, '读取中…'))
      }

      const 配置 = 态.配置
      /** 改「要点保存」的字段（数字/文案/开关）→ 置脏。 */

      const 改 = (k, v) => {
        设同步话('')
        draftRef.current[k] = v
        设态((旧) => ({ ...旧, 配置: { ...旧.配置, [k]: v } }))
        设脏(true)
      }

      /** 勾上的会话列表（组件里以本地状态为准，不等刷新，点一下立刻变色）。 */
      const 目标们 = Array.isArray(配置.目标会话) ? 配置.目标会话 : []
      // ⭐ 2026-10-23：会话 id 有两种写法（`xxx` / `session-xxx`）。host 那边现在统一存带前缀的，
      //    这里比较也要先洗一遍 —— 否则会出现「面板说已勾 1 个，框却是空的 / 点一下变 2 / 取消不掉」。
      const 会话键 = (v) => {
        const s = String(v == null ? '' : v).trim()
        return s.startsWith('session-') ? s.slice('session-'.length) : s
      }
      const 已勾 = (id) => 目标们.map(会话键).indexOf(会话键(id)) >= 0

      /**
       * 勾上/取消 → **立刻自动保存**（她原话：「有打勾不就完了嘛」）。
       * 注意：这是踩过坑改的：最早那版是「填进输入框 → 再按下面的『保存设置』」，
       *   结果她填了没按保存（按钮在另一张卡片里、页面上也没有任何"还没保存"的提示），
       *   host 一直报「还没配目标会话」。勾选这类核心设置就该点一下就落盘。
       * 注意：自动存只把「目标会话」这一个补丁发上去（host 的 /save 是合并语义），
       *   所以不会覆盖她在别的字段里还没保存的改动。
       */
      const 切换 = (id, 勾上) => {
        设手填(null)
        设脏(Object.keys(draftRef.current).length > 0)
        const 键 = 会话键(id)
        const 下一个 = 勾上
          ? (目标们.map(会话键).indexOf(键) >= 0 ? 目标们 : [...目标们, String(id)])
          : 目标们.filter((x) => 会话键(x) !== 键)
        设态((旧) => ({ ...旧, 配置: { ...旧.配置, 目标会话: 下一个 } }))
        自动存({ 目标会话: 下一个 })
      }

      const 自动存 = (补丁) => {
        const 回滚 = Object.fromEntries(Object.keys(补丁).map(key => [key, 配置[key]]))
        设忙(true)
        设同步话('保存中…')
        const task = queueRef.current.then(async () => {
          const r = await post('/save', 补丁)
          if (r && r.ok) {
            设态(旧 => ({ ...r, 配置: { ...r.配置, ...draftRef.current } }))
            设同步话('已保存')
            告知(r.说 || '设置已保存', { tone: 'success' })
          } else {
            设同步话('保存失败，请重试')
            告知(r?.说 || '保存失败，设置未生效', { holdMs: 6000 })
            设态(旧 => ({ ...旧, 配置: { ...旧.配置, ...回滚, ...draftRef.current } }))
            await 拉()
          }
        }).finally(() => 设忙(false))
        queueRef.current = task.catch(() => {})
        return task
      }

      const 改开关 = (k, v) => {
        设态(旧 => ({ ...旧, 配置: { ...旧.配置, [k]: v } }))
        return 自动存({ [k]: v })
      }

      const 存 = async () => {
        设忙(true)
        await queueRef.current
        // 手填框里还有没提交的草稿 → 存的时候一起带上
        const 手填快照 = handRef.current
        const 要存 = { ...draftRef.current, ...(手填快照 === null ? {} : { 目标会话: 拆id(手填快照) }) }
        const r = await post('/save', 要存)
        if (r && r.ok) {
          const 剩余草稿 = { ...draftRef.current }
          for (const key of Object.keys(要存)) {
            if (剩余草稿[key] === 要存[key]) delete 剩余草稿[key]
          }
          draftRef.current = 剩余草稿
          设态({ ...r, 配置: { ...r.配置, ...剩余草稿 } })
          const 有新手填 = handRef.current !== 手填快照
          if (!有新手填) 设手填(null)
          设脏(Object.keys(剩余草稿).length > 0 || 有新手填)
          设同步话('已保存')
          告知(r.说 || '已保存', { tone: 'success' })
          设忙(false)
          return true
        }
        告知((r && r.说) || '保存失败', { holdMs: 6000 })
        设同步话('保存失败 ✗')
        设忙(false)
        return false
      }
      saveRef.current = () => 脏 || 手填 !== null ? 存() : true

      const 掷 = async (模式) => {
        if (脏 && !await 存()) return
        await queueRef.current
        设忙(true)
        const r = await post('/roll', { 模式 })
        if (r && r.ok) 设态((旧) => ({ ...旧, 日志: r.日志 }))
        告知((r && r.说) || '执行完成')
        设忙(false)
      }

      const 新建小屋 = async () => {
        if (!window.confirm('新建会话并加入目标列表？')) return
        设忙(true)
        const r = await post('/new-session', { 设为目标: true })
        if (r && r.ok) {
          设手填(null)
          设脏(Object.keys(draftRef.current).length > 0)
          // 同样只刷服务端那份，别把她在别的字段里还没保存的改动抹掉
          设态((旧) => ({
            ...旧,
            配置: { ...旧.配置, 目标会话: r.配置 ? r.配置.目标会话 : 旧.配置.目标会话 },
            日志: r.日志,
            目标情况: r.目标情况,
            目标活着: r.目标活着,
            活着的会话: r.活着的会话,
          }))
        }
        告知((r && r.说) || '做完了')
        设忙(false)
      }

      const 会话们 = Array.isArray(态.活着的会话) ? 态.活着的会话 : []
      const 日志 = Array.isArray(态.日志) ? 态.日志 : []
      const 目标情况 = Array.isArray(态.目标情况) ? 态.目标情况 : []
      const 目标活着数 = 目标情况.filter((x) => x.活着).length
      const 手填文本 = 手填 === null ? 目标们.join(', ') : 手填

      /** 清单里的一行：`☐ 标题 · …后8位 · 状态`，整行点一下就勾/取消（勾选立刻自动保存）。 */
      const 会话行 = (s) =>
        h(
          'label',
          {
            key: s.id,
            style: { ...S.会话行, ...(已勾(s.id) ? S.会话行勾上 : null) },
            title:
              String(s.id) +
              (s.标题来源 ? '｜标题来源：' + String(s.标题来源) : '') +
              (s.有agent ? '' : '（会话未打开，触发时将跳过）') +
              (s.归档 ? '（会话已归档，请移出目标列表）' : ''),
          },
          h('input', {'aria-label': 题(s),
            type: 'checkbox',
            checked: 已勾(s.id),
            disabled: 忙,
            onChange: (e) => 切换(s.id, e.target.checked),
          }),
          h(
            'span',
            { style: { marginLeft: 8, ...(s.有agent ? null : S.dim) } },
            题(s),
          ),
          h('span', { style: { ...S.dim, marginLeft: 8, whiteSpace: 'nowrap' } }, '…' + 短id(s.id) + ' · ' + String(s.状态 || '?')),
        )

      return h(
        'div',
        { className: 'fish-module fish-speak', style: S.wrap, ...autosave },

        h('div', { className: 'fish-section-title', style: S.h }, '主动搭话'),
        h(
          'div',
          { style: S.dim },
          '按设定间隔执行本地随机检测，' +
            '命中后向目标会话提交触发文案，沿用其角色、历史、工具与记忆。',
        ),

        // —— 总开关 + 试运行 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '开关'),
          行('总开关', 勾(配置.总开关, (v) => 改开关('总开关', v)), '即时保存。关闭后停止投递，并拦截尚未发出的搭话 QQ 消息。'),
          行(
            '试运行',
            React.cloneElement(勾(配置.试运行, (v) => 改开关('试运行', v)), { disabled: 忙 }),
            '默认关闭。启用后仅记录触发结果，不发送消息。',
          ),
        ),

        // —— 骰子 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '触发频率与安静时段'),
          h('div', { style: S.dim },
            '按 0–100 随机值判断。触发阈值 = 时段基础值 × 时机因子 + 累积加成。'),
          行('检测间隔（分钟）', 数(配置.间隔分钟, (v) => 改('间隔分钟', v)), '范围 1–1440 分钟，默认 30。失焦保存，下一轮生效。'),
          行(
            '搭话冷却（分钟）',
            数(配置.搭话冷却分钟, (v) => 改('搭话冷却分钟', v)),
            '实际回复后的冷却时间，默认 20 分钟。' +
              '未产生回复不计入冷却。0 为禁用冷却。' +
              '手动操作不受冷却限制。',
          ),
          行(
            '未命中加成（百分点）',
            数(配置.没中加成, (v) => 改('没中加成', v)),
            '每次未命中后增加的百分点，默认 10。0 为禁用。',
          ),
          行(
            '加成上限（百分点）',
            数(配置.加成上限, (v) => 改('加成上限', v)),
            '累积加成上限，默认 40。',
          ),
          h('div', { style: S.dim },
            '命中后清零（含试运行），连续未命中时累加至上限。',
          ),
          h('div', { style: { ...S.dim, marginTop: 2 } },
            '仅影响定时检测，手动演练与发送不改变累积次数。',
          ),
          h('div', { style: { ...S.dim, marginTop: 2 } },
            '未命中次数仅保存在内存，重启 DSH 后清零。',
          ),
          行(
            '安静时段（起 / 止，小时）',
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } }, React.cloneElement(数(配置.安静起, (v) => 改('安静起', v)), { 'aria-label': '安静开始小时', min: 0, max: 23 }), h('span', { style: S.dim }, ' 点 ~ '), React.cloneElement(数(配置.安静止, (v) => 改('安静止', v)), { 'aria-label': '安静结束小时', min: 0, max: 23 }), h('span', { style: S.dim }, ' 点')),
            '使用配置时区，留空采用宿主时区。默认 1:00–8:00 暂停检测，含起点、不含终点，支持跨午夜。',
          ),
          // 注意：这条她特意提过两次，所以从上面那句里拎出来单独成一行、用红字（不新造颜色，复用 S.未保存）
          h('div', { style: S.未保存 }, '起止时间相同表示禁用安静时段。'),
        ),

        // —— 时机因子 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '对话间隔因子'),
          行(
            '短间隔：阈值 ×0.15',
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } }, 数(配置.近阈值分钟, (v) => 改('近阈值分钟', v), 1, '近阈值分钟'), h('span', { style: S.dim }, ' 分钟内 → ×'), 数(配置.近因子, (v) => 改('近因子', v), 0.05, '近因子')),
            '距上次回复不足此时长时降低触发概率，默认 20 分钟、倍率 0.15。',
          ),
          行(
            '长间隔：阈值 ×1.5',
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } }, 数(配置.远阈值分钟, (v) => 改('远阈值分钟', v), 1, '远阈值分钟'), h('span', { style: S.dim }, ' 分钟以上 → ×'), 数(配置.远因子, (v) => 改('远因子', v), 0.1, '远因子')),
            '距上次回复超过此时长时提高触发概率，默认 360 分钟、倍率 1.5。',
          ),
          h('div', { style: S.dim }, '其余间隔倍率为 1，最终阈值限制在 0–100。'),
        ),

        // —— 峰谷分时（贵的时候少开口，便宜的时候多开口）——
        // 注意：时段是**写死的**（不给格子填），这里只有两个命中线数字 —— 她的要求。
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '峰谷时段阈值'),
          h('div', { style: S.dim }, '时段固定，分别设置基础触发阈值。'),
          行(
            '峰时命中线（%）',
            数(配置.峰时命中线, (v) => 改('峰时命中线', v)),
            '随机值低于阈值时触发。' +
              '工作日 9:00–12:00、14:00–18:00 的基础阈值，默认 20。',
          ),
          行(
            '谷时命中线（%）',
            数(配置.谷时命中线, (v) => 改('谷时命中线', v)),
            '其余时段及周末的基础阈值，默认 60。',
          ),
          行(
            '峰谷与安静时段时区',
            h('input', {'aria-label': '峰谷时区',
              style: S.input,
              placeholder: '留空 = 本机时区；北京填 Asia/Shanghai',
              value: String(配置.峰谷时区 || ''),
              onChange: (e) => 改('峰谷时区', e.target.value),
            }),
            '按指定时区计算时段，北京时间使用 Asia/Shanghai。' +
              '支持 IANA 时区标识，无效值回退至宿主时区。',
          ),
          h('div', { style: { ...S.dim, marginTop: 4 } },
            '最终阈值 = 时段基础值 × 时机因子 + 累积加成，范围 0–100。',
          ),
          h('div', { style: S.未保存 }, '两个阈值相同表示全天使用同一基础阈值。'),
          h('div', { style: S.未保存 },
            '安静时段优先，当前为 ' +
              String(配置.安静起) + '~' + String(配置.安静止) +
              ' 点，此时暂停检测。',
          ),
        ),

        // —— 目标会话（勾选清单；手填只是次要路径）——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '目标会话'),
          h('div', { style: S.dim }, '可选择多个目标。每次命中后，从已打开且空闲的会话中随机选择一个。'),
          h('div', { style: { ...S.dim, marginTop: 2, fontWeight: 600 } }, '选择后立即保存'),
          h('div', { style: { marginTop: 4 } },
            目标们.length
              ? h('div', { style: S.已勾 },
                  '已勾 ' + 目标们.length + ' 个' +
                    (目标情况.length
                      ? '：' + 目标情况.map((x) => (x.标题 ? x.标题 : '…' + 短id(x.id)) + (x.活着 ? '' : '（未打开）')).join('、')
                      : '') +
                    (目标情况.length ? '。其中 ' + 目标活着数 + ' 个已打开' + (目标活着数 === 0 ? '，触发时跳过，请先打开会话' : '') : ''),
                )
              : h('div', { style: { ...S.dim, color: 'var(--fish-danger)' } }, '未选择目标会话，命中后不发送。'),
          ),

          会话们.length
            ? h('div', { style: { marginTop: 8 } },
                h('div', { style: S.dim }, '绑定工作区内的会话，选择后立即保存。'),
                h('div', { style: S.清单 }, 会话们.map(会话行)),
                h('div', { style: { ...S.dim, marginTop: 4 } },
                  '已归档或工作区外的会话不列出，也不会触发搭话。旧目标可在手填框中移除。' +
                    '未命名会话显示短 ID；' +
                    '未打开的会话在触发时跳过。',
                ),
              )
            : h('div', { style: { ...S.dim, marginTop: 8 } }, '暂无可选会话。绑定 QQ 工作区后刷新清单。'),

          h('div', { className: 'fish-actions' },
            h(RefreshButton, { type: 'button', label: '刷新清单', title: '刷新清单', disabled: 忙, onClick: 拉 }, '刷新清单'),
            按钮('新建并选中会话', 新建小屋, false, 忙 || !态.工作区),
          ),

          // 次要路径：手填 / 粘贴 id（她要求「不再是主路径」，但留着）
          h('div', { style: { marginTop: 10, borderTop: '1px solid var(--dsw-alias-border-l2)', paddingTop: 8 } },
            h('div', { style: S.dim }, '手动填写会话 ID，以逗号分隔，失焦后保存。'),
            h('div', { style: { marginTop: 4 } },
              h('input', {'aria-label': 'session-xxxxxxxx-…, session-yyyyyyyy-…',
                type: 'text',
                style: S.input,
                value: 手填文本,
                placeholder: 'session-xxxxxxxx-…, session-yyyyyyyy-…',
                onChange: (e) => { 设手填(e.target.value); 设脏(true); 设同步话('') },
              }),
            ),
            h('div', { style: { marginTop: 6 } }, null),
          ),
        ),

        // —— 文案 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '触发文案'),
          行(
            '触发文案',
            h('textarea', {'aria-label': '触发文案',
              style: S.ta,
              value: 配置.触发文案 === undefined ? '' : String(配置.触发文案),
              onChange: (e) => 改('触发文案', e.target.value),
            }),
            '填写 AI 第一人称文案。系统将自动标记为主动意图，无需补充来源说明。',
          ),
        ),

        // —— 角色（做不到的地方，老实写在这儿）——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '触发消息的角色'),
          行(
            '角色',
            h('select', {'aria-label': '角色',
              style: S.input,
              value: 配置.角色,
              onChange: (e) => 改('角色', e.target.value),
            },
              h('option', { value: 'user' }, 'user（当前支持）'),
              h('option', { value: 'developer' }, 'developer（当前不支持）'),
            ),
            '选择 developer 时拒绝发送并记录原因，详见 README。',
          ),
        ),

        // —— 动作 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '手动操作'),
          h('div', { className: 'fish-actions' },
            null,
            按钮('演练一次（仅预览）', () => 掷('演练'), false, 忙),
            按钮('发送一次（跳过等待）', () => 掷('真发'), false, 忙),
            h(RefreshButton, { type: 'button', label: '刷新', title: '刷新', disabled: 忙, onClick: 拉 }, '刷新'),
          ),
          h('div', { style: { marginTop: 6 } },
            h('div', { style: S.dim },
              '数字、时区、触发文案和角色在输入框失焦后自动保存。'),
            h('div', { style: S.dim },
              '“演练一次”跳过时段、概率和因子，仅预览结果。' +
                '“发送一次”跳过等待、概率与试运行，仍受总开关、安静时段和工作区限制，执行前保存草稿。'),
          ),
        ),

        // —— 记录 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '最近 ' + 日志.length + ' 条记录（新的在最下面）'),
          h('div', { style: S.dim }, '每轮检测均记录结果，包括未命中。'),
          h('div', { style: { marginTop: 6, maxHeight: 260, overflowY: 'auto' } },
            日志.length === 0
              ? h('div', { style: S.dim }, '暂无运行记录，启用后可在这里查看每次判断。')
              : 日志.map((条, i) => h('div', { key: i, style: S.日志行 }, 条.时间 + '　' + 条.文本)),
          ),
        ),

        h('div', { style: S.dim },
          '随机检测不调用模型，仅实际发送后消耗模型额度。',
        ),

        h('details', { className: 'fish-diagnostics' }, h('summary', null, '诊断信息'),
          h('p', null, '模块版本 ' + String(态.版本 || '?')),
          h('p', null, '配置文件：' + String(态.配置文件 || '未知'))),
      )
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('settings.section', () =>
        slots.register(
          { name: 'settings.section', id: 'speak-up', order: 53, label: () => '主动搭话' },
          Section,
        ),
      )
    }

    exports.Section = Section
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
