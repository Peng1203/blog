import { defineStore } from 'pinia'
import { useCategoryApi } from '@/api/category'
import { useTagApi } from '@/api/tag'
import { ref } from 'vue'
import { TagData, TagListData } from '@/views/article/tag'
import { CategoryData, CategoryListDate } from '@/views/article/category/types'
import { CodeEnum } from '@/constants'
import { useUserInfo } from './userInfo'
import pinia from './index'

const { getCategorys } = useCategoryApi()
const { getTags } = useTagApi()

const userStore = useUserInfo(pinia)

export const useArticleInfo = defineStore('articleInfo', {
  state: () => ({
    allParams: {
      queryStr: '',
      column: '',
      order: '',
      page: 1,
      pageSize: 9999,
    },
    // 分类全部数据
    categoryList: ref<CategoryData[]>([]),
    // 分类下拉全部数据
    categoryOption: ref<OptionItem[]>([]),
    // 标签全部数据
    tagList: ref<TagData[]>([]),
    // 标签下拉全部数据
    tagOption: ref<OptionItem[]>([]),
  }),
  actions: {
    // 获取全部文章分类数据
    async getCategoryData(updata?: boolean) {
      try {
        if (this.categoryList.length && this.categoryOption.length && !updata) return
        const { data: res } = await getCategorys<CategoryListDate>(this.allParams)
        const { code, data, success } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return

        this.categoryList = data.list
        this.categoryOption = data.list.map(({ categoryName, id }) => ({
          label: categoryName,
          value: id,
        }))
      } catch (e) {
        console.log(e)
      }
    },
    // 获取全部标签列表
    async getTagData(updata?: boolean) {
      try {
        if (this.tagList.length && this.tagOption.length && !updata) return
        const { data: res } = await getTags<TagListData>(this.allParams)
        const { code, data, success } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return

        this.tagList = data.list
        this.tagOption = data.list.map(({ tagName, id }) => ({
          label: tagName,
          value: id,
        }))
      } catch (e) {
        console.log(e)
      }
    },
  },
  getters: {
    userCategoryOption(state) {
      return state.categoryList
        .filter(item => item.userId === userStore.userInfos.id)
        .map(({ categoryName, id }) => ({
          label: categoryName,
          value: id,
        })) as OptionItem[]
    },
    userTagOption(state) {
      return state.tagList
        .filter(item => item.userId === userStore.userInfos.id)
        .map(({ tagName, id }) => ({
          label: tagName,
          value: id,
        })) as OptionItem[]
    },
  },
})
