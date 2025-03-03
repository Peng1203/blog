import type { GetBucketResult } from 'cos-nodejs-sdk-v5'

export interface DirFileDataItem {
  /** 路径 */
  path: string
  /** 文件名称 */
  name: string
  /** 文件大小 单位 mb */
  size: number | string
  /** 文件扩展名 */
  ext: string | null
  type: 'file' | 'dir'
  /** 最后修改时间 */
  lastModified: string
}

export type FormatDataType = Record<'data', DirFileDataItem[]>

export type ExtendBucketResult = GetBucketResult & FormatDataType
