<template>
  <div class="peng-editor-container">
    <MdEditor
      ref="mdEditorRef"
      v-model="model"
      :codeFoldable="false"
      :theme="getCurrentTheme"
      :language="props.lang"
      :showCodeRowNumber="showCodeRowNumber"
      :tableShape="[10, 6]"
      :autoDetectCode="true"
      :toolbars="toolbarConfigHashMapping[toolbarModel]"
      v-bind="$attrs"
      @onUploadImg="handleUploadImg"
      @onSave="handleDownSave"
    >
      <template #defToolbars>
        <EmojiExtension :onInsert="insert" />
      </template>
    </MdEditor>
  </div>
</template>

<script lang="ts" setup>
import { InsertContentGenerator, MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
// 引入公共库中的预览主题
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css'
import { allToolbars, commonToolbars } from './config/index'
import { MarkdownEditorAttibute } from './types'
import { useComponentRef } from '@/composables/useComponentRef'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { blobToFile, compressImage } from '@/utils/file'
import EmojiExtension from './components/Emoji'
import { useThemeConfig } from '@/stores/themeConfig'
import { storeToRefs } from 'pinia'

const themeStore = useThemeConfig()

const { themeConfig } = storeToRefs(themeStore)

const model = defineModel({ type: String })

const mdEditorRef = useComponentRef(MdEditor)

const toolbarConfigHashMapping = {
  all: allToolbars,
  common: commonToolbars,
}

const emit = defineEmits(['update:modelValue', 'uploadImg', 'fastSave', 'pasteUploadImg'])

const insert = (generator: InsertContentGenerator) => {
  ;(<any>mdEditorRef.value).insert(generator)
}

const props = withDefaults(defineProps<MarkdownEditorAttibute>(), {
  toolbarModel: 'common',
  preTheme: 'default',
  lang: 'zh-CN',
  codeTheme: 'atom',
  showCodeRowNumber: true,
  height: '400px',
})

// 工具栏上传图片事件
// cb: (urls: Array<string>) => void
const handleUploadImg = async (files: File[]) => {
  console.log(`%c files ----`, 'color: #fff;background-color: #000;font-size: 18px', files)
  // emit('uploadImg', files, cb);
  for (let i = 0; i < files.length; i++) {
    handlePasteUploadImg(files[i], ['Files'])
  }
}

// ctrl + s 保存事件
const handleDownSave = async (val: string, html: Promise<string>) =>
  html.then(htmlVal => emit('fastSave', val, htmlVal))

const inputEl = ref<RefType<HTMLDivElement>>()
const PASTE_EVENT = 'paste'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const addPasteUploadImg = () => {
  inputEl.value = mdEditorRef.value.$el.querySelector('.md-editor-input-wrapper')

  if (!inputEl.value) return

  inputEl.value.addEventListener(PASTE_EVENT, pasteUploadImgCb)
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const removePasteUploadImg = () => {
  if (!inputEl.value) return
  inputEl.value.removeEventListener(PASTE_EVENT, pasteUploadImgCb)
}

// 粘贴事件回调处理
const pasteUploadImgCb = async (event: ClipboardEvent) => {
  const { clipboardData } = event
  const { types, files } = clipboardData
  // console.log('types ------', types);
  // console.log('files ------', files);
  // console.log('items ------', items);

  for (let i = 0; i < files.length; i++) {
    handlePasteUploadImg(files[i], types)
  }
}

// 触发通知父组件上传图片
const handlePasteUploadImg = async (file: File, types: readonly string[]) => {
  // 粘贴内容是否为文件
  if (!types.includes('Files')) return
  // 粘贴文件是否为图片
  if (!file.type.includes('image')) return

  // 压缩图片
  const compressFile = (await compressImage(file)) as Blob
  // blob转换为file
  const newFile = blobToFile(compressFile)

  emit('pasteUploadImg', {
    file: newFile,
    cb: (imgUrl: string) => insterImageContent(imgUrl),
  })
}

// 在光标处插入图片
const insterImageContent = content => {
  ;(mdEditorRef.value as any).insert(() => {
    return {
      targetValue: `![](${content})\n`,
      select: false,
      deviationStart: 0,
      deviationEnd: 0,
    }
  })
}

const getCurrentTheme = computed<'light' | 'dark'>(() => {
  switch (themeConfig.value.themeMode) {
    case '':
    case 'light':
      return 'light'
    case 'dark':
      return 'dark'
    default:
      return 'light'
  }
})

onMounted(() => {
  // addPasteUploadImg();
})

onUnmounted(() => {
  // removePasteUploadImg();
})
</script>

<style lang="scss" scoped>
.peng-editor-container {
  width: 100%;
  .md-editor {
    height: v-bind('props.height');
  }
}
</style>
