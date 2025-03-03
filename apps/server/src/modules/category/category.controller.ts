import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto, FindAllCategoryDto, DeleteCategorysDto } from './dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { Public, RequirePermissions } from '@/common/decorators'
import { ParseIntParamPipe } from '@/common/pipe'
import { Response } from 'express'
import { IdentityGuard } from '@/common/guards'

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: '添加文章分类' })
  @RequirePermissions(PermissionEnum.CREATE_CATEGORY)
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data)
  }

  @Get()
  @ApiOperation({ summary: '查询文章分类' })
  findAll(@Query() params: FindAllCategoryDto) {
    return this.categoryService.findAll(params)
  }

  @Public()
  @Get('user/:uid/categorys')
  @ApiOperation({ summary: '查询用户文章分类' })
  findAllByUser(@Param('uid', new ParseIntParamPipe('用户id参数有误')) uid: number) {
    return this.categoryService.findAllByUser(uid)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章分类' })
  @RequirePermissions(PermissionEnum.UPDATE_CATEGORY)
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateCategoryDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.categoryService.update(id, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新文章分类失败!') && (res.success = false)
    return updateRes ? '更新文章分类成功!' : '操作失败!'
  }

  @Delete(':id')
  @UseGuards(IdentityGuard)
  @ApiOperation({ summary: '删除文章分类' })
  @RequirePermissions(PermissionEnum.DELETE_CATEGORY)
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const category = await this.categoryService.findOne(id).catch(() => false)
    if (!category)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_ROLE,
        msg: '删除失败，未找到相关分类',
      })

    const delRes = await this.categoryService.remove(id)
    if (!delRes) res.resMsg = '删除分类失败!'
    if (!delRes) res.success = false
    else return '删除分类成功'
  }

  @Delete()
  @ApiOperation({ summary: '批量删除文章分类' })
  @RequirePermissions(PermissionEnum.DELETE_CATEGORY)
  async batchRemove(@Body() { categoryIds }: DeleteCategorysDto, @Res({ passthrough: true }) res: Response) {
    const delRes = await this.categoryService.removes(categoryIds)
    if (!delRes) res.resMsg = '批量删除文章分类失败!'
    if (!delRes) res.success = false
    else return `成功删除 ${delRes.affected || 0} 条记录`
  }
}
