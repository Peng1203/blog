<template>
  <component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/stores/themeConfig'
import { Local } from '@/utils/storage'
import mittBus from '@/utils/mitt'

import defaults from '@/layout/main/defaults.vue'
import classic from '@/layout/main/classic.vue'
import transverse from '@/layout/main/transverse.vue'
import columns from '@/layout/main/columns.vue'

// 引入 不同主题的布局 组件
const layouts: any = {
  defaults,
  classic,
  transverse,
  columns,
}

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
  if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout)
  const clientWidth = document.body.clientWidth
  if (clientWidth < 1000) {
    themeConfig.value.isCollapse = false
    mittBus.emit('layoutMobileResize', {
      layout: 'defaults',
      clientWidth,
    })
  } else {
    mittBus.emit('layoutMobileResize', {
      layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
      clientWidth,
    })
  }
}
// 页面加载前
onBeforeMount(() => {
  onLayoutResize()
  window.addEventListener('resize', onLayoutResize)
})
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('resize', onLayoutResize)
})
</script>
