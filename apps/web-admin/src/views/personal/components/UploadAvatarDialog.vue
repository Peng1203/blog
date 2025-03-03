<template>
  <PengDialog
    title="上传头像"
    v-model="dialogState"
    confirm-btn-text="上传"
    @click-confirm="handleUpload"
    @open="handleOpenDialog"
  >
    <!-- width="300px" height="200px" -->

    <Cropper
      centerBox
      autoCrop
      :img="imgDateUrl"
      v-model="croppedData"
    />
    <!-- @change="handleCropperChange" -->
    <el-upload
      ref="uploadRef"
      accept="image/*"
      :limit="1"
      :auto-upload="false"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :on-change="handleFileChange"
    >
      <PengButton type="primary">选择图片</PengButton>
    </el-upload>
  </PengDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Cropper from '@/components/Cropper'
import { ElUpload, UploadFile, UploadInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useUserInfo } from '@/stores/userInfo'
import { useUserApi } from '@/api'
import { CodeEnum } from '@/constants'

const { userInfos } = useUserInfo()
const { uploadUserAvatar } = useUserApi()

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const MAX_SIZE = 1024 * 1024 * 2
const dialogState = ref<boolean>(false)

const imgDateUrl = ref<string>()
const croppedData = ref<Blob>()

const handleUpload = async () => {
  try {
    const formData = new FormData()

    formData.append('file', croppedData.value)

    const { data: res } = await uploadUserAvatar(userInfos.id, formData)
    const { data, message, code, success } = res
    if (!success || code !== CodeEnum.POST_SUCCESS) return
    useNotificationMsg('操作成功', message)
    updateAvater(data)
    dialogState.value = false
  } catch (e) {
    console.log('e', e)
  }
}

const updateAvater = (url: string) => {
  userInfos.userAvatar = url
}

const handleFileChange = (uploadFile: UploadFile) => {
  const { type, size } = uploadFile.raw
  if (!type.includes('image')) return useNotificationMsg('', '请选择图片类型的文件', 'warning', 2)
  if (size > MAX_SIZE) return useNotificationMsg('', '请选择小于2MB的图片', 'warning', 2)

  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = e => (imgDateUrl.value = e.target.result as string)
}

const uploadRef = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = files => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

const handleOpenDialog = () => (imgDateUrl.value = userInfos.userAvatar || defaultAvatar)

defineExpose({ dialogState })
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>
