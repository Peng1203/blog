import { ArticleStatusEnum, ArticleTypeEnum, BolEnum, ContentModelEnum } from '@/helper/enums'
import {
  ArrayMaxSize,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章标题' })
  title: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章摘要' })
  summary?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章内容' })
  content?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章封面' })
  cover?: string | null

  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '作者ID' })
  authorId: number

  @IsEnum(ArticleTypeEnum)
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    default: ArticleTypeEnum.ORIGINAL,
    description: '文章类型: 1原创 2转载 3翻译',
  })
  type: ArticleTypeEnum

  @IsEnum(ArticleStatusEnum)
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    default: ArticleStatusEnum.DRAFT,
    description: '文章状态: 1已发布 2私密 3草稿箱 4已删除 5待审核 6已拒绝',
  })
  status: ArticleStatusEnum

  @IsEnum(BolEnum)
  @ApiProperty({
    default: BolEnum.FALSE,
    description: '是否置顶: 0否 1是',
  })
  isTop: BolEnum

  @IsEnum(ContentModelEnum)
  @ApiProperty({
    default: ContentModelEnum.MARKDOWN,
    description: '文章内容模式: 0Markdown 1富文本',
  })
  contentModel: ContentModelEnum

  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ default: null, description: '分类ID' })
  category?: number | null

  @IsNumber({}, { each: true })
  @ArrayMaxSize(3)
  @ApiProperty({ default: [], description: '文章标签' })
  tags: number[]

  @IsString()
  @IsOptional()
  @MaxLength(8)
  @ApiProperty({ default: null, description: '私密文章 访问密码' })
  accessPassword?: string | null
}
