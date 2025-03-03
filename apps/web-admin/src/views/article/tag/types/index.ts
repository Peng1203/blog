import { ListApiBaseResponse } from 'Api'

export interface TagData {
  id: number
  tagName: string
  icon: string
  createTime: string
  updateTime: string
  articles?: number
  userId: number | null
  userName: string | null
}

export type TagListData = ListApiBaseResponse<TagData>

export type AddTagType = Pick<TagData, 'icon' | 'tagName'>

export interface EditProps {
  editRow: TagData
}
