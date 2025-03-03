<template>
  <!-- <div class="animate-pulse space-y-4">
    <div class="h-6 bg-gray-300 rounded w-3/4"></div>
    <div class="h-4 bg-gray-300 rounded w-full"></div>
    <div class="h-4 bg-gray-300 rounded w-full"></div>
    <div class="h-4 bg-gray-300 rounded w-5/6"></div>
  </div> -->

  <div
    class="p-4 pl-0 pr-0"
    v-if="loading"
  >
    <!-- 标题骨架 -->
    <div class="animate-pulse space-y-4">
      <div class="h-10 bg-gray-300 rounded w-3/4 sm:w-1/2"></div>

      <!-- 图片骨架 -->
      <div class="w-full h-screen bg-gray-300 rounded"></div>

      <!-- 内容骨架 -->
      <!-- <div class="space-y-3">
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        <div class="h-4 bg-gray-300 rounded w-4/5"></div>
      </div> -->
    </div>

    <!-- 评论骨架 -->
    <!-- <div class="mt-6 animate-pulse space-y-4">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div class="h-4 bg-gray-300 rounded w-full"></div>
      <div class="h-4 bg-gray-300 rounded w-5/6"></div>
    </div> -->
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
const loading = defineModel({ type: Boolean })
</script>

<style scoped>
/* 使用 Tailwind CSS 的动画样式 */
</style>
