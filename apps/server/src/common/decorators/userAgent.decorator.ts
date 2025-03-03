import { Request } from 'express'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 用于获取Req UserAgent 信息的装饰器
 */
export const UserAgent = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const ua = request.useragent
  return key ? ua?.[key] : ua
})
