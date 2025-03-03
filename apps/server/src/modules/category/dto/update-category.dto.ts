import { PartialType } from '@nestjs/mapped-types'
import { CreateCategoryDto } from './create-category.dto'
import { IsOptional, IsString, MaxLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @MaxLength(6)
  @ApiProperty({ description: '分类名' })
  @IsOptional()
  categoryName?: string

  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: '分类描述' })
  @IsOptional()
  description?: string
}
