import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '@/stores/index'
import { storeToRefs } from 'pinia'
import { useKeepALiveNames } from '@/stores/keepAliveNames'
import { useRoutesList } from '@/stores/routesList'
import { useThemeConfig } from '@/stores/themeConfig'
import { Local, Session } from '@/utils/storage'
import { staticRoutes, notFoundAndNoPower } from './route'
import { handleUserAuthRouters } from './handleAuthRouter'
import { useUserInfo } from '@/stores/userInfo'
import { LAST_VISITED_PAGE_PATH_STORAGE_KEY } from '@/utils/recordLastVisitedPage'
import { handleRefreshACToken } from '@/utils/refreshToken'

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */

// 读取 `/src/stores/themeConfig.ts` 是否开启后端控制路由配置
const storesThemeConfig = useThemeConfig(pinia)
const { themeConfig } = storeToRefs(storesThemeConfig)
const { isRequestRoutes } = themeConfig.value
/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  // base: '/your-sub-directory/',
  /**
   * 说明：
   * 1、notFoundAndNoPower 默认添加 404、401 界面，防止一直提示 No match found for location with path 'xxx'
   * 2、backEnd.ts(后端控制路由)、frontEnd.ts(前端控制路由) 中也需要加 notFoundAndNoPower 404、401 界面。
   *    防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
   */
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    ...notFoundAndNoPower,
    ...staticRoutes,
  ],
})

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
  if (arr.length <= 0) return false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
    }
  }
  return arr
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
  if (arr.length <= 0) return false
  const newArr: any = []
  const cacheList: Array<string> = []
  arr.forEach((v: any) => {
    if (v.path === '/') {
      newArr.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      })
    } else {
      // 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
      // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
      if (v.path.indexOf('/:') > -1) {
        v.meta['isDynamic'] = true
        v.meta['isDynamicPath'] = v.path
      }
      newArr[0].children.push({ ...v })
      // 存 name 值，keep-alive 中 include 使用，实现路由的缓存
      // 路径：@/layout/routerView/parent.vue
      if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
        cacheList.push(v.name)
        const stores = useKeepALiveNames(pinia)
        stores.setCacheKeepAlive(cacheList)
      }
    }
  })
  return newArr
}

// 路由加载前
router.beforeEach(async (to, from, next) => {
  NProgress.configure({ showSpinner: false })

  const userInfoStore = useUserInfo()
  if (to.meta.title) NProgress.start()

  // 切换页面时取消未响应的请求
  if (!from.meta.isKeepAlive && window.httpRequestList.length > 0) {
    window.httpRequestList.forEach(c => c())
    window.httpRequestList = []
  }
  const token = Session.getACToken()

  // 去登录页
  if (to.path === '/login' && !token) {
    if (window.performance.navigation.type || to.query.code) next()
    else {
      /**
       * 页面为新进来的情况下 返回上次关闭时预览的界面
       *  1. 刷新 并 获取 ac token
       *  2. 获取用户个人信息
       */
      // http://localhost:8888/resource/list?lastFlag=true
      const lastVPage = Local.get(LAST_VISITED_PAGE_PATH_STORAGE_KEY)
      // 当页面首次进来时 则直接返回登录页
      if (!Local.getRFToken()) next()
      else {
        const refreshStatus = await handleRefreshACToken()
        if (!refreshStatus) return next()
        await userInfoStore.getUserInfos()
        if (to.redirectedFrom.query?.lastFlag) next(to.redirectedFrom.path as string)
        else next(lastVPage)
      }
    }
    NProgress.done()
    return
  }

  if (!token) {
    next(`/login`)
    NProgress.done()
  } else if (token && to.path === '/login') {
    // next()
    next('/home')
    NProgress.done()
  } else {
    const storesRoutesList = useRoutesList(pinia)
    const { routesList } = storeToRefs(storesRoutesList)
    // 解决界面刷新路由规则丢失问题
    if (from.name === undefined && !routesList.value.length && token) {
      // 当前用户不是admin时 请求接口获取路由信息
      const { id, userName } = userInfoStore.userInfos
      if (id !== 1 && userName !== 'admin') await userInfoStore.getMenus()
      await handleUserAuthRouters()
      next({ path: to.path })
      // next({: to.name })
      // next(`${to.path}`)
      // return
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

// 导出路由
export default router
