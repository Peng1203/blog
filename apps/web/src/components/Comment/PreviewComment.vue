<template>
  <el-dialog
    v-model="previewVisible"
    title="预览"
    width="80%"
    :close-on-click-modal="false"
  >
    <CommentItem
      ip="''"
      device=""
      userAgent=""
      :id="0"
      :likes="0"
      :dislikes="0"
      :isDeleted="false"
      :isTop="0"
      :createTime="new Date().toISOString()"
      :updateTime="new Date().toISOString()"
      :location="{ city: '未知', isp: '未知', country: '未知', province: '未知' }"
      v-bind="previewData"
      :targetId="0"
      :parentId="0"
      :replyId="0"
      :type="commentType"
      :blogUrl="previewData?.blogUrl || ''"
      :avatar="previewData!.avatar"
      :email="previewData!.email || ''"
      :userId="previewData?.userId || 0"
      :name="previewData?.name || '匿名用户'"
      :content="previewData!.content"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="previewVisible = false"> 关 闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import CommentItem from './CommentItem.vue'
import type { AddCommentDto } from '@/apis/dto'
import type { CommentType } from '@/constant'

const previewVisible = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    previewData: AddCommentDto
    commentType: CommentType
  }>(),
  {
    previewData: {} as any
  }
)
</script>

<style scoped lang="scss"></style>
