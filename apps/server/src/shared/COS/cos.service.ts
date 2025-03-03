import { ApiResponseCodeEnum } from '@/helper/enums'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import COS, { GetBucketResult } from 'cos-nodejs-sdk-v5'
import { DirFileDataItem, ExtendBucketResult } from './types'
import { extname, basename } from 'path'
import { countOccurrences } from '@/utils/string.util'

@Injectable()
export class CosService {
  // 存储对象实例
  private cos: COS
  private Bucket: string
  private Region: string
  private rootDir: string

  constructor(private readonly configService: ConfigService) {
    const SECRET_ID = this.configService.get<string>('COS_SECRET_ID')
    const SECRET_KEY = this.configService.get<string>('COS_SECRET_KEY')
    const BUCKET = this.configService.get<string>('COS_BUCKET')
    const REGION = this.configService.get<string>('COS_REGION')
    const ROOTDIR = this.configService.get<string>('NETDISK_ROOT_DIR')

    this.rootDir = ROOTDIR
    this.Bucket = BUCKET
    this.Region = REGION

    this.cos = new COS({
      SecretId: SECRET_ID,
      SecretKey: SECRET_KEY,
    })

    // CosObject;
  }

  /**
   * 获取指定目录下的存储对象
   * @date 2023/10/10 - 09:54:22
   * @author Peng
   *
   * @async
   * @param {?string} [dirPath]
   * @returns {Promise<ExtendBucketResult>}
   */
  async getDirBucket(dirPath?: string): Promise<ExtendBucketResult> {
    return new Promise((resolve, reject) => {
      this.cos.getBucket(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Prefix: dirPath.replace(/\\+/g, '/') || '',
        },
        (err, data) => {
          if (err)
            throw new InternalServerErrorException({
              code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
              e: err,
            })
          console.log('data', JSON.parse(JSON.stringify(data)))
          resolve(this.handleDirData(data))
        }
      )
    })
  }

  // 处理目录查询响应的结构
  private handleDirData(result: GetBucketResult): ExtendBucketResult {
    const prefixPath = (result as any).Prefix === this.rootDir ? `${this.rootDir}/` : (result as any).Prefix
    if (!result.Contents.length) return { ...result, data: [] }
    // 排除自身文件夹结果 并排除 其其它子目录中的内容
    const data = result.Contents.slice(1).filter(item => {
      const str = item.Key.replace(prefixPath, '')
      const count = countOccurrences(str, '/')
      const lastLineChatIndex = str.lastIndexOf('/')
      const isDir = lastLineChatIndex === str.length - 1

      if (isDir && count !== 1 && str[lastLineChatIndex + 1]) return false

      return !str.split('/')[2] && count <= 1
    })

    const formatData: DirFileDataItem[] = data.map(COSItem => {
      const { Key, Size, LastModified } = COSItem
      const ext = extname(Key)
      const size = Number(Size)
      return {
        path: Key,
        name: basename(Key),
        size: size === 0 ? '' : (size / 1024 / 1024).toFixed(2),
        ext,
        type: ext ? 'file' : 'dir',
        // lastModified: formatDate(LastModified),
        lastModified: LastModified,
      }
    })

    return {
      ...result,
      data: formatData.sort((a, b) => {
        // 首先按类型排序，文件夹在前，文件在后
        if (a.type === 'dir' && b.type === 'file') return -1
        if (a.type === 'file' && b.type === 'dir') return 1

        // 如果类型相同，按名称排序
        return a.name.localeCompare(b.name)
      }),
    }
  }
}
