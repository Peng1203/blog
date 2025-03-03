import { Module } from '@nestjs/common'
import { MomentService } from './moment.service'
import { MomentController } from './moment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Moment } from '@/common/entities'
import { UserModule } from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Moment]), UserModule],
  controllers: [MomentController],
  providers: [MomentService],
})
export class MomentModule {}
