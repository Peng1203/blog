import day from 'dayjs'

export function formatDate(date?: number | string | Date): string {
  // prettier-ignore
  return date
    ? day(date).format('YYYY-MM-DD HH:mm:ss')
    : day().format('YYYY-MM-DD HH:mm:ss')
}

export default day
