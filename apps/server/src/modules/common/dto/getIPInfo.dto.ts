import { IsString, IsIP, MaxLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetIPInfoDto {
  @IsIP()
  @IsString()
  @MaxLength(15)
  @ApiProperty({ description: 'IP v4地址' })
  ip: string
}
