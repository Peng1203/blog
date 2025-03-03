import { Role } from '@/common/entities'

export interface UserData {
  id: number
  userName: string
  roles: Role[]
  email: string | null
  nickName: string | null
  userEnabled: number
  userAvatar: string | null
  createTime: string | Date
  updateTime: string | Date
}
