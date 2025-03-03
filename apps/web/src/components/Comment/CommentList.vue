<template>
  <div class="comment-list">
    <div class="mb-4 text-gray-600">共 {{ total }} 条评论</div>

    <!-- <div class="divide-y divide-gray-100"> -->
    <div>
      <template
        :key="comment.id"
        v-for="comment in comments"
      >
        <CommentItem
          v-bind="comment"
          @reply="handleReply"
        />

        <ReplyForm
          v-if="replyTo?.id === comment.id"
          :replyTo="comment"
          :parentComment="comment"
          @cancel="cancelReply"
          @submit="handleReplySubmit"
        />
      </template>
      <div
        v-if="comments.length === 0"
        class="text-center py-4 text-gray-500"
      >
        暂无评论
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center py-4"
    >
      <!-- <el-spinner /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import CommentItem from './CommentItem.vue'
import ReplyForm from './ReplyForm.vue'
import { getCommentData } from '@/apis'
import type { CommentType } from '@/constant'
import type { Comment } from '@/types/data'
import type { AddCommentDto } from '@/apis/dto'
import { comments } from './store'

const props = defineProps<{
  // comments: any[]
  // loading?: boolean
  targetId: number
}>()

const commentType = inject<CommentType>('commentType')

const loading = ref(false)
const total = ref(0)
// const comments = ref<Comment[]>([])

const emit = defineEmits<{
  reply: [comment: any]
  submit: [data: any]
}>()

const replyTo = ref<Comment | null>()

const handleReply = (commentItem: Comment) => {
  replyTo.value = commentItem
  emit('reply', commentItem)
}

const handleReplySubmit = (data: AddCommentDto) => {
  emit('submit', data)
  cancelReply()
}

const cancelReply = () => {
  replyTo.value = null
}

const getComments = async () => {
  // 获取评论列表
  try {
    const params = {
      page: 1,
      pageSize: 100
    }
    const { data: res } = await getCommentData(commentType!, props.targetId, params)
    const { code, data, success } = res
    if (code !== 20000 || !success) return
    comments.value = data.list.map((item) => ({
      ...item,
      replyData: [],
      replyCount: 0
    }))
    total.value = data.total
  } catch (e) {
    console.log('e', e)
  }
}

const handleShowLatestComments = (comment: Comment) => {
  comments.value.unshift({
    ...comment,
    replyData: [],
    replyCount: 0
  })
  total.value += 1
}

onMounted(() => {
  // 获取评论列表
  getComments()
})

defineExpose({
  handleShowLatestComments
})
</script>
