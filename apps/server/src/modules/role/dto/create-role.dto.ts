import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ description: '角色名称' })
  readonly roleName: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '角色描述' })
  readonly description?: string

  @IsNumber({}, { each: true })
  @ApiProperty({ description: '角色菜单', default: [] })
  readonly menus: number[]

  @IsNumber({}, { each: true })
  @ApiProperty({ description: '角色权限', default: [] })
  readonly permissions: number[]
}
