<template>
  <div
    class="card cursor-pointer bg-white rounded-lg shadow-md transition-all dark:bg-gray-800 dark:shadow-lg"
    :class="cardContainerClass"
    @click="handleGoDetail"
  >
    <div :class="coverClass">
      <!-- 使用 el-image 组件实现图片懒加载 -->
      <el-image
        lazy
        class="h-full rounded-t-lg"
        alt="封面"
        loading="lazy"
        draggable="false"
        preview-teleported
        :preview-src-list="[item.cover || DefaultImg]"
        :src="item.cover || DefaultImg"
        @click.stop
      />
    </div>

    <div
      :class="infoClass"
      class="p-4"
    >
      <!-- 标题 -->
      <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors">
        {{ item.title }}
      </h3>

      <!-- 摘要 -->
      <p
        class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3"
        style="word-break: break-all"
      >
        {{ item.summary }}
      </p>

      <!-- 分类和时间 -->
      <div class="flex justify-between items-center">
        <span class="text-gray-500 text-sm dark:text-gray-400">
          {{ item?.category?.categoryName || '' }}
        </span>

        <div class="text-gray-500 text-sm dark:text-gray-400">
          <span>
            发布于
            <b class="text-gray-700 dark:text-gray-300">{{ getFromNow(item.createTime) }}</b>
          </span>
          <br />
          <span>
            更新于
            <b class="text-gray-700 dark:text-gray-300">{{ getFromNow(item.updateTime) }}</b>
          </span>
        </div>
      </div>

      <!-- 标签 -->
      <div class="mt-2">
        <span
          v-for="(tag, index) in item.tags"
          :key="index"
          class="inline-block bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded transition-colors"
        >
          {{ tag.tagName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { getFromNow } from '@/utils/date'
import type { Article } from '@/types/data'
import DefaultImg from '@/assets/imgs/002455ISA8i.jpg'

type Props = { index: number; item: Article }

const props = defineProps<Props>()

// 根据行索引决定容器样式（奇数行封面在左，偶数行封面在右）
const cardContainerClass = computed(() =>
  props.index % 2 === 0
    ? 'flex gap-10 flex-row bg-white shadow-md rounded-lg p-6 mb-6'
    : 'flex gap-10 flex-row-reverse bg-white shadow-md rounded-lg p-6 mb-6'
)

const coverClass = 'w-1/3 h-48 mb-4 md:mb-0 hidden md:block' // 在移动设备上隐藏封面
const infoClass = 'flex-1 flex flex-col justify-between'

const router = useRouter()
const handleGoDetail = () => {
  router.push({
    name: 'ArticleDetail',
    params: {
      id: props.item.id
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.el-image__inner) {
  @apply w-full h-full object-cover rounded-lg shadow-md cursor-zoom-in;
}
</style>
