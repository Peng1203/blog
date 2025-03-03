import { IsArray, IsNumber } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteTagsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ default: [], description: '删除标签id' })
  tagIds: number[]
}
