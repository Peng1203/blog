<template>
  <el-table
    ref="tableRef"
    v-bind="$attrs"
    v-loading="props.loading"
    row-key="id"
    :row-style="getRowStyle"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    :stripe="props.stripe"
    :border="props.border"
    :data="tableData"
    :size="props.size"
    :empty-text="props.emptyText"
    :default-expand-all="props.defaultExpandAll"
    @filter-change="handleFilterTable"
    @sort-change="handleColumnSort"
    @selection-change="handleSelectionChange"
    @row-dblclick="handleDbRowClick"
    @row-click="handleRowClick"
    @row-contextmenu="handleMouseRightRowClick"
    @header-dragend="handleHeaderDragend"
  >
    <el-table-column
      v-if="props.isSelection"
      type="selection"
      width="45"
      :selectable="checkBoxIsEnableCallBack"
    />
    <!-- :selectable="handleCheckboxIsEnable" -->
    <slot name="expand"></slot>

    <template
      :key="i"
      v-for="(
        { label, prop, width, minWidth, sort, tooltip, fixed, align, slotName, childrenColumns, classNname, ...args }, i
      ) in tableColumns"
    >
      <!-- 自定义某列 -->
      <el-table-column
        v-if="slotName"
        :prop="prop"
        :label="label"
        :width="width || 'auto'"
        :sortable="sort"
        :min-width="minWidth"
        :class-name="classNname"
        :show-overflow-tooltip="tooltip"
        :fixed="deviceClientType === 'pc' ? fixed : fixed === 'left' ? false : fixed"
        :align="align || 'left'"
        v-bind="args"
      >
        <template #default="scope">
          <slot
            :prop="prop"
            :name="slotName"
            :scope="scope"
            :row="scope.row"
          />
        </template>
      </el-table-column>

      <!-- 二级表头 -->
      <!-- :width="width || 'auto'" -->
      <el-table-column
        :label="label"
        :align="align || 'center'"
        :class-name="classNname"
        v-else-if="childrenColumns && childrenColumns.length"
      >
        <template
          :key="childrenItem.prop"
          v-for="childrenItem in childrenColumns"
        >
          <!-- 自定义内容 -->
          <el-table-column
            v-if="childrenItem.slotName"
            :class-name="classNname"
            :label="childrenItem.label"
            :prop="childrenItem.prop"
            :min-width="childrenItem.minWidth"
            :sortable="childrenItem.sort"
            :show-overflow-tooltip="childrenItem.tooltip"
            :width="childrenItem.width || 'auto'"
          >
            <template #default="scope">
              <slot
                :row="scope.row"
                :name="childrenItem.slotName"
                :prop="childrenItem.prop"
              ></slot>
            </template>
          </el-table-column>

          <el-table-column
            v-else
            :class-name="classNname"
            :label="childrenItem.label"
            :prop="childrenItem.prop"
            :min-width="childrenItem.minWidth"
            :sortable="childrenItem.sort"
            :show-overflow-tooltip="childrenItem.tooltip"
            :width="childrenItem.width || 'auto'"
          ></el-table-column>
        </template>
      </el-table-column>

      <el-table-column
        v-else
        v-bind="args"
        :prop="prop"
        :label="label"
        :width="width"
        :sortable="sort"
        :class-name="classNname"
        :min-width="minWidth || ''"
        :show-overflow-tooltip="tooltip"
        :fixed="deviceClientType === 'pc' ? fixed : false"
        :align="align || 'left'"
      />
    </template>

    <!-- 操作列 -->
    <el-table-column
      label="操作"
      fixed="right"
      align="center"
      :width="operationColumnWidth"
      v-if="props.operationColumn"
    >
      <template #header>
        <slot name="operationHeaderSlot" />
      </template>

      <template #default="scope">
        <slot
          :scope="scope"
          :row="scope.row"
          name="operationStartSlot"
        />

        <PengButton
          circle
          title="添加"
          type="success"
          :icon="Plus"
          @click="handleAddBtn(scope.row)"
          v-if="operationColumnBtns.includes('add')"
        />

        <PengButton
          circle
          title="修改信息"
          type="primary"
          :icon="Edit"
          @click="handleEditBtn(scope.row)"
          v-if="operationColumnBtns.includes('edit')"
        />

        <el-popconfirm
          width="auto"
          icon="DeleteFilled"
          icon-color="#f56c6c"
          :title="`是否删除 ?`"
          @confirm="handleDelBtn(scope.row)"
          v-if="operationColumnBtns.includes('delete')"
        >
          <template #reference>
            <PengButton
              circle
              title="删除"
              type="danger"
              :icon="Delete"
            />
          </template>
        </el-popconfirm>

        <PengButton
          circle
          title="查看"
          type="info"
          :icon="View"
          @click="handleView(scope.row)"
          v-if="operationColumnBtns.includes('view')"
        />

        <slot
          :scope="scope"
          :row="scope.row"
          name="operationEndSlot"
        />
      </template>
    </el-table-column>

    <!-- 过滤 当有二级表头时也不展示 -->
    <el-table-column
      width="30"
      fixed="right"
      align="center"
      column-key="filter"
      class-name="filter-column-header"
      filter-placement="bottom"
      :filters="filterList"
      v-if="isFilterShowColumn"
    >
      <template #header>
        <el-icon>
          <Tools />
        </el-icon>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页器 -->
  <el-pagination
    v-if="props.isNeedPager"
    size="default"
    class="mt15"
    background
    :pager-count="5"
    :page-sizes="pagerInfo?.pageSizeList || defaultPageSizeList"
    :total="Total"
    layout="total, sizes, prev, pager, next, jumper"
    v-model:current-page="Page"
    v-model:page-size="PageSize"
    @size-change="handlePageSzieChange"
    @current-change="handlePageChange"
  />
