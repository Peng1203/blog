import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { User } from '@/common/entities'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { SessionInfo } from 'express-session'
import { Details } from 'express-useragent'

// 扩展 Express 的 Request Response 对象的属性
declare module 'express' {
  interface Response extends ExpressResponse {
    // 用于 transform
    resMsg: string
    success: boolean
    apiResponseCode: ApiResponseCodeEnum
  }

  interface Request extends ExpressRequest {
    user: User
    session: SessionInfo
    // 客户端 UA 信息
    useragent: Details & { isAuthoritative: boolean }
    //
    clientIp: any
    // 响应错误信息
    resErrMsg: string
    rawBody: Buffer
  }
}
