import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '@/common/decorators'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '@/modules/auth/auth.service'
import { ApiResponseCodeEnum, PassPortStrategyEnum } from '@/helper/enums'
import { RedisService } from '@/shared/redis/redis.service'

/**
 * 用于扩展 Passport JWT策略 会在 JwtStrategy 之前执行 canActivate 函数如果返回 false 或者抛出错误 则不会执行 JwtStrategy 策略 可以
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(PassPortStrategyEnum.JWT) {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly redis: RedisService
  ) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    // 跳过 自定义Public装饰器 修饰过的 请求
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(req)
    if (!token || token === 'undefined')
      throw new UnauthorizedException({
        code: ApiResponseCodeEnum.UNAUTHORIZED,
        msg: 'Token cannot be empty',
      })
    const { sub: id, userName } = await this.authService.verifyAccessToken(token)

    // 判断当前token 和 redis中存放的token是否一致
    const redisToken = await this.redis.getCache(this.authService.redisTokenKeyStr(id, userName))
    if (token !== redisToken)
      throw new UnauthorizedException({
        code: ApiResponseCodeEnum.UNAUTHORIZED_ACCESS_TOKEN,
        msg: '身份认证信息失效，请重新认证！',
      })

    return this.activate(context)
  }

  // 提取tooken
  private extractToken(req: Request): string | undefined {
    return (
      req.headers['authorization'] ||
      req.headers['Authorization'] ||
      req.headers['token'] ||
      req.body['token'] ||
      req.query['token'] ||
      ''
    ).replaceAll('Bearer ', '')
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>
  }
}
