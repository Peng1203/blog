import path from 'path'
import mime from 'mime-types'
import { nanoid } from 'nanoid'
import { Request } from 'express'
import { diskStorage } from 'multer'
// import { Public } from '@/common/decorators';
import { PayloadTooLargeException, UseInterceptors, applyDecorators } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { UploadFileDto } from '@/common/dto'
import { existsSync } from 'fs'
import fs from 'fs/promises'

interface UploadOptions {
  /** 文件最大限制 单位Mb 默认2Mb */
  maxSize?: number
  /** 上传文件保存的路径 暂时无用 */
  savePath?: string
  /** 触发超出限制的文件大小时的错误响应的信息 */
  tooLargeErrMsg?: string
}

/**
 * 上传文件装饰器聚合
 *   前端上传的 formDate name 需要为 file
 */
export function UploadFileAggregation(options?: UploadOptions) {
  const maxSize = options?.maxSize || 2
  // 这里无法读取process.env中的变量
  const savePath = options?.savePath || ''
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          async destination(req: Request, file, callback) {
            req.resErrMsg = options?.tooLargeErrMsg || `请选择小于${maxSize}MB大小的文件`
            const { STATIC_RESOURCE_PATH } = process.env
            const uploadPath = path.resolve(savePath || STATIC_RESOURCE_PATH)
            const hasDir = existsSync(uploadPath)
            if (!hasDir) await fs.mkdir(uploadPath)

            callback(null, uploadPath)
          },
          async filename(req: Request, file, callback) {
            // 解决中文文件名乱码
            const decodedName = decodeURIComponent(Buffer.from(file.originalname, 'latin1').toString('utf8'))

            const { STATIC_RESOURCE_PATH } = process.env
            // 判断是否有同样的文件名
            const fileExists = await fs
              .access(path.join(STATIC_RESOURCE_PATH, decodedName))
              .then(() => true)
              .catch(() => false)

            const extname = path.extname(file.originalname) || `.${mime.extension(file.mimetype)}`
            // const extname =
            const fileName = fileExists ? `${nanoid(10)}${extname}` : decodedName
            // handleLimitFileSize(req, maxSize, file, callback);

            callback(null, fileName)
          },
        }),
        limits: {
          fileSize: Math.pow(1024, 2) * (maxSize || 2),
        },
        fileFilter(req, file, callback) {
          callback(null, true)
        },
      })
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '',
      type: UploadFileDto,
    })
  )
}

// 动态限制上传文件大小
const handleLimitFileSize = (
  req: Request,
  maxSize: number,
  file: Express.Multer.File,
  cb: (error: Error, destination: string) => void
) => {
  // 当上传用户为 admin 时 无视文件大小限制
  if (req.user.userName === 'admin' && req.user.id === 1) return

  if (file.size > Math.pow(1024, 2) * (maxSize || 2)) cb(new PayloadTooLargeException(), '')
}
