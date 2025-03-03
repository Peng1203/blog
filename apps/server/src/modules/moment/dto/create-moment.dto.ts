import { IsArray, IsDefined, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BolEnum, MomentStatusEnum } from '@/helper/enums'

export class CreateMomentDto {
  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '用户ID' })
  userId: number

  @IsString()
  @ApiProperty({
    default: '',
    description: '说说内容',
  })
  content: string

  @IsEnum(BolEnum)
  @ApiProperty({
    default: BolEnum.FALSE,
    description: '是否置顶: 0否 1是',
  })
  isTop: BolEnum

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: '资源urls' })
  mediaUrls: string[]

  @IsEnum(MomentStatusEnum)
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({
    default: MomentStatusEnum.PUBLIC,
    description: '1公开 2私密',
  })
  status: MomentStatusEnum
}
