import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { BatchCreateMenuDto, CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Menu } from '@/common/entities'
import { Like, Repository } from 'typeorm'
import { ApiResponseCodeEnum } from '@/helper/enums'
import { FindAllMenuDto } from './dto'
import { BatchAddMenuItemInstance, MenuItem } from './types'

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menu) private readonly menuRepository: Repository<Menu>) {}

  async create(data: CreateMenuDto) {
    try {
      const menu = await this.menuRepository.create(data)
      return await this.menuRepository.save(menu)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '添加菜单失败',
      })
    }
  }

  async findAll(query: FindAllMenuDto) {
    try {
      const { queryStr = '', column, order } = query

      const [list, total] = await this.menuRepository.findAndCount({
        where: [{ menuName: Like(`%${queryStr}%`) }, { menuPath: Like(`%${queryStr}%`) }],
        order: { [column || 'id']: order || 'ASC' },
      })
      return { list, total }
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询菜单列表失败!',
      })
    }
  }

  handleMenusResponse(menus: Menu[]): MenuItem[] {
    const menuData: Menu[] = JSON.parse(JSON.stringify(menus))
    const formatMenu = this.formatTreeMenu(menuData)
    this.handleOrderNumMenuData(formatMenu)
    return formatMenu
  }

  formatTreeMenu(ary: MenuItem[], parentId?: number) {
    return ary
      .filter(item =>
        // 如果没有父id（第一次递归的时候）将所有父级查询出来
        parentId === undefined ? item.parentId === 0 : item.parentId === parentId
      )
      .map(item => {
        // 通过父节点ID查询所有子节点
        item.children = this.formatTreeMenu(ary, item.id)
        return item
      })
  }

  private handleOrderNumMenuData(menus: MenuItem[]) {
    menus.sort((a, b) => a.orderNum - b.orderNum)
    menus.forEach(menu => {
      if (!menu.children || !menu.children.length) return
      this.handleOrderNumMenuData(menu.children)
    })
  }

  async findOne(id: number) {
    try {
      return await this.menuRepository.findOne({ where: { id } })
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询菜单失败',
      })
    }
  }

  async update(id: number, data: UpdateMenuDto) {
    try {
      // const menu = await this.findOne(id);
      // for (const key in data) {
      //   menu[key] = data[key];
      // }
      // return await this.menuRepository.save(menu);

      const updateRes = await this.menuRepository.update(id, data)
      return !!updateRes.affected
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_UPDATE,
        msg: '更新菜单失败',
      })
    }
  }

  async remove(id: number) {
    try {
      const delResult = await this.menuRepository.delete(id)
      return !!delResult.affected
    } catch (e) {
      throw new InternalServerErrorException({
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        e,
        msg: '删除菜单失败',
      })
    }
  }

  /**
   * 判断当前菜单是否有子菜单
   */
  async menuHasChildren(id: number): Promise<boolean> {
    try {
      const [list] = await this.menuRepository.findAndCount()
      return list.some(menu => menu.parentId === id)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_FIND,
        msg: '查询菜单失败',
      })
    }
  }

  async batchInitMenu({ parentMenus, subMenus }: BatchCreateMenuDto) {
    try {
      // menuData.parentMenus.map();
      const parentData = await Promise.all(parentMenus.map(menu => this.findOrCreateParentMenu(menu)))

      // console.log('parentData ------', parentData);
      // 创建菜单实例
      const createdParentMenus = await this.menuRepository.create(parentData.filter(item => item !== null))
      // 写库
      await this.menuRepository.save(createdParentMenus)
      // 查询一创建的所有菜单数据
      const [findAllMenu] = await this.menuRepository.findAndCount()

      const subData = await Promise.all(subMenus.map(menu => this.findOrCreateSubMenu(menu, findAllMenu)))

      const createdSubMenus = await this.menuRepository.create(subData.filter(item => item !== null))
      // 写库
      await this.menuRepository.save(createdSubMenus)

      return createdParentMenus.length + createdSubMenus.length
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_SQL_CREATED,
        msg: '初始化菜单操作失败!',
      })
    }
  }

  // 查询并返回需要创建的父级菜单数据
  private async findOrCreateParentMenu(item: BatchAddMenuItemInstance) {
    try {
      const menu = await this.menuRepository.findOneBy({
        menuUri: item.menuUri,
      })
      if (menu) return null
      return { ...item, parentId: 0 }
    } catch (e) {
      throw e
    }
  }

  private async findOrCreateSubMenu({ parentUri, ...item }: BatchAddMenuItemInstance, allMenus: Menu[]) {
    try {
      const menu = await this.menuRepository.findOneBy({
        menuUri: item.menuUri,
      })
      if (menu) return null
      return {
        ...item,
        parentId: allMenus.find(menu => menu.menuUri === parentUri)?.id || 0,
      }
    } catch (e) {
      throw e
    }
  }
}
