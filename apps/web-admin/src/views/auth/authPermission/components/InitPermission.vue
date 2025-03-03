<template>
  <PengButton
    size="default"
    type="primary"
    @click="handleInitPermission"
  >
    <i class="iconfont icon-chushihua" />
    初始化权限标识
  </PengButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PERMISSION_DATA } from '@/constants/permission'
import { PermissionData } from '../types'
import { useNotificationMsg } from '@/hooks'
import { CodeEnum } from '@/constants'
import { usePermissionApi } from '@/api'

const emits = defineEmits(['updateList'])
const props = defineProps<{ data: PermissionData[] }>()

const { addPermission } = usePermissionApi()

const handleInitPermission = () => {
  PERMISSION_DATA.forEach(parentItem => {
    const findRes = props.data.find(item => item.permissionName === parentItem.permissionName)
    if (findRes) {
      // 对比 children 中的数据
      parentItem.children.forEach(childItem => {
        const childFindRes = findRes.children.find(item => item.permissionCode === childItem.permissionCode)

        if (childFindRes) return
        addNewAuthPermission(childItem, findRes.id)
      })
    } else {
      // 如果未找到 则进行父级创建
      addNewAuthPermission(parentItem, 0)
    }
  })
}

const requestCount = ref<number>(0)
// 添加权限标识
const addNewAuthPermission = async (item: any, parentId: number): Promise<boolean> => {
  try {
    requestCount.value++
    const { resourceMethod, children = [], ...args } = item
    const params = {
      parentId,
      resourceMethod: parentId ? resourceMethod : null,
      permissionName: '',
      resourceUrl: '',
      description: '',
      ...args,
    }
    const { data: res } = await addPermission<PermissionData>(params, true)
    const { code, success, data } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false

    // 当父级权限标识创建完成 循环创建子级权限标识
    if (!parentId && children && children.length) {
      children.forEach(item => addNewAuthPermission(item, data.id))
    }
    return true
  } catch (e) {
    console.log(e)
    return false
  } finally {
    requestCount.value--
    if (!requestCount.value) {
      useNotificationMsg('', '初始化权限标识完成')
      emits('updateList')
    }
  }
}
</script>
