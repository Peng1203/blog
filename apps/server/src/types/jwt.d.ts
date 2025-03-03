import psjwt from 'passport-jwt'

// 扩展 jwt解析对象信息
declare module 'passport-jwt' {
  interface JwtPayload {
    sub: number
    userName: string
    iat: number
    exp: number
    iss: string
  }
}
