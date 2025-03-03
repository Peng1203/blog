import { Request } from 'express'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 用于获取客户端IP的装饰器
 */
export const ClientIp = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>()
  const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
  const localIp = req.ip === '::1' ? '127.0.0.1' : req.ip
  return (Array.isArray(clientIp) ? clientIp[0] : clientIp || localIp).replace('::ffff:', '')
})
