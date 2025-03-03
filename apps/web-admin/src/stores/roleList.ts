import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoleApi } from '@/api'
import { RoleData, RoleListData } from '@/views/auth/role'
import { CodeEnum } from '@/constants'

const { getRole } = useRoleApi()

export const useRolesInfo = defineStore('rolesInfo', {
  state: () => ({
    // 角色数据列表
    roleList: ref<RoleData[]>([]),
    // 角色下拉数据
    roleOption: ref<OptionItem[]>([]),
  }),
  actions: {
    async getRoleData(isUpdate?: boolean) {
      try {
        if (!isUpdate && this.roleList.length) return
        const { data: res } = await getRole<RoleListData>({
          page: 1,
          pageSize: 999,
          queryStr: '',
          column: '',
          order: '',
        })
        const { code, success, data } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return
        this.roleList = data.list
        this.roleOption = data.list.map(({ roleName, id }) => ({
          label: roleName,
          value: id,
        }))
      } catch (error) {
        console.log('error ------', error)
      }
    },
  },
})
