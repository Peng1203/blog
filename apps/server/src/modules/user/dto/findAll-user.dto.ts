import { ListCommonParamsDto } from '@/common/dto'
import { IsInt, IsNumber, IsOptional } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllUserDto extends ListCommonParamsDto {
  @IsInt()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: '', required: false, description: '角色id' })
  readonly roleId?: number
}
