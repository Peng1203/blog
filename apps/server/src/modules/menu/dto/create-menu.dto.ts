import { StatusEnum } from '@/helper/enums'
import { Type } from '@nestjs/class-transformer'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BatchAddMenuItem, BatchAddMenuItemInstance } from '../types'

export class CreateMenuDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '菜单名' })
  readonly menuName: string

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '菜单路径', default: '/' })
  readonly menuPath: string

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '菜单唯一标识' })
  readonly menuUri: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '菜单图标类名', default: '' })
  readonly menuIcon?: string | null

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(20)
  @ApiProperty({ description: '菜单排序', default: 0 })
  readonly orderNum: number

  @IsNumber()
  @IsInt()
  @Min(0)
  @ApiProperty({ description: '菜单父级id 0 为 父级菜单', default: 0 })
  readonly parentId: number

  @IsInt()
  @IsNumber()
  @IsEnum(StatusEnum)
  @ApiProperty({
    description: '菜单是否隐藏 0不隐藏 1隐藏',
    default: StatusEnum.FALSE,
  })
  readonly isHidden: StatusEnum

  @IsInt()
  @IsNumber()
  @IsEnum(StatusEnum)
  @ApiProperty({
    description: '菜单是否隐藏 0不缓存 1缓存',
    default: StatusEnum.FALSE,
  })
  readonly isKeepalive: StatusEnum

  // @Type(() => CreateMenuDto)
  // @IsOptional()
  // @ApiProperty({ description: '子菜单', default: [] })
  // children?: CreateMenuDto[];
}

export class BatchCreateMenuDto {
  @IsArray()
  // @ValidateNested()
  @Type(() => BatchAddMenuItemInstance)
  @ApiProperty({
    default: [],
    description: '父菜单',
    type: BatchAddMenuItemInstance,
  })
  parentMenus: BatchAddMenuItem[]

  @IsArray()
  // @ValidateNested()
  @Type(() => BatchAddMenuItemInstance)
  @ApiProperty({
    default: [],
    description: '子菜单',
    type: BatchAddMenuItemInstance,
  })
  subMenus: BatchAddMenuItem[]
}
