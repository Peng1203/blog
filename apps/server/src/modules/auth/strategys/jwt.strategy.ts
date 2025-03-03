import { Injectable, Res, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy, StrategyOptions, JwtPayload } from 'passport-jwt'

import { AuthService } from '@/modules/auth/auth.service'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      issuer: configService.get<string>('JWT_ISSUER'),
    } as StrategyOptions)
  }
  // user 参数为 获取解析token的数据 return 内容 会作为 request 对象的 user属性存在
  async validate(payload: JwtPayload) {
    // 通过 用户名和 id 查询数据库 redis 缓存优化
    // token 无感刷新
    // 当前秒

    const user = await this.authService.validateUserByIdAndName(Number(payload.sub), payload.userName)
    if (!user)
      throw new UnauthorizedException({
        code: ApiResponseCodeEnum.UNAUTHORIZED,
        msg: '非法token!',
      })
    return user
  }
}
