import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto, UpdateCategoryDto, FindAllCategoryDto } from './dto'
import { Category } from '@/common/entities'
import { Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { formatDate } from '@/utils/date.util'
import { UserService } from '../user/user.service'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly userService: UserService
  ) {}

  async create(data: CreateCategoryDto) {
    const { userId, ...args } = data
    const hasTag = await this.categoryRepository.findOneBy({ user: { id: userId }, categoryName: args.categoryName })
    if (hasTag) throw new ConflictException('该分类已存在')
    const user = await this.userService.findOneById(userId)
    const category = await this.categoryRepository.create({ user, ...args })
    return await this.categoryRepository.save(category)
  }

  async findAll(query: FindAllCategoryDto) {
    try {
      const { page, pageSize, queryStr = '', column, order, userId } = query
      const [list, total] = await this.categoryRepository.findAndCount({
        where: { categoryName: Like(`%${queryStr}%`), user: { id: userId ? userId : undefined } },
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
        msg: '查询分类列表失败!',
      })
    }
  }

  async findAllByUser(uid: number) {
    try {
      const [list, total] = await this.categoryRepository.findAndCount({
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
        msg: '查询用户分类列表失败!',
      })
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const findRes = await this.categoryRepository.findOne({ where: { id } })
      if (!findRes) throw new NotFoundException()
      return findRes
    } catch (e) {
      if (e instanceof NotFoundException)
        throw new NotFoundException({
          code: ApiResponseCodeEnum.NOTFOUND_ROLE,
          msg: '查询失败，未找到相关分类',
        })
      else
        throw new InternalServerErrorException({
          e,
          code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
          msg: '查询分类失败',
        })
    }
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id)

      for (const key in data) {
        category[key] = data[key]
      }

      category.updateTime = formatDate()
      return await this.categoryRepository.save(category)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新分类失败',
      })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.categoryRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除分类失败',
      })
    }
  }

  async removes(ids: number[]) {
    try {
      return await this.categoryRepository.delete(ids)
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除分类失败',
      })
    }
  }
}
