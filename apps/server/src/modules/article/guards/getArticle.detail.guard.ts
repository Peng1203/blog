import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class GetArticleDetailGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * 1. 操作用户id是否 是作者本人?
     */
    const req = context.switchToHttp().getRequest<Request>()
    console.log(req.params)
    console.log(req.user.id)

    return true
  }
}
