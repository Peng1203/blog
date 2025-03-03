import { Request } from 'express'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 用于获取Req 用户对象信息的装饰器
 */
export const ReqUser = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const user = request.user
  return key ? user?.[key] : user
})
