<template>
  <div class="container mx-auto p-4 flex-1">
    <ArticleDetailSkeleton v-model="loading">
      <h1
        class="text-3xl font-extrabold mb-6 text-gray-800 md:text-4xl lg:text-5xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
      >
        {{ detailData?.title }}
      </h1>

      <div class="flex flex-col md:flex-row">
        <!-- Article Content -->
        <div
          :class="[
            'bg-white shadow-md dark:bg-gray-800 dark:shadow-lg rounded-lg p-3 mb-4 md:mb-0',
            hasCatalog(detailData?.content || '') ? 'w-full md:w-3/4' : 'w-full'
          ]"
        >
          <!-- <div class="prose">
          <p>Your article content goes here...</p>
        </div> -->
          <MdPreview
            :theme="themeModel"
            :editorId="state.id"
            :previewTheme="previewTheme"
            :modelValue="detailData?.content"
            v-bind="$attrs"
          />
        </div>

        <div
          class="w-full md:w-1/4 md:ml-4 hidden md:block"
          v-if="hasCatalog(detailData?.content || '')"
        >
          <div
            class="sticky top-20 bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4"
          >
            <MdCatalog
              :theme="themeModel"
              :editorId="state.id"
              scrollElement="#app"
              @onClick="handleCatalogClick"
            />
          </div>
        </div>
      </div>
    </ArticleDetailSkeleton>

    <Comment
      :targetId="Number(route.params.id)"
      :commentType="CommentType.ARTICLE"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { getArticleDetailData } from '@/apis'
import ArticleDetailSkeleton from '@/components/ArticleDetailSkeleton.vue'
import type { Article } from '@/types/data'
import type { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'
import { useLoading } from '@/hooks/useLoading'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'
import Comment from '@/components/Comment/index.vue'
import { CommentType } from '@/constant'

const { themeModel, previewTheme } = storeToRefs(useStore())

const { loading, startLoading, stopLoading } = useLoading()
const route = useRoute()

const state = reactive({ id: 'my-editor' })
const detailData = ref<Article>()

const getDetailData = async () => {
  try {
    startLoading()
    const { data: res } = await getArticleDetailData(Number(route.params.id))
    const { code, data, success } = res
    if (code !== 20000 || !success) return
    detailData.value = data
    setDocTitle()
  } catch (e) {
    console.log('e', e)
  } finally {
    stopLoading()
  }
}

const setDocTitle = () => {
  detailData.value?.title && (document.title = detailData.value.title)
}

const handleCatalogClick = (e: MouseEvent, t: TocItem) => {
  history.replaceState({}, '', `${location.pathname}#${t.text}`)
}

const hasCatalog = (markdownContent: string) => {
  const titleRegex = /^#{1,6} +.+/gm
  // 使用正则表达式测试是否存在匹配的标题
  return titleRegex.test(markdownContent)
}

onMounted(() => {
  getDetailData()
})
</script>

<style>
.md-editor-dark {
  --md-bk-color: #1f2937;
}

#my-editor {
  background-color: var(--card-bg-c) !important;
}
</style>
