import { PartialType } from '@nestjs/mapped-types'
import { CreateRoleDto } from './create-role.dto'
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  @ApiProperty({ description: '角色名称' })
  readonly roleName?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '角色描述' })
  readonly description?: string

  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({ description: '角色菜单', default: [] })
  readonly menus?: number[]

  @IsNumber({}, { each: true })
  @ApiProperty({ description: '角色权限', default: [] })
  readonly permissions?: number[]
}
