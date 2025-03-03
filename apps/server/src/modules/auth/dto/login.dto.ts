import { IsString, MaxLength, MinLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserLoginDto {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ description: '用户名' })
  userName: string

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: '密码' })
  password: string

  @IsString()
  @MinLength(1)
  @MaxLength(4)
  @ApiProperty({ description: '验证码', default: '' })
  captcha: string
}
