import { ListApiBaseResponse } from 'Api'
import { UserData } from '@/views/user/user/types'
export interface MomentData {
  id: number
  content: string
  userId: number
  mediaUrls: string[]
  isTop: BolEnum
  status: 1 | 2
  user: UserData
  createTime: string
  updateTime: string
}

export type LoginAuditLogListData = ListApiBaseResponse<MomentData>

export type AddMomentForm = Omit<MomentData, 'id' | 'createTime' | 'updateTime' | 'user'> & {
  originalDrawing: boolean[]
}
