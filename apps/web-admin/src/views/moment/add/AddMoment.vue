<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <template #header>
        <div class="card-header flex-sb-c">
          <span>发布动态</span>

          <PengButton
            type="primary"
            @click="handlePublish"
          >
            发 布
          </PengButton>
        </div>
      </template>

      <!-- {{ form }} -->
      <PengForm
        ref="formRef"
        :labelW="'120px'"
        :rules="formRules"
        :formItems="formItems"
        v-model="form"
      >
        <template #contentSlot>
          <el-input
            ref="textareaRef"
            type="textarea"
            v-model="form.content"
          />
          <EmojiSelect @change="handleEmojiSelectChange" />
        </template>

        <template #mediaUrlSlot>
          <div style="width: 100%; min-height: 12rem">
            <el-upload
              multiple
              ref="uploadRef"
              list-type="picture-card"
              accept="image/*,video/*"
              v-model:file-list="fileList"
              :auto-upload="false"
              :on-change="handleSelectFileChange"
            >
              <el-icon><Plus /></el-icon>

              <template #file="{ file }">
                <div class="file-pre-item">
                  <img
                    :src="file.url"
                    class="el-upload-list__item-thumbnail"
                    v-if="file.raw.type.includes('image')"
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePreview(file)"
                    >
                      <el-icon>
                        <zoom-in />
                      </el-icon>
                    </span>

                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </div>
        </template>
      </PengForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue'
import { useFormState, useNotificationMsg } from '@/hooks'
import { useUserInfo } from '@/stores/userInfo'
import type { AddMomentForm, MomentData } from '../types'
import { ElUpload, type UploadUserFile, type UploadFile, type FormRules } from 'element-plus'
import { api as viewerApi } from 'v-viewer'
import { useComponentRef } from '@/composables/useComponentRef'
import { useCommonApi, useMomentApi } from '@/api'
import { CodeEnum } from '@/constants'
import { concurRequest } from '@/utils/concurRequest'
import { startFullFoading, endFullFoading } from '@/utils/fullLoading'
import { useRouter } from 'vue-router'
import { compressImage } from '@/utils/file'
import { omit } from 'lodash'

const { uploadImage } = useCommonApi()
const { addMoment } = useMomentApi()

const router = useRouter()
const store = useUserInfo()

const fileList = ref<UploadUserFile[]>([])
const { form, formItems, setFormItems } = useFormState<AddMomentForm>({
  content: '',
  isTop: 0,
  mediaUrls: [],
  status: 1,
  userId: store.userInfos.id,
  originalDrawing: [],
})

const formRules = reactive<FormRules<AddMomentForm>>({
  content: [{ required: true, trigger: 'blur' }],
})

setFormItems([
  {
    // type: 'textarea',
    type: 'slot',
    label: '内容',
    prop: 'content',
    slotName: 'contentSlot',
    span: 16,
  },
  {
    type: 'slot',
    label: '图片',
    prop: 'mediaUrls',
    slotName: 'mediaUrlSlot',
    span: 16,
  },
  {
    type: 'checkbox',
    label: '原图',
    prop: 'originalDrawing',
    slotName: 'originSlot',
    span: 16,
    options: [{ label: '', value: true }],
  },
  {
    type: 'switch',
    label: '置顶',
    prop: 'isTop',
    tValue: 1,
    fValue: 0,
    span: 16,
  },
  {
    type: 'radio',
    label: '状态',
    prop: 'status',
    placeholder: '',
    options: [
      { label: '公开', value: 1 },
      { label: '私密', value: 2 },
    ],
    span: 16,
  },
])

const formRef = useTemplateRef('formRef')

const ElUploadInstance = useComponentRef(ElUpload)
const uploadRef = useTemplateRef<typeof ElUploadInstance.value>('uploadRef')

const textareaRef = useTemplateRef('textareaRef')
const getCursorPosition = (): number => textareaRef.value.ref.selectionStart

const handleEmojiSelectChange = (emoji: string) => {
  const index = getCursorPosition()
  form.value.content = insertStringAt(form.value.content, index, emoji)

  setTimeout(() => {
    const focusIndex = index + emoji.length
    textareaRef.value.ref.setSelectionRange(focusIndex, focusIndex)
    textareaRef.value.focus()
  })
}

const insertStringAt = (str: string, index: number = 0, content: string = '') => {
  const start = str.slice(0, index)
  const end = str.slice(index)

  return `${start}${content}${end}`
}

const handleSelectFileChange = (uploadFile: UploadFile) => {
  console.log(`%c uploadFile ----`, 'color: #fff;background-color: #000;font-size: 18px', uploadFile)
}
const handlePreview = (uploadFile: UploadFile) => {
  if (!uploadFile.raw.type.includes('image')) return
  viewerApi({ images: [uploadFile.url] })
}
const handleRemove = (uploadFile: UploadFile) => uploadRef.value.handleRemove(uploadFile)

const handlePublish = async () => {
  const isValidate = await new Promise(response => formRef.value.getRef().validate(response))
  if (!isValidate) return
  startFullFoading()
  // 上传图片
  const updateStatus = await batchUpload()
  if (!updateStatus) return endFullFoading()
  // 发布动态
  const publishStatus = await publishMoment()
  endFullFoading()

  publishStatus && router.push({ name: 'MomentList' })
}

// 上传图片
const handleUploadImage = async (file: File) => {
  try {
    const uploadFile = form.value.originalDrawing.length ? file : ((await compressImage(file)) as Blob)

    const formData = new FormData()
    formData.append('file', uploadFile)
    const { data: res } = await uploadImage(formData)
    const { data, code, success } = res
    if (!success || code !== CodeEnum.POST_SUCCESS) return
    return data
  } catch (e) {
    console.log('e', e)
    return ''
  }
}

// 批量上传
const batchUpload = async () => {
  const paramsArr = fileList.value.map(item => item.raw)
  const request = file => handleUploadImage(file).then(res => res)

  const uploadResult = await concurRequest(paramsArr, request)
  if (uploadResult.includes('')) return false

  form.value.mediaUrls = uploadResult.filter(url => url) as string[]
  return true
}

const publishMoment = async () => {
  try {
    const params = omit(form.value, 'originalDrawing')
    const { data: res } = await addMoment<MomentData>(params)
    const { code, success } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg('', '发布成功')
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card),
:deep(.el-upload-list__item),
.file-pre-item {
  width: 70px;
  height: 70px;
}
:deep(.el-card__body) {
  overflow: auto;
}
</style>
