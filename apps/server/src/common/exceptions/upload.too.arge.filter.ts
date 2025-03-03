import { ApiResponseCodeEnum, StatusEnum } from '@/helper/enums'
import { AuditService } from '@/modules/log/audit/audit.service'
import { formatDate } from '@/utils/date.util'
import { ArgumentsHost, Catch, ExceptionFilter, PayloadTooLargeException } from '@nestjs/common'
import { Request, Response } from 'express'

/** 上传文件过大异常处理 */
@Catch(PayloadTooLargeException)
export class UploadTooLargeFilter implements ExceptionFilter {
  constructor(private readonly auditService: AuditService) {}
  catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
    const exceptionRes = exception.getResponse() as any
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()
    const status = exception.getStatus()

    console.log('上传异常过滤器触发 ------', exceptionRes)

    this.auditService.createAuditRecord(req, res, StatusEnum.FALSE, 0, req.resErrMsg, status)

    res.status(status).json({
      code: ApiResponseCodeEnum.FILE_TOO_LARGE,
      error: exception.message,
      path: req.url,
      method: req.method,
      message: req.resErrMsg,
      timestamp: formatDate(),
    })
  }
}
