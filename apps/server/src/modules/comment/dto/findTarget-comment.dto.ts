import { ListCommonParamsDto } from '@/common/dto'
import { IsInt, IsNumber, IsNotEmpty, Min, IsDefined } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindCommentByTargetDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ default: 1, description: '页码' })
  page: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ default: 10, description: '每页数' })
  pageSize: number
}
