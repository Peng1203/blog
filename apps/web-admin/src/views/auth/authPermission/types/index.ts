import { ListApiBaseResponse } from 'Api'
import { RequestMethodEnum } from '@/constants/permission'

export interface PermissionData {
  id: number
  permissionName: string
  permissionCode: string | null
  resourceMethod: RequestMethodEnum | null
  resourceUrl: string | null
  parentId: number
  description: string | null
  updateTime: string
  createTime: string
  children: PermissionData[]
}

export type PermissionListData = ListApiBaseResponse<PermissionData>

export type AddPermissionType = Omit<PermissionData, 'id' | 'updateTime' | 'createTime' | 'children'>
