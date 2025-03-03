import { Controller, Get, Body, Patch, Param, UseGuards, Res } from '@nestjs/common'
import { PersonalService } from './personal.service'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { Public } from '@/common/decorators'
import { ParseIntParamPipe } from '@/common/pipe'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { IdentityGuard } from '@/common/guards'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { Response } from 'express'

@ApiTags('User')
@ApiBearerAuth()
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService, private readonly userService: UserService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取用户个人信息' })
  async findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    await this.userService.findOneById(id)
    return this.personalService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(IdentityGuard)
  @ApiOperation({ summary: '更新用户个人信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdatePersonalDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.personalService.update(id, data)

    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新个人信息失败!') && (res.success = false)

    return updateRes ? '更新个人信息成功!' : '操作失败!'
  }

  @Public()
  @Patch('uv/:id')
  @ApiOperation({ summary: '更新用户访问量' })
  addUV(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.personalService.addUV(id)
  }

  @Public()
  @Patch('pv/:id')
  @ApiOperation({ summary: '更新页面访问量' })
  addPV(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.personalService.addPV(id)
  }
}
