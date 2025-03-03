<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <div class="mb15 flex-sb-c">
        <div>
          <PengButton
            size="default"
            type="success"
            @click="addDialogRef.addCategoryDialogStatus = true"
          >
            <Peng-Icon
              name="icon-fenlei"
              class="mr5"
            />
            添加分类
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
        </div>

        <PengSearch
          placeholder="请输入分类名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>
      <PengTable
        selection
        :data="tableState.data"
        :columns="tableState.columns"
        :getData="getCategoryTableData"
        :total="tableState.total"
        :default-sort="{ prop: tableState.column, order: 'descending' }"
        v-model:order="tableState.order"
        v-model:column="tableState.column"
        v-model:page="tableState.page"
        v-model:pageSize="tableState.pageSize"
        v-model:loading="tableState.loading"
        @editBtn="handleEditCategory"
        @deleteBtn="handleDelCategory"
        @selectionChange="value => (tableState.selectVal = value)"
      >
        <template #categoryNameSlot="{ row }">
          <div class="flex-s-c">
            <span
              class="ml5"
              v-html="queryStrHighlight(row.categoryName, tableState.queryStr)"
            />
          </div>
        </template>
      </PengTable>
    </el-card>

    <!-- 编辑分类抽屉 -->
    <EditCategoryDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加分类对话框 -->
    <AddCategoryDialog
      ref="addDialogRef"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts" name="ArticleCategory">
import { defineAsyncComponent, ref, onMounted, useTemplateRef } from 'vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useCategoryApi } from '@/api/category/index'
import { CategoryData, CategoryListDate } from './types'
import { useArticleInfo } from '@/stores/articleInfo'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useTableState } from '@/hooks/useTableState'
import { CodeEnum } from '@/constants'
import { UserSelect } from '@/views/user/user'
import { useUserInfo } from '@/stores/userInfo'

const { getCategorys, deleteCategory, batchDelete } = useCategoryApi()

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
} = useTableState<CategoryData>()

setColumns([
  {
    label: '分类名称',
    prop: 'categoryName',
    minWidth: 130,
    tooltip: true,
    fixed: 'left',
    slotName: 'categoryNameSlot',
  },
  {
    label: '文章数',
    prop: 'articles',
    width: 130,
    align: 'center',
  },
  {
    label: '描述',
    prop: 'description',
    minWidth: 300,
    align: 'center',
  },
  {
    label: '创建人',
    prop: 'userName',
    width: 130,
    align: 'center',
  },
  { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: 'custom' },
  { label: '创建时间', prop: 'createTime', minWidth: 200, sort: 'custom' },
])

tableState.column = 'createTime'
tableState.order = 'DESC'
const userId = ref<number>(0)

// 获取分类表格数据
const getCategoryTableData = async () => {
  try {
    startLoading()
    const params = {
      userId: userId.value,
      ...getCommonParams(),
    }
    const { data: res } = await getCategorys<CategoryListDate>(params)
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
  getCategoryTableData()
}

// 处理删除分类
const handleDelCategory = async (row: CategoryData) => {
  const delRes = await deleteCategoryById(row.id)
  if (delRes) handleUpdate()
}

// 删除分类
const deleteCategoryById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteCategory<string>(id)
    const { code, data, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    useNotificationMsg('成功', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const deleteCategorys = async () => {
  try {
    const ids = tableState.selectVal.map(({ id }) => id)
    const { data: res } = await batchDelete<string>(ids)
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
  const delRes = await deleteCategorys()
  if (delRes) handleUpdate()
}

// 处理编辑分类
const editRow = ref<CategoryData>()
const EditCategoryDrawer = defineAsyncComponent(() => import('./components/EditCategory.vue'))
const editDrawerRef = useTemplateRef('editDrawerRef')
const handleEditCategory = (row: CategoryData) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加分类
const AddCategoryDialog = defineAsyncComponent(() => import('./components/AddCategory.vue'))
const addDialogRef = useTemplateRef('addDialogRef')

const handleUpdate = () => {
  getCategoryTableData()
  articleInfoStore.getCategoryData(true)
}

onMounted(() => {
  getCategoryTableData()
})
</script>
