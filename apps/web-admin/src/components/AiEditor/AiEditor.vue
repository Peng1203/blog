<template>
  <div
    ref="divRef"
    :style="{ height }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useAttrs } from 'vue'
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import _ from 'lodash'
import { AiEditorAttrs } from './types'
import { blobToFile, compressImage } from '@/utils/file'

const attrs = useAttrs()

withDefaults(defineProps<AiEditorAttrs>(), {
  height: '400px',
})

const emit = defineEmits(['pasteUploadImg'])

let modelValue = defineModel({ type: String, required: true })
const divRef = ref<RefType>()
let aiEditor: AiEditor | null = null

// 内容变化 获取目录 getOutline()
const handleContenChange = _.debounce((editor: AiEditor) => (modelValue.value = editor.getMarkdown()), 300)

const handleUploadImage = (file: File): Promise<Record<string, any>> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    // 压缩图片
    const compressFile = (await compressImage(file)) as Blob
    // blob转换为file
    const newFile = blobToFile(compressFile)
    emit('pasteUploadImg', {
      file: newFile,
      cb: (src: string) => resolve({ errorCode: 0, data: { src } }),
    })
  })
}

const initEditor = () => {
  const {
    VITE_AI_EDITOR_SPARK_APIKEY,
    VITE_AI_EDITOR_SPARK_APISECRET,
    VITE_AI_EDITOR_SPARK_APPID,
    VITE_AI_EDITOR_SPARK_VERSION,
  } = import.meta.env

  aiEditor = new AiEditor({
    element: divRef.value,
    placeholder: (attrs?.placeholder as string) || '选中输入',
    content: modelValue.value,
    onChange: handleContenChange,
    ai: {
      models: {
        spark: {
          appId: VITE_AI_EDITOR_SPARK_APPID,
          apiKey: VITE_AI_EDITOR_SPARK_APIKEY,
          apiSecret: VITE_AI_EDITOR_SPARK_APISECRET,
          version: VITE_AI_EDITOR_SPARK_VERSION,
        },
        bubblePanelEnable: true,
        bubblePanelModel: 'spark',
      },
    },
    image: {
      allowBase64: false,
      uploader: handleUploadImage,
    },
  })

  // 初始化设置文本
  // aiEditor && aiEditor.setContent(modelValue.value);
}

const destroyEditor = () => aiEditor && aiEditor.destroy()

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  destroyEditor()
})
</script>
