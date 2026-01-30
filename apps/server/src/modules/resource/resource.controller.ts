import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UploadedFile,
  Put,
  UseInterceptors,
  InternalServerErrorException,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermissions, UploadFileAggregation } from '@/common/decorators'
import { ConfigService } from '@nestjs/config'
import path from 'path'
import fs from 'fs/promises'
import { Response } from 'express'
import mime from 'mime-types'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { CreateFileDirDto, MergeFileChunksDto } from './dto'
import { nanoid } from 'nanoid'
import { createReadStream, createWriteStream } from 'fs'
import { formatDate } from '@/utils/date.util'
import { PermissionEnum } from '@/helper/enums'

mime.types['ts'] = 'application/typescript'
@ApiTags('Resource')
@ApiBearerAuth()
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService, private readonly configService: ConfigService) {}

  private readonly MAX_SIZE: number = 5
  private readonly UPLOAD_CHUNKS_DIR: string = path.join(process.cwd(), 'uploads')
  private readonly STATIC_RESOURCE_PATH: string = this.configService.get<string>('STATIC_RESOURCE_PATH')
  private readonly STATIC_RESOURCE_SERVE: string = this.configService.get<string>('STATIC_RESOURCE_SERVE')

  @Get()
  @ApiOperation({ summary: '获取文件列表' })
  async findAll() {
    const fileNames = await fs.readdir(this.STATIC_RESOURCE_PATH)
    const data = await Promise.all(
      fileNames.map(async name => {
        const { atime, mtime, ctime, birthtime, ...args } = await fs.stat(path.join(this.STATIC_RESOURCE_PATH, name))

        return {
          ...args,
          name,
          type: path.extname(name).replace('.', ''),
          mimeType: mime.lookup(name),
          atime: formatDate(atime),
          mtime: formatDate(mtime),
          ctime: formatDate(ctime),
          birthtime: formatDate(birthtime),
          url: `${this.STATIC_RESOURCE_SERVE}/${name}`,
        }
      })
    )

    return data
  }

  @Post()
  @UploadFileAggregation({ maxSize: 5 })
  @RequirePermissions(PermissionEnum.UPLOAD_RESOURCE)
  @ApiOperation({ summary: '上传文件' })
  upload(@Res({ passthrough: true }) res: Response, @UploadedFile() file: Express.Multer.File) {
    const fullPath = `${this.STATIC_RESOURCE_SERVE}/${path.basename(file.path)}`
    res.resMsg = '文件上传成功'
    return `${fullPath}`
  }

  @Post('chunk/upload')
  @RequirePermissions(PermissionEnum.UPLOAD_RESOURCE)
  @ApiOperation({ summary: '创建或检查分片上传目录，并支持断点续传' })
  async createChunkDir(@Body() data: CreateFileDirDto) {
    // 如果 uploads 不存在手动创建目录
    const uploadDirExists = await fs
      .access(this.UPLOAD_CHUNKS_DIR)
      .then(() => true)
      .catch(() => false)
    if (!uploadDirExists) await fs.mkdir(this.UPLOAD_CHUNKS_DIR)

    const UPLOAD_DIR = path.join(process.cwd(), 'uploads', data.uploadId)
    const existingChunks = await fs.readdir(UPLOAD_DIR).catch(() => false)
    if (existingChunks) {
      // 过滤出已经上传过的分片进行返回
      return {
        existingChunks,
        message: '部分分片已存在，支持断点续传。',
      }
    } else {
      await fs.mkdir(UPLOAD_DIR)
      return { message: '合成目录创建成功' }
    }
  }

  @Put('chunk/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination(req, file, cb) {
          const uploadPath = path.join(process.cwd(), 'uploads', req.query.uploadId as string)
          cb(null, uploadPath)
        },
        filename(req, file, cb) {
          cb(null, req.query.index as string)
        },
      }),
    })
  )
  @ApiOperation({ summary: '上传大文件' })
  chunkUpload() {
    return {
      message: '分片上传成功',
      success: true,
    }
  }

  @Post('chunk/merge')
  @ApiOperation({
    summary: '合并文件切片',
  })
  async mergeFileChunks(@Body() data: MergeFileChunksDto) {
    try {
      const targetDir = path.join(this.UPLOAD_CHUNKS_DIR, data.uploadId)
      const dirResult = await fs.readdir(targetDir)
      const { fileName, extName } = data

      const EXT_NAME = `.${extName}`
      const BASE_NAME = fileName.replace(EXT_NAME, '')
      const FULL_FILE_NAME = `${BASE_NAME}${EXT_NAME}`

      // 判断是否有同样的文件名
      const fileExists = await fs
        .access(path.join(this.STATIC_RESOURCE_PATH, FULL_FILE_NAME))
        .then(() => true)
        .catch(() => false)

      // 如果有同样的文件名，则生成新的文件名
      const fullFileName = fileExists ? `${nanoid(5)}.${extName}` : FULL_FILE_NAME

      const outputPath = path.join(this.STATIC_RESOURCE_PATH, fullFileName)

      // 按文件名顺序排序，确保分片按正确顺序合并
      dirResult.sort((a, b) => parseInt(a) - parseInt(b))
      const writeStream = createWriteStream(outputPath)
      for (const fullFileName of dirResult) {
        const chunkPath = path.join(targetDir, fullFileName)

        // 读取并写入流
        await new Promise((resolve, reject) => {
          const readStream = createReadStream(chunkPath)
          readStream.pipe(writeStream, { end: false })
          readStream.on('end', resolve)
          readStream.on('error', reject)
        })

        // 删除已合并的切片
        await fs.unlink(chunkPath)
      }

      writeStream.end()

      // 确保写入完成
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

      // 合并完成后删除临时目录
      await fs.rm(targetDir, { recursive: true, force: true })

      return `${this.STATIC_RESOURCE_SERVE}/${fileName}`
    } catch (error) {
      throw new InternalServerErrorException('Failed to merge file chunks')
    }
  }

  @Delete(':fileName')
  @RequirePermissions(PermissionEnum.DELETE_RESOURCE)
  @ApiOperation({ summary: '删除文件' })
  async deleteFile(@Param('fileName') fileName: string) {
    const fullPath = path.join(this.STATIC_RESOURCE_PATH, fileName)
    const fileExists = await fs
      .access(fullPath)
      .then(() => true)
      .catch(() => false)

    if (!fileExists) throw new NotFoundException('文件不存在')
    await fs.unlink(fullPath)

    return '文件删除成功'
  }
}
