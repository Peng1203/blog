import { RouteRecordRaw } from 'vue-router'
import { allDynamicRoutes } from './dynamicRoutes'
import { router, formatFlatteningRoutes } from './index'
import { Local } from '@/utils/storage'
import { useRoutesList } from '@/stores/routesList'
import pinia from '@/stores/index'
import { useUserInfo } from '@/stores/userInfo'
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes'
import { NextLoading } from '@/utils/loading'
import { MenuData } from '@/views/auth/menu'
import { notFoundAndNoPower } from './route'

/**
 * 处理 登录用户的路由表
 * 该方法会在登录成功 和 页面刷新时执行
 * @author Peng
 * @date 2023-03-18
 * @returns {any}
 */

const storesRoutesList = useRoutesList(pinia)
const storesTagsView = useTagsViewRoutes(pinia)
const allRouterRules = formatFlatteningRoutes(allDynamicRoutes[0].children)

export async function handleUserAuthRouters(): Promise<any> {
  if (window.nextLoading === undefined) NextLoading.start()
  const { userInfos, menus } = useUserInfo()

  const { id, userName } = userInfos

  // 当登录 用户为 admin 用户 不进行菜单处理直接添加全部权限路由
  if (id === 1 && userName === 'admin') {
    // 将全部权限路由添加到路由规则中
    await allDynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route))
    // 设置
    await storesRoutesList.setRoutesList(allDynamicRoutes[0].children as any)
    await storesTagsView.setTagsViewRoutes(allRouterRules)

    // 返回第一个跳转后第一个展示的菜单展示
    NextLoading.done()
    notFoundAndNoPower.forEach((route: any) => router.addRoute(route))
    return (allDynamicRoutes[0].children as any)[0].name
  } else {
    return generateUserMenu(menus)
  }
}

async function generateAdminMenu() {}

/**
 * 处理非 admin 用户菜单
 */
async function generateUserMenu(menus: MenuData[]): Promise<string> {
  if (window.nextLoading === undefined) NextLoading.start()
  // 当角色没有菜单时直接返回
  if (!menus.length) return ''

  const allMenuRules = allDynamicRoutes[0].children

  // 过滤出持有的一级菜单
  const handleAfterMenus: any = allMenuRules?.filter(m => menus.find((item: MenuData) => item.menuUri === m.name))

  // 递归处理 持有的菜单 设置的配置项
  handleChildrenMenu(handleAfterMenus, menus)

  const newRule: RouteRecordRaw[] = allDynamicRoutes
  newRule[0].children = handleAfterMenus
  await newRule.forEach((route: RouteRecordRaw) => router.addRoute(route))
  // 设置
  await storesRoutesList.setRoutesList(newRule[0].children as any)
  await storesTagsView.setTagsViewRoutes(allRouterRules)

  // 返回第一个跳转后第一个展示的菜单展示
  const toRouter = (newRule[0] as any).children.find((rule: RouteRecordRaw) => rule.meta && !rule.meta.isHide)

  NextLoading.done()
  return toRouter!.name as string
}

// 菜单规则
function handleChildrenMenu(children: RouteRecordRaw[], menus: MenuData[]) {
  // 需要删除元素的索引
  let dels: number[] = []

  children.forEach((item: RouteRecordRaw, i) => {
    const findRes = menus.find((menu: MenuData) => menu.menuUri === item.name)

    if (findRes) {
      const { menuIcon, menuName, menuPath, isHidden, isKeepalive } = findRes

      item.path = menuPath

      // if (menuRedirect) item.redirect = { name: menuRedirect };

      if (item.meta) {
        item.meta.icon = menuIcon
        item.meta.title = menuName
        item.meta.isKeepAlive = !!isKeepalive
        item.meta.isHide = !!isHidden
        // item.meta. =
        // item.meta. =
      }
    } else {
      dels.push(i)
    }

    // 当存在其他子节点是继续递归处理
    if (item.children && item.children.length) handleChildrenMenu(item.children, menus)
  })

  // 删除未持有的菜单
  // 重大到小删除元素 防止影响其他数据索引
  dels.sort((a, b) => b - a)

  dels.forEach(i => children.splice(i, 1))
}
