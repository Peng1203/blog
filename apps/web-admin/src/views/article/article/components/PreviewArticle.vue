<template>
  <PengDialog
    width="80%"
    height="80vh"
    :operationRow="false"
    :title="articleInfo.title || ''"
    v-model="previewDialogStatus"
  >
    <Preview
      height="calc(70vh - 45px)"
      v-model="articleInfo.content"
    />
  </PengDialog>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { ArticleData } from '../types'
import { Preview } from '@/components/MarkdownEditor'

const previewDialogStatus = defineModel({ type: Boolean })

const articleInfo = defineModel('row', {
  type: Object as PropType<ArticleData>,
  default: () => ({} as ArticleData),
})
</script>

<style lang="scss" scoped></style>
