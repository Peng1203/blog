import { Module } from '@nestjs/common'
import { PersonalService } from './personal.service'
import { PersonalController } from './personal.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Personal } from '@/common/entities'
import { UserModule } from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Personal]), UserModule],
  controllers: [PersonalController],
  providers: [PersonalService],
})
export class PersonalModule {}
