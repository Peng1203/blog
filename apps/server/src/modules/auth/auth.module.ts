import { Module, forwardRef } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtConfigService, PassportConfigService } from '@/config'
import { LocalStrategy } from './strategys'
import { UserModule } from '@/modules/user/user.module'
import { SharedModule } from '@/shared/shared.module'
import { PasswordService } from './services'
import { LoginAuditModule } from '../log/login-audit/login-audit.module'

@Module({
  imports: [
    PassportModule.registerAsync({ useClass: PassportConfigService }),
    JwtModule.registerAsync({ useClass: JwtConfigService }),
    forwardRef(() => UserModule),
    SharedModule,
    LoginAuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PasswordService],
  exports: [AuthService, PassportModule, PasswordService],
})
export class AuthModule {}
