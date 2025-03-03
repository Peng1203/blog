<template>
  <div class="container flex-1 mx-auto px-4 py-8">
    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="tag in dataList"
        :key="tag.tagName"
        class="card flex items-center justify-between bg-white shadow-md rounded-lg p-4 dark:bg-gray-800 dark:shadow-lg transition-all"
      >
        <div>
          <h2 class="text-lg font-bold text-blue-600 dark:text-blue-400">
            {{ tag.tagName }}
          </h2>
          <span class="text-gray-500 dark:text-gray-400 text-sm"> {{ tag.articles }} 篇文章 </span>
        </div>
        <button
          class="text-blue-500 hover:text-blue-700 transition duration-300 dark:text-blue-400 dark:hover:text-blue-300"
          @click="handleGo(tag)"
        >
          查看更多 &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTagData } from '@/apis'
import { useListState } from '@/hooks/useListState'
import type { Tag } from '@/types/data'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

let { dataList, loading } = useListState<Tag>()

const getCategorys = async () => {
  try {
    loading.value = true

    const { data: res } = await getTagData()
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
const handleGo = (tag: Tag) => {
  router.push({
    name: 'TagArticles',
    params: {
      id: tag.id
    }
  })
}

onMounted(() => {
  getCategorys()
})
</script>
