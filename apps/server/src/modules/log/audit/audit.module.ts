import { Module } from '@nestjs/common'
import { AuditService } from './audit.service'
import { AuditController } from './audit.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Audit } from '@/common/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
