import { PartialType } from '@nestjs/mapped-types'
import { CreatePermissionDto } from './create-permission.dto'
import { IsString, MaxLength, MinLength, IsEnum, IsOptional, IsNumber, IsInt, Min } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PermissionEnum } from '@/helper/enums/permission'
import { RequestMethodEnum } from '@/helper/enums/request.method'
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ description: '权限名称' })
  readonly permissionName: string

  @IsEnum(PermissionEnum)
  @IsOptional()
  @ApiProperty({ description: '权限标识', default: null })
  readonly permissionCode?: PermissionEnum | null

  @IsEnum(RequestMethodEnum)
  @IsOptional()
  @ApiProperty({ description: '请求方式', default: null })
  readonly resourceMethod?: RequestMethodEnum | null

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '请求url', default: '' })
  readonly resourceUrl?: string

  @IsNumber()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '所属分类的父级id 0为类型', default: 0 })
  readonly parentId?: number

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '权限描述', default: '' })
  readonly description?: string
}
