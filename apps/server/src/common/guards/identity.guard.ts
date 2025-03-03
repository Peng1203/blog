import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { ApiResponseCodeEnum } from '@/helper/enums'

/** 用于校验 执行敏感操作 是否越权 */
@Injectable()
export class IdentityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>()

    if (req.user.id === 1 && req.user.userName === 'admin') return true

    const paramsId = Number(req.params.id || req.params.uid || req.body.userId || req.body.uid)
    // prettier-ignore
    if (paramsId != req.user.id) throw new ForbiddenException({
      code: ApiResponseCodeEnum.FORBIDDEN_USER,
      msg: `操作失败 身份信息有误！`,
    });
    return true
  }
}
