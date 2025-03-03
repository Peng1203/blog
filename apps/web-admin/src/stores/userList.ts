import { UserData, UserListData } from '@/views/user/user'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserApi } from '@/api'
import { CodeEnum } from '@/constants'

const { getUsers } = useUserApi()

export const useUsersInfo = defineStore('usersInfo', {
  state: () => ({
    // 用户列表数据
    userList: ref<UserData[]>([]),
    // 用户下拉数据
    userOption: ref<OptionItem[]>([]),
  }),

  actions: {
    async getUserData(isUpdate?: boolean) {
      try {
        if (!isUpdate && this.userList.length) return
        const { data: res } = await getUsers<UserListData>({
          page: 1,
          pageSize: 9999,
          queryStr: '',
          column: '',
          order: '',
        })
        const { code, success, data } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return
        this.userList = data.list
        this.userOption = data.list.map(({ userName, nickName, id }) => ({
          label: nickName || userName,
          value: id,
        }))
      } catch (e) {
        console.log('e ------', e)
      }
    },
  },
})
