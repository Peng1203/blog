import { IsArrayNumber } from '@/common/validator'
import { IsArray, Validate } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteUsersDto {
  @IsArray()
  @Validate(IsArrayNumber)
  @ApiProperty({ default: [], required: true, description: '角色id' })
  readonly ids: number[]
}
