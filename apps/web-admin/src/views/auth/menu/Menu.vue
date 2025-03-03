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
            @click="handleAddParentMenu"
          >
            <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
            <el-icon>
              <Menu />
            </el-icon>
            添加菜单
          </PengButton>

          <!-- 初始化菜单操作 -->
          <InitMenu @updateList="handleUpdate" />
        </div>

        <PengSearch
          placeholder="菜单名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <!-- defaultExpandAll -->
      <PengTable
        :pager="false"
        :data="tableState.data"
        :getData="getMenuTableData"
        :columns="tableState.columns"
        :operationColumnBtns="['add', 'edit', 'delete']"
        v-model:order="tableState.order"
        v-model:column="tableState.column"
        v-model:loading="tableState.loading"
        @addBtn="handleAddChildrenMenu"
        @editBtn="handleEditMenu"
        @deleteBtn="handleDelMenu"
      >
        <template #queryHighNightSlot="{ row, prop }">
          <span v-html="queryStrHighlight(row[prop] as string, tableState.queryStr)" />
        </template>

        <!-- 图标 -->
        <template #menuIconSlot="{ row, prop }">
          <span v-if="!row[prop]">--</span>

          <Peng-Icon
            v-else
            size="20"
            :name="row.menuIcon"
          />
        </template>

        <!-- 访问路径 -->
        <template #menuPathSlot="{ row, prop }">
          <el-link type="primary">
            {{ row[prop] }}
          </el-link>
        </template>

        <!-- 缓存 -->
        <template #isKeepaliveSlot="{ row }">
          <el-switch
            v-model="row.isKeepalive"
            :active-value="1"
            :inactive-value="0"
            size="small"
          />
          <!-- :disabled="row.children.length" -->
        </template>

        <!-- 隐藏 -->
        <template #isHiddenSlot="{ row }">
          <el-switch
            v-model="row.isHidden"
            :active-value="1"
            :inactive-value="0"
            size="small"
          />
          <!-- :disabled="row.children.length" -->
        </template>
      </PengTable>
    </el-card>

    <!-- 编辑菜单抽屉 -->
    <EditMenuDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加菜单对话框 -->
    <AddMenuDialog
      ref="addDialogRef"
      :parentRow="parentRow"
      :isAddChildren="isAddChildren"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts" name="Menu">
import { defineAsyncComponent, onMounted, ref, useTemplateRef } from 'vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useMenuApi } from '@/api'
import { useMenuInfo } from '@/stores/menuList'
import { MenuData, MenuListData } from './types'
import InitMenu from './components/InitMenu.vue'
import { useTableState } from '@/hooks/useTableState'
import { CodeEnum } from '@/constants'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'

const { getMenus, deleteMenu } = useMenuApi()

const menuStore = useMenuInfo()

const { tableState, setColumns, setData, startLoading, stopLoading, getCommonParams } = useTableState<MenuData>()

setColumns([
  {
    label: '菜单名',
    prop: 'menuName',
    minWidth: 120,
    tooltip: true,
    fixed: 'left',
    slotName: 'queryHighNightSlot',
    className: 'expand-row',
  },
  {
    label: '图标',
    prop: 'menuIcon',
    minWidth: 100,
    tooltip: true,
    slotName: 'menuIconSlot',
    align: 'center',
  },
  {
    label: '访问路径',
    prop: 'menuPath',
    slotName: 'menuPathSlot',
    minWidth: 170,
    tooltip: true,
  },
  {
    label: '缓存',
    prop: 'isKeepalive',
    slotName: 'isKeepaliveSlot',
    align: 'center',
    minWidth: 80,
  },
  {
    label: '隐藏',
    prop: 'isHidden',
    slotName: 'isHiddenSlot',
    align: 'center',
    minWidth: 80,
  },
  {
    label: '排序',
    prop: 'orderNum',
    align: 'center',
    minWidth: 80,
  },
  // { label: '持有角色', prop: 'roles', minWidth: 200, tooltip: true },
  { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: 'custom' },
  { label: '创建时间', prop: 'createTime', minWidth: 200, sort: 'custom' },
])

// 获取菜单表格数据
const getMenuTableData = async () => {
  try {
    startLoading()
    const params = getCommonParams(['page', 'pageSize'])
    const { data: res } = await getMenus<MenuListData>(params)
    const { code, success, data } = res
    if (code !== CodeEnum.GET_SUCCESS || !success) return
    setData(data.list)
  } catch (e) {
    console.log(e)
  } finally {
    stopLoading()
  }
}

// 搜索
const handleSearch = () => getMenuTableData()

// 处理删除菜单
const handleDelMenu = async (row: MenuData) => {
  const delRes = await deleteMenuById(row.id)
  if (!delRes) return
  handleUpdate()
}

// 删除菜单
const deleteMenuById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteMenu<string>(id)
    const { code, data, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    useNotificationMsg('', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 处理编辑菜单
const EditMenuDrawer = defineAsyncComponent(() => import('./components/EditMenu.vue'))
let editDrawerRef = useTemplateRef('editDrawerRef')
const editRow = ref<MenuData>()
const handleEditMenu = (row: MenuData) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

const isAddChildren = ref<boolean>()
const handleAddChildrenMenu = (row: MenuData) => {
  parentRow.value = row
  isAddChildren.value = true
  addDialogRef.value.addMenuDialogStatus = true
}

const handleAddParentMenu = () => {
  isAddChildren.value = false
  addDialogRef.value.addMenuDialogStatus = true
}

// 添加子菜单的父菜单
const parentRow = ref<MenuData>()
// 处理添加菜单
const AddMenuDialog = defineAsyncComponent(() => import('./components/AddMenu.vue'))
let addDialogRef = useTemplateRef('addDialogRef')

// 处理子组件通知父组件更新列表
const handleUpdate = () => {
  getMenuTableData()
  menuStore.getMenuData(true)
}

onMounted(() => {
  getMenuTableData()
})
</script>
