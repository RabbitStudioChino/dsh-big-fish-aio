function ScheduledMessages({ active, openPlatform, notify }) {
  const path = '/scheduled-messages'
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [sessionId, setSessionId] = React.useState('')
  const [at, setAt] = React.useState('')
  const [repeat, setRepeat] = React.useState('once')
  const [message, setMessage] = React.useState('')
  const latest = React.useRef(0)
  const refresh = async () => {
    const id = ++latest.current
    try {
      const result = await platformRequest(path)
      if (id === latest.current) { setData(result); setError('') }
    } catch (err) { if (id === latest.current) setError(err.message) }
  }
  React.useEffect(() => {
    if (!active) return
    refresh()
    const timer = setInterval(refresh, 5000)
    return () => { clearInterval(timer); latest.current++ }
  }, [active])

  const save = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const { task } = await platformRequest(path + '/create', { sessionId, at: at + '+08:00', repeat, message })
      setMessage('')
      notify(task.nextAt ? '定时任务已创建。' : '定时任务已保存，等待节假日安排公布。')
      await refresh()
    } catch (err) { notify(err.message) }
    finally { setBusy(false) }
  }
  const changeTask = async (action, values, notice) => {
    if (busy) return
    setBusy(true)
    try {
      await platformRequest(path + action, values)
      notify(notice)
      await refresh()
    } catch (err) { notify(err.message) }
    finally { setBusy(false) }
  }
  const sessions = data?.sessions || []
  const tasks = data?.tasks || []
  const statuses = { pending: '待触发', running: '触发中', triggered: '已触发会话', failed: '会话触发失败', missed: '已错过', interrupted: '触发结果未知' }
  const format = at => new Date(at).toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' })
  const usesCalendar = rule => rule === 'workday' || rule === 'holiday'
  const target = sessions.find(session => session.id === sessionId)
  return h('div', { className: 'platform-page schedule-page' },
    h('section', { className: 'fish-card schedule-access' },
      h('div', null, h('strong', null, '通过聊天设置'), h('p', { className: 'fish-muted' }, '在「开放平台 → 定时任务」开启接入并授权调用会话和目标会话后，QQ 主人可以发消息让大肥鱼安排提醒。')),
      button('打开开放平台', openPlatform)),
    error || data?.warning ? h('p', { className: 'memory-feedback', role: 'alert' }, error || data.warning) : null,
    h('form', { className: 'fish-card schedule-form', onSubmit: save },
      h('h2', null, '新建提醒'),
      h('div', { className: 'schedule-fields' },
        h('label', { className: 'memory-field' }, '目标会话', h('select', { required: true, value: target ? target.id : '', onChange: event => setSessionId(event.target.value) },
          h('option', { value: '' }, !data ? '正在读取会话…' : sessions.length ? '选择会话' : '绑定工作区暂无可用会话'),
          ...sessions.map(session => h('option', { key: session.id, value: session.id }, session.title + (session.online ? '' : '（未打开）'))))),
        h('label', { className: 'memory-field' }, (repeat === 'once' ? '发送时间' : '开始时间') + '（北京时间）', h('input', { type: 'datetime-local', required: true, value: at, onChange: event => setAt(event.target.value) })),
        h('label', { className: 'memory-field' }, '重复', h('select', { value: repeat, onChange: event => setRepeat(event.target.value) },
          ...Object.entries(SCHEDULE_REPEATS).map(([id, label]) => h('option', { key: id, value: id }, label))))),
      data && !data.workspaceId ? h('p', { className: 'fish-muted' }, '请先在「QQ 互通」选择工作区。') : null,
      usesCalendar(repeat) ? h('p', { className: 'fish-muted' }, '调休补班计入法定工作日。法定节假日按法定放假日期触发。',
        data?.calendarThrough ? ' 日历已更新至 ' + data.calendarThrough + ' 年。' : '') : null,
      h('label', { className: 'memory-field' }, '提醒内容', h('textarea', { required: true, maxLength: 2000, rows: 3, value: message, onChange: event => setMessage(event.target.value) })),
      h('div', { className: 'fish-actions' }, h('button', { type: 'submit', className: 'fish-button fish-primary', disabled: busy || !target || !at || !message.trim() || Boolean(data?.warning) }, '创建定时任务')),
      h('p', { className: 'fish-muted' }, '大肥鱼会用目标会话的人设转述提醒。到点时需要 DSH 运行且目标会话可用，会话未打开或正忙时最多等 15 分钟。')),
    h('section', { className: 'fish-card schedule-list' }, h('h2', null, '任务列表'),
      !tasks.length ? h('p', { className: 'fish-muted' }, data ? '暂无定时任务。' : '正在读取定时任务…') : null,
      ...[...tasks].reverse().map(task => {
        const locked = busy || task.status === 'running' || Boolean(data.warning)
        const elapsedOnce = task.repeat === 'once' && task.nextAt <= Date.now()
        const paused = !task.enabled && (task.repeat !== 'once' || Boolean(task.nextAt))
        const next = task.enabled && (task.nextAt ? '下次 ' + format(task.nextAt) : usesCalendar(task.repeat) && '等待更新节假日安排')
        return h('article', { className: 'schedule-item', key: task.id },
          h('div', null, h('strong', { className: 'schedule-message' }, task.message),
            h('p', { className: 'fish-muted' }, (sessions.find(row => row.id === task.sessionId)?.title || task.sessionId) + ' · ' + SCHEDULE_REPEATS[task.repeat]),
            h('p', { className: 'fish-muted' }, [paused ? '已停用' : statuses[task.status], paused && elapsedOnce && '计划时间已过', next, task.lastAt && '上次计划 ' + format(task.lastAt)].filter(Boolean).join(' · '))),
          h('div', { className: 'memory-actions' },
            h(FishSwitch, { 'aria-label': '启用定时任务「' + task.message + '」', checked: task.enabled, disabled: locked || (!task.enabled && elapsedOnce),
              onChange: event => {
                const enabled = event.target.checked
                return changeTask('/enabled', { id: task.id, enabled }, enabled ? '定时任务已开启。' : '定时任务已停用。')
              } }),
            button('删除', () => changeTask('/remove', { id: task.id }, '定时任务已删除。'), false, locked)))
      })))
}
