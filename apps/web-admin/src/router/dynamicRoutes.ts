import { RouteRecordRaw } from 'vue-router'
import authRouterRules from './modules/authRouter'
import userRouterRules from './modules/userRouter'
import articleRouterRules from './modules/articleRouter'
import resourceRouterRules from './modules/resourceRouter'
import testRouterRules from './modules/testRouter'
import systemConfigRouterRules from './modules/configRouter'
import personalRouterRules from './modules/personalRouter'
import homeRouterRules from './modules/homeRouter'
import logRouterRules from './modules/logRouter'
import momentRouter from './modules/momentRouter'

/**
 * 需要权限的路由表
 * @author Peng
 * @date 2023-03-18
 */

export const allDynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/index',
    name: 'Index',
    redirect: '/home',
    component: () => import('@/layout/index.vue'),
    // meta: {
    //   isKeepAlive: false,
    // },
    children: [
      ...homeRouterRules,
      // 权限管理
      ...authRouterRules,
      // 用户管理
      ...userRouterRules,
      // 文章管理
      ...articleRouterRules,
      // 动态
      ...momentRouter,
      // 资源管理
      ...resourceRouterRules,
      // 测试
      ...testRouterRules,
      // 系统设置
      ...systemConfigRouterRules,
      // 日志
      ...logRouterRules,
      // 个人中心
      ...personalRouterRules,
    ],
  },
]
