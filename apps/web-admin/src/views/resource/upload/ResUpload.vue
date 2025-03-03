<template>
  <div
    ref="el"
    class="table-container layout-padding resource-upload-container"
  >
    <el-upload
      class="hidden md:block"
      drag
      multiple
      :auto-upload="false"
      :show-file-list="false"
      :on-change="(uploadInfo: UploadFile)=> handleFileChange(uploadInfo.raw)"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽或点击选择上传文件</div>
      <div>上传文件不得大于 {{ MAX_SIZE_MB }} Mb</div>
    </el-upload>

    <div class="select-file-row flex">
      <el-upload
        multiple
        :auto-upload="false"
        :show-file-list="false"
        :on-change="(uploadInfo: UploadFile)=> handleFileChange(uploadInfo.raw)"
      >
        <!-- :on-change="test" -->
        <PengButton
          type="primary"
          size="default"
          icon="ele-Files"
        >
          选择文件
        </PengButton>
      </el-upload>

      <PengButton
        ml10
        type="primary"
        size="default"
        icon="ele-Folder"
        color="#ffe791"
        @click="handleSelectDirectory"
      >
        选择文件夹
      </PengButton>

      <!-- 上传大文件 -->
      <UploadLargeFile
        ref="uploadLargeFileRef"
        @change="item => tableState.data.unshift(item)"
      />

      <PengButton
        ml10
        type="info"
        size="default"
        icon="ele-DeleteFilled"
        class="hidden md:block"
        @click="tableState.data = []"
      >
        清空
      </PengButton>
    </div>

    <!-- 文件状态过滤操作行 -->

    <!-- 文件列表 -->
    <PengTable
      flex1
      empty-text="暂无文件"
      operation-column-width="200"
      :operation-column-btns="[]"
      :border="false"
      :pager="false"
      :data="tableState.data"
      :columns="tableState.columns"
    >
      <!-- 文件名称 -->
      <template #nameSlot="{ row }">
        <span>
          <!-- {{ row.name }} -->
          <el-input
            size="small"
            v-model="row.name"
            :disabled="row.status === StatusEnum.SUCCESS"
            placeholder="请输入文件名"
          >
            <!-- <template #append>.{{ row.type }}</template> -->
          </el-input>
        </span>
      </template>

      <!-- 状态 -->
      <template #statusSlot="{ row }">
        <el-tag
          type="info"
          size="small"
          v-if="row.status === StatusEnum.PENDING"
        >
          待上传
        </el-tag>

        <!-- 上传中 进度条 0 ~ 100 -->
        <!-- :color="row.uploadProcess === 100 ? '#67c23a' : '#409eff'" -->
        <!-- :status="row.uploadProcess === 100 ? 'success' : ''" -->
        <el-progress
          :show-text="false"
          :percentage="row.uploadProcess"
          v-else-if="row.status === StatusEnum.UPLOADING"
        />

        <el-tag
          size="small"
          type="success"
          v-else-if="row.status === StatusEnum.SUCCESS"
        >
          上传成功
        </el-tag>

        <el-tag
          size="small"
          type="danger"
          tip="点击重试"
          @click="
            () => {
              row.uploadProcess = 0
              handleExeUploadMethod(row)
            }
          "
          v-else-if="row.status === StatusEnum.FAIL"
        >
          上传失败 {{ row.errMsg }}
        </el-tag>

        <el-tag
          size="small"
          type="primary"
          v-else-if="row.status === StatusEnum.CALC_HASH"
        >
          生成文件Hash {{ row.errMsg }}
        </el-tag>
      </template>

      <!-- 上传压缩 -->
      <template #isCompressSlot="{ row }">
        <div v-if="row.size > MAX_SIZE_VALUE">大文件不支持压缩</div>
        <div v-else-if="row.mimeType.includes('image')">
          <span v-if="row.mimeType.includes('gif')">不支持压缩gif图</span>
          <el-switch
            v-else
            v-model="row.isCompress"
          />
        </div>

        <span v-else>仅针对图片类型生效</span>
      </template>

      <!-- 操作列 -->
      <template #operationStartSlot="{ row, scope }">
        <!-- {{ row }} -->

        <!-- 上传 -->
        <PengButton
          circle
          title="上传"
          size="small"
          type="primary"
          icon="ele-Upload"
          :disabled="row.status === StatusEnum.SUCCESS"
          @click="handleExeUploadMethod(row)"
        />

        <!-- 暂停/继续 -->
        <!-- <PengButton
          v-if="isLargeFile(row.size) && row.status === StatusEnum.UPLOADING"
          circle
          size="small"
          type="info"
          :title="row.pause ? '继续' : '暂停'"
          :color="row.pause ? '#007BFF' : '#6C757D'"
          :disabled="!(row.status === StatusEnum.UPLOADING)"
          @click="handleUploadToggle(row)"
        >
          <i
            style="margin-right: 0 !important"
            class="iconfont"
            :class="row.pause ? 'icon-kaishi' : 'icon-zanting'"
          />
        </PengButton> -->

        <!-- 删除 -->
        <PengButton
          circle
          title="删除"
          size="small"
          type="danger"
          icon="ele-Delete"
          @click="handleDelete(row, scope)"
        />

        <!-- 预览 -->
        <PengButton
          circle
          title="预览"
          size="small"
          type="success"
          icon="ele-View"
          @click="handlePreView(row)"
          v-if="row.mimeType.includes('image')"
        />

        <!-- 复制 url -->
        <PengButton
          circle
          title="复制"
          size="small"
          type="info"
          icon="CopyDocument"
          color="#007BFF"
          v-copy="row.url"
          v-if="row.url"
        />

        <!-- 下载 -->
        <!-- <PengButton
          circle
          title="下载"
          size="small"
          type="info"
          icon="Download"
          color="#28A745"
          v-if="row.url"
        /> -->
      </template>
    </PengTable>

    <!-- 上传按钮 上传文件信息统计 -->
    <div
      class="upload-inof-row"
      flex-sb-c
    >
      <PengButton
        type="primary"
        size="default"
        icon="ele-UploadFilled"
        :disabled="!tableState.data.length"
        @click="handleUpload"
      >
        开始上传
      </PengButton>

      <div class="hidden md:block">
        <el-tag
          type="info"
          size="small"
          effect="light"
        >
          文件数量: {{ uploadInfo.files }}
        </el-tag>
        <el-tag
          size="small"
          effect="light"
          type="success"
        >
          成功上传: {{ uploadInfo.successFiles }}
        </el-tag>
        <el-tag
          size="small"
          effect="light"
          type="danger"
        >
          上传失败: {{ uploadInfo.failFiles }}
        </el-tag>
        <el-tag
          size="small"
          effect="light"
        >
          <!-- {{ uploadInfo.filesTotalSize }} byte ≈  -->
          总大小: {{ formatByteSize(uploadInfo.filesTotalSize as number) }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import { FileData, StatusEnum } from './types'
import { ElUpload, UploadFile } from 'element-plus'
import { useResourceApi } from '@/api'
import { blobToFile, compressImage, formatByteSize, imageToBase64 } from '@/utils/file'
import { api as viewerApi } from 'v-viewer'
import { BroadcastChannelEnum, CodeEnum, MB } from '@/constants'
import UploadLargeFile from './components/UploadLargeFile.vue'
import { watch } from 'vue'
import { useResourceStore } from '@/stores/resource'
import { useTableState } from '@/hooks/useTableState'

const { uploadResource } = useResourceApi()

const uploadLargeFileRef = ref<RefType>(null)

// 正常上传文件大小
const MAX_SIZE_MB = 5
const MAX_SIZE_VALUE = MB * MAX_SIZE_MB

const { tableState, setColumns } = useTableState<FileData>()

setColumns([
  {
    label: '文件名',
    prop: 'name',
    sort: true,
    minWidth: 100,
    // tooltip: true,
    slotName: 'nameSlot',
  },
  {
    label: '类型',
    prop: 'type',
    sort: true,
  },
  {
    label: '大小',
    prop: 'size',
    sort: true,
    formatter: ({ size }) => formatByteSize(size),
  },
  {
    label: '状态',
    prop: 'status',
    sort: true,
    slotName: 'statusSlot',
  },
  {
    label: '上传压缩',
    prop: 'isCompress',
    slotName: 'isCompressSlot',
    tooltip: true,
  },
])

// 文件列表信息统计
const uploadInfo = ref({
  files: computed(() => tableState.data.length),
  successFiles: computed(() => tableState.data.filter(file => file.status === StatusEnum.SUCCESS).length),
  failFiles: computed(() => tableState.data.filter(file => file.status === StatusEnum.FAIL).length),
  filesTotalSize: computed<number>(() => _.sum(tableState.data.map(file => file.size))),
})

// 选择文件夹上传
const handleSelectDirectory = () => {
  const inputEl: HTMLInputElement = document.createElement('input')
  inputEl.type = 'file'
  inputEl.webkitdirectory = true
  // 用于兼容 openg浏览器和 火狐浏览器
  ;(inputEl as any).mozdirectory = true
  ;(inputEl as any).odirectory = true
  inputEl.click()

  inputEl.onchange = () => {
    for (let i = 0; i < inputEl.files.length; i++) {
      const file = inputEl.files[i]
      handleFileChange(file)
    }

    // 选择完成 删除创建的 input 元素
    inputEl.remove()
  }
}

const handleFileChange = async (file: File, maxFileSize = MAX_SIZE_VALUE) => {
  const { name, size, type } = file

  // prettier-ignore
  // if (size > maxFileSize) return useNotificationMsg('', `请选择小于${maxFileSize / MB}MB的文件`, 'warning', 2);
  if (size > maxFileSize) return uploadLargeFileRef.value.handleFileChange(file)

  const fileItem: FileData = {
    url: '',
    name,
    size,
    type: name.split('.')[name.split('.').length - 1],
    status: StatusEnum.PENDING,
    fileData: file,
    mimeType: type,
    isCompress: type.includes('image') && !type.includes('gif'),
  }

  tableState.data.unshift(fileItem)
}

const handleUpload = () => {
  tableState.data.forEach(item => item.status === StatusEnum.PENDING && handleExeUploadMethod(item))
}

// 根据文件大小 判断走正常上传还是 大文件分片上传
const handleExeUploadMethod = (row: FileData) => {
  if (row.size <= MAX_SIZE_VALUE) uploadFile(row)
  else uploadLargeFileRef.value.handleUploadLargeFile(row)
}

// 正常上传
const uploadFile = async (fileItem: FileData) => {
  fileItem.status = StatusEnum.UPLOADING
  try {
    const formData = await fileToFormData(fileItem)
    const { data: res } = await uploadResource(
      formData,
      event => (fileItem.uploadProcess = event.progress * 100),
      fileItem
    )
    // 当 res 响应时 onUploadProgress 事件 回调函数将不会再执行 但可能会触发1~2次 res 响应之前 已经触发的回调
    const { success, code, data } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return
    fileItem.uploadProcess = 1
    fileItem.status = StatusEnum.SUCCESS
    fileItem.url = data
  } catch (e) {
    console.log('e', e)
    fileItem.errMsg = e.message
    fileItem.status = StatusEnum.FAIL
  }
}

// 获取文件的 FormData 并且判断是否是 图片类型且开启了压缩
const fileToFormData = async (fileItem: FileData): Promise<FormData> => {
  const { fileData, isCompress, name, type } = fileItem
  const formData = new FormData()
  if (isCompress) {
    const compressFile = (await compressImage(fileData)) as Blob
    const newFile = blobToFile(compressFile, name.replace(`.${type}`, ''))
    formData.append('file', newFile)
  } else formData.append('file', fileData)
  return formData
}

const handleDelete = (row: FileData, scope) => {
  tableState.data.splice(scope.$index, 1)
  row.cancel && row.cancel()
}

// 图片预览
const handlePreView = async (fileItem: FileData) => {
  const { fileData, isCompress } = fileItem
  let dateUrl = ''
  if (isCompress) {
    const compressFile = (await compressImage(fileData)) as Blob
    const newFile = blobToFile(compressFile)
    dateUrl = await imageToBase64(newFile)
  } else {
    dateUrl = await imageToBase64(fileData)
  }

  viewerApi({ images: [dateUrl] })
}

const PASTE_EVENT = 'paste'
const el = ref<RefType<HTMLDivElement>>(null)

// 粘贴文件快捷操作
const handlePasteEvent = (event: ClipboardEvent) => {
  const { files } = event.clipboardData

  for (let i = 0; i < files.length; i++) {
    handleFileChange(files[i])
  }
}

// 是否是大文件

const _isLargeFile = size => size > MAX_SIZE_VALUE
const _handleUploadToggle = row => uploadLargeFileRef.value.handleUploadToggle(row)

// 获取文件列表所有状态
const listStatus = computed(() => tableState.data.map(item => item.status))

const resourceStore = useResourceStore()
// 监听文件列状态变化 有新的成功上传时 更新文件列表
watch(
  () => listStatus,
  val => {
    if (!val.value.length) return
    const uploadFinish = val.value.every(status => status === StatusEnum.SUCCESS)
    if (!uploadFinish) return
    // 通知当前tab页的文件列表更新
    resourceStore.getResourceList(true)
    // 通知其他tab页的状态列表更新
    const channel = new BroadcastChannel(BroadcastChannelEnum.RESOURCE_CHANNEL)
    channel.postMessage('update')
  },
  { deep: true }
)

onMounted(() => {
  el.value && el.value.addEventListener(PASTE_EVENT, handlePasteEvent)
})

onUnmounted(() => {
  el.value && el.value.removeEventListener(PASTE_EVENT, handlePasteEvent)
})
</script>

<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}

.resource-upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
