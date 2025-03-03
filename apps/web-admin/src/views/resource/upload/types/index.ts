import { Canceler } from 'axios'

export enum StatusEnum {
  PENDING = 0,
  UPLOADING = 1,
  SUCCESS = 2,
  FAIL = 3,

  CALC_HASH = 99,
}

export interface FileData {
  name: string
  type: string
  size: number
  /** 上传成功 资源路径 */
  url: string
  /** 文件的状态 上传前(待上传) 上传中(上传进度条) 上传后(成功 / 失败) */
  status: StatusEnum
  /** 文件的 MIME 类型 */
  mimeType: string
  fileData?: File
  /** 上传进度 */
  uploadProcess?: number
  /** 仅针对图片类型 是否开启压缩 */
  isCompress?: boolean
  errMsg?: string
  /** 取消上传的函数 */
  cancel?: Canceler
  /** 暂停状态 当 status 为上传中时生效 (只针对于大文件上传有效) */
  pause?: boolean
  /** 文件的hash (只针对于大文件上传有效) */
  fileHash?: string
  /** 取消分片上传的函数列表 (只针对于大文件上传有效) */
  cancelList?: Canceler[]
}

export interface CreateFileDirData {
  existingChunks?: string[]
  message: string
}

export interface ChunkItem {
  /** 分片开始字节 */
  start: number
  /** 分片结束字节 */
  end: number
  /** 第几片切片数 */
  index: number
  /** 文件块 */
  blob: Blob
  /** 文件的总大小 */
  size: number
}
