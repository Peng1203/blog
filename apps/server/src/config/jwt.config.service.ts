import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt'
@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      global: true,
      signOptions: {
        expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        issuer: this.configService.get<string>('JWT_ISSUER'),
      },
    }
  }
}
