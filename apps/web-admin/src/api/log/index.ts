import request from '@/utils/request'
import { TransformedResponse, RequestListParams } from 'Api'
import { Method } from '../types'

export function useLoginAuditApi() {
  return {
    /** 获取审计列表 */
    getLoginAuditLogs<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/login/audit',
        method: Method.GET,
        params,
      })
    },
    /** 通过ID删除审计记录 */
    deleteById<T = string>(id: number): TransformedResponse<T> {
      return request({
        url: `/login/audit/${id}`,
        method: Method.DELETE,
      })
    },
    /** 批量删除审计记录 */
    deletes<T = string>(ids: number[]): TransformedResponse<T> {
      return request({
        url: `/login/audit`,
        method: Method.DELETE,
        data: JSON.stringify({ ids }),
      })
    },
  }
}
