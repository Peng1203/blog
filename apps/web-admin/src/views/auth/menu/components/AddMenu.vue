<template>
  <Dialog
    :title="isAddChildren ? '添加子菜单' : '添加菜单'"
    v-model="addMenuDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <Form
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="addMenuState.formItemList"
      v-model="addMenuState.data"
    >
      <template #iconSlot>
        <IconSelector
          :prepend="preIcon"
          v-model="addMenuState.data.menuIcon"
        />
      </template>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType, computed, defineAsyncComponent } from 'vue'
import { useMenuApi } from '@/api/menu/index'
import Dialog from '@/components/Dialog'
import Form, { FormItem } from '@/components/Form'
import { MenuData, AddMenuType } from '../types'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'))

const { addMenu } = useMenuApi()

const emits = defineEmits(['updateList'])

const props = defineProps({
  isAddChildren: {
    type: Boolean,
    default: false,
  },
  parentRow: {
    type: Object as PropType<MenuData>,
    default: () => ({}),
  },
})

const addMenuDialogStatus = ref<boolean>(false)

const addMenuState = reactive({
  data: ref<AddMenuType>({
    menuName: '',
    menuUri: '',
    menuPath: '',
    menuIcon: '',
    orderNum: 0,
    isKeepalive: 0,
    isHidden: 0,
  }),
  formItemList: ref<FormItem<AddMenuType>[]>([
    {
      type: 'input',
      label: '菜单名',
      prop: 'menuName',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 8, trigger: 'blur' },
      ],
    },
    {
      type: 'input',
      label: '菜单URI',
      prop: 'menuUri',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 4, max: 16, trigger: 'blur' },
      ],
    },
    {
      type: 'input',
      label: '访问路径',
      prop: 'menuPath',
      // statrPre: '/',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 18, trigger: 'blur' },
      ],
    },
    {
      type: 'slot',
      label: '图标',
      prop: 'menuIcon',
      slotName: 'iconSlot',
    },
    {
      type: 'switch',
      label: '缓存',
      prop: 'isKeepalive',
      tValue: 1,
      fValue: 0,
      span: 10,
    },
    {
      type: 'switch',
      label: '隐藏',
      prop: 'isHidden',
      tValue: 1,
      fValue: 0,
      span: 10,
    },
    {
      type: 'inputNum',
      label: '排序',
      prop: 'orderNum',
      minVal: 0,
      maxVal: 20,
      controlsR: true,
    },
  ]),
})

const addFormRef = ref<any>(null)
// 处理添加操作
const handleAdd = async () => {
  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewMenu()
  if (!addRes) return
  handleDialogClose()
  emits('updateList')
}

const addNewMenu = async (): Promise<boolean> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars

    const params = {
      ...addMenuState.data,
      parentId: props.isAddChildren ? props.parentRow.id : 0,
    }
    const { data: res } = await addMenu<MenuData>(params)
    const { code, success, message } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg(message, '')
    return true
  } catch (error) {
    console.log('error ------', error)
    return false
  }
}

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (addMenuState.data.menuIcon) return addMenuState.data.menuIcon
  else return 'ele-Pointer'
})

// 下拉选择切换
// const handleSelectChange = ({ newVal, prop, index }) => {};

// // switch 选项切换
// const handleSwitchChange = ({ newVal, prop, index }) => {};

// radios 单选框切换
// const handleRadioChange = ({ newVal, prop, index }) => {};

const resetAddForm = () => {
  addMenuState.data.menuName = ''
  addMenuState.data.menuPath = ''
  addMenuState.data.menuUri = ''
  addMenuState.data.menuIcon = ''
  addMenuState.data.isKeepalive = 0
  addMenuState.data.isHidden = 0
}

const handleDialogClose = () => {
  resetAddForm()
  addFormRef.value.getRef().resetFields()
  addMenuDialogStatus.value = false
}

defineExpose({ addMenuDialogStatus })
</script>

<style lang="scss" scoped></style>
