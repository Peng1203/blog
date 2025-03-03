import { ListApiBaseResponse, BooleanEnum } from 'Api'

export interface MenuData {
  id: number
  menuName: string
  menuPath: string
  menuUri: string
  menuIcon: string
  orderNum: number
  parentId: number
  isHidden: BooleanEnum
  isKeepalive: BooleanEnum
  createTime: string
  updateTime: string
  children: MenuData[]
}

export type MenuListData = ListApiBaseResponse<MenuData>

export type AddMenuType = Omit<MenuData, 'id' | 'children' | 'createTime' | 'updateTime' | 'parentId'>

export type EditMenuType = Omit<MenuData, 'children' | 'createTime' | 'updateTime' | 'parentId'>

export interface EditProps {
  editRow: MenuData
}
