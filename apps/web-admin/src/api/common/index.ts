import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'

export function useCommonApi() {
  return {
    /** 解析IP */
    getIPInfo(ip: string): TransformedResponse<{
      city: number
      region: string
    }> {
      return request({
        url: '/common/ipParse',
        method: Method.GET,
        params: { ip },
      })
    },

    /**
     * 上传文章图片资源
     */
    uploadImage<T = string>(file: FormData): TransformedResponse<T> {
      return request({
        url: `/common/upload/image`,
        method: Method.POST,
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  }
}
