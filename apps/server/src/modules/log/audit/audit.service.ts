import { Injectable, InternalServerErrorException, Param } from '@nestjs/common'
import { StatusEnum, RequestMethodEnum, ApiResponseCodeEnum } from '@/helper/enums'
import { Response, Request } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { Audit } from '@/common/entities'
import { Repository } from 'typeorm'
import { FindAllAuditDto } from './dto'

@Injectable()
export class AuditService {
  // 无需记录内容的字段
  HIDEDK_EYS: string[] = ['summary', 'password', 'accessPassword', 'oldPassword', 'newPassword', 'refresh_token', 'ip']
  constructor(@InjectRepository(Audit) private readonly auditRepository: Repository<Audit>) {}

  async createAuditRecord(
    req: Request,
    res: Response,
    operationStatus: StatusEnum,
    responseTime?: number,
    errMessage?: string,
    statusCode?: number
  ) {
    try {
      const { method, originalUrl, useragent, query, body, path, ip } = req
      // const { statusCode } = res;

      // 隐藏 query/body 参数中的关键信息
      const [toBody, toQuery] = this.hideKeyInfoParams(body, query)

      if (originalUrl.includes('article')) this.HIDEDK_EYS.push('content')

      const clientIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
      const audit = new Audit()

      const saveIp = ((Array.isArray(clientIp) ? clientIp[0] : clientIp) || ip).replace('::ffff:', '')

      audit.method = RequestMethodEnum[method]
      // audit.router = originalUrl;
      audit.router = path
      audit.ip = saveIp === '::1' ? '127.0.0.1' : saveIp
      audit.userAgent = useragent.source
      audit.statusCode = statusCode || res.statusCode
      audit.responseTime = responseTime
      audit.requestQueryParams = JSON.stringify(toQuery)
      audit.requestBodyParams = JSON.stringify(toBody)
      audit.operationStatus = operationStatus
      errMessage && (audit.errMessage = errMessage)
      audit.description = ''
      audit.user = req.user

      const auditRecord = await this.auditRepository.create(audit)
      return await this.auditRepository.save(auditRecord)
    } catch (e) {
      console.log('审计记录创建失败 ------', e)
    }
  }

  private hideKeyInfoParams(body: any, query: any) {
    const hideInfo = (obj: any) => {
      Object.keys(obj).forEach(key => {
        if (this.HIDEDK_EYS.includes(key)) {
          obj[key] = '******'
        }
      })
    }

    hideInfo(body)
    hideInfo(query)

    return [body, query]
  }

  async findAll(params: FindAllAuditDto, queryUserId: number) {
    try {
      const { page, pageSize, queryStr = '', column, order, userId = 0, startTime, endTime } = params

      // const [list, total] = await this.auditRepository.findAndCount({
      //   where: [
      //     {
      //       user: userId as any,
      //     },
      //   ],
      //   skip: (page - 1) * pageSize,
      //   take: pageSize,
      //   order: { [column]: order },
      //   relations: ['user'],
      // });

      const queryBuilder = this.auditRepository
        .createQueryBuilder('audit')
        .leftJoinAndSelect('audit.user', 'user')
        // .select(['user.userName'])
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .orderBy(`audit.${column || 'createTime'}`, order || 'DESC')

      userId > 0 && queryBuilder.where('user.id = :userId', { userId })

      // -1 查询未知用户请求
      userId === -1 && queryBuilder.where('user.id IS NULL')

      startTime &&
        queryBuilder.andWhere('audit.createTime >= :startTime', {
          startTime,
        })
      endTime && queryBuilder.andWhere('audit.createTime <= :endTime', { endTime })

      const [list, total] = await queryBuilder.getManyAndCount()
      return {
        list: list.map(({ user, ip, ...args }) => ({
          ...args,
          ip,
          // ip: this.formatIPInfo(ip, queryUserId),
          userId: user?.id || null,
          userName: user?.userName || null,
        })),
        total,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询审计列表失败',
      })
    }
  }

  // 判断是否是 admin 用户 来展示 IP段信息
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
      const delResult = await this.auditRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除审计记录失败',
      })
    }
  }

  async removes(ids: number[]) {
    try {
      return await this.auditRepository.delete(ids)
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除审计记录失败',
      })
    }
  }
}
