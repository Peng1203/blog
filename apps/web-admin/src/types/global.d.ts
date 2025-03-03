// 申明外部 npm 插件模块
declare module 'vue-grid-layout'
declare module 'qrcodejs2-fixes'
declare module 'splitpanes'
declare module 'js-cookie'
declare module '@wangeditor/editor-for-vue'
declare module 'js-table2excel'
declare module 'qs'
declare module 'sortablejs'

// 声明一个模块，防止引入文件时报错
declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.scss'
declare module '*.ts'
declare module '*.js'

// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明文件，定义全局变量
/* eslint-disable */
declare interface Window {
  nextLoading: boolean
  clientType: string
  // axios 发送的HTTP请求列表
  httpRequestList: any[]
}

// 声明路由当前项类型
declare type RouteItem<T = any> = {
  path: string
  name?: string | symbol | undefined | null
  redirect?: string
  k?: T
  meta?: {
    title?: string
    isLink?: string
    isHide?: boolean
    isKeepAlive?: boolean
    isAffix?: boolean
    isIframe?: boolean
    roles?: string[]
    icon?: string
    isDynamic?: boolean
    isDynamicPath?: string
    isIframeOpen?: string
    loading?: boolean
  }
  children: T[]
  query?: { [key: string]: T }
  params?: { [key: string]: T }
  contextMenuClickId?: string | number
  commonUrl?: string
  isFnClick?: boolean
  url?: string
  transUrl?: string
  title?: string
  id?: string | number
}

// 声明路由 to from
declare interface RouteToFrom<T = any> extends RouteItem {
  path?: string
  children?: T[]
}

// 声明路由当前项类型集合
declare type RouteItems<T extends RouteItem = any> = T[]

// 声明 ref
declare type RefType<T = any> = T | Element | null

// 声明 HTMLElement
declare type HtmlType = HTMLElement | string | undefined | null

// 申明 children 可选
declare type ChilType<T = any> = {
  children?: T[]
}

// 申明 数组
declare type EmptyArrayType<T = any> = T[]

// 申明 对象
declare type EmptyObjectType<T = any> = {
  [key: string]: T
}

// 申明 select option
declare type SelectOptionType = {
  value: string | number
  label: string | number
}

// 鼠标滚轮滚动类型
declare interface WheelEventType extends WheelEvent {
  wheelDelta: number
}

// table 数据格式公共类型
declare interface TableType<T = any> {
  total: number
  loading: boolean
  param: {
    pageNum: number
    pageSize: number
    [key: string]: T
  }
  queryStr: string
  column: string
  order
}

declare enum BolEnum {
  FALSE = 0,
  TRUE = 1,
}

/**
 * 可选的 TS 泛型工具类
 *  传入一个类型 和该类型的一些字段 将这些字段转为可选属性
 **/
declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 删除指定属性生成新的类型 */
declare type TypeOmit<T, K extends keyof T> = Omit<T, K>

/** 将传入的属性生成新的类型 */
declare type TypePick<T, K extends keyof T> = Pick<T, K>

/** 指定一个对象为不可变类型 */
declare type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/** 获取指定类型的可选属性 */
declare type GetOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[k] ? never : T[K]]: T[K]
}

// `get${Capitalize<K & string>}`

type SizeEnum = '' | 'large' | 'default' | 'small'

interface OptionItem {
  label: string
  value: any
}
