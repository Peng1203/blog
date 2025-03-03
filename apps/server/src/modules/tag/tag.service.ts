import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateTagDto, UpdateTagDto, FindAllTagDto } from './dto'
import { Tag } from '@/common/entities'
import { Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { formatDate } from '@/utils/date.util'
import { UserService } from '../user/user.service'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly userService: UserService
  ) {}

  async create(data: CreateTagDto) {
    try {
      const { userId, ...args } = data
      const hasTag = await this.tagRepository.findOneBy({ user: { id: userId }, tagName: args.tagName })
      if (hasTag) throw new ConflictException('该标签已存在')

      const user = await this.userService.findOneById(userId)
      // 判断创建用户是否创建过当前标签
      const tag = await this.tagRepository.create({ user, ...args })
      return await this.tagRepository.save(tag)
    } catch (e) {
      if (e instanceof ConflictException) throw e
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '添加标签失败',
      })
    }
  }

  async findAll(query: FindAllTagDto) {
    try {
      const { page, pageSize, queryStr = '', column, order, userId } = query
      const [list, total] = await this.tagRepository.findAndCount({
        where: { tagName: Like(`%${queryStr}%`), user: { id: userId ? userId : undefined } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'id']: order || 'ASC' },
        relations: ['articles', 'user'],
      })
      return {
        list: list.map(({ user, articles, ...args }) => ({
          ...args,
          articles: articles.length,
          userId: user?.id || null,
          userName: user?.userName || null,
        })),
        total,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签列表失败!',
      })
    }
  }

  async findAllByUser(uid: number) {
    try {
      const [list, total] = await this.tagRepository.findAndCount({
        where: {
          user: {
            id: uid,
          },
        },
        relations: ['articles'],
      })
      return {
        list: list.map(item => ({ ...item, articles: item.articles.length })),
        total,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签列表失败!',
      })
    }
  }

  async findOne(id: number): Promise<Tag> {
    try {
      return await this.tagRepository.findOne({ where: { id } })
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询标签失败',
      })
    }
  }

  async update(id: number, data: UpdateTagDto) {
    try {
      const tag = await this.findOne(id)

      for (const key in data) {
        tag[key] = data[key]
      }

      tag.updateTime = formatDate()
      return await this.tagRepository.save(tag)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新标签失败',
      })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.tagRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除标签失败',
      })
    }
  }

  async removes(ids: number[]) {
    try {
      return await this.tagRepository.delete(ids)
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除标签失败',
      })
    }
  }
}
