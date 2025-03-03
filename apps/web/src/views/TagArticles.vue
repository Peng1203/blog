<template>
  <div class="container flex-1 mx-auto px-4 py-8">
    <!-- <h2 class="text-3xl font-bold mb-6">Articles</h2> -->

    <!-- :rows="5" -->
    <el-skeleton
      animated
      :loading="loading"
    >
      <template #template>
        <div class="p-5 border rounded-lg shadow-md mb-6">
          <div class="grid grid-flow-col grid-cols-[1fr_2fr] gap-6 h-40">
            <div class="h-40 bg-gray-300 rounded"></div>

            <div>
              <div class="h-7 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-5 bg-gray-300 rounded w-5/6 mb-2"></div>

              <div class="flex gap-2">
                <div class="w-16 h-6 bg-gray-300 rounded-md animate-pulse" />
                <div class="w-20 h-6 bg-gray-300 rounded-md animate-pulse" />
                <div class="w-24 h-6 bg-gray-300 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div class="p-5 border rounded-lg shadow-md">
          <div class="grid grid-flow-col grid-cols-[1fr_2fr] gap-6 h-40">
            <div>
              <div class="h-7 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-5 bg-gray-300 rounded w-5/6 mb-2"></div>

              <div class="flex gap-2">
                <div class="w-16 h-6 bg-gray-300 rounded-md animate-pulse" />
                <div class="w-20 h-6 bg-gray-300 rounded-md animate-pulse" />
                <div class="w-24 h-6 bg-gray-300 rounded-md animate-pulse" />
              </div>
            </div>

            <div class="h-40 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div class="p-5 border rounded-lg shadow-md mb-6">
          <div class="grid grid-flow-col grid-cols-[1fr_2fr] gap-6 h-40">
            <div class="h-40 bg-gray-300 rounded"></div>

            <div>
              <div class="h-7 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-5 bg-gray-300 rounded w-5/6 mb-2"></div>

              <div class="flex gap-2">
                <div class="w-16 h-6 bg-gray-300 rounded-md animate-pulse" />
                <div class="w-20 h-6 bg-gray-300 rounded-md animate-pulse" />
                <div class="w-24 h-6 bg-gray-300 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <template v-if="dataList.length">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- 文章列表 -->
            <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 flex-1">
              <ArticleCard
                :index="i"
                :item="article"
                :key="article.id"
                class="lg:max-h-none"
                v-for="(article, i) in dataList"
              />
              <!-- :style="{ 'max-height': dataList.length === 1 && '42%' }" -->
            </div>
          </div>

          <div class="flex justify-center">
            <el-pagination
              background
              size="large"
              layout="prev, pager, next"
              :total="total"
              v-model:current-page="page"
              v-model:page-size="pageSize"
              @current-change="handlePageChange"
            />
          </div>
        </template>

        <el-empty
          v-else
          description="暂无文章"
        />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getArticleData } from '@/apis'
import ArticleCard from '@/components/ArticleCard.vue'
import { useListState } from '@/hooks/useListState'
import type { Article } from '@/types/data'
import { useRoute } from 'vue-router'
import { useLoading } from '@/hooks/useLoading'

const route = useRoute()
const { loading, startLoading, stopLoading } = useLoading()

let { page, pageSize, dataList, total } = useListState<Article>()
const getArticles = async () => {
  try {
    startLoading()
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      queryStr: '',
      categoryId: 0,
      tagId: route.params.id
    }
    const { data: res } = await getArticleData(params)
    const { code, success, data } = res
    if (code !== 20000 || !success) return
    dataList.value = data.list
    total.value = data.total
  } catch (e) {
    console.log('e', e)
  } finally {
    stopLoading()
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  getArticles()
}

onMounted(() => {
  getArticles()
})
</script>

<style scoped>
/* 为移动端适配调整样式 */
@media (max-width: 768px) {
  aside {
    order: -1; /* 信息卡片区域在移动端显示在文章列表之前 */
    width: 100%;
    padding: 0; /* 移除边距以节省空间 */
  }
  .flex {
    flex-direction: column; /* 使得整体布局在移动端垂直排列 */
  }
}
</style>
