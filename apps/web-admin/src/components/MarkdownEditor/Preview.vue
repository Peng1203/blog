<template>
  <div
    ref="previewRef"
    class="preview-con"
    :style="{ height }"
  >
    <!-- 文章内容 -->
    <MdPreview
      :editorId="state.id"
      :modelValue="model"
      v-bind="$attrs"
    />

    <el-aside
      v-if="catalogVisible"
      class="catalog-container"
    >
      <div
        flex-c-c
        class="catalog-headend"
      >
        <h2>文章目录</h2>
        <i
          ml10
          class="iconfont icon-folderopen"
        ></i>
      </div>

      <MdCatalog
        :editorId="state.id"
        :scrollElement="previewRef"
      />
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { PreviewAttibute } from './types'

defineEmits(['catalogClick'])

const model = defineModel({ type: String })

withDefaults(defineProps<PreviewAttibute>(), {
  height: '400px',
  catalogVisible: true,
})

const state = reactive({
  id: 'my-editor',
})

const previewRef = ref<RefType>(null)
</script>

<style scoped lang="scss">
.preview-con {
  display: flex;
  .catalog-container {
    width: 300px;
    margin-left: 1rem;
    padding: 10px;
    background-color: #fff;
    .catalog-headend {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 900;
      text-align: center;
    }
  }

  :deep(.md-editor-catalog-active) {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    font-weight: 700;
    font-size: 16px;

    &::before {
      // margin-right: 5px;
      // content: '#';
      // content: ' ';
      // border-left: 1px solid;
    }
  }
}
</style>
