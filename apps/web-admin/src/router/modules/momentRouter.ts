import { RouteRecordRaw } from 'vue-router'

// 权限管理路由规则
const routerRules: Array<RouteRecordRaw> = [
  {
    path: '/moment',
    name: 'Moment',
    redirect: { name: 'MomentList' },
    meta: {
      title: '动态',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'iconfont icon-dongtai',
      orderNum: 5,
    },
    children: [
      {
        path: '/moment/list',
        name: 'MomentList',
        component: () => import('@/views/moment/list'),
        meta: {
          title: '看',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-41shuoshuo',
          orderNum: 1,
        },
      },
      {
        path: '/moment/add',
        name: 'AddMoment',
        component: () => import('@/views/moment/add'),
        meta: {
          title: '发',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: true,
          isIframe: false,
          icon: 'iconfont icon-shuoshuo',
          orderNum: 2,
        },
      },
    ],
  },
]

export default routerRules
