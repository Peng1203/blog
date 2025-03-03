<template>
  <div
    class="comment-item py-4 border-b border-gray-100 dark:border-gray-500 dark:bg-gray-800 dark:shadow-lg"
  >
    <!-- 评论信息 -->
    <div class="flex items-start gap-3">
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <el-avatar
          :size="40"
          :src="props.avatar || DEFAULT_AVATAR"
        />
      </div>

      <!-- 评论内容区 -->
      <div class="flex-grow">
        <!-- 用户信息行 -->
        <div class="flex items-center gap-2 mb-1">
          <div class="flex items-center gap-2">
            <el-link
              target="_blank"
              class="font-medium text-xs"
              :underline="false"
              :disabled="!blogUrl"
              :type="blogUrl ? 'primary' : 'default'"
              :href="blogUrl ? getBlogUrl(blogUrl || '') : undefined"
              :class="blogUrl ? '' : 'text-gray-600'"
            >
              <!-- v-if="blogUrl" -->
              {{ props.name }}
            </el-link>

            <!-- 当为回复评论时 显示回复人 -->
            <span
              class="font-medium text-xs"
              v-if="replyId"
            >
              回复 @{{ getReplyUserName() }}
            </span>
            <!-- <span
              v-else
              class="font-medium text-xs"
            >
              {{ props.name }}
            </span> -->

            <el-tag
              v-if="isAuthor"
              size="small"
              type="danger"
            >
              作者
            </el-tag>
          </div>
        </div>

        <!-- 评论内容 -->
        <div
          class="text-gray-700 mb-2 dark:text-gray-300"
          v-html="content"
        />
        <!-- {{ content }} -->
        <!-- </div> -->

        <!-- 底部信息栏 -->
        <div
          class="flex items-end sm:items-center gap-4 -ml-10 sm:ml-0 text-xs text-gray-500 whitespace-nowrap"
        >
          <div class="flex flex-col sm:flex-row">
            <span class="sm:min-w-20">{{ getFromNow(createTime, 1) }}</span>
            <!-- <span class="hidden sm:inline-block"> -->
            <span>
              IP属地：
              {{ location?.province || '未知' }}
            </span>
            <!-- | {{ Object.keys(device) }} -->
          </div>

          <div
            class="flex items-center gap-4 ml-auto"
            v-if="id"
          >
            <button
              class="flex items-center gap-1 hover:text-blue-500 transition-colors"
              @click="handleClickLikeBtn"
            >
              <i
                class="iconfont"
                :class="
                  likeIds.includes(getFormatLikeValue())
                    ? 'icon-aixin_shixin text-red-500'
                    : 'icon-aixin'
                "
              />

              <!-- <el-icon><ThumbsUp /></el-icon> -->
              <span>{{ likeCount }}</span>
            </button>

            <!-- 查看回复 -->
            <button
              class="flex items-center gap-1"
              :class="replyListState ? 'text-blue-500' : ''"
              v-if="isParent"
              @click="handleShowReply"
            >
              <i class="iconfont icon-comiisfashuoshuo" />
              <!-- <span>{{ likeCount }}</span> -->
              <!-- {{ replyCount }} -->
            </button>

            <button
              class="flex items-center gap-1 hover:text-blue-500 transition-colors"
              @click="scrollToReplyForm"
            >
              <!-- <el-icon><ChatLineRound /></el-icon> -->
              <span>回 复</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 回复列表 只有父级评论有回复列表 -->
    <ReplyList
      ref="replyListRef"
      :comment="props"
      v-if="isParent"
      v-model="replyListState"
      @submit="handleReplyToReply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, useTemplateRef, onMounted, onUnmounted, inject } from 'vue'
import { getFromNow } from '@/utils/date'
import type { Comment } from '@/types/data'
import { SESSION_LIKES_KEY, DEFAULT_AVATAR, EventEnum, CommentType } from '@/constant'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { addComment, cancelLikeComment, likeComment } from '@/apis'
import { useLoading } from '@/hooks/useLoading'
import type { ReplyToReplyParams } from '@/apis/dto'
import ReplyList from './ReplyList.vue'
import { comments, anonmousUserName } from './store'
import { bus } from '@/utils/eventBus'

