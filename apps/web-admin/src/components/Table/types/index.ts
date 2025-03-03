import type { TableProps, TableColumnCtx } from 'element-plus'

export type Props<T> = TableProps<T> & {
  /** 数据列表 */
  data: T[]
  columns: ColumnItem<T>[]
  selection?: boolean
  /** 过滤列 */
  filterColumn?: boolean
  /** 索引列 */
  index?: boolean
  /** 自定义索引 */
  indexMethod?: (index: number) => number
  /** 操作列 */
  operationColumn?: boolean
  operationColumnWidth?: number | string
  operationColumnBtns?: [OperationType?, OperationType?, OperationType?, OperationType?]
  rowKey?: PropType<T> | 'id'

  /**
   * 是否需要分页器
   */
  pager?: boolean
  total?: number

  /**
   * 获取数据的方法
   */
  getData?: (...args: any[]) => Promise<any>
  /**
   * 自动加载数据 开启后初始化和切换分页排序时会自动加载数据
   */
  autoLoadData?: boolean
}

export type ColumnItem<T> = Partial<Omit<TableColumnCtx<T>, 'sortable' | 'showOverflowTooltip'>> & {
  label: string
  // prop: keyof T | 'operation'
  prop: PropType<T>
  sort?: boolean | 'custom'
  tooltip?: boolean
  fixed?: boolean | 'left' | 'right'
  slotName?: `${PropType<T>}Slot` | 'queryHighNightSlot'
  align?: 'left' | 'center' | 'right'
  childrenColumns?: ColumnItem<T>[]
  /**
   * 当前行进度条 0 ~ 100
   */
  process?: number
  // [key: string]: any
}

export type SlotsType<T> = {
  /** 展开行内容插槽 */
  expand(scope: { row: T; expanded: boolean; $index: number; store: any }): any
  /** 插入至表格最后一行之后的内容 */
  append(): any

  /** 操作列 自动表头内容 */
  operationHeaderSlot(): any
  /** 操作行 内容前插槽 */
  operationStartSlot(props: SlotOperationProps<T>): any
  /** 操作行 内容后插槽 */
  operationEndSlot(props: SlotOperationProps<T>): any
}

export type OrderProp = {
  ascending: string
  descending: string
}

export type OperationType = 'add' | 'edit' | 'delete' | 'view' | ''

export type OperationBtnsType = [OperationType?, OperationType?, OperationType?, OperationType?]

export type PropType<T> = keyof T extends string ? keyof T : never

export interface SlotProps<T> {
  scope: any
  row: T
  // prop: keyof T | 'operation';
  prop: PropType<T>
}

// 表格column 可选属性
export type OrderEnum = 'ASC' | 'DESC' | ''

export interface SlotOperationProps<T> {
  scope: any
  row: T
}

export interface SortInfo {
  prop: string
  order: keyof OrderProp
  // order: string
}

export interface ColumnSort {
  column: string
  order: string
}
export type Emits = {
  (e: 'columnSort', value: ColumnSort): void
}
