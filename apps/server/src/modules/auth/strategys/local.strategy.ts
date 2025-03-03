import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { User } from '@/common/entities'
import { Request } from 'express'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'password',
      session: true,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, userName: string, password: string): Promise<User> {
    this.authService.verifyCaptcha(req.body.captcha, req.session)
    return await this.authService.validateUser(userName, password)
  }
}
