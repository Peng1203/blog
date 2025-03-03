import { SelectOptionItem } from '@/components/Select'
import { FormRules, UploadRequestOptions } from 'element-plus'

export interface FormAttribute<T> {
  /**
   * 表单数据
   */
  modelValue: T
  /**
   * 表单规则
   */
  rules?: FormRules<T>
  /**
   * 表单配置项
   */
  formItems: FormItem[]
  /**
   * label 宽度
   */
  labelW?: string | number
  /**
   * label 定位
   */
  labelP?: 'right' | 'top' | 'left'
  /**
   * 表单组件尺寸 大小
   */
  size?: SizeEnum
  /**
   * 是否禁用该表单内的所有组件
   */
  disabled?: boolean
  /**
   * 行内表单模式
   */
  inline?: boolean
  /**
   * 每行间隔
   */
  gutter?: number
  /**
   * 只读
   */
  readonly?: boolean
}

export type FormItemEnum =
  | 'slot'
  | 'input'
  | 'select'
  | 'switch'
  | 'checkbox'
  | 'radio'
  | 'pwd'
  | 'transparent'
  | 'textarea'
  | 'upload'
  | 'inputNum'

export type AcceptEnum = '.png' | '.jpg' | '.jpeg' | '.gif' | '.webp' | '.txt' | '.mp3' | '.mp4'

// 封装表单formItem属性
export type FormItem<T = any> = BaseFormItem<T> & UploadLimit & InputAttr & SwitchAttr & InputNumAttr

/** 封装表单formItem基础属性 */
export interface BaseFormItem<T = any> {
  // type: string // slot input select
  type: FormItemEnum // slot input select
  label: string
  prop: keyof T | ''
  size?: string
  placeholder?: string
  labelItemW?: string | number
  required?: boolean
  rules?: any[]
  disabled?: boolean
  span?: number
  offset?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  isShow?: boolean
  slotName?: string
  /** 下拉框的数据 复选框数据 */
  options?: OperationItem[] | RadioItem[] | SelectOptionItem[]
  /** 开启多选 */
  multiple?: boolean
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
  /** change事件 */
  change?: Function
  [key: string]: any
}

/** input类型 输入框 特有属性 */
export interface InputAttr {
  /** 复合型输入框 前置插槽内容 */
  statrPre?: string
  /** 复合型输入框 后置插槽内容 */
  endPre?: string
  /**
   * 密码强度等级
   */
  strengthLevel?: 0 | 1 | 2 | 3
  /**
   * 输入框 自动填充历史值
   */
  autocomplete?: boolean
}

export interface InputNumAttr {
  /** 数字输入框最小值 */
  minVal?: number
  /** 数字输入框最大值 */
  maxVal?: number
  /** 控件是否居右 */
  controlsR?: boolean
}

/** swatch类型 特有属性 */
export interface SwitchAttr {
  /** switch true 文本 */
  tText?: string | number
  /** switch false 文本 */
  fText?: string | number
  /** switch true 值 */
  tValue?: string | number | boolean
  /** switch false 值 */
  fValue?: string | number | boolean
}

/** 文件上传的限制属性 */
export interface UploadLimit {
  /** 上传文件类型 */
  accept?: AcceptEnum[]
  /** 允许上传文件的最大数量 */
  limit?: number
  /** 单个文件最大大小 Mb */
  fileMaxSize?: number
  /** 是否显示已上传文件列表 */
  fsShow?: boolean
  /** 自动上传 */
  autoUpload?: boolean
  /** 文件上传前的回调 返回 false 或者 Promise.reject() 停止上传 */
  // beforeUploadCb?: (rawFile: UploadRawFile) => Awaitable<void | undefined | null | boolean | File | Blob>;
  /** 自定义上传函数 */
  customUploadCb?: (options: UploadRequestOptions) => any
}

// 封装表单 下拉框 / switch 组件 自定义事件传递参数
export type FormItemChangeType = {
  newVal: any
  prop: string
  index: number
}

// 下拉数据 Options 项
export interface OperationItem {
  label: string
  value: string | number | boolean
  [key: string]: any
}

// radio 菜单 Options 项
export interface RadioItem {
  value: number | string | null
  label: number | string
  disabled?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
}
