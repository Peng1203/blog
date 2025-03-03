import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserEnabledEnum } from '@/helper/enums'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ description: '用户名称' })
  @IsOptional()
  readonly userName?: string

  @IsInt()
  @IsNumber()
  @IsEnum(UserEnabledEnum)
  @IsOptional()
  @ApiProperty({
    description: '用户状态 0禁用 1启用',
    default: UserEnabledEnum.Enabled,
  })
  readonly userEnabled?: UserEnabledEnum

  // @IsArray()
  // @Validate(IsArrayNumber)
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  // @IsOptional()
  @ApiProperty({ description: '用户角色id数组', default: [] })
  readonly roleIds?: number[]

  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: '邮箱', required: false })
  readonly email?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '昵称' })
  readonly nickName?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '用户头像' })
  readonly userAvatar?: string
}
