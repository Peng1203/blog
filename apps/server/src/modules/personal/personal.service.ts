import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { UpdatePersonalDto } from './dto/update-personal.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Personal } from '@/common/entities'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal) private readonly personalRepository: Repository<Personal>,
    private readonly userService: UserService
  ) {}

  async findOne(userId: number) {
    try {
      let personalInfo = await this.personalRepository.findOne({ where: { userId } })
      if (!personalInfo) {
        await this.create(userId)
        personalInfo = await this.personalRepository.findOne({ where: { userId } })
      }
      const userInfo = await this.userService.findUserArticleInfo(userId)
      const { userName, nickName, userAvatar, email, articles, categorys, tags } = userInfo
      return {
        userName,
        nickName,
        userAvatar,
        email,
        articleCount: articles.length,
        categoryCount: categorys.length,
        tagCount: tags.length,
        ...personalInfo,
      }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '获取用户个人信息失败',
      })
    }
  }

  private async create(userId: number) {
    const personal = await this.personalRepository.create({ userId })
    await this.personalRepository.save(personal)
    return personal
  }

  async update(userId: number, data: UpdatePersonalDto) {
    try {
      const updateRes = await this.personalRepository.update({ userId }, data)
      return !!updateRes.affected
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '更新用户个人信息失败',
      })
    }
  }

  async addUV(userId: number) {
    const personal = await this.personalRepository.findOne({ where: { userId } })
    if (!personal) throw new NotFoundException({ code: ApiResponseCodeEnum.NOTFOUND_USER })
    personal.uv += 1
    await this.personalRepository.save(personal)
    return 'ok'
  }

  async addPV(userId: number) {
    const personal = await this.personalRepository.findOne({ where: { userId } })
    if (!personal) throw new NotFoundException({ code: ApiResponseCodeEnum.NOTFOUND_USER })
    personal.pv += 1
    await this.personalRepository.save(personal)
    return 'ok'
  }
}
