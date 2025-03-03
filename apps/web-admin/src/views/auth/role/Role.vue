<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <PengButton
          size="default"
          type="success"
          @click="addDialogRef.addRoleDialogStatus = true"
        >
          <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
          <Peng-Icon name="icon-jiaoseguanli1" />
          <span ml5>添加角色</span>
        </PengButton>

        <Search
          placeholder="角色名称 / 角色描述"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <PengTable
        :operationColumnWidth="200"
        :operationColumnBtns="['edit', 'delete', 'view']"
        :data="tableState.data"
        :columns="tableState.columns"
        :getData="getRoleTableData"
        :total="tableState.total"
        v-model:page="tableState.page"
        v-model:pageSize="tableState.pageSize"
        v-model:order="tableState.order"
        v-model:column="tableState.column"
        v-model:loading="tableState.loading"
        @editBtn="handleEditRole"
        @deleteBtn="handleDelRole"
        @viewBtn="handleViewRole"
      >
        <template #queryHighNightSlot="{ row, prop }">
          <span v-html="queryStrHighlight((row[prop] as string), tableState.queryStr)" />
        </template>
      </PengTable>
    </el-card>

    <!-- 添加角色对话框 -->
    <AddRoleDialog
      ref="addDialogRef"
      @updateList="handleUpdate"
    />

    <!-- 编辑角色抽屉 -->
    <EditRoleDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 查看角色 -->
    <ViewRoleDialog
      :viewRow="viewRow"
      ref="viewDialogRef"
    />
  </div>
</template>

<script setup lang="ts" name="SystemRole">
import { defineAsyncComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useRoleApi } from '@/api/role/index'
import { useRolesInfo } from '@/stores/roleList'
import { RoleData, RoleListData, RoleEntityData } from './types'
import Search from '@/components/Search'
import { useTableState } from '@/hooks/useTableState'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'

const { getRole, deleteRole } = useRoleApi()

const roleStore = useRolesInfo()

const {
  tableState, //
  setData,
  setTotal,
  setColumns,
  startLoading,
  stopLoading,
  getCommonParams,
} = useTableState<RoleData>()

setColumns([
  {
    label: '角色名称',
    prop: 'roleName',
    minWidth: 130,
    tooltip: true,
    fixed: 'left',
    slotName: 'queryHighNightSlot',
  },
  {
    label: '角色描述',
    prop: 'description',
    minWidth: 150,
    sort: false,
    tooltip: true,
    slotName: 'queryHighNightSlot',
  },
  { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: 'custom' },
  { label: '创建时间', prop: 'createTime', minWidth: 200, sort: 'custom' },
])

// 获取角色表格数据
const getRoleTableData = async () => {
  try {
    startLoading()
    const params = getCommonParams()
    const { data: res } = await getRole<RoleListData>(params)

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
  getRoleTableData()
}

// 处理删除角色
const handleDelRole = async (row: RoleData) => {
  const delRes = await deleteRoleById(row.id)
  if (!delRes) return
  handleUpdate()
}

// 删除角色
const deleteRoleById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteRole<string>(id)
    const { code, data, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    ElMessage.success(data)
    useNotificationMsg('', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 处理编辑角色
const editRow = ref<RoleEntityData>()
const EditRoleDrawer = defineAsyncComponent(() => import('./components/EditRole.vue'))
const editDrawerRef = ref<RefType>(null)
const handleEditRole = (row: RoleEntityData) => {
  editRow.value = row
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加角色
const AddRoleDialog = defineAsyncComponent(() => import('./components/AddRole.vue'))
const addDialogRef = ref<RefType>(null)

// 查看角色
const viewRow = ref<RoleEntityData>()
const ViewRoleDialog = defineAsyncComponent(() => import('./components/ViewRole.vue'))
const viewDialogRef = ref<RefType>(null)
const handleViewRole = (row: RoleEntityData) => {
  viewRow.value = row
  viewDialogRef.value.viewRoleDialogStatus = true
}

// 更新列表
const handleUpdate = () => {
  getRoleTableData()
  roleStore.getRoleData(true)
}

// 页面加载时
onMounted(() => {
  getRoleTableData()
})
</script>

<style lang="scss" scoped></style>
