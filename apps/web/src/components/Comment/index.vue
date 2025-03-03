<template>
  <div class="bg-white shadow-md rounded-lg p-6 mt-5 dark:bg-gray-800 dark:shadow-lg">
    <h2 class="text-xl font-bold mb-4">评 论</h2>

    <!-- 评论表单 -->
    <CommentForm
      ref="commentFormRef"
      @submit="handleSubmit"
      @preview="handlePreview"
    />

    <!-- 预览对话框 -->
    <PreviewComment
      v-model="previewVisible"
      :previewData="previewData!"
      :commentType="commentType"
    />

    <!-- 评论列表 -->
    <CommentList
      ref="commentListRef"
      :targetId="targetId"
      @reply="handleReply"
      @submit="handleReplySubmit"
      @cancel="cancelReply"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import CommentForm from './CommentForm.vue'
import CommentList from './CommentList.vue'
import PreviewComment from './PreviewComment.vue'
import { ANONMOUS_USER_NAME_KEY, EventEnum, type CommentType } from '@/constant'
import type { AddCommentDto } from '@/apis/dto'
import type { Comment } from '@/types/data'
import { addComment } from '@/apis'
import { comments, anonmousUserName } from './store'
import { bus } from '@/utils/eventBus'

const props = defineProps<{
  commentType: CommentType
  targetId: number
}>()

provide('commentType', props.commentType)
provide('targetId', props.targetId)

const previewVisible = ref(false)
const previewData = ref<AddCommentDto>()

const commentListRef = useTemplateRef('commentListRef')
const commentFormRef = useTemplateRef('commentFormRef')

const handleSubmit = async (formData: AddCommentDto) => {
  try {
    const params = {
      ...formData,
      name: formData.name || anonmousUserName.value,
      targetId: props.targetId
      // userId: 0, 登录功能实现后再补充
    }
    const { data: res } = await addComment(params)
    const { code, data, success } = res
    if (code !== 20100 || !success) return

    // ElMessage.success('评论提交成功')
    commentListRef.value?.handleShowLatestComments(data)
    commentFormRef.value?.resetCommentInfo()
    // TODO: 调用API提交评论
  } catch (error) {
    // ElMessage.error('评论提交失败')
  } finally {
    //
  }
}

const handlePreview = (formData: AddCommentDto) => {
  previewData.value = formData
  previewVisible.value = true
}

const handleReply = (comment: any) => {
  console.log('回复评论:', comment)
}

/** 回复评论 */
const handleReplySubmit = async (formData: AddCommentDto) => {
  try {
    const params = {
      ...formData,
      name: formData.name || anonmousUserName.value
    }
    const { data: res } = await addComment(params)
    const { code, data, success } = res
    if (code !== 20100 || !success) return
    ElMessage.success('回复提交成功')
    handleShowLatestReply(data)
  } catch (error) {
    ElMessage.error('回复提交失败')
  } finally {
    //
  }
}

/** 将回复的评论 添加到对应评论的下面 并展开评论列表 */
const handleShowLatestReply = (data: Comment) => {
  const parentComment = comments.value.find((item) => item.id === data.parentId)
  if (!parentComment) return
  // parentComment.replyData.unshift(data)
  // 获取并展开评论 需要通过自定义事件进行解耦操作
  bus.emit(EventEnum.SHOW_REPLY, data)
}

const cancelReply = () => {
  // 取消回复逻辑
}

onMounted(() => {
  // 当匿名名称不存在时 则初始化一个匿名名称
  if (!localStorage.getItem(ANONMOUS_USER_NAME_KEY)) {
    const uuid = window.crypto.randomUUID()
    // 生成随机匿名用户名称
    const name = `匿名用户${uuid.slice(-4)}`
    // const name = `匿名用户${Math.floor(Math.random() * 10000)}`
    localStorage.setItem(ANONMOUS_USER_NAME_KEY, name)
    anonmousUserName.value = name
  }
})
</script>
