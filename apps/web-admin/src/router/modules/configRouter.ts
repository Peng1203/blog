import { RouteRecordRaw } from 'vue-router'

// 设置
const routerRules: RouteRecordRaw[] = [
  {
    path: '/sysConfig',
    name: 'SysConfig',
    component: () => import('@/views/system/config/SysConfig.vue'),
    meta: {
      title: '系统设置',
      icon: 'iconfont icon-xitongshezhi',
      orderNum: 7,
      isHide: false,
      isKeepAlive: false,
    },
  },
]

export default routerRules
