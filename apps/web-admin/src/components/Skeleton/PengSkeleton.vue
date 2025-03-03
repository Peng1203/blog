<template>
  <div class="skeleton-container">
    <el-skeleton v-bind="$props">
      <template
        v-for="(val, name) in $slots"
        #[name]="scope"
      >
        <slot
          :name="name"
          v-bind="scope"
        />
      </template>
    </el-skeleton>
  </div>
</template>

<!-- 
  自定义渲染
  'p' | 'text' | 'h1' | 'h3' | 'caption' | 'button' | 'image' | 'circle' | 'rect'
<template #template>
  <el-skeleton-item variant="circle" />
  <Peng-Skeleton />
</template>
-->

<script setup lang="ts">
import { SkeletonAttribute } from './types'

withDefaults(defineProps<SkeletonAttribute>(), {
  rows: 3,
  /** 自定义模板渲染数量 */
  count: 1,
  animated: true,
  loading: true,
  height: '16px',
  /** 延时渲染真实 内容 避免数据响应太快一闪而过 单位ms */
  throttle: 500,
})
</script>

<style scoped lang="scss">
.skeleton-container {
  :deep(.el-skeleton > .el-skeleton__item) {
    height: v-bind('height');
  }
}
</style>
