import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTagDto {
  @IsNumber()
  @IsInt()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '用户ID' })
  userId: number

  @IsString()
  @MaxLength(12)
  @ApiProperty({ description: '标签名' })
  tagName: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '标签图标类名', default: '' })
  icon?: string | null
}
