import { RoleData } from '@/views/auth/role'
import { ListApiBaseResponse, BooleanEnum } from 'Api'

export interface UserData {
  id: number
  userName: string
  password?: string
  roles: RoleData[]
  email: string | null
  nickName: string | null
  userEnabled: BooleanEnum
  userAvatar: string | null
  createTime: string | Date
  updateTime: string | Date
}

export type UserListData = ListApiBaseResponse<UserData>

//
export interface AddProps {
  roles: OptionItem[]
}

export interface EditProps extends AddProps {
  editRow: UserData
}

export type AddUserType = Omit<UserData, 'id' | 'roles' | 'createTime' | 'updateTime'> & { roleIds: number[] }
export type EditUserType = Omit<UserData, 'createTime' | 'updateTime'> & { roleIds: number[] }
//
