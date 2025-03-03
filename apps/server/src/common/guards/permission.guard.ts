import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators'
import { Request } from 'express'
import { Role } from '../entities'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requirePermissions = this.reflector.getAllAndOverride<PermissionEnum[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    // 当没有设置 所需角色时 或者操作用户为 admin角色(id 1) 直接通过
    const { user } = context.switchToHttp().getRequest<Request>()
    if (!requirePermissions || user.id === 1) return true

    // const allowedPermissions: string[] = [];
    // user.roles.forEach((role: Role) => {
    //   role.permissions.forEach((item) => allowedPermissions.push(item.permissionCode));
    // });
    const allowedPermissions: string[] = [].concat(
      ...user.roles.map(role => role.permissions.map(item => item.permissionCode))
    )

    const isPass = requirePermissions.every(key => allowedPermissions.includes(key))
    if (isPass) return true
    throw new ForbiddenException({
      code: ApiResponseCodeEnum.FORBIDDEN_PERMISSION,
      msg: '操作权限不足!',
    })
  }
}
