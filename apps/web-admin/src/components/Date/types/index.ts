export type DatePickerType = 1 | 2

export type DateAttrs<T> = {
  size?: SizeEnum
  /** 1选单个日期 2日期范围 */
  type?: T
  /** 宽度 */
  width?: string
  format?: string
  valueFormat?: string
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
}
// Omit<DatePickerProps>
// & TypeOmit<DatePickerProps, 'type'>
