export type CropperOutoutTypeEnum = 'jpeg' | 'png' | 'webp'
export type OutputSizeEnum = 0.1 | 0.3 | 0.5 | 0.7 | 0.8 | 0.9 | 1
export interface CropperAttribute {
  img: string | Blob | File | null
  // 输出图片压缩比
  outputSize?: OutputSizeEnum | number
  outputType?: CropperOutoutTypeEnum
  width?: string
  height?: string
}

export interface CropperData {
  dateUrl: string
  blobData: Blob
}
