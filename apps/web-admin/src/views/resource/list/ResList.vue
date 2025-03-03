<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div
        mb15
        flex-sb-c
      >
        <div>
          <PengButton
            size="default"
            type="primary"
            :disabled="!tableState.selectVal.length"
            v-model:loading="tableState.loading"
            @click="handleBatchDown"
          >
            <el-icon>
              <Download />
            </el-icon>
            下 载
          </PengButton>

          <PengButton
            size="default"
            type="danger"
            :disabled="!tableState.selectVal.length"
            v-model:loading="tableState.loading"
            @click="handleBatchDel"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删 除
          </PengButton>
        </div>

        <div>
          <el-tag
            type="info"
            size="small"
            effect="light"
          >
            文件数量: {{ dataList.length }}
          </el-tag>

          <el-tag
            type="success"
            size="small"
            effect="light"
          >
            选中文件数: {{ tableState.selectVal.length }}
          </el-tag>

          <el-tag
            size="small"
            effect="light"
            type="primary"
          >
            总大小: {{ formatByteSize(filesTotalSize) }}
          </el-tag>
        </div>
      </div>
      <!-- :border="false" -->

      <!-- :data="dataList" -->
      <PengTable
        selection
        row-key="url"
        operationColumn
        :operationColumnWidth="180"
        :operationColumnBtns="['delete']"
        :data="showDataList"
        :total="dataList.length"
        :getData="getDataList"
        :columns="tableState.columns"
        :default-sort="{ prop: 'ctime', order: 'descending' }"
        v-model:loading="tableState.loading"
        v-model:page="tableState.page"
        v-model:pageSize="tableState.pageSize"
        @deleteBtn="handleDelete"
        @dbRowClick="handleRowDbClikc"
        @selectionChange="val => (tableState.selectVal = val)"
      >
        <template #nameSlot="{ row }">
          <span v-html="queryStrHighlight(row.name, tableState.queryStr)" />
        </template>

        <template #operationHeaderSlot>
          <div flex-sb-c>
            <el-input
              size="small"
              v-model="tableState.queryStr"
            />

            <PengButton
              ml5
              size="small"
              type="primary"
              icon="RefreshRight"
              @click="handleRefreshList"
            />
          </div>
        </template>

        <template #operationStartSlot="{ row }">
          <PengButton
            circle
            title="复制"
            size="small"
            type="info"
            icon="CopyDocument"
            color="#007BFF"
            v-copy="row.url"
          />

          <PengButton
            circle
            title="下载"
            size="small"
            type="success"
            icon="Download"
            @click="handleDownload(row)"
          />

          <PengButton
            circle
            title="预览"
            size="small"
            type="info"
            icon="ele-View"
            @click="handlePreView(row)"
          />
        </template>
      </PengTable>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="ResourceList">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useResourceStore } from '@/stores/resource'
import type { ResourceListItem } from './types'
import request from '@/utils/request'
import FileSaver from 'file-saver'
import axios, { AxiosProgressEvent, Canceler } from 'axios'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { api as viewerApi } from 'v-viewer'
import { concurRequest } from '@/utils/concurRequest'
import { BroadcastChannelEnum } from '@/constants'
import { formatByteSize } from '@/utils/file'
import _ from 'lodash'
import { useTableState } from '@/hooks/useTableState'

defineOptions({
  name: 'ResourceList',
})

const store = useResourceStore()

const { tableState, setColumns, startLoading, stopLoading } = useTableState<ResourceListItem>()

