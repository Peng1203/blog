import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  Query,
  Res,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public, ReqUser, RequirePermissions } from '@/common/decorators'
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { FindAllArticleDto, FindPublicUserArticleDto, FindUserArticleDto } from './dto'
import { ParseIntParamPipe } from '@/common/pipe'
import { Response } from 'express'
import { DeleteArticleGuard, UpdateArticleGuard } from './guards'
import { NoOrderListCommonParamsDto } from '@/common/dto'

@ApiTags('Article')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @RequirePermissions(PermissionEnum.CREATE_ARTICLE)
  @ApiOperation({ summary: '发布文章' })
  async create(@Body() data: CreateArticleDto, @ReqUser('id') uid: number) {
    if (uid !== data.authorId)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '身份信息有误！',
      })

    return this.articleService.create(data)
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取文章列表' })
  findAll(@Query() params: FindAllArticleDto) {
    return this.articleService.findAll(params)
  }

  @Get(':uid')
  @ApiOperation({ summary: '获取用户文章列表或者文章下拉数据' })
  findByUser(@Param('uid', new ParseIntParamPipe('作者id参数有误')) uid: number, @Query() params: FindUserArticleDto) {
    return this.articleService.findByUserOrOptions(uid, params)
  }

  @Public()
  @Get('user/:uid/articles')
  @ApiOperation({ summary: '获取用户文章列表' })
  findByUser_v2(
    @Param('uid', new ParseIntParamPipe('作者id参数有误')) uid: number,
    @Query() params: FindPublicUserArticleDto
  ) {
    return this.articleService.findByUser(uid, params)
  }

  @Public()
  @Get('user/:uid/articles/:aid')
  @ApiOperation({ summary: '获取文章详情' })
  findOneByUser(
    @Param('uid', new ParseIntParamPipe('作者id参数有误')) uid: number,
    @Param('aid', new ParseIntParamPipe('文章id参数有误')) aid: number
  ) {
    return this.articleService.findOne(aid)
  }

  // @UseGuards(GetArticleDetailGuard)
  @Get(':uid/:aid')
  @ApiOperation({ summary: '获取文章详情' })
  findOne(
    @Param('uid', new ParseIntParamPipe('作者id参数有误')) uid: number,
    @Param('aid', new ParseIntParamPipe('文章id参数有误')) aid: number
  ) {
    return this.articleService.findOne(aid)
  }

  // @RequirePermissions(PermissionEnum.UPDATE_ARTICLE)
  @Patch(':uid/:aid')
  @UseGuards(UpdateArticleGuard)
  @ApiOperation({ summary: '更新文章' })
  async update(
    @Param('uid', new ParseIntParamPipe('作者id参数有误')) uid: number,
    @Param('aid', new ParseIntParamPipe('文章id参数有误')) aid: number,
    @Body() data: UpdateArticleDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.articleService.update(aid, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新文章失败!') && (res.success = false)
    return updateRes || '操作失败!'
  }

  // @RequirePermissions(PermissionEnum.DELETE_ARTICLE)
  @Delete(':uid/:aid')
  @UseGuards(DeleteArticleGuard)
  @ApiOperation({ summary: '删除文章' })
  async remove(
    @Param('uid', new ParseIntParamPipe('作者id参数有误')) uid: number,
    @Param('aid', new ParseIntParamPipe('文章id参数有误')) aid: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const article = await this.articleService.findOne(aid).catch(() => false)
    if (!article)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_ROLE,
        msg: '删除失败，未找到相关文章',
      })

    const delRes = await this.articleService.remove(aid)
    if (!delRes) res.resMsg = '删除文章失败!'
    if (!delRes) res.success = false
    else return '删除文章成功'
  }
}
