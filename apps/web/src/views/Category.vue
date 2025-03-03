<template>
  <div class="container flex-1 mx-auto px-4 py-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in dataList"
        :key="category.categoryName"
        class="card bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:shadow-lg transition-all"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ category.categoryName }}
          </h2>
          <span class="text-gray-500 dark:text-gray-400 text-sm">
            {{ category.articles || 0 }} 篇文章
          </span>
        </div>
        <p class="text-gray-700 dark:text-gray-300">
          {{ category.description }}
        </p>
        <button
          class="mt-4 inline-block text-blue-500 hover:text-blue-700 transition duration-300 dark:text-blue-400 dark:hover:text-blue-300"
          @click="handleGo(category)"
        >
          查看更多 &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategoryData } from '@/apis'
import { useListState } from '@/hooks/useListState'
import type { Category } from '@/types/data'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

let { dataList, loading } = useListState<Category>()

const getCategorys = async () => {
  try {
    loading.value = true

    const { data: res } = await getCategoryData()
    const { code, success, data } = res
    if (code !== 20000 || !success) return
    dataList.value = data.list
  } catch (e) {
    console.log('e', e)
  } finally {
    loading.value = false
  }
}

const router = useRouter()
const handleGo = (row: Category) => {
  router.push({
    name: 'CategoryArticles',
    params: {
      id: row.id
    }
  })
}

onMounted(() => {
  getCategorys()
})
</script>
