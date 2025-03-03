import { ListApiBaseResponse } from 'Api'
import { MenuData } from '@/views/auth/menu'
import { PermissionData } from '@/views/auth/authPermission'

export interface RoleData<T = number, V = number> {
  id: number
  roleName: string
  description: string | null
  menus: T[]
  permissions: V[]
  // menus: MenuData[];
  // permissions: PermissionData[];
  createTime: string | Date
  updateTime: string | Date
}

export type RoleEntityData = RoleData<MenuData, PermissionData>

export type AddRoleType = Omit<RoleData, 'id' | 'createTime' | 'updateTime'>

export type EditRoleType = Omit<RoleData, 'createTime' | 'updateTime'>

export type RoleListData = ListApiBaseResponse<RoleData>
