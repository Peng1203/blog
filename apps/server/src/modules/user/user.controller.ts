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
  Put,
  UploadedFile,
  Req,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, DeleteUsersDto, FindAllUserDto, UpdatePasswordDto } from './dto'
import { UpdateUserDto } from './dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermissions, UploadImageAggregation } from '@/common/decorators'
import { ApiResponseCodeEnum, PermissionEnum } from '@/helper/enums'
import { ParseIntParamPipe } from '@/common/pipe'
import { Response, Request } from 'express'
import { ConfigService } from '@nestjs/config'
import path from 'path'
import { IdentityGuard } from '@/common/guards'
import { PasswordService } from '../auth/services'

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly passwordService: PasswordService
  ) {}

  @Post()
  @RequirePermissions(PermissionEnum.CREATE_USER)
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data)
  }

  // @Roles(RoleEnum.ADMINISTRATOR, RoleEnum.USER)
  @Get()
  @ApiOperation({ summary: '查询用户' })
  async findAll(@Query() query: FindAllUserDto) {
    const { list, total } = await this.userService.findAll(query)
    return { list, total }
  }

  @Get(':id')
  @ApiOperation({ summary: '通过ID查询用户' })
  findOne(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.userService.findOneById(id)
  }

  @Patch(':id')
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  @ApiOperation({ summary: '更新用户信息' })
  async update(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.userService.update(id, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新用户失败!') && (res.success = false)

    return updateRes || '操作失败!'
  }

  @Put(':id')
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  @ApiOperation({ summary: '批量更新用户信息' })
  async updateBatch(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Body() data: UpdateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const updateRes = await this.userService.update(id, data)
    updateRes
      ? (res.apiResponseCode = ApiResponseCodeEnum.UPDATE)
      : (res.resMsg = '更新用户失败!') && (res.success = false)

    return updateRes || '操作失败!'
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.DELETE_USER)
  @ApiOperation({ summary: '通过ID删除用户' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.findOneById(id).catch(() => false)
    if (!user)
      throw new NotFoundException({
        code: ApiResponseCodeEnum.NOTFOUND_USER,
        msg: '删除失败，未找到相关用户信息',
      })
    const delResult = await this.userService.remove(id)
    if (!delResult) res.resMsg = '删除用户失败!'
    if (!delResult) res.success = false
    else return '删除用户成功'
  }

  @Delete()
  @RequirePermissions(PermissionEnum.DELETE_USER)
  @ApiOperation({ summary: '通过ID批量删除用户' })
  async removes(@Body() data: DeleteUsersDto) {
    const delCount = await this.userService.handleBatchRemove(data.ids)
    return `成功删除${delCount}个用户`
  }

  @Post('avater')
  @UploadImageAggregation()
  @ApiOperation({ summary: '上传头像' })
  async uploadAvater(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    const RESOURCE_SERVE = this.configService.get<string>('STATIC_RESOURCE_SERVE')
    const fullPath = `${RESOURCE_SERVE}/${path.basename(file.path)}`

    res.resMsg = '头像上传成功!'
    return fullPath
  }

  @Post(':id/avater')
  @UploadImageAggregation()
  @ApiOperation({ summary: '更新用户头像' })
  async updateUserAvater(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number
  ) {
    const RESOURCE_SERVE = this.configService.get<string>('STATIC_RESOURCE_SERVE')
    const fullPath = `${RESOURCE_SERVE}/${path.basename(file.path)}`

    await this.userService.update(id, { userAvatar: fullPath })

    res.resMsg = '头像更新成功!'
    return fullPath
  }

  @Put(':id/password')
  @UseGuards(IdentityGuard)
  @ApiOperation({ summary: '修改密码' })
  async changePassword(@Body() data: UpdatePasswordDto, @Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    /**
     *  1.校验输入的旧密码是否正确
     *  2.校验新旧密码是否一致
     *  3.更新用户密码
     */
    const { oldPassword, newPassword } = data
    const { password: userPwd } = await this.userService.findUserPassword(id)

    const pass = await this.passwordService.verify(oldPassword, userPwd)

    // prettier-ignore
    if (!pass) throw new UnauthorizedException({
      code: ApiResponseCodeEnum.UNAUTHORIZED_OLD_PWD,
      msg: '当前密码不正确',
    });

    // prettier-ignore
    if (oldPassword === newPassword) throw new BadRequestException({
      code: ApiResponseCodeEnum.BADREQUEST_OLD_NEW_PWD,
      msg: '新密码不能与旧密码相同',
    });

    const newHashPwd = await this.passwordService.hash(newPassword)

    await this.userService.update(id, { password: newHashPwd })
    return '密码修改成功'
  }

  @Patch(':id/password/reset')
  @UseGuards(IdentityGuard)
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    const user = await this.userService.findOneById(id)
    // prettier-ignore
    if (!user) throw new NotFoundException({
      code: ApiResponseCodeEnum.NOTFOUND_USER,
      msg: '操作失败，未找到相关用户信息',
    });
    const newPwd = await this.passwordService.reset()
    console.log('newPwd ------', newPwd)
    await this.userService.update(id, { password: newPwd })
    return '密码重置成功'
  }
}
