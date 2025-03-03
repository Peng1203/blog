import { IsArray, IsNumber } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteCategorysDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ default: [], description: '删除分类id' })
  categoryIds: number[]
}
