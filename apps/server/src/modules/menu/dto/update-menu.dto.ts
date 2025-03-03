import { PartialType } from '@nestjs/mapped-types'
import { CreateMenuDto } from './create-menu.dto'
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { StatusEnum } from '@/helper/enums'
import { Type } from '@nestjs/class-transformer'

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty({ description: '菜单名' })
  menuName?: string

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty({ description: '菜单路径', default: '/' })
  menuPath?: string

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty({ description: '菜单唯一标识' })
  menuUri?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '菜单图标类名', default: '' })
  menuIcon?: string | null

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(20)
  @IsOptional()
  @ApiProperty({ description: '菜单排序', default: 0 })
  orderNum?: number

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({ description: '菜单父级id 0 为 父级菜单', default: 0 })
  parentId?: number

  @IsInt()
  @IsNumber()
  @IsEnum(StatusEnum)
  @IsOptional()
  @ApiProperty({
    description: '菜单是否隐藏 0不隐藏 1隐藏',
    default: StatusEnum.FALSE,
  })
  isHidden?: StatusEnum

  @IsInt()
  @IsNumber()
  @IsEnum(StatusEnum)
  @IsOptional()
  @ApiProperty({
    description: '菜单是否隐藏 0不缓存 1缓存',
    default: StatusEnum.FALSE,
  })
  isKeepalive?: StatusEnum

  // @Type(() => CreateMenuDto)
  // @IsOptional()
  // @ApiProperty({ description: '子菜单', default: [] })
  // children?: CreateMenuDto[];

  // @IsNumber({}, { each: true })
  // @IsOptional()
  // @ApiProperty({ description: '子菜单', default: [] })
  // children?: CreateMenuDto[];
}
