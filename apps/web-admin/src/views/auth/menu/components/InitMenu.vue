<template>
  <PengButton
    size="default"
    type="primary"
    @click="handleInitMenus"
  >
    <i class="iconfont icon-chushihua" />
    初始化菜单
  </PengButton>
</template>

<script setup lang="ts">
import { useMenuApi } from '@/api/menu'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { allDynamicRoutes } from '@/router/dynamicRoutes'
import { CodeEnum } from '@/constants'

const { initMenus } = useMenuApi()

const emits = defineEmits(['updateList'])

const handleInitMenus = async () => {
  const addStatus = await addInitMenu()
  if (!addStatus) return
  emits('updateList')
}

const addInitMenu = async (): Promise<boolean> => {
  try {
    const params = getInitMenuData()
    const { data: res } = await initMenus<string>(params)
    const { data, success, message, code } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg(message, data)
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}

// 处理提交菜单数据
const getInitMenuData = () => {
  return allDynamicRoutes[0].children.reduce(
    (prev, cur) => {
      const { name: menuUri, path: menuPath, children } = cur
      const { title: menuName, icon: menuIcon, orderNum, isHide, isKeepAlive } = cur.meta

      prev.parentMenus.push({
        menuUri,
        menuPath,
        menuName,
        menuIcon,
        orderNum,
        isHide,
        isKeepAlive,
      })

      if (children) {
        prev.subMenus.push(
          ...children.map(subMenu => ({
            menuName: subMenu.meta.title,
            menuPath: subMenu.path,
            menuUri: subMenu.name,
            menuIcon: subMenu.meta.icon,
            orderNum: subMenu.meta.orderNum,
            isHide: subMenu.meta.isHide,
            isKeepAlive: subMenu.meta.isKeepAlive,
            parentUri: menuUri,
          }))
        )
      }

      return prev
    },
    { parentMenus: [], subMenus: [] }
  )
}
</script>
