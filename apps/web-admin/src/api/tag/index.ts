import request from '@/utils/request'
import { TransformedResponse, RequestListParams } from 'Api'
import { Method } from '../types'

export function useTagApi() {
  return {
    /**
     * 获取标签列表
     * @author Peng
     * @date 2023-04-28
     * @param {any} params:object
     * @returns {any}
     */
    getTags<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/tag',
        method: Method.GET,
        params,
      })
    },
    /**
     * 添加标签
     * @author Peng
     * @date 2023-04-28
     * @param {any} data:object
     * @returns {any}
     */
    addTag<T>(data: object): TransformedResponse<T> {
      return request({
        url: '/tag',
        method: Method.POST,
        data: JSON.stringify(data),
      })
    },
    /**
     * 通过ID更新标签信息
     * @author Peng
     * @date 2023-04-28
     * @param {any} tagId:number
     * @param {any} params:object
     * @returns {any}
     */
    updataTag<T>(tagId: number, data: object): TransformedResponse<T> {
      return request({
        url: `/tag/${tagId}`,
        method: Method.PATCH,
        data: JSON.stringify(data),
      })
    },
    /**
     * 通过ID删除标签
     * @author Peng
     * @date 2023-04-28
     * @param {any} tagId:number
     * @returns {any}
     */
    deleteTag<T>(tagId: number): TransformedResponse<T> {
      return request({
        url: `/tag/${tagId}`,
        method: Method.DELETE,
      })
    },
    /** 批量删除标签 */
    batchDeleteTag<T = string>(tagIds: number[]): TransformedResponse<T> {
      return request({
        url: '/tag',
        method: Method.DELETE,
        data: JSON.stringify({ tagIds }),
      })
    },
  }
}
