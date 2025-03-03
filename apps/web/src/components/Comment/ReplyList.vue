<template>
  <div
    class="sm:ml-12"
    v-show="replyListState"
  >
    <div v-loading="loading">
      <template v-if="replyList?.length">
        <template
          :key="replyItem.id"
          v-for="replyItem in replyList"
        >
          <!-- {{ replyItem }} -->
          <CommentItem
            v-bind="replyItem"
            @reply="handleReply"
          />

          <ReplyForm
            v-if="replyTo?.id === replyItem.id"
            :parentComment="props.comment"
            :replyTo="replyItem"
            @cancel="cancelReply"
            @submit="handleReplyToReply"
          />
        </template>
      </template>

      <el-empty
        v-else-if="!loading && !replyList?.length"
        description="暂无评论"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { comments } from './store'
import type { Comment } from '@/types/data'
import type { CommentType } from '@/constant'
import { getReplyData } from '@/apis'
import CommentItem from './CommentItem.vue'
import ReplyForm from './ReplyForm.vue'
import type { AddCommentDto, ReplyToReplyParams } from '@/apis/dto'
import { useLoading } from '@/hooks/useLoading'

const commentType = inject<CommentType>('commentType')
const targetId = inject<number>('targetId')

const emit = defineEmits<{
  reply: [comment: Comment]
  submit: [data: ReplyToReplyParams]
}>()

const replyListState = defineModel<boolean>({ default: false })
const props = defineProps<{ comment: Comment }>()

const replyList = ref<Comment[]>()
const { loading, startLoading, stopLoading } = useLoading()
const getReplyList = async () => {
  try {
    startLoading()
    const params = {
      page: 1,
      pageSize: 100
    }
    const { data: res } = await getReplyData(commentType!, targetId!, props.comment.id, params)
    const { code, data, success } = res
    if (code !== 20000 || !success) return
    replyList.value = data.list

    const currentComment = comments.value.find((item) => item.id === props.comment.id)
    if (!currentComment) return
    currentComment.replyData = data.list
    currentComment.replyCount = data.total
  } catch (e) {
    console.log('e', e)
  } finally {
    stopLoading()
  }
}

const replyTo = ref<Comment | null>()

const handleReply = (commentItem: Comment) => {
  replyTo.value = commentItem
  emit('reply', commentItem)
}

const cancelReply = () => {
  replyTo.value = null
}

const handleReplyToReply = (data: AddCommentDto) => {
  const params = {
    form: data,
    replyTo: replyTo.value!
  }
  emit('submit', params)
  cancelReply()
}

/**
 * 评论回复成功后，更新评论列表
 */
const handleAddNewReply = (reply: Comment) => {
  // 将回复的评论的回复 添加到对应回复的下面

  const replyCurrentIndex = replyList.value?.findIndex((item) => item.id === reply.replyId)

  replyList.value?.splice(replyCurrentIndex! + 1, 0, reply)
}

const handleAddNewReplyToTop = (reply: Comment) => {
  replyList.value?.unshift(reply)
}

defineExpose({
  replyListState,
  getReplyList,
  handleAddNewReply,
  handleAddNewReplyToTop
})
</script>
