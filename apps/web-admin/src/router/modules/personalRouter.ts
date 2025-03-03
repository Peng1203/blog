import { RouteRecordRaw } from 'vue-router'

// 设置
const routerRules: RouteRecordRaw[] = [
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('@/views/personal'),
    meta: {
      title: '个人中心',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'ele-UserFilled',
      orderNum: 20,
    },
  },
]

export default routerRules
