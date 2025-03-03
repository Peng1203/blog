import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import mime from 'mime-types'
import { nanoid } from 'nanoid'
import { Request } from 'express'
import { diskStorage } from 'multer'
// import { Public } from '@/common/decorators';
import { MethodNotAllowedException, UseInterceptors, applyDecorators } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { UploadImageDto } from '@/common/dto'

const mkdirAsync = promisify(fs.mkdir)

interface UploadOptions {
  /** 文件最大限制 单位Mb 默认2Mb */
  maxSize?: number
  /** 上传文件保存的路径 暂时无用 */
  savePath?: string
  /** 触发超出限制的文件大小时的错误响应的信息 */
  tooLargeErrMsg?: string
}

/**
 * 上传文章图片装饰器聚合
 *   前端上传的 formDate name 需要为 file
 */
export function UploadImageAggregation(options?: UploadOptions) {
  const maxSize = options?.maxSize || 2
  // 这里无法读取process.env中的变量
  const savePath = options?.savePath || ''
  const tooLargeErrMsg = options?.tooLargeErrMsg || `请选择小于${maxSize}MB大小的文件`
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          async destination(req: Request, file, callback) {
            req.resErrMsg = tooLargeErrMsg
            const { STATIC_RESOURCE_PATH } = process.env
            const uploadPath = path.resolve(savePath || STATIC_RESOURCE_PATH)
            const hasDir = fs.existsSync(uploadPath)
            if (!hasDir) await mkdirAsync(uploadPath)

            callback(null, uploadPath)
          },
          filename(req: Request, file, callback) {
            const extname = mime.extension(file.mimetype)
            const fileName = `${nanoid(10)}.${extname}`
            callback(null, fileName)
          },
        }),
        limits: {
          fileSize: Math.pow(1024, 2) * (maxSize || 2),
        },
        fileFilter(req, file, callback) {
          if (!file.mimetype.includes('image')) callback(new MethodNotAllowedException('请选择图片类型的文件'), false)
          else callback(null, true)
        },
      })
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '',
      type: UploadImageDto,
    })
  )
}
