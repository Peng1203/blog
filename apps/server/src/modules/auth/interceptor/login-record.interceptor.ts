import { LoginAuditService } from '@/modules/log/login-audit/login-audit.service'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Request } from 'express'
import { LoginMethodEnum, LoginStatusEnum } from '@/helper/enums'

@Injectable()
export class LoginRecordInterceptor implements NestInterceptor {
  constructor(private readonly loginAuditService: LoginAuditService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestTime = Date.now()
    const req = context.switchToHttp().getRequest<Request>()

    return next.handle().pipe(
      tap(data => {
        const { ip, location, loginTime, user } = data
        const { id: userId, userName } = user
        const responseTime = Date.now()

        this.loginAuditService.createLoginRecord(
          req,
          {
            userId,
            userName,
          },
          {
            ip,
            location,
            loginTime,
            loginDuration: responseTime - requestTime,
            loginStatus: LoginStatusEnum.SUCCESS,
            failureReason: null,
            loginMethod: LoginMethodEnum.PASSWORD,
          }
        )
      })
    )
  }
}
