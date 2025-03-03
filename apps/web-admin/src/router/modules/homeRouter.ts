import { RouteRecordRaw } from 'vue-router'

// 设置
const routerRules: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      isHide: false,
      isAffix: true,
      isKeepAlive: false,
      // roles: ['admin', 'common'],
      icon: 'ele-HomeFilled',
      orderNum: 1,
    },
  },
]

export default routerRules
