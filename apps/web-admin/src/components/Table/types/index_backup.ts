export interface Props<T> {
  data: T[]
  columns: ColumnItem<T>[]
  border?: boolean
  isSelection?: boolean
  checkBoxIsEnableCallBack?: (...args) => boolean
  loading?: boolean
  /** 过滤列 */
  isFilterShowColumn?: boolean
  /** 是否需要分页器 */
  isNeedPager?: boolean
  /** 分页器信息 */
  pagerInfo?: PageInfo
  /** 尺寸 */
  size?: SizeEnum
  /** 斑马纹 */
  stripe?: boolean
  /** 空数据描述 */
  emptyText?: string
  /** 是否展开树形数据 */
  defaultExpandAll?: boolean
  /** 操作列 */
  operationColumn?: boolean
  /** 操作列的按钮 */
  operationColumnBtns?: OperationBtnsType
  /** 操作列宽 */
  operationColumnWidth?: number
}

export type OrderProp = {
  ascending: string
  descending: string
}

export type OperationType = 'add' | 'edit' | 'delete' | 'view' | ''

export type OperationBtnsType = [OperationType?, OperationType?, OperationType?, OperationType?]

export interface BaseTableAttribute {
  data: any[]
  columns: ColumnItem[]
  border?: boolean
  isSelection?: boolean
  checkBoxIsEnableCallBack?: () => {}
  loading?: boolean
  isFilterShowColumn?: boolean
  isNeedPager?: boolean
  pagerInfo?: PageInfo
}

type PropType<T> = (keyof T extends string ? keyof T : never) | 'operation'
// 表格column 可选属性
export interface ColumnItem<T = any> {
  label: string
  // prop: keyof T | 'operation'
  prop: PropType<T>
  width?: number | string | 'auto'
  minWidth?: number | string
  sort?: boolean | 'custom'
  tooltip?: boolean
  fixed?: boolean | 'left' | 'right'
  slotName?: string | `${keyof T & string}Slot` | 'operation'
  align?: 'left' | 'center' | 'right'
  childrenColumns?: ColumnItem<T>[]
  classNname?: string
  [key: string]: any
}
// 分页器信息
export interface PageInfo {
  page: number
  pageSize: number
  total: number
  pageSizeList?: number[]
}

export type OrderEnum = 'ASC' | 'DESC' | ''

// 表格排序切换 参数
export interface ColumnChangeParams {
  column: string
  order: OrderEnum
}
// 分页器切换 参数
export interface PageChangeParams {
  page: number
  pageSize: number
}

export interface SlotProps<T> {
  scope: any
  row: T
  // prop: keyof T | 'operation';
  prop: PropType<T>
}

export interface SlotOperationProps<T> {
  scope: any
  row: T
}
