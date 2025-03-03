import { IsDefined, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ListCommonParamsDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ default: 1, description: '页码' })
  readonly page: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ default: 10, description: '每页数' })
  readonly pageSize: number

  @IsString()
  @IsOptional()
  @IsDefined()
  @ApiProperty({ required: false, description: '搜索关键字' })
  readonly queryStr?: string

  @IsString()
  @ApiProperty({ default: 'id', required: false, description: '排序字段' })
  readonly column?: string

  @IsString()
  @IsIn(['ASC', 'DESC', ''])
  @IsDefined()
  @ApiProperty({ default: 'ASC', required: false, description: '排序方式' })
  readonly order?: 'ASC' | 'DESC' | ''
}

export class NoOrderListCommonParamsDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ default: 1, description: '页码' })
  readonly page: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ default: 10, description: '每页数' })
  readonly pageSize: number

  @IsString()
  @IsOptional()
  @IsDefined()
  @ApiProperty({ required: false, description: '搜索关键字' })
  readonly queryStr?: string
}

export class NoPageListCommonParamsDto {
  @IsString()
  @IsOptional()
  @IsDefined()
  @ApiProperty({ required: false, description: '搜索关键字' })
  readonly queryStr?: string

  @IsString()
  @ApiProperty({ default: 'id', required: false, description: '排序字段' })
  readonly column?: string

  @IsString()
  @IsIn(['ASC', 'DESC', ''])
  @IsDefined()
  @ApiProperty({ default: 'ASC', required: false, description: '排序方式' })
  readonly order?: 'ASC' | 'DESC' | ''
}
