import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePermissionApi } from '@/api'
import { PermissionData, PermissionListData } from '@/views/auth/authPermission'
import { CodeEnum } from '@/constants'

const { getPermissions } = usePermissionApi()

export const usePermissionInfo = defineStore('permissionInfo', {
  state: () => ({
    permissionList: ref<PermissionData[]>([]),
  }),
  actions: {
    async getPermissionData(isUpdate?: boolean) {
      if (!isUpdate && this.permissionList.length) return
      const { data: res } = await getPermissions<PermissionListData>({
        queryStr: '',
        column: '',
        order: '',
      })
      const { code, success, data } = res
      if (code !== CodeEnum.GET_SUCCESS || !success) return
      this.permissionList = data.list
    },
  },
})
