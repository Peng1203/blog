import { IsString, MinLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({ description: '旧密码' })
  oldPassword: string

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: '旧密码' })
  newPassword: string
}
