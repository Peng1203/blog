import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, Res } from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindAllRoleDto } from './dto'
import { ParseIntParamPipe } from '@/common/pipe'
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { Response } from 'express'
import { RequirePermissions } from '@/common/decorators'

@ApiTags('Role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @RequirePermissions(PermissionEnum.CREATE_ROLE)
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data)
  }

  @Get()
  @ApiOperation({ summary: '查询角色' })
  findAll(@Query() query: FindAllRoleDto) {
    return this.roleService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '通过ID查询角色' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.roleService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions(PermissionEnum.UPDATE_ROLE)
  @ApiOperation({ summary: '更新角色信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateRoleDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.roleService.update(id, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新角色信息失败!') && (res.success = false)
    return updateRes ? '更新角色信息成功!' : '操作失败!'
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.DELETE_ROLE)
  @ApiOperation({ summary: '删除角色' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const role = await this.roleService.findOne(id).catch(() => false)
    if (!role)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_ROLE,
        msg: '删除失败，未找到相关角色',
      })

    const delRes = await this.roleService.remove(id)
    if (!delRes) res.resMsg = '删除角色失败!'
    if (!delRes) res.success = false
    else return '删除角色成功'
  }
}
