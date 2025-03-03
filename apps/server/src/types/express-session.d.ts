import * as expressSession from 'express-session'

declare module 'express-session' {
  interface SessionInfo {
    cookie: any
    captcha?: string
    expirationTimestamp?: number
  }
}

export = expressSession // 导出整个 express-session 模块
