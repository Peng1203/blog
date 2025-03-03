import { CommentType } from '@/helper/enums'
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsUrl,
  ValidateIf,
} from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
  @IsString()
  @ApiProperty({ description: '名称' })
  name: string

  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '用户ID', default: null })
  userId: number

  @IsString()
  @ApiProperty({ description: '评论内容' })
  content: string

  @IsEmail()
  @ValidateIf(o => o.email !== '')
  @IsOptional()
  @ApiProperty({ description: '邮箱', required: false })
  email?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '头像' })
  avatar?: string

  @IsInt()
  @IsNumber()
  @IsEnum(CommentType)
  @ApiProperty({ description: '评论类型' })
  type?: CommentType

  @Min(0)
  @IsInt()
  @IsNumber()
  @ApiProperty({ description: '关联的文章ID或动态ID' })
  targetId: number

  @Min(0)
  @IsInt()
  @IsNumber()
  @ApiProperty({ description: '关联的文章ID或动态ID' })
  replyId: number

  @Min(0)
  @IsInt()
  @IsNumber()
  @ApiProperty({ description: 'id 0或者null 为父级评论', default: 0 })
  parentId: number

  @IsUrl()
  @IsOptional()
  @ValidateIf(o => o.blogUrl !== '')
  @ApiProperty({ description: '博客链接', required: false })
  blogUrl?: string
}
