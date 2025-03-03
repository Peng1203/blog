import { RouteRecordRaw } from 'vue-router'

// 用户管理路由规则
const routerRules: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    redirect: { name: 'UserList' },
    // component: () => import('@/layout/routerView/parent.vue'),
    meta: {
      title: '用户管理',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'iconfont icon-jiaoseguanli',
      orderNum: 3,
    },
    children: [
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/user'),
        meta: {
          title: '用户列表',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-yonghuguanli',
          orderNum: 1,
        },
      },
    ],
  },
]

export default routerRules
