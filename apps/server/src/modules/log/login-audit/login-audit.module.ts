import { Module } from '@nestjs/common'
import { LoginAuditService } from './login-audit.service'
import { LoginAuditController } from './login-audit.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoginAudit } from '@/common/entities'
import { IpModule } from '@/shared/ip/ip.module'

@Module({
  imports: [TypeOrmModule.forFeature([LoginAudit]), IpModule],
  controllers: [LoginAuditController],
  providers: [LoginAuditService],
  exports: [LoginAuditService],
})
export class LoginAuditModule {}
