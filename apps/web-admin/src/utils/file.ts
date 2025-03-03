// import { saveAs } from 'file-saver';
import _ from 'lodash'
import SparkMD5 from 'spark-md5'

/** 是否是图片 */
export const isImage = (file: File): boolean => {
  return file.type.includes('image')
}

/** 文件是否超出指定大小 */
export const checkFileSizeExceeds = (file: File, maxSize: number = 2): boolean => {
  const fileMb = file.size / (1024 * 1024)
  return fileMb > maxSize
}

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => resolve(e.target.result as string)
    reader.onerror = err => reject(err)
  })
}

type QualityType = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
interface CompressOptions {
  quality?: QualityType
  outputType?: 'jpeg' | 'png' | 'webp' | 'base64'
}
/** 压缩图片 无法压缩gif图 */
export const compressImage = (
  file: File,
  options: CompressOptions = { quality: 0.5, outputType: 'webp' }
): Promise<string | Blob> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    const { quality, outputType } = options
    const { size } = file

    const base64: string = await imageToBase64(file)
    const imgEl = document.createElement('img')
    imgEl.src = base64

    setTimeout(() => {
      const { width, height } = imgEl

      const canvasEl = document.createElement('canvas')
      canvasEl.width = imgEl.width
      canvasEl.height = imgEl.height

      const ctx = canvasEl.getContext('2d')
      ctx.drawImage(imgEl, 0, 0, width, height)

      switch (outputType) {
        case 'base64':
          const compressBase64 = canvasEl.toDataURL('image/jpeg', quality)
          resolve(compressBase64)
          break
        default:
          // 转换为 blob 对象
          canvasEl.toBlob(
            blob => {
              const compressibility = (((size - blob.size) / size) * 100).toFixed(2) + ' %'
              console.table({
                原始大小: size,
                压后大小: blob.size,
                文件类型: blob.type,
                压缩率: compressibility,
              })
              // saveAs(blob, `${Date.now()}.${outputType}`);
              resolve(blob)
            },
            `image/${outputType}`,
            quality
          )
          break
      }
    })
  })
}

/** Blob类型转File类型 */
export function blobToFile(blob: Blob, fileName: string = Date.now() + '') {
  // 创建一个新的 File 对象
  const file = new File([blob], `${fileName}.${blob.type.split('/')[1]}`, {
    type: blob.type,
    lastModified: Date.now(),
  })
  return file
}

export const getFileHash = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const spark = new SparkMD5.ArrayBuffer()
    getFileArrayBuffer(file).then(arrayBuffer => {
      spark.append(arrayBuffer)
      resolve(spark.end())
    })
  })
}
export const getFileArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = e => {
      resolve(e.target.result as ArrayBuffer)
    }
  })
}

/** 文件字节单位转换 */
export const formatByteSize = (byte: number) => {
  const kb = byte / 1024
  const mb = kb / 1024
  const gb = mb / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  if (mb < 1024) return `${mb.toFixed(2)} MB`
  return `${gb.toFixed(2)} GB`
}

/** 对比2个文件是否相同 */
export const compareFiles = (file1: File, file2: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader1 = new FileReader()
    const reader2 = new FileReader()

    reader1.onload = () => {
      reader2.onload = () => {
        if (reader1.result instanceof ArrayBuffer && reader2.result instanceof ArrayBuffer) {
          // 比较两个文件的 ArrayBuffer
          const isEqual = _.isEqual(new Uint8Array(reader1.result), new Uint8Array(reader2.result))
          resolve(isEqual)
        } else {
          reject(new Error('读取文件失败'))
        }
      }
      reader2.onerror = reject
      reader2.readAsArrayBuffer(file2)
    }
    reader1.onerror = reject
    reader1.readAsArrayBuffer(file1)
  })
}

/**
 * 获取图片的宽度和高度
 */
interface ImageFileInfo {
  width: number
  height: number
  url: string
}
export const getImageDimensions = (file: File): Promise<ImageFileInfo> => {
  return new Promise<ImageFileInfo>((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const { width, height } = img
      resolve({ width, height, url: img.src })
      // 确保在 resolve 后释放 URL
      // URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
      URL.revokeObjectURL(img.src)
    }
  })
}
