import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'

export function useMomentApi() {
  return {
    getMoments<T>(params): TransformedResponse<T> {
      return request({
        url: '/moment',
        method: Method.GET,
        params,
      })
    },
    addMoment<T>(data): TransformedResponse<T> {
      return request({
        url: '/moment',
        method: Method.POST,
        data: JSON.stringify(data),
      })
    },
  }
}
