import { IsOptional, IsString } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePersonalDto {
  @IsString()
  @ApiProperty({ description: '备案ICP' })
  @IsOptional()
  readonly icp?: string

  @IsString()
  @ApiProperty({ description: '签名' })
  @IsOptional()
  readonly sign?: string

  @IsString()
  @ApiProperty({ description: '公告' })
  @IsOptional()
  readonly notice?: string
}
