import { dateTimeFormat } from './date'
import { Local } from './storage'

function handlePromiseError(event: any): void {
  const { message, stack } = event.reason
  const localKey = 'errorList'
  const errInfo = {
    type: 'Promise',
    message,
    stack,
    errDate: dateTimeFormat(),
  }

  const errorList = Local.get(localKey)
  const errors = errorList ? JSON.parse(errorList) : []
  errors.push(errInfo)
  Local.set(localKey, JSON.stringify(errors))
  // 阻止默认处理（例如将错误输出到控制台）
  event.preventDefault()
}

export default handlePromiseError
