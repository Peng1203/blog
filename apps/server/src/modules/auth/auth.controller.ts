import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RefreshTokenDto, UserLoginDto, UserLogoutDto } from './dto'
import { LocalAuthGuard } from './guards/local.auth.guard'
import { Request, Response } from 'express'
import { Public, ReqUser, UserAgent } from '@/common/decorators'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { ConfigService } from '@nestjs/config'
import { SessionInfo } from 'express-session'
import { CaptchaAggregation } from './decorator'
import { Details } from 'express-useragent'
import { User } from '@/common/entities'
import { ParseIntParamPipe } from '@/common/pipe'
import { UserService } from '../user/user.service'
import { LoginRecordInterceptor } from './interceptor'
import { LoginAuditService } from '../log/login-audit/login-audit.service'
import { formatDate } from '@/utils/date.util'

@ApiTags('Auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly loginAuditService: LoginAuditService
  ) {}

  @Get('login/captcha')
  @CaptchaAggregation()
  getCaptcha(@Session() session: SessionInfo, @UserAgent() ua: Details) {
    const isPhone = ['Android', 'iPhone'].includes(ua.platform)
    const { text, data } = this.authService.generateCaptcha(isPhone)
    session.captcha = text
    const CAPTCHA_EXPIRES = Number(this.configService.get<string>('CAPTCHA_EXPIRES'))

    // 方案1 设置一个 setTimeout 到时自动删除 session对象的验证码字段
    // 方案2 在生成验证码时记录一个过期时间戳 登录时进行时间戳对比
    // 设置验证码的过期时间戳
    session.expirationTimestamp = Date.now() + CAPTCHA_EXPIRES
    return data
  }

  @Get('login/v2/captcha')
  @CaptchaAggregation()
  getV2Captcha(@Session() session: SessionInfo, @UserAgent() ua: Details) {
    const isPhone = ['Android', 'iPhone'].includes(ua.platform)
    const { text, data } = this.authService.generateV2Captcha(isPhone)
    session.captcha = text
    const CAPTCHA_EXPIRES = Number(this.configService.get<string>('CAPTCHA_EXPIRES'))
    session.expirationTimestamp = Date.now() + CAPTCHA_EXPIRES
    return data
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LoginRecordInterceptor)
  @ApiOperation({ summary: '登录' })
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() data: UserLoginDto,
    @Session() session: SessionInfo
  ) {
    const user = req.user
    if (!user.userEnabled)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER_DISABLED,
        msg: '账号已被禁用!请联系管理员',
      })

    const access_token = await this.authService.generateAccessToken(user.id, user.userName)
    const refresh_token = await this.authService.generateRefreshToken(user.id)
    const clientInfo = await this.authService.getClientInfo(req)

    // redis 设置token
    await this.authService.setTokenToRedis(this.authService.redisTokenKeyStr(user.id, user.userName), access_token)

    // 登录成功 删除 session 设置的验证码和 过期日期
    delete session.captcha
    delete session.expirationTimestamp

    const ip = this.loginAuditService.getClientIp(req)
    const location = this.loginAuditService.getLocationInfo(ip)

    res.resMsg = '登录成功'
    user.id
    user.userName
    return {
      user,
      clientInfo,
      ip,
      location,
      loginTime: formatDate(),
      tokens: { access_token, refresh_token },
    }
  }

  @Public()
  @Patch('auth/refreshAccessToekn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新accessToken' })
  async refreshAccessToken(@Body() data: RefreshTokenDto) {
    const payload = await this.authService.verifyRefresToken(data.refresh_token)
    const user = await this.authService.findUserById(payload.sub)
    if (!user.userEnabled)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER_DISABLED,
        msg: '账号已被禁用!请联系管理员',
      })

    const access_token = await this.authService.generateAccessToken(user.id, user.userName)
    const refresh_token = await this.authService.generateRefreshToken(user.id)

    // redis 设置token
    await this.authService.setTokenToRedis(this.authService.redisTokenKeyStr(user.id, user.userName), access_token)

    return {
      access_token,
      refresh_token,
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '退出登录' })
  async logout(@ReqUser() user: User, @Body() data: UserLogoutDto, @Res({ passthrough: true }) res: Response) {
    if (data.id !== user.id || data.userName !== user.userName)
      throw new ForbiddenException({
        code: ApiResponseCodeEnum.FORBIDDEN_USER,
        msg: '操作用户信息不匹配!',
      })

    // 清除Redis中的token
    this.authService.clearUserToken(data)

    res.apiResponseCode = ApiResponseCodeEnum.SUCCESS
    res.resMsg = '退出登录成功'
    return '操作成功'
  }

  @Get('auth/menus/:id')
  @ApiOperation({ summary: '获取用户菜单' })
  async userMenu(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.userService.findUserMenus(id)
  }

  @Public()
  @Get('auth/permissions/:id')
  @ApiOperation({ summary: '获取用户权限标识' })
  async userPermissions(@Param('id', new ParseIntParamPipe('id参数有误')) id: number) {
    return this.userService.findUserPermissions(id)
  }

  @Get('auth/userInfo')
  @ApiOperation({ summary: '根据 refresh_token 获取用户信息' })
  async getUserInfo(@ReqUser() user: User) {
    // const clientInfo = await this.authService.getClientInfo(req);
    return user
  }
}
