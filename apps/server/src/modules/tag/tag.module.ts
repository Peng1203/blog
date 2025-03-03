import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagController } from './tag.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from '@/common/entities'
import { UserModule } from '../user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), UserModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
