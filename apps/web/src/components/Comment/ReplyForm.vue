<template>
  <div class="sm:pl-12 py-4">
    <div class="reply-form">
      <!-- <div class="text-sm text-gray-500 mb-2"></div> -->
      <el-form :model="form">
        <el-row
          :gutter="20"
          style="align-items: center"
        >
          <!-- 回复编辑器 -->
          <!-- placeholder="请输入回复内容..." -->
          <el-col :span="24">
            <CommentEditor
              ref="inputRef"
              v-model="form.content as string"
              :placeholder="`回复 @${replyTo.name}：`"
              @update:wordCount="currentWordCount = $event"
            />
          </el-col>

          <!-- 操作按钮 -->
          <el-col
            :span="24"
            class="mt-2"
          >
            <el-form-item>
              <div class="flex justify-end gap-2">
                <el-button @click="cancelReply">取消回复</el-button>
                <el-button
                  type="primary"
                  @click="handleSubmit"
                  :disabled="!form.content"
                  :loading="loading"
                >
                  提交回复
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import CommentEditor from './CommentEditor.vue'
import type { Comment } from '@/types/data'
import type { AddCommentDto } from '@/apis/dto'
import type { CommentType } from '@/constant'
import { useRoute } from 'vue-router'

interface Props {
  /** 回复对象 */
  replyTo: Comment
  /**
   * 父级评论
   * 回复 组件存在2种情况
   *  1. 回复父级评论
   *  2. 回复评论的评论
   * 情况1 replyTo 和 parentComment 为同一个对象
   * 情况2 replyTo 为评论的评论 parentComment 为父级评论
   **/
  parentComment: Comment
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [formData: any]
  cancel: []
}>()

const route = useRoute()

const commentType = inject<CommentType>('commentType')

const form = ref<AddCommentDto>({
  name: '',
  email: '',
  blogUrl: '',
  content: '',
  avatar: '',
  parentId: 0,
  userId: 0,
  targetId: 0,
  replyId: 0,
  type: commentType!
})

const currentWordCount = ref(0)

const handleSubmit = () => {
  if (!form.value.content) return ElMessage.warning('请输入回复内容')
  // if (!form.value.email) return ElMessage.warning('请输入邮箱')

  emit('submit', {
    ...form.value,
    replyId: 0, // 根据 replyTo 中的 parentId 来判断是否为回复主评论
    parentId: props.parentComment.id,
    targetId: +route.params.id || 0
  })
}

const cancelReply = () => {
  emit('cancel')
}

const COMMENT_INFO_KEY = 'commentInfo'

const inputRef = useTemplateRef('inputRef')

onMounted(() => {
  const commentInfo = localStorage.getItem(COMMENT_INFO_KEY)
  if (commentInfo) {
    const { avatar, name, blogUrl, email } = JSON.parse(commentInfo) as AddCommentDto
    form.value.name = name
    form.value.email = email
    form.value.avatar = avatar
    form.value.blogUrl = blogUrl
  }

  // 打开回复框时 自动聚焦
  inputRef.value?.focusEditor()
})
</script>

<style scoped lang="scss">
.reply-form {
  // background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  @apply dark:bg-gray-800;
}
</style>
