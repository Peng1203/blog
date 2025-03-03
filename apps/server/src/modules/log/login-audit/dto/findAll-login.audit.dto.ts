import { ListCommonParamsDto } from '@/common/dto'
import { IsDateTimeString } from '@/helper/validate'
import { IsDefined, IsInt, IsNumber, IsOptional, IsString, Validate } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllLoginAuditDto extends ListCommonParamsDto {
  @IsInt()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ default: '', required: false, description: '登录用户ID' })
  readonly userId?: number

  @IsOptional()
  @IsString()
  @Validate(IsDateTimeString, { message: '开始时间格式有误' })
  @IsDefined()
  @ApiProperty({ default: '', required: false, description: '开始时间' })
  readonly startTime?: string

  @IsOptional()
  @IsString()
  @Validate(IsDateTimeString, { message: '结束时间格式有误' })
  @IsDefined()
  @ApiProperty({ default: '', required: false, description: '结束时间' })
  readonly endTime?: string
}
