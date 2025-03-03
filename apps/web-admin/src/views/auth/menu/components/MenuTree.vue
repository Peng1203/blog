<template>
  <div w100>
    <!-- <MenuTree v-model:checked-menu="checkedMenuKeys" /> -->
    <el-input
      v-if="filter"
      size="small"
      v-model="filterText"
      placeholder="菜单名"
    />
    <el-scrollbar
      mt5
      :height="`${height}px`"
    >
      <el-skeleton
        :rows="5"
        animated
        v-if="!data?.length && loading"
      />
      <el-tree
        v-else
        check-strictly
        show-checkbox
        node-key="id"
        ref="treeRef"
        :data="data"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        :default-expanded-keys="expandedKeys"
        :filter-node-method="filterNode"
        @check="handleCheckboxChange"
      >
        <template #default="{ node, data }">
          <Peng-Icon
            v-if="data.menuIcon"
            size="20"
            :name="data.menuIcon"
          />
          <span ml5>
            {{ data.menuName }}
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, onMounted, PropType, watch } from 'vue'
import { ElTree } from 'element-plus'
import { useMenuInfo } from '@/stores/menuList'
import { MenuData } from '../types'

const emits = defineEmits(['update:checkedMenu'])

const props = defineProps({
  checkedMenu: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  filter: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  height: {
    type: Number as PropType<number>,
    default: 200,
  },
})

const loading = ref<boolean>(false)

const menuStore = useMenuInfo()

const defaultProps = {
  children: 'children',
  label: 'menuName',
}

const filterText = ref('')

// 选中的数据
const checkedKeys = ref<number[]>([])
// 默认展开的数据
const expandedKeys = ref<number[]>([])
// 树形结构数据
const data = ref<MenuData[]>()

const handleCheckboxChange = (checkedNodes: MenuData, checkedInfo: any) => {
  emits('update:checkedMenu', checkedInfo.checkedKeys)
}

const handleReset = () => {
  checkedKeys.value = []
  treeRef.value!.setCheckedKeys([])
}

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.menuName.includes(value)
}

const treeRef = ref<InstanceType<typeof ElTree>>()
watch(filterText, val => {
  treeRef.value!.filter(val)
})

watch(
  () => menuStore.menuList,
  val => (data.value = val),
  { deep: true }
)

watch(
  () => props.checkedMenu,
  val => (checkedKeys.value = JSON.parse(JSON.stringify(val))),
  {
    deep: true,
    immediate: true,
  }
)

onMounted(async () => {
  loading.value = true
  await menuStore.getMenuData().finally(() => (loading.value = false))
  data.value = menuStore.menuList
})

defineExpose({ handleReset })
</script>

<style scoped lang="scss"></style>
