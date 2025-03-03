<template>
  <div>
    <!-- <VueCropper
      centerBox
      outputType="jpeg"
      style="transform: scale(0.4)"
      :canMoveBox="false"
      :canScale="false"
      :img="imageInfo.url"
      :style="{ width: `${imageInfo.width}px`, height: `${imageInfo.height}px` }"
    ></VueCropper> -->

    <el-upload
      class="upload-demo"
      drag
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleSelectFile"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or
        <em>click to upload</em>
      </div>
    </el-upload>
    <el-button @click="handleSave">保存</el-button>

    {{ imageInfo }}
    <br />
    {{ cropBox }}

    <div
      v-show="imageInfo.url"
      class="editor_image_container"
    >
      <img
        id="originImg"
        :width="imageInfo.width"
        :height="imageInfo.height"
        :src="imageInfo.url"
      />

      <!-- 裁切遮罩层 -->
      <div
        ref="cropperRef"
        class="cropper_modal"
      />

      <!-- 裁切容器 -->
      <div
        class="cropper_crop_box"
        ref="cropperBoxRef"
        :style="{
          width: `${cropBox.width}px`,
          height: `${cropBox.height}px`,
          transform: `translateX(${cropBox.translateX}px) translateY(${cropBox.translateY}px)`,
        }"
      >
        <img
          :width="imageInfo.width"
          :height="imageInfo.height"
          :src="imageInfo.url"
          :style="{
            transform: `translateX(-${cropBox.translateX}px) translateY(-${cropBox.translateY}px)`,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { UploadFile, UploadFiles } from 'element-plus'
import { onMounted, reactive, useTemplateRef } from 'vue'
import { getImageDimensions } from '@/utils/file'

const imageInfo = reactive({
  url: '',
  width: 800,
  height: 0,
  zoom: 1,
  originWidth: 0,
  originHeight: 0,
})

const cropBox = reactive({
  // 截取状态
  status: false,
  url: '',
  width: 0,
  height: 0,

  startPoint: { x: 0, y: 0 },
  translateX: 0,
  translateY: 0,
})

const handleSelectFile = async (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(`%c e ----`, 'color: #fff;background-color: #000;font-size: 18px', uploadFile, uploadFiles)
  const { width, height, url } = await getImageDimensions(uploadFile.raw)
  imageInfo.originWidth = width
  imageInfo.originHeight = height
  imageInfo.zoom = imageInfo.width / width
  imageInfo.height = height * imageInfo.zoom
  imageInfo.url = url

  console.log('width ------', width)
  console.log('height ------', height)
  console.log('url ------', url)
}

const cropperRef = useTemplateRef('cropperRef')
const cropperBoxRef = useTemplateRef('cropperBoxRef')

type Point = {
  x: number
  y: number
}
const getCropBoxWH = (startPoint: Point, endPoint: Point) => {
  // let width = 0
  // let height = 0
  return {
    width: startPoint.x > endPoint.x ? startPoint.x - endPoint.x : endPoint.x - startPoint.x,
    height: startPoint.y > endPoint.y ? startPoint.y - endPoint.y : endPoint.y - startPoint.y,
  }
}

const handleSave = () => {
  const { width, height, translateX, translateY } = cropBox
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  const img = document.querySelector('#originImg') as HTMLImageElement
  // 获取图片的缩放比例（基于图片的自然尺寸和显示尺寸）
  const scaleX = img.naturalWidth / img.width
  const scaleY = img.naturalHeight / img.height

  // 根据缩放比例调整裁切区域的大小和位置
  const cropX = translateX * scaleX
  const cropY = translateY * scaleY
  const cropWidth = width * scaleX
  const cropHeight = height * scaleY

  // 裁切并绘制图片到canvas上
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height)
  // ctx.drawImage(img, translateX, translateY, width, height)

  const url = canvas.toDataURL('image/jpg')
  const a = document.createElement('a')

  a.href = url
  a.download = '裁切'
  a.target = '_blank'
  a.click()
}

onMounted(() => {
  cropperRef.value.addEventListener('mousedown', e => {
    cropBox.status = true
    const startPoint = {
      x: e.offsetX,
      y: e.offsetY,
    }
    cropBox.startPoint = startPoint
  })

  cropperRef.value.addEventListener('mousemove', e => {
    if (!cropBox.status) return
    const startPoint = {
      x: e.offsetX,
      y: e.offsetY,
    }

    cropBox.translateX = Math.min(startPoint.x, cropBox.startPoint.x)
    cropBox.translateY = Math.min(startPoint.y, cropBox.startPoint.y)

    const { width, height } = getCropBoxWH(cropBox.startPoint, startPoint)
    cropBox.width = width
    cropBox.height = height
    // console.log('mousemove ------', startPoint)
  })

  cropperRef.value.addEventListener('mouseup', e => {
    cropBox.status = false
    const endPoint = {
      x: e.offsetX,
      y: e.offsetY,
    }
    console.log('mouseup ------', endPoint)
  })

  cropperRef.value.addEventListener('mouseleave', () => {
    console.log('离开了父容器 ------')
    cropBox.status = false
  })

  cropperBoxRef.value.addEventListener('mouseenter', () => {
    console.log('进入了裁切容器 ------')
  })
})
</script>

<style scoped lang="scss">
.editor_image_container {
  width: 100%;
  max-width: 800px;
  position: relative;
  margin: 0;
  padding: 0;

  .cropper_modal {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;

    background-color: #000;
    opacity: 0.5;

    cursor: crosshair;
  }

  img {
    vertical-align: middle;
    user-select: none;
    -webkit-user-drag: none; /* 适用于 WebKit 内核浏览器 */
  }

  .cropper_crop_box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    overflow: hidden;

    cursor: move;
  }
}
</style>
