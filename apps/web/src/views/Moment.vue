<template>
  <div class="container mx-auto px-4 py-8 flex-1">
    <!-- 动态列表 -->
    <div
      v-for="moment in dataList"
      :key="moment.id"
      class="bg-white shadow-md rounded-lg p-4 mb-6 dark:bg-gray-800 dark:shadow-lg transition-all"
    >
      <!-- 用户信息 -->
      <div class="flex items-center mb-4">
        <img
          alt="User Avatar"
          class="w-12 h-12 rounded-full mr-4"
          :src="userInfo.userAvatar"
        />
        <div>
          <p class="font-bold text-lg text-gray-900 dark:text-gray-100">
            {{ userInfo.nickName || userInfo.userName }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ getFromNow(moment.createTime) }}
          </p>
        </div>
      </div>

      <!-- 动态内容 -->
      <div class="mb-4 text-gray-800 dark:text-gray-200">
        <p style="white-space: pre-wrap; word-wrap: break-word">
          {{ moment.content }}
        </p>
      </div>

      <div v-if="moment.mediaUrls && moment.mediaUrls.length > 0">
        <!-- 判断图片数量 -->
        <div
          :class="{
            'flex justify-start items-center': moment.mediaUrls.length === 1, // 单图居中布局
            'grid grid-cols-2 gap-1': moment.mediaUrls.length === 4, // 4 张图片时
            'grid grid-cols-3 gap-1': moment.mediaUrls.length > 1 && moment.mediaUrls.length !== 4 // 多图九宫格布局
          }"
        >
          <template
            v-for="(url, i) in moment.mediaUrls"
            :key="i"
          >
            <el-image
              v-if="moment.mediaUrls.length > 1"
              lazy
              class="h-full max-h-40"
              loading="lazy"
              draggable="false"
              preview-teleported
              :src="url"
              :initial-index="i"
              :preview-src-list="moment.mediaUrls"
            />

            <!-- 单张图片的样式 -->
            <!-- style="height: 15rem" -->
            <el-image
              v-else
              lazy
              fit="contain"
              loading="lazy"
              draggable="false"
              preview-teleported
              class="h-40"
              :src="url"
              :initial-index="i"
              :preview-src-list="moment.mediaUrls"
            />
          </template>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div
        class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
      >
        <button
          class="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
          :class="commentLikeIds.includes(moment.id) ? '!text-blue-500 !dark:text-blue-400' : ''"
          @click="handleLike(moment)"
        >
          <i class="iconfont icon-dianzan_kuai text-xl" />
          <span class="text-sm">
            {{ moment.likes }}
          </span>
        </button>
        <button
          class="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
          :class="moment.id === currentShowComment ? '!text-blue-500 !dark:text-blue-400' : ''"
          @click="handleShowComment(moment)"
        >
          <!-- :class="loadComments.includes(moment.id) ? '!text-blue-500 !dark:text-blue-400' : ''" -->
          <i class="iconfont icon-comiisfashuoshuo text-xl" />
          <span class="text-sm">评论</span>
        </button>
        <button
          class="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <i class="iconfont icon-fenxiang1 text-xl" />
          <span class="text-sm">分享</span>
        </button>
      </div>

      <!-- 评论功能展开 -->
      <!-- v-show="loadComments.includes(moment.id)" -->
      <!-- v-if="moment.commentVisible" -->
      <Comment
        class="comment-container"
        v-if="moment.id === currentShowComment"
        :targetId="moment.id"
        :commentType="CommentType.MOMENT"
      />
    </div>

    <div class="flex justify-center mt-6">
      <button
        v-if="!loadCompleted"
        class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition duration-300"
        :disabled="loading"
        @click="handleLoadMore"
      >
        <span v-if="!loading">加载更多</span>
        <span v-else>加载中...</span>
      </button>
      <p
        v-else
        class="text-gray-500 dark:text-gray-400"
      >
        没有更多内容了
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getFromNow } from '@/utils/date'
import { useListState } from '@/hooks/useListState'
import type { MomentItem } from '@/types/extend'
import { getMomentData, likeMoment, cancelLikeMoment } from '@/apis'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { SESSION_COMMENT_LIKES_KEY, CommentType } from '@/constant'
import Comment from '@/components/Comment/index.vue'

const store = useStore()
const { userInfo, commentLikeIds } = storeToRefs(store)

let { page, pageSize, dataList, total, loading } = useListState<MomentItem>()

const loadCompleted = computed<boolean>(() => dataList.value.length >= total.value)

const getMoments = async () => {
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }
    const { data: res } = await getMomentData(params)
    const { code, success, data } = res
    if (code !== 20000 || !success) return
    dataList.value = [
      ...dataList.value.map((item) => ({ ...item, commentVisible: false })),
      ...data.list.map((item) => ({ ...item, commentVisible: false }))
    ]
    total.value = data.total
  } catch (e) {
    console.log('e', e)
  }
}

const handleLoadMore = () => {
  page.value++
  getMoments()
}

const handleLike = async (moment: MomentItem) => {
  try {
    // 判断是点赞还是取消点赞
    const isLiked = !commentLikeIds.value.includes(moment.id)
    const { data: res } = isLiked ? await likeMoment(moment.id) : await cancelLikeMoment(moment.id)
    if (!res.success) return
    // 更新点赞状态
    if (isLiked) {
      moment.likes++
      commentLikeIds.value.push(moment.id)
    } else {
      if (moment.likes <= 0) return
      moment.likes--
      commentLikeIds.value = commentLikeIds.value.filter((id: number) => id !== moment.id)
    }

    sessionStorage.setItem(SESSION_COMMENT_LIKES_KEY, JSON.stringify(commentLikeIds.value))
  } catch (e) {
    console.log('e', e)
  }
}

// 展开的评论
const currentShowComment = ref<number>()
const loadComments = ref<number[]>([])
const handleShowComment = (item: MomentItem) => {
  if (!item.commentVisible) item.commentVisible = true
  currentShowComment.value = item.id
  // loadComments.value = toggleNumber(loadComments.value, item.id)
}

function toggleNumber(arr: number[], num: number): number[] {
  return arr.includes(num) ? arr.filter((n) => n !== num) : [...arr, num]
}

onMounted(() => {
  getMoments()
})
</script>

<style scoped lang="scss">
.container {
  max-width: 800px;
}

:deep(.el-image__inner) {
  @apply w-full h-full object-cover rounded-lg shadow-md cursor-zoom-in;
}

.single {
  :deep(.el-image__inner) {
    // width: 10rem;
  }
}

/* 加载中按钮禁用时的样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.comment-container {
  box-shadow: initial;
}
</style>
