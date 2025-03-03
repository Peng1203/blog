<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <div>
          <PengButton
            size="default"
            type="success"
            @click="addDialogRef.addTagDialogStatus = true"
          >
            <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->

            <Peng-Icon
              class="mr5"
              name="icon-tags"
            />
            添加标签
          </PengButton>

          <PengButton
            size="default"
            type="danger"
            :disabled="!tableState.selectVal.length"
            @click="handleBatchDelete"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删 除
          </PengButton>

          <!-- :multiple-limit="5" -->
          <!-- collapse-tags -->
          <!-- <div> -->
          <!-- multiple -->
          <UserSelect
            ml10
            v-model="userId"
            @change="handleSearch"
          />

          <el-link
            type="primary"
            fz11
            class="ml10"
            @click="
              () => {
                userId = userInfoStore.userInfos.id
                handleSearch()
              }
            "
          >
            只看我自己
          </el-link>
          <el-link
            type="info"
            fz11
            class="ml10"
            @click="
              () => {
                userId = 0
                handleSearch()
              }
            "
          >
            重置
          </el-link>
          <!-- </div> -->
        </div>

        <PengSearch
          placeholder="请输入标签名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>
      <PengTable
        selection
        :data="tableState.data"
        :getData="getTagTableData"
        :total="tableState.total"
        :columns="tableState.columns"
        :default-sort="{ prop: tableState.column, order: 'descending' }"
        v-model:order="tableState.order"
        v-model:column="tableState.column"
        v-model:page="tableState.page"
        v-model:pageSize="tableState.pageSize"
        v-model:loading="tableState.loading"
        @editBtn="handleEditTag"
        @deleteBtn="handleDelTag"
        @selectionChange="value => (tableState.selectVal = value)"
      >
        <!-- 权限标识名称 权限标识代码 查询高亮 -->
        <template #queryHighNightSlot="{ row, prop }">
          <div class="flex-s-c">
            <span
              class="ml5"
              v-html="queryStrHighlight(row[prop] as string, tableState.queryStr)"
            />
          </div>
        </template>

        <!-- 标签图标 -->
        <template #iconSlot="{ row }">
          <!-- type="class" -->
          <Peng-Icon
            v-if="row.icon"
            :name="row.icon"
            size="30"
          />
          <span v-else>
            {{ '未设置图标' }}
          </span>
        </template>

        <template #updateTimeSlot="{ row, prop }">
          {{ dateFormat(row[prop] as string) }}
        </template>

        <template #createTimeSlot="{ row, prop }">
          {{ dateFormat(row[prop] as string) }}
        </template>
      </PengTable>
    </el-card>

    <!-- 编辑标签抽屉 -->
    <EditTagDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加标签对话框 -->
    <AddTagDialog
      ref="addDialogRef"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="tsx" name="ArticleTag">
import { defineAsyncComponent, ref, onMounted, useTemplateRef } from 'vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useTagApi } from '@/api/tag/index'
import { TagData, TagListData } from './'
import { useArticleInfo } from '@/stores/articleInfo'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useTableState } from '@/hooks/useTableState'
import { dateFormat } from '@/utils/date'
import { CodeEnum } from '@/constants'
import { useUserInfo } from '@/stores/userInfo'
import { UserSelect } from '@/views/user/user'

const { getTags, deleteTag, batchDeleteTag } = useTagApi()

const userInfoStore = useUserInfo()
const articleInfoStore = useArticleInfo()

const {
  tableState, //
  setData,
  setTotal,
  setColumns,
  startLoading,
  stopLoading,
  getCommonParams,
} = useTableState<TagData>()

setColumns([
  {
    label: '标签名',
    prop: 'tagName',
    minWidth: 130,
    tooltip: true,
    fixed: 'left',
    slotName: 'queryHighNightSlot',
  },
  {
    label: '图标',
    prop: 'icon',
    minWidth: 100,
    tooltip: true,
    slotName: 'iconSlot',
    align: 'center',
  },
  {
    label: '文章数',
    prop: 'articles',
    width: 130,
    align: 'center',
  },
  {
    label: '创建人',
    prop: 'userName',
    width: 130,
    align: 'center',
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    slotName: 'updateTimeSlot',
    minWidth: 200,
    sort: true,
  },
  {
    label: '创建时间',
    prop: 'createTime',
    slotName: 'createTimeSlot',
    minWidth: 200,
    sort: true,
  },
])

tableState.column = 'createTime'
tableState.order = 'DESC'
const userId = ref<number>(0)
// 表格参数
// const tableState = reactive({
//   selectVal: ref<TagData[]>([]),
//   loading: false,
//   data: ref<TagData[]>([]),
//   tableColumns: ref<ColumnItem<TagData>[]>(),
//   column: '',
//   order: '',
//   queryStr: '',

//   // 分页器信息
//   pagerInfo: ref<PageInfo>({
//     page: 1,
//     pageSize: 50,
//     total: 0,
//   }),
// })

// 获取标签表格数据
const getTagTableData = async () => {
  try {
    startLoading()
    const params = {
      userId: userId.value,
      ...getCommonParams(),
    }
    const { data: res } = await getTags<TagListData>(params)
    const { code, data, success } = res
    if (code !== CodeEnum.GET_SUCCESS || !success) return
    setData(data.list)
    setTotal(data.total)
  } catch (e) {
    console.log(e)
  } finally {
    stopLoading()
  }
}

// 搜索
const handleSearch = () => {
  tableState.page = 1
  getTagTableData()
}

const handleUpdate = () => {
  getTagTableData()
  articleInfoStore.getTagData(true)
}

// 处理删除标签
const handleDelTag = async (row: TagData) => {
  const delRes = await deleteTagById(row.id)
  if (delRes) handleUpdate()
}

// 删除标签
const deleteTagById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteTag<string>(id)
    const { code, data, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    useNotificationMsg('成功', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 批量删除标签
const deleteTags = async () => {
  try {
    const ids = tableState.selectVal.map((tag: TagData) => tag.id)
    const { data: res } = await batchDeleteTag<string>(ids)
    const { code, data, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    useNotificationMsg('成功', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const handleBatchDelete = async () => {
  const delRes = await deleteTags()
  if (delRes) handleUpdate()
}

// 处理编辑标签
const editRow = ref()
const EditTagDrawer = defineAsyncComponent(() => import('./components/EditTag.vue'))
const editDrawerRef = useTemplateRef('editDrawerRef')
const handleEditTag = (row: any) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加标签
const AddTagDialog = defineAsyncComponent(() => import('./components/AddTag.vue'))
const addDialogRef = useTemplateRef('addDialogRef')

// 页面加载时
onMounted(() => {
  getTagTableData()
})
</script>
