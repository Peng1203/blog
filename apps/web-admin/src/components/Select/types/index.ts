export interface SelectOptionItem {
  label: string | number
  value: string | number | boolean | object
  disabled?: boolean
}
export interface SelectAttribute {
  width?: string
  options: SelectOptionItem[]
  size?: SizeEnum
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  // valueKey?: string
  clearable?: boolean
  filterable?: boolean
  // 是否使用虚拟化选择器
  virtual?: boolean
}
