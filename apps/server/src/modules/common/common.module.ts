import { Module } from '@nestjs/common'
import { CommonService } from './common.service'
import { CommonController } from './common.controller'
import { IpModule } from '@/shared/ip/ip.module'

@Module({
  imports: [IpModule],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
