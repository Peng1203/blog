import { RouteRecordRaw } from 'vue-router'

// 权限管理路由规则
const routerRules: Array<RouteRecordRaw> = [
  {
    path: '/log',
    name: 'Log',
    redirect: { name: 'Audit' },
    meta: {
      title: '日志',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'iconfont icon-jurassic_log',
      orderNum: 7,
    },
    children: [
      {
        path: '/log/audit',
        name: 'Audit',
        component: () => import('@/views/log/audit'),
        meta: {
          title: '审计日志',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-audit',
          orderNum: 1,
        },
      },
      {
        path: '/log/login',
        name: 'LoginLog',
        component: () => import('@/views/log/login'),
        meta: {
          title: '登录日志',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-denglurizhi',
          orderNum: 2,
        },
      },
    ],
  },
]

export default routerRules
