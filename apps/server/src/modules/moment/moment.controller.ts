import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { MomentService } from './moment.service'
import { CreateMomentDto, UpdateMomentDto, FindAllMomentDto, FindUserMomentDto } from './dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IdentityGuard } from '@/common/guards'
import { Public } from '@/common/decorators'
import { ParseIntParamPipe } from '@/common/pipe'
import { UserService } from '../user/user.service'

@ApiTags('Moment')
@ApiBearerAuth()
@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService, private readonly userService: UserService) {}

  @Post()
  @UseGuards(IdentityGuard)
  @ApiOperation({ summary: '发布动态' })
  create(@Body() data: CreateMomentDto) {
    return this.momentService.create(data)
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取动态列表' })
  findAll(@Query() params: FindAllMomentDto) {
    return this.momentService.findAll(params)
  }

  @Public()
  @Get('user/:uid/moments')
  @ApiOperation({ summary: '获取用户动态列表' })
  async findByUser(
    @Param('uid', new ParseIntParamPipe('用户id参数有误')) uid: number,

    @Query() params: FindUserMomentDto
  ) {
    await this.userService.findOneById(uid)
    return this.momentService.findByUser(uid, params)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.momentService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMomentDto: UpdateMomentDto) {
    return this.momentService.update(+id, updateMomentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentService.remove(+id)
  }

  @Public()
  @Post(':id/like')
  @ApiOperation({ summary: '点赞动态' })
  like(@Param('id', new ParseIntParamPipe('动态id参数有误')) id: number) {
    return this.momentService.like(id)
  }

  @Public()
  @Delete(':id/like')
  @ApiOperation({ summary: '取消点赞动态' })
  unlike(@Param('id', new ParseIntParamPipe('动态id参数有误')) id: number) {
    return this.momentService.unlike(id)
  }
}
