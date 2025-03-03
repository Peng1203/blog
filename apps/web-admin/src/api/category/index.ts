import request from '@/utils/request'
import { TransformedResponse, RequestListParams } from 'Api'

import { Method } from '../types'

export function useCategoryApi() {
  return {
    /**
     * 获取分类列表
     * @author Peng
     * @date 2023-04-29
     * @param {any} params:object
     * @returns {any}
     */
    getCategorys<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/category',
        method: Method.GET,
        params,
      })
    },
    /**
     * 添加分类
     * @author Peng
     * @date 2023-04-29
     * @param {any} data:object
     * @returns {any}
     */
    addCategory<T>(data: object): TransformedResponse<T> {
      return request({
        url: '/category',
        method: Method.POST,
        data: JSON.stringify(data),
      })
    },
    /**
     * 通过ID更新分类信息
     * @author Peng
     * @date 2023-04-29
     * @param {any} categoryId:number
     * @param {any} params:object
     * @returns {any}
     */
    updateCategory<T>(categoryId: number, params: object): TransformedResponse<T> {
      return request({
        url: `/category/${categoryId}`,
        method: Method.PATCH,
        data: JSON.stringify(params),
      })
    },
    /**
     * 通过ID删除分类
     * @author Peng
     * @date 2023-04-29
     * @param {any} categoryId:number
     * @returns {any}
     */
    deleteCategory<T>(categoryId: number): TransformedResponse<T> {
      return request({
        url: `/category/${categoryId}`,
        method: Method.DELETE,
      })
    },
    /** 批量删除标签 */
    batchDelete<T = string>(categoryIds: number[]): TransformedResponse<T> {
      return request({
        url: '/category',
        method: Method.DELETE,
        data: JSON.stringify({ categoryIds }),
      })
    },
  }
}
