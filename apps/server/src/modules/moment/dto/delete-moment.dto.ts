import { IsArray, IsNumber } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteMomentsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ default: [], description: '删除动态id' })
  ids: number[]
}
