type directionEnum = 'ltr' | 'ttb' | 'btt' | 'rtl'

export interface DrawerAttribute {
  /** 抽屉状态 */
  modelValue: boolean
  /** 标题 */
  title?: string
  /** 抽屉宽度 百分比 | px */
  size?: number | string
  /** 打开方向 */
  direction?: directionEnum
  /** 是否有遮罩层 */
  modal?: boolean
  /** 是否展示标题 */
  showHeader?: boolean
  /** 遮罩层类名 */
  mdClass?: string
  /** esc 关闭抽屉 */
  escClose?: boolean
  /** 点击遮罩层关闭 */
  modalClose?: boolean
}
