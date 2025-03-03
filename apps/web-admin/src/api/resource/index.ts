import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'
import axios, { AxiosProgressEvent, Canceler } from 'axios'
// Canceler

export function useResourceApi() {
  return {
    getResourceList<T>(params?: Record<'path', string>): TransformedResponse<T> {
      return request({
        url: '/resource',
        method: Method.GET,
        params,
      })
    },
    uploadResource<T = string>(
      file: FormData,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => any,
      item: any
    ): TransformedResponse<T> {
      return request({
        url: '/resource',
        method: Method.POST,
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
        cancelToken: new axios.CancelToken(c => (item.cancel = c)),
      })
    },
    /** 创建大文件合成目录 */
    createLargeFileDir<T = string>(params): TransformedResponse<T> {
      return request({
        url: '/resource/chunk/upload',
        method: Method.POST,
        data: JSON.stringify(params),
      })
    },
    /** 上传文件分片 */
    uploadFileChunk<T>(params, file: FormData, cancelList: Canceler[]): TransformedResponse<T> {
      return request({
        url: '/resource/chunk/upload',
        method: Method.PUT,
        params,
        data: file,
        headers: {
          // prettier-ignore
          'x-log': 'false',
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: new axios.CancelToken(c => cancelList.push(c)),
      })
    },
    /** 合成文件切片 */
    mergeFileChunks<T>(params): TransformedResponse<T> {
      return request({
        url: '/resource/chunk/merge',
        method: Method.POST,
        data: JSON.stringify(params),
      })
    },
    /** 删除文件资源 */
    deleteResourceFile(fileName: string): TransformedResponse<string> {
      return request({
        url: `/resource/${fileName}`,
        method: Method.DELETE,
      })
    },
  }
}
