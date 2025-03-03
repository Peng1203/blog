import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Brackets, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindAllUserDto } from './dto'
import { Permission, User } from '@/common/entities'
import { ListResponse } from '@/common/interface'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { RoleService } from './../role/role.service'
import { formatDate } from '@/utils/date.util'
import { PasswordService } from '@/modules/auth/services'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly passwordService: PasswordService
  ) {}

  async create(data: CreateUserDto) {
    try {
      const { roleIds, password, ...userInfo } = data
      const roles = await Promise.all(roleIds.map(roleId => this.roleService.findOne(roleId)))
      const user = await this.userRepository.create({
        roles,
        password: await this.passwordService.hash(password),
        ...userInfo,
      })
      return await this.userRepository.save(user)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '创建用户失败',
      })
    }
  }

  /**
   * 查询全部用户
   * @date 2023/8/30 - 10:41:38
   * @author Peng
   *
   * @async
   * @param {FindAllUserDto} params
   * @returns {Promise<ListResponse<User>>}
   */
  async findAll(params: FindAllUserDto): Promise<ListResponse<User>> {
    try {
      const { page, pageSize, queryStr = '', column, order, roleId = '' } = params
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'role')
        .andWhere(
          new Brackets(qb => {
            qb.where('user.userName LIKE :queryStr', {
              queryStr: `%${queryStr}%`,
            }).orWhere('user.nickName LIKE :queryStr', {
              queryStr: `%${queryStr}%`,
            })
          })
        )
        .orderBy(`user.${column || 'id'}`, order || 'ASC')
        .skip((page - 1) * pageSize)
        .take(pageSize)
      roleId && queryBuilder.where('role.id = :roleId', { roleId })
      const [list, total] = await queryBuilder.getManyAndCount()

      // let [list, total] = await this.userRepository.findAndCount({
      //   where: [
      //     { userName: Like(`%${queryStr}%`) },
      //     { nickName: Like(`%${queryStr}%`) },
      //     // ...roleFilter
      //   ],
      //   skip: (page - 1) * pageSize,
      //   take: pageSize,
      //   order: { [column]: order },
      //   relations: ['roles'],
      // });

      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询用户列表失败',
      })
    }
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      const user = await this.findOneById(id)
      const { roleIds, ...userInfo } = data

      // 角色ID转换为 角色实例
      const roles = roleIds?.length ? await Promise.all(roleIds.map(roleId => this.roleService.findOne(roleId))) : []

      for (const key in userInfo) {
        user[key] = userInfo[key]
      }

      roleIds?.length && (user.roles = roles)

      // 更新多对多表的数据需要使用 save方法 save 方法无法触发 自动更新日期字段
      user.updateTime = formatDate()

      return await this.userRepository.save(user)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新用户失败',
      })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.userRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除用户失败',
      })
    }
  }

  /**
   * 通过用户名密码查询
   * @date 2023/8/30 - 16:36:06
   * @author Peng
   *
   * @async
   * @param {string} userName
   * @param {string} password
   * @returns {Promise<User | null>}
   */
  async findOneByUserNameAndPwd(userName: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.userName = :userName', { userName })
        .andWhere('user.password = :password', { password })
        .leftJoinAndSelect('user.roles', 'roles')
        // .leftJoinAndSelect('roles.menus', 'menus')
        // .leftJoinAndSelect('roles.permissions', 'permissions')
        .getOne()
      // const user = await this.userRepository.findOne({
      //   where: { userName, password },
      //   relations: ['roles'],
      // });
      if (user) return user
      throw new UnauthorizedException({
        code: ApiResponseCodeEnum.UNAUTHORIZED_UNAME_OR_PWD_NOMATCH,
        msg: '用户名或密码错误',
      })
    } catch (e) {
      this.handleFindOneError(e)
    }
  }

  /**
   * 通过 id和 用户名查询用户信息
   * @date 2023/9/3 - 16:04:17
   * @author Peng
   *
   * @async
   * @param {number} id
   * @param {string} userName
   * @returns {*}
   */
  async findOneByUserIdAndUserName(id: number, userName: string): Promise<User> {
    try {
      // const user = await this.userRepository.findOne({
      //   where: { id, userName },
      //   relations: ['roles'],
      // });
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .where('user.userName = :userName', { userName })
        .leftJoinAndSelect('user.roles', 'roles')
        // .leftJoinAndSelect('roles.menus', 'menus')
        .leftJoinAndSelect('roles.permissions', 'permissions')
        .getOne()
      if (user) return user
      else this.handleFindOneNotFoundError()
    } catch (e) {
      this.handleFindOneError(e)
    }
  }

  /** 通过 id 查询用户 */
  async findOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } })
      if (user) return user
      else this.handleFindOneNotFoundError()
    } catch (e) {
      this.handleFindOneError(e)
    }
  }

  /** 通过 用户名 查询用户 */
  async findOneByUserName(userName: string) {
    try {
      const user = await this.userRepository.findOne({ where: { userName } })
      if (user) return user
      else this.handleFindOneNotFoundError()
    } catch (e) {
      this.handleFindOneError(e)
    }
  }

  /** 通过 用户名 查询登录用户 */
  async findLoginUserByUserName(userName: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.userName = :userName', { userName })
        .leftJoinAndSelect('user.roles', 'roles')
        .addSelect('user.password')
        .getOne()
      if (user) return user
      else this.handleFindOneNotFoundError()
    } catch (e) {
      this.handleFindOneError(e)
    }
  }

  /**
   * 处理查询单个用户抛出的错误
   * @date 2023/9/8 - 11:31:22
   * @author Peng
   *
   * @param {*} e
   */
  handleFindOneError(e) {
    if (e instanceof NotFoundException) throw e
    else if (e instanceof UnauthorizedException) throw e
    else
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '查询用户失败',
      })
  }

  /**
   * 处理查询未找到错误
   * @date 2023/9/8 - 14:51:11
   * @author Peng
   *
   * @param {?*} [e]
   */
  handleFindOneNotFoundError(e?) {
    if (e instanceof NotFoundException) throw e
    throw new NotFoundException({ code: ApiResponseCodeEnum.NOTFOUND_USER })
  }

  async handleBatchRemove(ids: number[]): Promise<number> {
    try {
      return (await this.userRepository.delete(ids)).affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_DELETE,
        e,
        msg: '批量删除操作失败',
      })
    }
  }

  /**
   * 获取用户菜单
   */
  async findUserMenus(id: number) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('roles.menus', 'menus')
        .getOne()
      return this.handleUserMenus(user)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '获取用户菜单失败',
      })
    }
  }

  private handleUserMenus({ roles }: User) {
    // 多维数组菜单处理为一维菜单数组
    const menus = [].concat(...roles.map(role => role.menus))

    // 菜单去重
    const uniqueMap = new Map()
    return menus.reduce((result, menu) => {
      if (!uniqueMap.has(menu.id)) {
        uniqueMap.set(menu.id, true)
        result.push(menu)
      }
      return result
    }, [])
  }

  /**
   * 获取用户权限标识
   */
  async findUserPermissions(id: number) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('roles.permissions', 'permissions')
        .getOne()

      return this.handleUserPermissions(user)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '获取用户权限标识失败',
      })
    }
  }

  private handleUserPermissions({ roles }: User) {
    const permissions = [].concat(...roles.map(role => role.permissions))

    const uniqueMap = new Map()
    return permissions.reduce((result, permission: Permission) => {
      if (!uniqueMap.has(permission.id)) {
        uniqueMap.set(permission.id, true)
        result.push(permission.permissionCode)
      }
      return result
    }, [])
  }

  async findUserPassword(id: number) {
    try {
      return await this.userRepository.findOne({
        where: {
          id,
        },
        select: ['password'],
      })
    } catch (e) {
      this.handleFindOneError(e)
    }
  }

  async findUserArticleInfo(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['articles', 'tags', 'categorys'],
    })
  }
}
