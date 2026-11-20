export const scheduleRepeats = {
  once: '仅一次', daily: '每天', mon: '每周一', tue: '每周二', wed: '每周三', thu: '每周四',
  fri: '每周五', sat: '每周六', sun: '每周日', weekend: '每周末', workday: '法定工作日', holiday: '法定节假日',
}

const day = 86_400_000
const beijingOffset = 8 * 3_600_000
const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
export const usesHolidayCalendar = repeat => repeat === 'workday' || repeat === 'holiday'

// shortcut: 只使用已核对的国务院年度通知，公布新一年安排后补入对应数据。
// 调休放假区间用于判定工作日，法定节假日按《全国年节及纪念日放假办法》选取。
const calendar = {
  // https://www.gov.cn/zhengce/content/202511/content_7047090.htm
  2026: {
    breaks: [['01-01', '01-03'], ['02-15', '02-23'], ['04-04', '04-06'], ['05-01', '05-05'], ['06-19', '06-21'], ['09-25', '09-27'], ['10-01', '10-07']],
    work: ['01-04', '02-14', '02-28', '05-09', '09-20', '10-10'],
    holidays: ['01-01', '02-16', '02-17', '02-18', '02-19', '04-05', '05-01', '05-02', '06-19', '09-25', '10-01', '10-02', '10-03'],
  },
  // https://www.gov.cn/zhengce/content/202611/content_7085101.htm
  2027: {
    breaks: [['01-01', '01-03'], ['02-05', '02-13'], ['04-03', '04-05'], ['05-01', '05-05'], ['06-09', '06-09'], ['09-15', '09-15'], ['10-01', '10-07']],
    work: ['01-31', '02-14', '05-08', '09-26', '10-09'],
    holidays: ['01-01', '02-05', '02-06', '02-07', '02-08', '04-05', '05-01', '05-02', '06-09', '09-15', '10-01', '10-02', '10-03'],
  },
}

export const scheduleCalendarThrough = Math.max(...Object.keys(calendar).map(Number))

export function nextScheduleAt(repeat, startAt, from = startAt) {
  if (repeat === 'once') return startAt >= from ? startAt : 0
  // 在北京时间的日期上匹配规则，保留开始时间的时、分、秒。
  const first = startAt + beijingOffset
  let wallTime = first + Math.max(0, Math.ceil((from + beijingOffset - first) / day)) * day
  for (; wallTime <= 8.64e15; wallTime += day) {
    if (repeat === 'daily') return wallTime - beijingOffset
    const date = new Date(wallTime)
    const weekday = date.getUTCDay()
    const weekend = weekday === 0 || weekday === 6
    if (usesHolidayCalendar(repeat)) {
      const year = calendar[date.getUTCFullYear()]
      if (!year) return 0
      const dateKey = date.toISOString().slice(5, 10)
      const matches = repeat === 'holiday' ? year.holidays.includes(dateKey)
        : year.work.includes(dateKey) || (!weekend && !year.breaks.some(([first, last]) => dateKey >= first && dateKey <= last))
      if (matches) return wallTime - beijingOffset
    } else if (repeat === weekdays[weekday] || (repeat === 'weekend' && weekend)) return wallTime - beijingOffset
  }
  return 0
}
