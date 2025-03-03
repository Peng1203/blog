import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { FindAllPermissionDto } from './dto'
import { Permission } from '@/common/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  async create(data: CreatePermissionDto) {
    try {
      const permission = await this.permissionRepository.create(data)
      return await this.permissionRepository.save(permission)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '添加操作权限失败',
      })
    }
  }

  async findAll(params: FindAllPermissionDto) {
    try {
      const {  queryStr = '', column, order } = params

      const [list, total] = await this.permissionRepository.findAndCount({
        where: [
          { permissionName: Like(`%${queryStr}%`) },
          // { permissionCode: Like(`%${queryStr}%`) },
        ],
        order: { [column || 'id']: order || 'ASC' },
      })
      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询权限列表失败',
      })
    }
  }

  handlePermissionResponse(permissions: Permission[]) {
    const data = JSON.parse(JSON.stringify(permissions))
    return this.formatTree(data)
  }

  async findOne(id: number) {
    try {
      return await this.permissionRepository.findOne({ where: { id } })
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询权限信息失败',
      })
    }
  }

  async update(id: number, data: UpdatePermissionDto) {
    try {
      const updateRes = await this.permissionRepository.update(id, data)
      return !!updateRes.affected
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新权限信息失败!',
      })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.permissionRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除权限失败',
      })
    }
  }

  formatTree(ary: any[], parentId?: number) {
    return ary
      .filter(item =>
        // 如果没有父id（第一次递归的时候）将所有父级查询出来
        parentId === undefined ? item.parentId === 0 : item.parentId === parentId
      )
      .map(item => {
        // 通过父节点ID查询所有子节点
        item.children = this.formatTree(ary, item.id)
        return item
      })
  }

  async permissionHasChildren(id: number): Promise<boolean> {
    try {
      const [list] = await this.permissionRepository.findAndCount()
      return list.some(menu => menu.parentId === id)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询权限信息失败',
      })
    }
  }
}
