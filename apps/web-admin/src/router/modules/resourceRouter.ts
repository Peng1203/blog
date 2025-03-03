import { RouteRecordRaw } from 'vue-router'

// 资源管理路由规则
const routerRules: RouteRecordRaw[] = [
  {
    path: '/resource',
    name: 'Resource',
    redirect: { name: 'ResourceList' },
    meta: {
      title: '资源管理',
      icon: 'iconfont icon-ziyuan-resources',
      isKeepAlive: false,
      orderNum: 5,
      isHide: false,
    },
    children: [
      {
        path: '/resource/list',
        name: 'ResourceList',
        component: () => import('@/views/resource/list'),
        meta: {
          title: '资源列表',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: true,
          isIframe: false,
          icon: 'iconfont icon-ziyuanliebiao',
          orderNum: 1,
        },
      },
      {
        path: '/resource/upload',
        name: 'ResourceUpload',
        component: () => import('@/views/resource/upload'),
        meta: {
          title: '上传资源',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: true,
          isIframe: false,
          icon: 'ele-UploadFilled',
          orderNum: 2,
        },
      },
    ],
  },
]

export default routerRules
