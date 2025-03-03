import request from '@/utils/request'
import { Method } from '../types'
import { TransformedResponse } from 'Api'

export function usePersonalApi() {
  return {
    /** 获取个人信息 */
    getPersonalInfo<T>(id: number): TransformedResponse<T> {
      return request({
        url: `/personal/${id}`,
        method: Method.GET,
      })
    },
    /** 更新个人信息 */
    updatePersonalInfo<T = string>(id: number, data: any): TransformedResponse<T> {
      return request({
        url: `/personal/${id}`,
        method: Method.PATCH,
        data: JSON.stringify(data),
      })
    },
  }
}
