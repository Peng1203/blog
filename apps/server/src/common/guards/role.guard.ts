import { ApiResponseCodeEnum, RoleEnum } from '@/helper/enums'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators'
import { Request } from 'express'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    // 当没有设置 所需角色时 直接通过
    if (!requireRoles) return true
    const { user } = context.switchToHttp().getRequest<Request>()
    const isPass = user.roles.some(role => requireRoles.includes(role.roleName as RoleEnum))
    if (isPass) return true
    throw new ForbiddenException({
      code: ApiResponseCodeEnum.FORBIDDEN_ROLE,
      msg: '用户角色身份不足!',
    })
  }
}
