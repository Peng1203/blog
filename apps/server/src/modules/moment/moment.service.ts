import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateMomentDto, UpdateMomentDto, FindAllMomentDto, FindUserMomentDto } from './dto'
import { Moment } from '@/common/entities'
import { Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseCodeEnum, MomentStatusEnum } from '@/helper/enums'
import { UserService } from '../user/user.service'

@Injectable()
export class MomentService {
  constructor(
    @InjectRepository(Moment) private readonly momentRepository: Repository<Moment>,
    private readonly userService: UserService
  ) {}
  async create(data: CreateMomentDto) {
    try {
      const { userId, ...args } = data
      const user = await this.userService.findOneById(userId)
      const moment = await this.momentRepository.create({ user, ...args })
      return await this.momentRepository.save(moment)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '发布动态失败',
      })
    }
  }

  async findAll(query: FindAllMomentDto) {
    try {
      const { page, pageSize, queryStr = '', column, order } = query
      const [list, total] = await this.momentRepository.findAndCount({
        where: [{ content: Like(`%${queryStr}%`) }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'createTime']: order || 'ASC' },
        relations: ['user'],
      })
      return {
        list,
        total,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询动态列表失败!',
      })
    }
  }

  async findByUser(userId: number, query: FindUserMomentDto) {
    try {
      const { page, pageSize, queryStr = '' } = query

      const [list, total] = await this.momentRepository.findAndCount({
        where: { user: { id: userId }, content: Like(`%${queryStr}%`), status: MomentStatusEnum.PUBLIC },
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createTime: 'DESC' },
        // relations: ['user'],
      })

      return {
        list,
        total,
      }
    } catch (e) {
      console.log('e ------', e)
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询用户动态列表失败!',
      })
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} moment`
  }

  update(id: number, updateMomentDto: UpdateMomentDto) {
    return `This action updates a #${id} moment`
  }

  remove(id: number) {
    return `This action removes a #${id} moment`
  }

  async like(id: number) {
    try {
      const moment = await this.momentRepository.findOne({ where: { id } })
      if (!moment) {
        throw new NotFoundException({
          code: ApiResponseCodeEnum.NOTFOUND,
          msg: '动态不存在',
        })
      }
      moment.likes += 1

      await this.momentRepository.save(moment)
      return '点赞成功'
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '点赞失败',
      })
    }
  }

  async unlike(id: number) {
    try {
      const moment = await this.momentRepository.findOne({ where: { id } })
      if (!moment) {
        throw new NotFoundException({
          code: ApiResponseCodeEnum.NOTFOUND,
          msg: '动态不存在',
        })
      }
      if (moment.likes > 0) {
        moment.likes -= 1
      }
      await this.momentRepository.save(moment)
      return '操作成功'
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '取消点赞失败',
      })
    }
  }
}
