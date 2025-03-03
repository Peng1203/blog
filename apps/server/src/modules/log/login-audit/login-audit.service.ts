import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LoginAudit } from '@/common/entities'
import { Between, Repository } from 'typeorm'
import { Request } from 'express'
import { IpService } from '@/shared/ip/ip.service'
import { ApiResponseCodeEnum, LoginMethodEnum } from '@/helper/enums'
import { formatDate } from '@/utils/date.util'
import { FindAllLoginAuditDto } from './dto'

@Injectable()
export class LoginAuditService {
  constructor(
    @InjectRepository(LoginAudit)
    private readonly loginAuditRepository: Repository<LoginAudit>,
    private readonly ipService: IpService
  ) {}
  async createLoginRecord(
    req: Request,
    userInfo: { userId?: number; userName: string },
    options: {
      ip?: string
      location?: string
      loginStatus: number
      failureReason: string
      loginDuration: number
      loginMethod: LoginMethodEnum
      loginTime?: string | null
    }
  ) {
    const record = new LoginAudit()

    const { userId, userName } = userInfo
    const { ip, location, loginStatus, failureReason, loginDuration, loginMethod, loginTime } = options
    const ipAddr = ip || this.getClientIp(req)
    const { browser, version, userAgent, os, deviceTypes } = this.getClientInfo(req)

    record.userId = userId
    record.userName = userName
    record.ip = ipAddr
    record.device = this.getDeviceType(deviceTypes)
    record.location = location || this.getLocationInfo(ipAddr)
    record.loginStatus = loginStatus
    record.failureReason = failureReason
    record.userAgent = userAgent
    record.loginDuration = loginDuration
    record.loginMethod = loginMethod
    record.browser = `${browser} ${version}`
    record.os = deviceTypes.includes('Android') ? 'Android' : os
    record.loginTime = loginTime || formatDate()

    const loginRecord = await this.loginAuditRepository.create(record)
    return await this.loginAuditRepository.save(loginRecord)
  }

  getClientIp(req: Request) {
    const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
    const localIp = req.ip === '::1' ? '127.0.0.1' : req.ip
    return (Array.isArray(clientIp) ? clientIp[0] : clientIp || localIp).replace('::ffff:', '')
  }

  getLocationInfo(ip: string) {
    return JSON.stringify(this.ipService.resolveIp(ip))
  }

  getClientInfo(req: Request) {
    const { os, platform, browser, version, source, isAuthoritative, ...args } = req.useragent
    const deviceTypes: string[] = []
    for (const key in args) {
      if (!key.includes('is')) continue

      if (!args[key]) continue

      deviceTypes.push(key.replace('is', ''))
    }
    // return req.useragent;
    return {
      os,
      platform,
      browser,
      version,
      deviceTypes,
      authoritative: isAuthoritative,
      userAgent: source,
    }
  }

  getDeviceType(deviceTypes: string[]) {
    if (deviceTypes.includes('Desktop')) return 'PC'
    else if (deviceTypes.includes('Mobile')) return 'Mobile'
    else return 'Other'
  }

  async findAll(params: FindAllLoginAuditDto, queryUserId: number) {
    try {
      const { page, pageSize, queryStr = '', column, order, userId = 0, startTime, endTime } = params

      const filter: any = {}

      if (userId) filter.userId = userId

      if (startTime && endTime) filter.loginTime = Between(startTime, endTime)

      const [list, total] = await this.loginAuditRepository.findAndCount({
        where: [filter],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'loginTime']: order || 'DESC' },
      })

      return {
        list: list.map(({ ip, ...args }) => ({
          ...args,
          ip: this.formatIPInfo(ip, queryUserId),
        })),
        total,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询登录日志列表失败',
      })
    }
  }

  private formatIPInfo(ip: string, userId: number): string {
    if (userId === 1) return ip
    else {
      const ipParts = ip.split('.')
      if (ipParts.length !== 4) return ip
      else {
        ipParts[1] = '***'
        ipParts[2] = '***'
        return ipParts.join('.')
      }
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.loginAuditRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除登录日志失败',
      })
    }
  }

  async removes(ids: number[]) {
    try {
      return await this.loginAuditRepository.delete(ids)
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除登录日志失败',
      })
    }
  }
}
