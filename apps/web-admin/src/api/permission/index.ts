import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'

/**
 * 操作权限标识
 * @author Peng
 * @date 2023-04-16
 * @returns {any}
 */
export function usePermissionApi() {
  return {
    /**
     * 获取权限标识列表
     * @author Peng
     * @date 2023-04-16
     * @param {any} params:any
     * @returns {any}
     */
    getPermissions<T = any>(params: any): TransformedResponse<T> {
      return request({
        url: '/permission',
        method: Method.GET,
        params,
      })
    },
    /**
     * 添加权限标识
     * @author Peng
     * @date 2023-04-17
     * @param {any} params:object
     * @returns {any}
     */
    addPermission<T = any>(params: object, fullscreenLoading: boolean = false): TransformedResponse<T> {
      return request({
        url: '/permission',
        method: Method.POST,
        data: params,
        headers: { fullscreenLoading },
      })
    },
    /**
     * 删除权限标识
     * @author Peng
     * @date 2023-04-17
     * @param {any} id:number
     * @returns {any}
     */
    delAuthPermission<T = any>(id: number): TransformedResponse<T> {
      return request({
        url: `/permission/${id}`,
        method: Method.DELETE,
      })
    },
    /**
     * 更新权限标识信息
     * @author Peng
     * @date 2023-04-17
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    updateAuthPermInfo<T = any>(id: number, params: object): TransformedResponse<T> {
      return request({
        url: `/permission/${id}`,
        method: Method.PATCH,
        data: params,
      })
    },

    getPermCodeOptions<T = any>(): TransformedResponse<T> {
      return request({
        url: '/permission/code/options',
        method: Method.GET,
      })
    },
  }
}
