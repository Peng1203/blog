import { AxiosResponse } from 'axios'

// 定义接口 公用类型
declare module 'Api' {
  export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE',
  }

  // 请求列表 通用参数
  export type RequestListParams<T = any> = {
    page: number
    pageSize: number
    queryStr: string
    column: string
    order: string
    [key: string]: T
  }

  export type RequestNoPageListParams<T = any> = {
    queryStr: string
    column: string
    order: string
    [key: string]: T
  }

  export interface ApiBaseResponse<T = any> {
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
  /**
   * @description 没有经过 后端拦截器转换的接口 数据结构
   */
  export type RawResponse<T = any> = Promise<AxiosResponse<T>>

  /**
   * @description 接口成功 经过响应拦截器转换的 数据结构接口成功 经过响应拦截器转换的 数据结构
   */
  export type TransformedResponse<T> = Promise<AxiosResponse<ApiBaseResponse<T>>>

  /**
   * @description 列表接口返回的基本格式
   */
  export interface ListApiBaseResponse<T> {
    list: T[]
    total: number
  }

  export interface ApiErrorResponse {
    code: number
    error: string
    path: string
    method: string
    message: string
    timestamp: string
  }

  export type BooleanEnum = 0 | 1
}
