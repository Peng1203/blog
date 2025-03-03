import { formatDate } from '@/utils/date.util'
import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 取消打印日志
    if (req.headers['x-log'] === 'false') return next()
    const statusCode = res.statusCode
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
    const logFormat = `
###########################################################
Date: ${formatDate()}
RequestUrl: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
ClientIP: ${clientIp}
Host: ${req.headers.host}
Referer: ${req.headers.referer || req.headers.referrer}
StatusCode: ${statusCode}
ContentType: ${req.headers['content-type']}
Params: ${JSON.stringify(req.params)}
Query: ${JSON.stringify(req.query)}
Body: ${JSON.stringify(req.body)}
UserAgent: ${req.headers['user-agent']}
###########################################################
`
    Logger.log(logFormat)
    this.writeLog(logFormat)
    next()
  }
  /** 写入 本地日志 */
  private writeLog(logInfo: string) {}
}
