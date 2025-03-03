import request from '@/utils/request'
import { RequestListParams, TransformedResponse } from 'Api'
import { Method } from '../types'

export function useRoleApi() {
  return {
    /**
     * 获取角色列表
     * @author Peng
     * @date 2023-04-21
     * @param {any} params:RequestListParams
     * @returns {any}
     */
    getRole<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/role',
        method: Method.GET,
        params,
      })
    },
    /**
     * 添加角色
     * @author Peng
     * @date 2023-04-21
     * @param {any} params:object
     * @returns {any}
     */
    addRole<T>(params: object): TransformedResponse<T> {
      return request({
        url: '/role',
        method: Method.POST,
        data: JSON.stringify(params),
      })
    },
    /**
     * 通过ID更新角色信息
     * @author Peng
     * @date 2023-04-21
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    updateRole<T>(id: number, params: object): TransformedResponse<T> {
      return request({
        url: `/role/${id}`,
        method: Method.PATCH,
        data: JSON.stringify(params),
      })
    },
    /**
     * 通过ID删除角色信息
     * @author Peng
     * @date 2023-04-21
     * @param {any} id:number
     * @returns {any}
     */
    deleteRole<T>(id: number): TransformedResponse<T> {
      return request({
        url: `/role/${id}`,
        method: Method.DELETE,
      })
    },
  }
}
