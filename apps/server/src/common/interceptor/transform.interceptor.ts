import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { Response } from 'express'
import { ApiResponseCodeEnum, ApiResponseMessageEnum } from '@/helper/enums'
import { Reflector } from '@nestjs/core'
import { IS_KEEP_KEY } from '../decorators'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isKeep = this.reflector.getAllAndOverride<boolean>(IS_KEEP_KEY, [context.getHandler(), context.getClass()])
    return next.handle().pipe(
      map(data => {
        if (isKeep) return data
        const res = context.switchToHttp().getResponse<Response>()
        const code =
          res.apiResponseCode ?? (res.statusCode === 200 ? ApiResponseCodeEnum.SUCCESS : ApiResponseCodeEnum.CREATED)
        const message = res.resMsg || ApiResponseMessageEnum[code]
        const success = res.success ?? true
        // 当设置了响应头时 返回原始数据
        // if (res.getHeader('Content-Type')) return data;
        return {
          code,
          success,
          message,
          data,
        }
      })
    )
  }
}
