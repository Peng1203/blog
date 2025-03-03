import { ListCommonParamsDto } from '@/common/dto'
import { ArticleStatusStateEnum, ArticleTypeStateEnum } from '@/helper/enums'
import { DATE_TIME_REGEX } from '@/helper/regex'
import { IsDateTimeString } from '@/helper/validate'
import { IsDefined, IsEnum, IsInt, IsNumber, IsOptional, IsString, Matches, Validate } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllArticleDto extends ListCommonParamsDto {
  @IsEnum(ArticleTypeStateEnum)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: '文章类型',
    enum: ArticleTypeStateEnum,
    default: ArticleTypeStateEnum.ALL,
  })
  type?: ArticleTypeStateEnum

  @IsEnum(ArticleStatusStateEnum)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: '文章状态',
    enum: ArticleStatusStateEnum,
    default: ArticleStatusStateEnum.ALL,
  })
  status?: ArticleStatusStateEnum

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '作者ID', default: 0 })
  authorId: number

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '分类ID', default: 0 })
  categoryId: number

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '标签ID', default: 0 })
  tagId: number

  @IsOptional()
  @IsString()
  @Validate(IsDateTimeString, { message: '开始时间格式有误' })
  @IsDefined()
  @ApiProperty({ default: '', required: false, description: '开始时间' })
  startTime?: string

  @IsOptional()
  @IsString()
  @Validate(IsDateTimeString, { message: '结束时间格式有误' })
  @IsDefined()
  @ApiProperty({ default: '', required: false, description: '结束时间' })
  endTime?: string
}
