import { RouteRecordRaw } from 'vue-router'

const routerRules: RouteRecordRaw[] = [
  {
    path: '/test',
    name: 'TestPage',
    component: () => import('@/views/test/Test.vue'),
    meta: {
      title: '测试页面',
      orderNum: 6,
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      icon: 'iconfont icon-ceshi',
    },
  },
]
export default routerRules
