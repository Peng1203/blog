import { BooleanEnum } from 'Api'

export interface MenuParams {
  menuName: string
  menuPath: string
  menuUri: string
  menuIcon: string
  orderNum: number
  parentId: number
  isHidden: BooleanEnum
  isKeepalive: BooleanEnum
}

export type EditMenuParams = Partial<MenuParams>
