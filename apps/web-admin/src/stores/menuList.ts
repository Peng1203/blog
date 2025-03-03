import { useMenuApi } from '@/api'
import { CodeEnum } from '@/constants'
import { MenuData, MenuListData } from '@/views/auth/menu'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const { getMenus } = useMenuApi()

export const useMenuInfo = defineStore('menuInfo', {
  state: () => ({
    menuList: ref<MenuData[]>([]),
  }),
  actions: {
    async getMenuData(isUpdate?: boolean) {
      if (!isUpdate && this.menuList.length) return
      const { data: res } = await getMenus<MenuListData>({
        queryStr: '',
        column: '',
        order: '',
      })
      const { code, success, data } = res
      if (code !== CodeEnum.GET_SUCCESS || !success) return
      this.menuList = data.list
    },
  },
})
