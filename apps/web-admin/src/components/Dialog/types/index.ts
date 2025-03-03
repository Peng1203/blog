export interface DialogAttribute {
  modelValue: boolean
  title: string
  width?: string | number
  height?: string
  fullscreen?: boolean
  modal?: boolean
  modelClose?: boolean
  escClose?: boolean
  draggable?: boolean
  aCenter?: boolean
  /** 底部操作行 */
  operationRow?: boolean
  cancleBtnText?: string
  confirmBtnText?: string
}