setColumns([
  {
    label: '名称',
    prop: 'name',
    tooltip: true,
    slotName: 'nameSlot',
  },
  {
    label: '修改日期',
    prop: 'atime',
    sort: true,
    width: 165,
  },
  {
    label: '创建日期',
    prop: 'ctime',
    sort: true,
    width: 165,
  },
  // {
  //   label: 'Mime类型',
  //   prop: 'mimeType',
  // },
  {
    label: '类型',
    prop: 'type',
    sort: true,
    width: 100,
    filters: [
      { text: '图片', value: 'image' },
      { text: '视频', value: 'video' },
      { text: '音频', value: 'audio' },
      { text: '文本', value: 'text' },
      { text: '其他', value: '' },
    ],
    filterMethod(
      value: string,
      row: ResourceListItem
      // column: TableColumnCtx<ResourceListItem>
    ) {
      if (!row.mimeType) return true

      if (value === 'text') return row.mimeType.includes(value) || ['js', 'ts'].includes(row.type)

      return row.mimeType.includes(value)
    },
  },
  {
    label: '大小',
    prop: 'size',
    width: 100,
    sort: true,
    formatter: ({ size }) => formatByteSize(size),
  },
])

const showDataList = computed(() =>
  dataList.value.slice((tableState.page - 1) * tableState.page, tableState.page * tableState.pageSize)
)

// 取消请求的函数
const cancelCbs = ref<Canceler[]>([])
const handleDownload = async (row: ResourceListItem) => {
  try {
    // 重新下载时 重置下载进度为 0
    row.process = 0
    // FileSaver 也可以通过传入 url 触发下载
    // FileSaver.saveAs(row.url, row.name)

    const { data: blobRes } = await request({
      timeout: 0,
      url: row.url,
      method: 'GET',
      responseType: 'blob',
      withCredentials: false,
      cancelToken: new axios.CancelToken(c => cancelCbs.value.push(c)),
      onDownloadProgress(event: AxiosProgressEvent) {
        if (row.process === 100) return
        row.process = event.progress * 100
      },
    })
    // 当触发 blobRes 表示下载完毕 进度设置为 100%
    row.process = 100
    // blobRes 为一个 blob 类型的数据
    FileSaver.saveAs(blobRes, row.name)
  } catch (e) {
    console.log('e', e)
  }
}

const dataList = computed<ResourceListItem[]>(() => {
  const tableData = store.list.map(item => ({ ...item, process: 0 }))
  if (!tableState.queryStr) return tableData
  return tableData.filter(
    data => !tableState.queryStr || data.name.toLowerCase().includes(tableState.queryStr.toLowerCase())
  )
})

const handlePreView = (row: ResourceListItem) => window.open(row.url, '_blank')

const handleDelete = (row: ResourceListItem) => {
  if (row.process > 0 && row.process < 100)
    return useNotificationMsg('操作失败', '当前文件正在下载 无法删除', 'warning')
  store.deleteResource(row.name)
}

const handleRefreshList = () => getDataList(true)

const handleBatchDel = async () => {
  const params = tableState.selectVal.map((item: ResourceListItem) => item.name)
  await concurRequest(params, fileName => store.deleteResource(fileName, false))

  useNotificationMsg('', '批量删除成功')
}

const handleBatchDown = async () => {
  await concurRequest(tableState.selectVal, handleDownload)
}

const getDataList = async (refresh: boolean = false) => {
  try {
    startLoading()
    await store.getResourceList(refresh)
  } catch (e) {
    console.log('e', e)
  } finally {
    stopLoading()
  }
}

const handleAcceptBroadcasts = () => {
  const channel = new BroadcastChannel(BroadcastChannelEnum.RESOURCE_CHANNEL)
  channel.onmessage = e => {
    e.data === 'update' && getDataList(true)
  }
}

const handleRowDbClikc = (row: ResourceListItem) => {
  if (!row.mimeType) return
  if (!row.mimeType.includes('image')) return
  viewerApi({ images: [row.url] })
}

const filesTotalSize = computed(() => _.sum(dataList.value.map(file => file.size)))

onMounted(() => {
  getDataList()
  handleAcceptBroadcasts()
})

onUnmounted(() => {
  cancelCbs.value.forEach(c => c && c())
})
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 5px;
}
</style>
