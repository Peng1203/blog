import { ApiResponseMessageEnum, LoginMethodEnum, StatusEnum } from '@/helper/enums'
import { AuditService } from '@/modules/log/audit/audit.service'
import { LoginAuditService } from '@/modules/log/login-audit/login-audit.service'
import { formatDate } from '@/utils/date.util'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly auditService: AuditService, private readonly loginAuditService: LoginAuditService) {}

  catch(exception: HttpException & unknown, host: ArgumentsHost) {
    const exceptionRes = exception.getResponse() as any
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const code = exceptionRes.code || status
    Logger.error('触发 Http 异常过滤器 ----->', exceptionRes)

    // 根据请求url 记录到审计日志或登录日志中
    if (req.path.includes('login') && req.method === 'POST' && !req.path.includes('/login/audit')) {
      this.loginAuditService.createLoginRecord(
        req,
        {
          userId: null,
          userName: req.body.userName,
        },
        {
          loginDuration: 0,
          loginStatus: exceptionRes.code,
          failureReason: exceptionRes.msg,
          loginMethod: LoginMethodEnum.PASSWORD,
        }
      )
    } else {
      this.auditService.createAuditRecord(req, res, StatusEnum.FALSE, 0, exceptionRes.msg, status)
    }

    res.status(status).json({
      code,
      error: exception.message,
      path: req.url,
      method: req.method,
      message: exceptionRes.msg || ApiResponseMessageEnum[exceptionRes.code],
      timestamp: formatDate(),
    })
  }
}
