import type { AxiosResponse } from 'axios'

export type TransformedResponse<T> = Promise<AxiosResponse<BaseResponse<T>>>

export interface BaseResponse<T = any> {
  /**
   * Api状态码
   * 20000 请求成功
   * 20001 更新成功
   * 20100 创建成功
   */
  code: number
  /**
   * 请求状态
   */
  success: boolean
  /**
   * 响应消息
   */
  message: string
  data: T
}

export interface ListApiBaseResponse<T> {
  list: T[]
  total: number
}

export type ListResponse<T> = TransformedResponse<ListApiBaseResponse<T>>
