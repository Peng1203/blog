import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindUserMomentDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ default: 1, description: '页码' })
  page: number

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: 10, description: '每页数' })
  pageSize: number

  @IsString()
  @IsOptional()
  @IsDefined()
  @ApiProperty({ required: false, description: '搜索关键字' })
  queryStr?: string
}
