import { defineStore } from 'pinia'
import { useResourceApi } from '@/api'
import type { ResourceListData, ResourceData } from '@/views/resource/list'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'

const { getResourceList, deleteResourceFile } = useResourceApi()

export const useResourceStore = defineStore('resource', {
  state: () => ({
    list: <ResourceData[]>[],
  }),
  actions: {
    async getResourceList(refresh = false) {
      try {
        if (this.list.length && !refresh) return
        const { data: res } = await getResourceList<ResourceListData>()
        const { code, success, data } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return
        this.list = data
      } catch (e) {
        console.log('e', e)
      }
    },
    async deleteResource(fileName: string, notification: boolean = true) {
      try {
        const { data: res } = await deleteResourceFile(fileName)
        const { data, code, success } = res
        if (code !== CodeEnum.DELETE_SUCCESS || !success) return
        notification && useNotificationMsg('', data)
        const delIndex = this.list.findIndex(item => item.name === fileName)
        if (delIndex === -1) return
        this.list.splice(delIndex, 1)
      } catch (e) {
        console.log('e', e)
      }
    },
  },
})
