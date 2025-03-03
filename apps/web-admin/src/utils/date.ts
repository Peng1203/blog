import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

// 类型别名
type dateType = string | number | Date

/**
 * 格式化时间的方法 YYYY-MM-DD
 * @author Peng
 * @date 2023-03-01
 * @param {any} date:dateType
 * @returns {string}
 */
export function dateFormat(date?: dateType): string {
  return dayjs(date || new Date()).format('YYYY-MM-DD')
}

/**
 * 格式化时间的方法 YYYY-MM-DD HH:mm:ss'
 * @author Peng
 * @date 2023-03-01
 * @param {any} date:dateType
 * @returns {string}
 */
export function dateTimeFormat(date?: dateType): string {
  return dayjs(date || new Date()).format('YYYY-MM-DD HH:mm:ss')
}

export function getFromNow(date?: dateType) {
  return dayjs(date || new Date())
    .locale('zh-cn')
    .fromNow()
}
