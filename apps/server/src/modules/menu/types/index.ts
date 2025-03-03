import { Menu, Role } from '@/common/entities'
import { StatusEnum } from '@/helper/enums'

export type MenuItem = Menu & { children?: Menu[] }

export type BatchAddMenuItem = Optional<Menu, 'createTime' | 'updateTime' | 'id' | 'roles' | 'parentId'>

export class BatchAddMenuItemInstance {
  menuName: string
  menuPath: string
  menuUri: string
  menuIcon: string
  orderNum: number
  isHidden: StatusEnum
  isKeepalive: StatusEnum
  parentUri?: string | undefined
}
