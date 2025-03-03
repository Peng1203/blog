import { InternalServerErrorException } from '@nestjs/common'

// 扩展内置的 InternalServerErrorException 传参
export class ServerError extends InternalServerErrorException {
  // 服务错误代码
  errCode: string
  constructor(errCode: string, message?: string) {
    super()
    this.errCode = errCode
    this.message = message || ''
  }
}
