import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { SensitiveWordsService } from '@/common/service'
import { Comment } from '@/common/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { IpService } from '@/shared/ip/ip.service'
import { Details } from 'express-useragent'
import { pickBy } from 'lodash'
import { ListResponse } from '@/common/interface'
import { FindAllCommentDto } from './dto/findAll-comment.dto'
import { ApiResponseCodeEnum, CommentType, BolEnum } from '@/helper/enums'
import { FindCommentByTargetDto } from './dto/findTarget-comment.dto'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    private readonly sensitiveWordsService: SensitiveWordsService,
    private readonly ipService: IpService
  ) {}

  async create(data: CreateCommentDto, userAgentInfo: Details, ip: string): Promise<Comment> {
    // 判断发言是否为敏感发言
    const { text } = this.sensitiveWordsService.getMint().filter(data.content, { replace: true })
    data.content = text

    // 当输入的为qq邮箱 自动获取头像 前端实现

    // 解析ip 设置归属地
    const ipInfo = this.ipService.resolveIp(ip)

    // 解析UA获取设备信息
    const aboutDeviceInfo = pickBy(userAgentInfo, val => val === true)
    const deviceInfo = {} as any
    for (const key in aboutDeviceInfo) {
      if (key === 'isAuthoritative') continue
      deviceInfo[key.replace('is', '')] = aboutDeviceInfo[key]
    }
    deviceInfo.version = userAgentInfo.version

    const comment = this.commentRepository.create({
      ...data,
      ip,
      userAgent: userAgentInfo.source,
      location: JSON.stringify(ipInfo),
      device: JSON.stringify(deviceInfo),
    })
    return await this.commentRepository.save(comment)
  }

  async findAll(params: FindAllCommentDto): Promise<ListResponse<Comment>> {
    try {
      const { page, pageSize, queryStr = '', column, order, targetId, type } = params
      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        // .andWhere(
        //   new Brackets(qb => {
        //     qb.where('comment.parentId = :parentId', {
        //       parentId: 0,
        //     }).orWhere('comment.parentId = :parentId', {
        //       parentId: null,
        //     }) // 处理 parentId 为 NULL 或 0
        //   })
        // )
        .andWhere(
          new Brackets(qb => {
            qb.where('comment.content LIKE :queryStr', {
              queryStr: `%${queryStr}%`,
            }).orWhere('comment.name LIKE :queryStr', {
              queryStr: `%${queryStr}%`,
            })
          })
        )
      if (targetId) {
        queryBuilder.andWhere('comment.targetId = :targetId', { targetId })
      }
      if (type) {
        queryBuilder.andWhere('comment.type = :type', { type })
      }
      queryBuilder
        .orderBy(`comment.${column || 'id'}`, order || 'ASC')
        .skip((page - 1) * pageSize)
        .take(pageSize)
      const [list, total] = await queryBuilder.getManyAndCount()

      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询评论列表失败',
      })
    }
  }

  async findByTarget(
    type: CommentType,
    targetId: number,
    params: FindCommentByTargetDto
  ): Promise<ListResponse<Comment>> {
    try {
      const { page, pageSize } = params
      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .andWhere('comment.targetId = :targetId', { targetId })
        .andWhere('comment.type = :type', { type })
        .andWhere('comment.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere(new Brackets(qb => qb.where('comment.parentId IS NULL').orWhere('comment.parentId = 0')))
        // .addSelect(
        //   subQuery =>
        //     subQuery.select('COUNT(*)', 'replyCount').from(Comment, 'reply').where('reply.parentId = comment.id'),
        //   'replyCount' // 添加子查询统计回复数量
        // )
        .orderBy('comment.isTop', 'DESC')
        .addOrderBy('comment.likes', 'DESC')
        .skip((page - 1) * pageSize)
        .take(pageSize)
      const [list, total] = await queryBuilder.getManyAndCount()

      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询评论列表失败',
      })
    }
  }

  async findByTargetReply(
    type: CommentType,
    targetId: number,
    params: FindCommentByTargetDto,
    parentId: number
  ): Promise<ListResponse<Comment>> {
    try {
      const { page, pageSize } = params
      const queryBuilder = this.commentRepository
        .createQueryBuilder('comment')
        .andWhere('comment.targetId = :targetId', { targetId })
        .andWhere('comment.type = :type', { type })
        .andWhere('comment.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('comment.parentId = :parentId', { parentId })
        .addOrderBy('comment.likes', 'DESC')
        .skip((page - 1) * pageSize)
        .take(pageSize)
      const [list, total] = await queryBuilder.getManyAndCount()

      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询评论列表失败',
      })
    }
  }

  async likeComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } })
    if (!comment) throw new NotFoundException('评论不存在')

    comment.likes = (comment.likes || 0) + 1
    await this.commentRepository.save(comment)
    return '操作成功'
  }

  async unlikeComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } })
    if (!comment) throw new NotFoundException('评论不存在')

    if (comment.likes <= 0) return '点赞不能小于0'
    comment.likes -= 1
    await this.commentRepository.save(comment)
    return '操作成功'
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`
  }

  remove(id: number) {
    return `This action removes a #${id} comment`
  }
}
