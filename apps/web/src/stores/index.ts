import { defineStore, createPinia } from 'pinia'
import type { Personal } from '@/types/data'
import { ANONMOUS_USER_NAME_KEY, SESSION_COMMENT_LIKES_KEY, SESSION_LIKES_KEY } from '@/constant'

const pinia = createPinia()
export default pinia
type ThemeType = 'light' | 'dark'
type previewThemeType = 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'

export const useStore = defineStore('main', {
  state: () => ({
    userInfo: {} as Personal,
    // 主题模式
    themeModel: (localStorage.getItem('theme_model') as ThemeType) || 'light',
    // 代码预览模式
    previewTheme: (localStorage.getItem('preview_theme_model') as previewThemeType) || 'default',
    // 点赞过的列表 格式为 评论类型-文章id/动态id
    likeIds: JSON.parse(sessionStorage.getItem(SESSION_LIKES_KEY) || '[]') as string[],
    commentLikeIds: JSON.parse(
      sessionStorage.getItem(SESSION_COMMENT_LIKES_KEY) || '[]'
    ) as number[]
  })
})
