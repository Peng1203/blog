import { RouteRecordRaw } from 'vue-router'

// 权限管理路由规则
const routerRules: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    name: 'Auth',
    redirect: { name: 'Role' },
    // component: () => import('@/layout/routerView/parent.vue'),
    meta: {
      title: '权限管理',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'iconfont icon-auth',
      orderNum: 2,
    },
    children: [
      {
        path: '/auth/role',
        name: 'Role',
        component: () => import('@/views/auth/role'),
        meta: {
          title: '角色管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-jiaoseguanli1',
          orderNum: 1,
        },
      },
      {
        path: '/auth/menu',
        name: 'Menu',
        component: () => import('@/views/auth/menu'),
        meta: {
          title: '菜单管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'ele-Menu',
          orderNum: 2,
        },
      },
      {
        path: '/auth/authPermission',
        name: 'Permission',
        component: () => import('@/views/auth/authPermission'),
        meta: {
          title: '权限标识',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'ele-Key',
          orderNum: 3,
        },
      },
    ],
  },
]

export default routerRules
