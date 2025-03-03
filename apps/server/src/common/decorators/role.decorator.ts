import { RoleEnum } from '@/helper/enums'
import { SetMetadata } from '@nestjs/common'

/**
 * 用于设置接口所需要的角色 需要用户信息 不能和 Public 装饰器一块使用
 */
export const ROLES_KEY = 'roles'
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles)
