<template>
  <Drawer
    :title="'修改菜单信息'"
    v-model="editDrawerStatus"
    @clickConfirm="handleSaveEdit"
  >
    <Form
      ref="editFormRef"
      label-p="top"
      :labelW="100"
      :formItems="editFormState.formItemList"
      v-model="formData"
    >
      <template #iconSlot>
        <IconSelector
          :prepend="preIcon"
          v-model="formData.menuIcon"
        />
      </template>
    </Form>
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, defineAsyncComponent, computed } from 'vue'
import { useMenuApi } from '@/api/menu/index'
import Form, { FormItem } from '@/components/Form'
import Drawer from '@/components/Drawer'
import { MenuData, EditMenuType, EditProps } from '../types'
import { CodeEnum } from '@/constants'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useFormWatcher } from '@/hooks/useFormWatcher'

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'))
const { updataMenu } = useMenuApi()

const props = withDefaults(defineProps<EditProps>(), {
  editRow: () => ({} as MenuData),
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const formData = ref<EditMenuType>({
  id: 0,
  menuName: '',
  menuUri: '',
  menuPath: '',
  menuIcon: '',
  orderNum: 0,
  isKeepalive: 0,
  isHidden: 0,
})
const editFormState = reactive({
  formItemList: ref<FormItem<EditMenuType>[]>([
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
      span: 24,
    },
    {
      type: 'switch',
      label: '隐藏',
      prop: 'isHidden',
      tValue: 1,
      fValue: 0,
      span: 24,
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

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (formData.value.menuIcon) return formData.value.menuIcon
  else return 'ele-Pointer'
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const validRes = editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const editRes = await saveEditMenu()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditMenu = async (): Promise<boolean> => {
  try {
    const { id, ...params } = formData.value
    const { data: res } = await updataMenu<string>(id, params)
    const { code, data, success } = res
    if (code !== CodeEnum.UPDATE_SUCCESS || !success) return false
    useNotificationMsg(data, '')
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

useFormWatcher(() => props.editRow, formData)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, val => {
  if (!val) editFormRef.value.getRef().resetFields()
})

defineExpose({ editDrawerStatus })
</script>
