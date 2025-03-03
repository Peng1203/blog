import { Controller, Get, Param, Delete, Query, Body, Res } from '@nestjs/common'
import { AuditService } from './audit.service'
import { DeleteAuditLogsDto, FindAllAuditDto } from './dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ReqUser } from '@/common/decorators'
import { User } from '@/common/entities'
import { ParseIntParamPipe } from '@/common/pipe'
import { Response } from 'express'
import { PermissionEnum } from '@/helper/enums'
import { RequirePermissions } from '@/common/decorators'

@ApiTags('Log')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions(PermissionEnum.GET_AUDIT_LOG)
  @ApiOperation({ summary: '查询审计' })
  findAll(@Query() query: FindAllAuditDto, @ReqUser() user: User) {
    return this.auditService.findAll(query, user.id)
  }

  @Delete(':id')
  @RequirePermissions(PermissionEnum.DELETE_AUDIT_LOG)
  @ApiOperation({ summary: '删除审计记录' })
  async remove(
    @Param('id', new ParseIntParamPipe('id参数有误')) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const delRes = await this.auditService.remove(id)
    if (!delRes) res.resMsg = '删除审计记录失败!'
    if (!delRes) res.success = false
    else return '删除审计记录成功'
  }

  @Delete()
  @RequirePermissions(PermissionEnum.DELETE_AUDIT_LOG)
  @ApiOperation({ summary: '批量删除审计记录' })
  async batchRemove(@Body() { ids }: DeleteAuditLogsDto, @Res({ passthrough: true }) res: Response) {
    const delRes = await this.auditService.removes(ids)
    if (!delRes) res.resMsg = '批量删除审计记录失败!'
    if (!delRes) res.success = false
    else return `成功删除 ${delRes.affected || 0} 条记录`
  }
}
