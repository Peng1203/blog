import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class DeleteArticleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * 1. 操作用户是否是作者本人
     * 2. 删除操作最小容忍度 当用户没有删除文章权限时 是否可以删除自己的文章? 待定
     */
    const req = context.switchToHttp().getRequest<Request>()

    if (Number(req.params.uid) !== req.user.id)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '删除文章失败 身份信息有误！',
      })
    return true
  }
}
