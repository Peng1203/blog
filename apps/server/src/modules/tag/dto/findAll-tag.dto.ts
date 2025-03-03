import { ListCommonParamsDto } from '@/common/dto'
import { IsInt, IsNumber, IsOptional } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllTagDto extends ListCommonParamsDto {
  @IsNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({ description: '用户ID', default: 0 })
  userId: number
}
