import { IsInt, IsNumber, IsString, MaxLength, Min, MinLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserLogoutDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @ApiProperty({ description: '用户id', default: 1 })
  id: number

  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ description: '用户名', default: 'admin' })
  userName: string
}
