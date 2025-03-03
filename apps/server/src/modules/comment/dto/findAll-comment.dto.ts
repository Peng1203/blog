import { ListCommonParamsDto } from '@/common/dto'
import { IsInt, IsNumber, IsOptional, IsEnum } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { FindCommentType } from '@/helper/enums'

export class FindAllCommentDto extends ListCommonParamsDto {
  @IsInt()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: '', required: false, description: '用户id' })
  userId?: number

  @IsInt()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: '', required: false, description: '目标ID' })
  targetId?: number

  @IsEnum(FindCommentType)
  @IsOptional()
  @ApiProperty({
    enum: FindCommentType,
    description: '评论类型',
    default: FindCommentType.ALL,
  })
  type?: FindCommentType
}
