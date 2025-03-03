<template>
  <div flex>
    <VueCropper
      ref="cropperRef"
      :img="img"
      :outputSize="outputSize"
      :outputType="outputType"
      :style="{ width, height }"
      v-bind="$attrs"
      @realTime="handleRealPreview"
    />

    <div
      flex1
      flex-sb-c
    >
      <el-avatar
        :size="25"
        :src="previewInfo.base64"
      />

      <el-avatar
        :size="50"
        :src="previewInfo.base64"
      />

      <el-avatar
        :size="120"
        :src="previewInfo.base64"
      />
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { CropperAttribute } from './types'
import _ from 'lodash'

const model = defineModel({ type: Blob })

const emits = defineEmits(['change'])

withDefaults(defineProps<CropperAttribute>(), {
  outputSize: 0.8,
  outputType: 'jpeg',
  width: '600px',
  height: '350px',
})

const cropperRef = ref<RefType>()

const previewInfo = ref({
  url: '',
  html: '',
  base64: '',
})
/** 实时预览 */
const handleRealPreview = _.debounce(async data => {
  previewInfo.value = data

  const [base64_data, blob_data] = await Promise.all([getCropData(), getCropBlob()])
  previewInfo.value.base64 = base64_data

  model.value = blob_data
  emits('change', { dateUrl: base64_data, blobData: blob_data })
}, 300)

/** 获取裁剪之后图片的base64 */
const getCropData = (): Promise<string> => {
  return new Promise(resolve => {
    cropperRef.value.getCropData(data => resolve(data))
  })
}

/** 获取裁剪之后图片的blob数据 */
const getCropBlob = (): Promise<Blob> => {
  return new Promise(resolve => {
    cropperRef.value.getCropBlob(data => resolve(data))
  })
}

// const handleUpload = async () => {
//   const [base64_data, blob_data] = await Promise.all([getCropData(), getCropBlob()]);
//   console.log('base64_data ------', base64_data);
//   console.log('blob_data ------', blob_data);
// };
</script>

<style scoped lang="scss"></style>
