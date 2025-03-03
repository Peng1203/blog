import { PartialType } from '@nestjs/mapped-types'
import { CreateSystemDto } from './create-system.dto'
import { SystemServeNameEnum } from '@/helper/enums'
import { IsEnum } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateSystemDto {
  @IsEnum(SystemServeNameEnum)
  @ApiProperty({ description: '服务名' })
  serveName: SystemServeNameEnum
}
