import { Body, Controller, Delete, Get, Param, Query, Res } from '@nestjs/common'
import { LoginAuditService } from './login-audit.service'
import { PermissionEnum } from '@/helper/enums'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ReqUser, RequirePermissions } from '@/common/decorators'
import { User } from '@/common/entities'
import { DeleteLoginAuditLogsDto, FindAllLoginAuditDto } from './dto'
import { ParseIntParamPipe } from '@/common/pipe'
import { Response } from 'express'

@ApiTags('Log')
@ApiBearerAuth()
@Controller('login/audit')
export class LoginAuditController {
  constructor(private readonly loginAuditService: LoginAuditService) {}

  @Get()
  @RequirePermissions(PermissionEnum.GET_LOGIN_LOG)
  @ApiOperation({ summary: '查询登录日志' })
  findAll(@Query() query: FindAllLoginAuditDto, @ReqUser() user: User) {
    return this.loginAuditService.findAll(query, user.id)
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.DELETE_LOGIN_LOG)
  @ApiOperation({ summary: '删除登录日志' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const delRes = await this.loginAuditService.remove(id)
    if (!delRes) res.resMsg = '删除登录日志失败!'
    if (!delRes) res.success = false
    else return '删除登录日志成功'
  }

  @Delete()
  @RequirePermissions(PermissionEnum.DELETE_LOGIN_LOG)
  @ApiOperation({ summary: '批量删除登录日志' })
  async batchRemove(@Body() { ids }: DeleteLoginAuditLogsDto, @Res({ passthrough: true }) res: Response) {
    const delRes = await this.loginAuditService.removes(ids)
    if (!delRes) res.resMsg = '批量删除登录日志失败!'
    if (!delRes) res.success = false
    else return `成功删除 ${delRes.affected || 0} 条记录`
  }
}
