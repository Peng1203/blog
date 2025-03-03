import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, ConflictException } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FindAllPermissionDto } from './dto'
import { ParseIntParamPipe } from '@/common/pipe'
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { Response } from 'express'
import { RequirePermissions } from '@/common/decorators'
@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @RequirePermissions(PermissionEnum.CREATE_PERMISSION)
  @ApiOperation({ summary: '创建权限' })
  create(@Body() data: CreatePermissionDto) {
    return this.permissionService.create(data)
  }

  @Get()
  @RequirePermissions(PermissionEnum.GET_PERMISSION)
  @ApiOperation({ summary: '获取权限' })
  async findAll(@Query() query: FindAllPermissionDto) {
    const { list: data, total } = await this.permissionService.findAll(query)
    const list = query.queryStr ? data : this.permissionService.handlePermissionResponse(data)
    return { list, total }
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.permissionService.findOne(id)
  }

  @Patch(':id')
  @RequirePermissions(PermissionEnum.UPDATE_PERMISSION)
  @ApiOperation({ summary: '修改权限信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdatePermissionDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.permissionService.update(id, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新权限信息失败!') && (res.success = false)

    return updateRes ? '更新权限信息成功!' : '操作失败!'
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.DELETE_PERMISSION)
  @ApiOperation({ summary: '删除权限' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const permission = await this.permissionService.findOne(id)
    const isHave = await this.permissionService.permissionHasChildren(permission.id)
    if (isHave)
      throw new ConflictException({
        code: ApiResponseCodeEnum.CONFLICT,
        msg: '删除失败，请先处理相关的权限标识',
      })

    const delResult = await this.permissionService.remove(id)
    if (!delResult) res.resMsg = '删除权限标识失败!'
    if (!delResult) res.success = false
    else return '删除权限标识成功'
  }

  @Get('/code/options')
  @ApiOperation({ summary: '获取权限标识下拉数据' })
  getPermissionCodeOptions() {
    const options = []
    for (const key in PermissionEnum) {
      options.push({
        label: key,
        value: PermissionEnum[key],
      })
    }
    return options
  }
}