</template>

<script setup lang="ts" generic="T">
import { ref, reactive, watch, onMounted, inject, computed, onUnmounted } from 'vue'
import { ColumnItem, Props } from './types/index_backup'
import { Plus, Edit, Delete, View } from '@element-plus/icons-vue'
import { useComponentRef } from '@/composables/useComponentRef'
import { ElTable } from 'element-plus'

const deviceClientType = inject('deviceClientType')

const props = withDefaults(defineProps<Props<T>>(), {
  border: true,

  // 是否有复选
  isSelection: false,

  // 表格项复选框 启用条件函数
  checkBoxIsEnableCallBack: () => true,

  loading: false,

  // 是否展示过滤表格
  isFilterShowColumn: false,

  // 是否需要分页
  isNeedPager: true,

  // 分页器信息
  pagerInfo: () => ({ page: 1, pageSize: 10, total: 0 }),

  // 表格尺寸
  size: 'default',

  stripe: true,

  emptyText: '暂无数据',
  defaultExpandAll: false,
  operationColumn: false,
  operationColumnBtns: () => ['edit', 'delete'],
})

const emits = defineEmits([
  'columnSort',
  'pageChange',
  'pageSizeChange',
  'pageNumOrSizeChange',
  'selectionChange',
  'rowClick',
  'dbRowClick',
  'mouseRightRowClick',
  'addBtn',
  'editBtn',
  'deleteBtn',
  'viewBtn',
])

defineSlots<{
  operationSlot(props: { scope: any; row: T }): any
  operationStartSlot(props: { scope: any; row: T }): any
  [key: string]: any
}>()

const tableRef = useComponentRef(ElTable)

// 表格展示的 columns
let tableColumns = ref<ColumnItem<T>[]>([])

// 操作列的宽度
const operationColumnWidth = computed<number>(() => {
  const width = props.operationColumnWidth || 45 * props.operationColumnBtns.length
  return width > 60 ? width : 60
})

// 过滤数据
interface filterItem {
  text: string
  value: any
}
const filterList = reactive<filterItem[]>([])
watch(
  () => props.isFilterShowColumn,
  val => {
    if (!val) return
    props.columns.forEach(({ label, prop }) => prop && filterList.push({ text: label, value: prop }))
  },
  {
    deep: true,
    immediate: true,
  }
)

const tableData = computed(() => props.data)

// column排序
type OrderProp = {
  ascending: string
  descending: string
}
const handleColumnSort = ({ prop, order }: { prop: string; order: keyof OrderProp }) => {
  const orderProp: OrderProp = {
    ascending: 'ASC',
    descending: 'DESC',
  }

  emits('columnSort', {
    column: orderProp[order] ? prop : '',
    order: orderProp[order] || '',
  })
}

/**
 * 分页器
 */
// 默认可选的page大小列表
const defaultPageSizeList = [5, 10, 30, 50, 100, 200]
const handleFilterTable = (filters: any) => {
  const { filter } = filters
  if (!filter) return
  // @ts-ignore
  if (!filter.length) return (tableColumns.value = props.columns)
  // @ts-ignore
  tableColumns.value = props.columns.filter((column: ColumnItem) => !filter.includes(column.prop))
}
const Page = ref<number>(0)
const PageSize = ref<number>(0)
const Total = ref<number>(0)
// 分页器
watch(
  () => props.pagerInfo,
  val => {
    if (!val || !props.isNeedPager) return
    const { page, pageSize, total } = val
    Page.value = page
    PageSize.value = pageSize
    Total.value = total
  },
  {
    deep: true,
    immediate: true,
  }
)
const handlePageChange = (val: number) => {
  Page.value = val
  emits('pageChange', val)
  emits('pageNumOrSizeChange', { page: Page.value, pageSize: PageSize.value })
}

