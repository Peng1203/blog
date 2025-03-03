<template>
  <!-- loading --- {{ loading }} -->
  <!-- <br />
  attrs --- {{ attrs }} -- {{ Object.keys(attrs) }} -- {{ JSON.parse(JSON.stringify(attrs)) }}
  <br />
  props --- {{ props }} -- {{ Object.keys(props) }}
  <br /> -->
  <!-- 拷贝去除 attrs 对象上的 onClick 防止触发2次  -->
  <el-button
    v-bind="{ ...props, ...JSON.parse(JSON.stringify(attrs)) }"
    :loading="loading"
    @click="handleClick"
  >
    <template
      :key="i"
      #[name]
      v-for="(_, name, i) in slots"
    >
      <slot :name="name" />
    </template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import { Props } from './types'

defineOptions({
  inheritAttrs: false,
})

const slots = useSlots()
const attrs = useAttrs()
const props = withDefaults(defineProps<Props>(), {
  size: 'small',
})

const loading = defineModel<boolean>('loading')

const handleClick = async () => {
  try {
    loading.value = true
    // @ts-ignore
    await attrs?.onClick?.()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.el-button {
  :deep(.el-icon + span) {
    margin-left: 0px !important;
  }
}
</style>
