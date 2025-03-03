import request from '@/utils/request'
import { TransformedResponse, RequestListParams } from 'Api'
import { Method } from '../types'

export function useAuditApi() {
  return {
    /** 获取审计列表 */
    getAuditLogs<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/audit',
        method: Method.GET,
        params,
      })
    },
    /** 通过ID删除审计记录 */
    deleteById<T = string>(id: number): TransformedResponse<T> {
      return request({
        url: `/audit/${id}`,
        method: Method.DELETE,
      })
    },
    /** 批量删除审计记录 */
    deletes<T = string>(ids: number[]): TransformedResponse<T> {
      return request({
        url: `/audit`,
        method: Method.DELETE,
        data: JSON.stringify({ ids }),
      })
    },
  }
}
