<template>
  <div class="flex items-center justify-center space-x-2 mt-6">
    <!-- 上一页按钮 -->
    <button
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="prevPage"
    >
      上一页
    </button>

    <!-- 当前页码（仅在小屏幕显示） -->
    <span class="block md:hidden px-4 py-2 text-sm font-semibold text-gray-700">
      第 {{ currentPage }} 页
    </span>

    <!-- 页码按钮（仅在 md 及以上设备显示） -->
    <button
      v-for="page in totalPages"
      :key="page"
      class="hidden md:inline-block px-4 py-2 text-sm font-semibold border rounded-md"
      :class="[
        currentPage === page
          ? 'text-white bg-blue-600 border-blue-600'
          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100'
      ]"
      @click="setPage(page)"
    >
      {{ page }}
    </button>

    <!-- 下一页按钮 -->
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      下一页
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  pageSize: number
}>()

const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(props.total / props.page))

const setPage = (page: number) => {
  currentPage.value = page
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}
</script>

<style scoped>
/* 如果需要额外的样式自定义，可以在这里添加 */
</style>
