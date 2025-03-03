import { IsInt, IsNumber, IsString, MaxLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
  // @IsNumber()
  // @IsInt()
  // readonly id: number;

  // @IsString()
  // @MaxLength(15)
  // readonly userName: string;

  @IsString()
  @ApiProperty()
  readonly refresh_token: string
}