const handlePageSzieChange = (val: number) => {
  PageSize.value = val
  Page.value = 1
  emits('pageSizeChange', val)
  emits('pageNumOrSizeChange', { page: Page.value, pageSize: PageSize.value })
}

const handleSelectionChange = (val: any, column: any, event: any) => {
  emits('selectionChange', val, column, event)
}

const handleDbRowClick = (val: any, column: any, event: any) => {
  emits('dbRowClick', val, column, event)
}

const handleRowClick = (val: any, column: any, event: any) => {
  emits('rowClick', val, column, event)
}

const handleMouseRightRowClick = (val: any, column: any, event: any) => {
  emits('mouseRightRowClick', val, column, event)
}

// 操作按钮事件
const handleAddBtn = (row: any) => emits('addBtn', row)
const handleEditBtn = (row: any) => emits('editBtn', row)
const handleDelBtn = (row: any) => emits('deleteBtn', row)
const handleView = (row: any) => emits('viewBtn', row)

const tableContenDom = ref<RefType<HTMLDivElement>>()
// 计算出表格 fixed 的列 宽总和
const fixedTotalWidth = computed<number>({
  get: () => {
    let totalWidth = 0
    tableColumns.value.forEach(item => {
      if (item.fixed) {
        const width = item?.minWidth || item.width
        totalWidth += Number(width)
      }
    })

    return totalWidth + (props.isSelection ? 45 : 0) + (props.isFilterShowColumn ? 30 : 0) + operationColumnWidth.value
  },
  set: () => {},
})
// 设置滚轮控制表格x轴滚动 (当不存在y轴滚动条时)
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const WHEEL_EVENT = 'wheel'
const setXScrollWhell = () => {
  const rootDom = tableRef.value.$el as HTMLDivElement
  tableContenDom.value = rootDom.querySelector<HTMLDivElement>('.el-table__inner-wrapper .el-table__body-wrapper')

  tableContenDom.value.addEventListener(WHEEL_EVENT, handleWhell)
}

const clearXScrollWhell = () => tableContenDom.value.removeEventListener(WHEEL_EVENT, handleWhell)

const xScorllToValue = ref<number>(0)
const handleWhell = (event: WheelEvent) => {
  // console.log('event ------', event, event.deltaY);
  const dom = tableContenDom.value

  // 实际内容的容器
  const dateContentDom = document.querySelector('.el-table__body')
  const { clientWidth, clientHeight } = dateContentDom

  // 当没有出现横向滚动条时 则不生效
  if (clientWidth <= dom.clientWidth) return

  // 当容器存在x轴滚动条时 则不生效
  if (clientHeight > dom.clientHeight) return

  // event.deltaY 滚轮下滚动 为 100 上滚动为 -100
  // 当横向滚动 处于最右侧 只能接收负值
  if (xScorllToValue.value >= clientWidth - fixedTotalWidth.value) {
    if (event.deltaY < 0) {
      xScorllToValue.value += event.deltaY
    }
  } else if (xScorllToValue.value <= 0) {
    // 只能接收正值
    if (event.deltaY > 0) {
      xScorllToValue.value += event.deltaY
    }
  } else {
    xScorllToValue.value += event.deltaY
  }

  tableRef.value.setScrollLeft(xScorllToValue.value)
}

const handleHeaderDragend = (newWidth: number) => {
  console.log('新列宽 ------', newWidth)
}

const getRowStyle = ({ row }) => {
  return { '--process': `${row.process}%` }
}

onMounted(() => {
  // @ts-ignore
  tableColumns.value = props.columns
  setXScrollWhell()
})

onUnmounted(() => clearXScrollWhell())
</script>

<!-- expand 展开column 插槽 -->
<!-- <template #expand>
  <el-table-column width="30" type="expand" fixed="left">
    <template #default="props"> {{ props.row }} </template>
  </el-table-column>
</template> -->

<style scoped lang="scss">
:deep(.el-table__row) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
    // width: 100%;
    width: var(--process);
    height: 2px;
    transition: width 0.3s ease;
    background-color: #409eff;
  }
}
</style>

<style>
.el-table .fail-row {
  --el-table-tr-bg-color: rgba(244, 67, 54, 0.1);
}
.el-table .success-row {
  --el-table-tr-bg-color: rgba(76, 175, 80, 0.1);
}
</style>
