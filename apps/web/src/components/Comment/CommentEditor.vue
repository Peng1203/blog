<template>
  <div class="relative">
    <EditorContent
      :editor="editor"
      class="comment-editor"
    />
    <span
      class="absolute bottom-2 right-2 text-gray-500"
      style="font-size: 12px"
    >
      字数：{{ wordCount }}/{{ maxLength }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

// interface Props

const props = withDefaults(
  defineProps<{
    maxLength?: number
    placeholder?: string
  }>(),
  {
    maxLength: 200,
    placeholder: '请输入内容...'
  }
)

const modelValue = defineModel<string>()

const editor = ref<Editor>()
const wordCount = ref(0)

const resetContent = () => {
  modelValue.value = ''
  editor.value?.commands.setContent('')
  wordCount.value = 0
}

onMounted(() => {
  editor.value = new Editor({
    content: modelValue.value,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: props.placeholder
      })
    ],
    editorProps: {
      attributes: {
        class:
          'focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl h-20 overflow-y-auto tiptap is-editor-empty border border-gray-300 rounded-md p-2 m-0 font-12'
      }
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText()
      wordCount.value = content.length

      if (wordCount.value > props.maxLength) {
        editor.commands.setContent(content.slice(0, props.maxLength))
        wordCount.value = props.maxLength
      }

      nextTick(() => {
        modelValue.value = content.length ? editor.getHTML() : ''
      })
    }
  })
})

onUnmounted(() => {
  editor.value?.destroy()
})

defineExpose({
  resetContent,
  focusEditor: () => editor.value?.commands.focus()
})

// watch(
//   () => modelValue.value,
//   (newValue) => {
//     if (editor.value && newValue !== editor.value.getHTML()) {
//       editor.value.commands.setContent(newValue)
//     }
//   }
// )
</script>

<style lang="scss">
.tiptap {
  font-size: 12px;
  p.is-editor-empty:first-child::before {
    font-size: 12px;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
}
</style>
