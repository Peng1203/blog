import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, NotFoundException, UseGuards } from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto, UpdateTagDto, FindAllTagDto, DeleteTagsDto } from './dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { Public, RequirePermissions } from '@/common/decorators'
import { ParseIntParamPipe } from '@/common/pipe'
import { Response } from 'express'
import { IdentityGuard } from '@/common/guards'

@ApiTags('Tag')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '添加文章标签' })
  @RequirePermissions(PermissionEnum.CREATE_TAG)
  create(@Body() data: CreateTagDto) {
    return this.tagService.create(data)
  }

  @Get()
  @ApiOperation({ summary: '查询文章标签' })
  findAll(@Query() params: FindAllTagDto) {
    return this.tagService.findAll(params)
  }

  @Public()
  @Get('user/:uid/tags')
  @ApiOperation({ summary: '查询用户文章标签' })
  findAllByUser(@Param('uid', new ParseIntParamPipe('用户id参数有误')) uid: number) {
    return this.tagService.findAllByUser(uid)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章标签' })
  @RequirePermissions(PermissionEnum.UPDATE_TAG)
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateTagDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.tagService.update(id, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新文章标签失败!') && (res.success = false)
    return updateRes ? '更新文章标签成功!' : '操作失败!'
  }

  @Delete(':id')
  @UseGuards(IdentityGuard)
  @ApiOperation({ summary: '删除文章标签' })
  @RequirePermissions(PermissionEnum.DELETE_TAG)
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const tag = await this.tagService.findOne(id).catch(() => false)
    if (!tag)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_ROLE,
        msg: '删除失败，未找到相关标签',
      })

    const delRes = await this.tagService.remove(id)
    if (!delRes) res.resMsg = '删除标签失败!'
    if (!delRes) res.success = false
    else return '删除标签成功'
  }

  @Delete()
  @ApiOperation({ summary: '批量删除文章标签' })
  @RequirePermissions(PermissionEnum.DELETE_TAG)
  async batchRemove(@Body() { tagIds }: DeleteTagsDto, @Res({ passthrough: true }) res: Response) {
    const delRes = await this.tagService.removes(tagIds)
    if (!delRes) res.resMsg = '批量删除标签失败!'
    if (!delRes) res.success = false
    else return `成功删除 ${delRes.affected || 0} 条记录`
  }
}
