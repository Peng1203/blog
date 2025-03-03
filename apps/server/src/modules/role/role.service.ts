import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from '@/common/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { FindAllRoleDto } from './dto'
import { ListResponse } from '@/common/interface'
import { PermissionService } from '@/modules/permission/permission.service'
import { MenuService } from '@/modules/menu/menu.service'
import { formatDate } from '@/utils/date.util'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
    private readonly menuService: MenuService
  ) {}

  async create(data: CreateRoleDto) {
    try {
      const { permissions: pIds, menus: menuIds, ...roleInfo } = data

      const permissions = await Promise.all(pIds.map(id => this.permissionService.findOne(id)))

      const menus = await Promise.all(menuIds.map(id => this.menuService.findOne(id)))

      const role = await this.roleRepository.create({
        permissions,
        menus,
        ...roleInfo,
      })
      return await this.roleRepository.save(role)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '创建角色失败',
      })
    }
  }

  async findAll(query: FindAllRoleDto): Promise<ListResponse<Role>> {
    try {
      const { page, pageSize, queryStr = '', column, order } = query
      const [list, total] = await this.roleRepository.findAndCount({
        where: [{ roleName: Like(`%${queryStr}%`) }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { [column || 'id']: order || 'ASC' },
        relations: ['menus', 'permissions'],
      })
      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询角色列表失败!',
      })
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      return await this.roleRepository.findOne({ where: { id } })
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询角色失败',
      })
    }
  }

  async update(id: number, data: UpdateRoleDto) {
    try {
      const role = await this.findOne(id)
      const { menus: menuIds, permissions: pIds, ...roleInfo } = data

      for (const key in roleInfo) {
        role[key] = roleInfo[key]
      }

      const menus = menuIds.length ? await Promise.all(menuIds.map(id => this.menuService.findOne(id))) : []

      const permissions = pIds.length ? await Promise.all(pIds.map(id => this.permissionService.findOne(id))) : []

      role.menus = menus
      role.permissions = permissions

      role.updateTime = formatDate()
      return await this.roleRepository.save(role)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新角色失败',
      })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.roleRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除角色失败',
      })
    }
  }
}
