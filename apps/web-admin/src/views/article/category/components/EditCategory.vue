<template>
  <Drawer
    title="编辑"
    v-model="editDrawerStatus"
    @clickConfirm="handleSaveEdit"
  >
    <Form
      ref="editFormRef"
      label-p="top"
      :labelW="100"
      :formItems="editFormState.formItemList"
      v-model="editFormState.data"
    />
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import Form, { FormItem } from '@/components/Form'
import Drawer from '@/components/Drawer'
import { useCategoryApi } from '@/api/category/index'
import { CategoryData, EditProps } from '../types'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'

const { updateCategory } = useCategoryApi()

const props = withDefaults(defineProps<EditProps>(), {
  editRow: () => ({} as CategoryData),
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<CategoryData>({
    id: 0,
    categoryName: '',
    description: '',
    createTime: '',
    updateTime: '',
  }),
  formItemList: ref<FormItem<CategoryData>[]>([
    {
      type: 'input',
      label: '分类名',
      prop: 'categoryName',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      type: 'input',
      label: '描述',
      prop: 'description',
      placeholder: '',
    },
  ]),
})

const editFormRef = ref<RefType>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!valdateRes) return
  const editRes = await saveEditCategory()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditCategory = async (): Promise<boolean> => {
  try {
    const { id, categoryName, description } = editFormState.data
    const { data: res } = await updateCategory<string>(id, { categoryName, description })
    const { code, data, success } = res
    if (code !== CodeEnum.UPDATE_SUCCESS || !success) return false
    useNotificationMsg(data, '')
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

watch(
  () => props.editRow,
  (val: CategoryData) => val && (editFormState.data = JSON.parse(JSON.stringify(val)))
)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, async val => {
  if (val) return
  editFormRef.value.getRef().resetFields()
})

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