const props = defineProps<Comment>()
const emit = defineEmits(['reply'])

const { likeIds } = storeToRefs(useStore())
const store = useStore()
const commentType = inject<CommentType>('commentType')

const isAuthor = computed(() => store.userInfo.userId === props.userId)
// 是否时父级评论
const isParent = computed(() => props.parentId === 0)

const likeCount = ref(props.likes)

const { loading, startLoading, stopLoading } = useLoading()

const handleClickLikeBtn = async () => {
  if (loading.value) return

  // 判断当前点赞状态 执行相反操作  未点赞  已点赞
  const isLiked = likeIds.value.includes(getFormatLikeValue())

  // 处理点赞逻辑
  const status = await handleLikeComment(isLiked)
  if (!status) return

  // 根据缓存中取出的点赞id数组判断当前评论是否已点赞
  if (isLiked) {
    likeIds.value.splice(likeIds.value.indexOf(getFormatLikeValue()), 1)
    likeCount.value--
  } else {
    likeIds.value.push(getFormatLikeValue())
    likeCount.value++
  }

  sessionStorage.setItem(SESSION_LIKES_KEY, JSON.stringify(likeIds.value))
}

const handleLikeComment = async (isLiked: boolean): Promise<boolean> => {
  try {
    startLoading()
    const { data: res } = await (isLiked ? cancelLikeComment(props.id) : likeComment(props.id))
    if (!res.success) return false
    return true
  } catch (e) {
    console.log('e', e)
    return false
  } finally {
    stopLoading()
  }
}

const getFormatLikeValue = () => `${commentType}-${props.id}`

const scrollToReplyForm = () => {
  emit('reply', props)
  nextTick(() => {
    const replyForm = document.querySelector('.reply-form')
    replyForm?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const getBlogUrl = (url: string) => {
  if (url?.includes('http')) return url
  else return `https://${url}`
}

const replyListState = ref(false)
const replyRef = useTemplateRef('replyListRef')
const handleShowReply = () => {
  replyListState.value = !replyListState.value

  if (replyListState.value) replyRef.value?.getReplyList()
}

/**
 * 回复 回复的评论 需要传入回复对象的id作为 replyId
 */
const handleReplyToReply = async ({ form, replyTo }: ReplyToReplyParams) => {
  try {
    const params = {
      ...form,
      replyId: replyTo.id,
      name: form.name || anonmousUserName.value
    }

    const { data: res } = await addComment(params)
    const { code, data, success } = res
    if (code !== 20100 || !success) return
    ElMessage.success('回复提交成功')
    replyRef.value?.handleAddNewReply(data)
  } catch (e) {
    console.log('e', e)
  }
}

const getReplyUserName = () => {
  // 找到数据列表中
  const parentComment = comments.value.find((item) => item.id === props.parentId)

  return parentComment?.replyData?.find((item) => item.id === props.replyId)?.name || '--'
}

/** 处理 回复评论 添加到回复列表中 */
const handleAddReplyToList = (data: Comment) => {
  // console.log(`%c data ----`, 'color: #fff;background-color: #000;font-size: 18px', data, props)
  if (data.parentId === props.id) {
    // 根据当前回复列表是否展开 来判断是否需要重新获取回复列表
    if (!replyListState.value) {
      replyListState.value = true
      replyRef.value?.getReplyList()
    } else {
      replyRef.value?.handleAddNewReplyToTop(data)
    }
  }
}

onMounted(() => {
  bus.on(EventEnum.SHOW_REPLY, handleAddReplyToList)
})

onUnmounted(() => {
  bus.off(EventEnum.SHOW_REPLY, handleAddReplyToList)
})
</script>

<style scoped lang="scss">
:deep(.el-link.is-disabled) {
  color: initial;
  cursor: initial;
}
</style>
