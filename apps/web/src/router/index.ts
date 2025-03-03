import { addPV } from '@/apis'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/category',
      name: 'Category',
      component: () => import('@/views/Category.vue'),
      meta: {
        title: '分类'
      }
    },
    {
      path: '/category/:id',
      name: 'CategoryArticles',
      component: () => import('@/views/CategoryArticles.vue'),
      meta: {
        title: '分类-文章'
      }
    },
    {
      path: '/tag',
      name: 'Tag',
      component: () => import('@/views/Tag.vue'),
      meta: {
        title: '标签'
      }
    },
    {
      path: '/tag/:id',
      name: 'TagArticles',
      component: () => import('@/views/TagArticles.vue'),
      meta: {
        title: '标签-文章'
      }
    },
    {
      path: '/moment',
      name: 'Moment',
      component: () => import('@/views/Moment.vue'),
      meta: {
        title: '动态'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue'),
      meta: {
        title: '关于我'
      }
    },
    {
      path: '/article/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/ArticleDetail.vue'),
      meta: {
        title: '文章详情'
      }
    }
  ]
})

const docTitle = 'Peng的小站'

router.beforeEach((to, from, next) => {
  to.meta.title
    ? (document.title = `${docTitle}-${to.meta.title as string}`)
    : (document.title = docTitle)
  addPV()
  next()
})

export default router
