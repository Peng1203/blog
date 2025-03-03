import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class UpdateArticleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * 1. 操作用户id是否 更新用户的id是否相同
     * 2. 更新最小容忍度 当用户没有更新文章权限时 是否可以修改自己的文章? 待定
     */
    const req = context.switchToHttp().getRequest<Request>()

    if (Number(req.params.uid) != req.user.id)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '更新文章失败 身份信息有误！',
      })
    return true
  }
}
