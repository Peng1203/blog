import { IsOptional, IsString } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindNetdiskDirDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '目录路径', required: false })
  readonly path?: string
}
