import { Express, Request } from 'express'
import multer from 'multer'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

const ROOT_PATH = ''
// 磁盘存储引擎
const diskStorage = multer.diskStorage({
  // 保存目录
  destination(req: Request, file: Express.Multer.File, cb) {
    cb(null, ROOT_PATH)
  },
  // 文件名称
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + file.originalname) // 文件名使用原始文件名
  },
})

// 内存存储引擎 使用内存存储的情况下 会在file对象身上多出一个 buffer 属性
const memoryStorage = multer.memoryStorage()
