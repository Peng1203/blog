import { PermissionEnum } from '@/helper/enums'
import { SetMetadata } from '@nestjs/common'

/**
 * 用于设置接口所需要的权限 需要用户信息 不能和 Public 装饰器一块使用
 */
export const PERMISSIONS_KEY = 'permissions'
export const RequirePermissions = (...permissions: PermissionEnum[]) => SetMetadata(PERMISSIONS_KEY, permissions)
