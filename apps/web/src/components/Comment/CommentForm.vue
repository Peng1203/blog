<template>
  <!-- {{ form }} -->
  <el-form
    :model="form"
    class="sm:flex sm:gap-4"
  >
    <!-- 头像 -->
    <el-avatar
      :size="50"
      :src="form.avatar || DEFAULT_AVATAR"
      style="flex: 0 0 auto"
    />

    <el-row
      class="flex-1"
      :gutter="20"
      style="align-items: center"
    >
      <!-- 用户信息输入区 -->
      <el-col
        :span="8"
        :xl="8"
        :lg="8"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <el-form-item prop="name">
          <el-input
            v-model="form.name"
            :placeholder="anonmousUserName"
          >
            <template #prepend>昵称</template>
            <!-- <template #append>
              <el-button
                type="primary"
                class="w-12"
              >
                <i class="iconfont icon-suijishushengcheng"></i>
              </el-button>
            </template> -->
          </el-input>
        </el-form-item>
      </el-col>

      <el-col
        :span="8"
        :xl="8"
        :lg="8"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="选填"
            @input="handleEmailChange"
          >
            <template #prepend>邮箱</template>
            <!-- <template #append>@qq.com</template> -->
          </el-input>
        </el-form-item>
      </el-col>

      <el-col
        :span="8"
        :xl="8"
        :lg="8"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <el-form-item prop="blogUrl">
          <el-input
            v-model="form.blogUrl"
            placeholder="选填"
          >
            <template #prepend>网址</template>
          </el-input>
        </el-form-item>
      </el-col>

      <!-- 评论编辑器 -->
      <el-col :span="24">
        <CommentEditor
          ref="commentEditorRef"
          v-model="form.content as string"
          :placeholder="placeholder"
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
            <el-button
              @click="handlePreview"
              :disabled="!form.content"
            >
              预览
            </el-button>
            <el-button
              type="primary"
              @click="handleSubmit"
              :disabled="!form.content"
              :loading="props.loading"
            >
              提交
            </el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import CommentEditor from './CommentEditor.vue'
import type { AddCommentDto } from '@/apis/dto'
import type { CommentType } from '@/constant'
import { DEFAULT_AVATAR } from '@/constant'
import { anonmousUserName } from './store'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    maxLength?: number
  }>(),
  {
    loading: false
  }
)

const emit = defineEmits<{
  submit: [formData: AddCommentDto]
  preview: [formData: AddCommentDto]
}>()

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
const placeholder = ref(
  `✍️ 请输入评论内容\n📝 支持 Markdown 语法\n🖼️ 输入 QQ 邮箱自动获取头像\n📧 回复评论通过邮箱通知 请保证邮箱可用性`
)

const handleEmailChange = () => {
  if (!form.value.email) return (form.value.avatar = '')

  if (form.value.email.includes('@qq.com')) {
    form.value.avatar = `https://q1.qlogo.cn/g?b=qq&nk=${form.value.email}&s=100`
  }
  // https://qlogo.store.qq.com/qzone/2567810155/2567810155/100
  // https://q1.qlogo.cn/g?b=qq&nk=2567810155&s=100
}

const COMMENT_INFO_KEY = 'commentInfo'

const handleSubmit = () => {
  if (!form.value.content) return ElMessage.warning('请输入评论内容')
  // if (!form.value.email) return ElMessage.warning('请输入邮箱')
  localStorage.setItem(
    COMMENT_INFO_KEY,
    JSON.stringify({
      ...form.value,
      content: ''
    })
  )
  emit('submit', form.value)
}

const handlePreview = () => {
  if (!form.value.content) return ElMessage.warning('请输入评论内容')
  emit('preview', form.value)
}

const initCommentInfo = () => {
  const commentInfo = localStorage.getItem(COMMENT_INFO_KEY)
  if (commentInfo) {
    const { avatar, name, blogUrl, email } = JSON.parse(commentInfo) as AddCommentDto
    form.value.name = name
    form.value.email = email
    form.value.avatar = avatar
    form.value.blogUrl = blogUrl
  }
}

const editorRef = useTemplateRef('commentEditorRef')

const resetCommentInfo = () => {
  form.value.content = ''
  editorRef.value?.resetContent()
}

onMounted(() => {
  initCommentInfo()
})

defineExpose({
  resetCommentInfo
})
</script>

<style scoped lang="scss">
:deep(.el-input-group__append) {
  padding: 0 10px;
}

:deep(.el-form-item__content) {
  justify-content: space-between;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
