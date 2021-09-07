import { format, addMonths, startOfMonth, endOfMonth, addDays } from 'date-fns'

const getCurrentDays = (now, formatType) => {
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const monthStartDay = new Date(monthStart).getDay()  // 月份开始第一天是周几
  const monthDays = new Date(monthEnd).getDate() // 这个月有都少天
  const itemDays = []
  for (let i = 0; i < monthDays; i++) {
    // days 0 - 6 周日 - 周六
    const _format = (type) => {
      return format(addDays(monthStart, i), type)
    }
    itemDays.push({
      currentMonth: 0, // 是否当前月 0 -1 1
      day: (monthStartDay + i) % 7, // 周几
      date: _format(formatType), // 日期
      month: _format('M'), // 月
      days: _format('d'), // 天
      valueOf: addDays(monthStart, i).valueOf() // 时间戳
    })
  }
  return itemDays
}
// 月份面板补充前面的
const getPrefixDays = (now, formatType, day) => {
  if (day === 0) {
    return []
  }
  const prevDays = getCurrentDays(addMonths(now, -1), formatType)
  const ret = [...prevDays].map(item => {
    return { ...item, currentMonth: -1 }
  })
  return ret.slice(-day)
}

// 月份面板补充后面的
const getSubfixDays = (now, formatType, day) => {
  if (day === 0) {
    return []
  }
  const nextDays = getCurrentDays(addMonths(now, 1), formatType)
  let ret = [...nextDays].map(item => {
    return { ...item, currentMonth: 1 }
  })
  ret.splice(day)
  return ret
}
// 根据月初和月末 计算 前后需要补几天
const supNumber = (day, type) => {
  // type 月前 -1 还是 月后 1
  if (type === -1) {
    return day === 0 ? 6 : day - 1
  }
  return day === 0 ? day : 7 - day
}
const getItemDays = (now = new Date(), formatType) => {
  const _getCurrentDays = getCurrentDays(now, formatType)
  const firstDay = _getCurrentDays[0].day
  const endDay = _getCurrentDays[_getCurrentDays.length - 1].day
  return [
    ...getPrefixDays(now, formatType, supNumber(firstDay, -1)),
    ..._getCurrentDays,
    ...getSubfixDays(now, formatType, supNumber(endDay, 1))]
}

export {
  getItemDays
}