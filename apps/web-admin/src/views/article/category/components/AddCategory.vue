<template>
  <Dialog
    title="添加标签"
    v-model="addCategoryDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <PengForm
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="formItems"
      v-model="form"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from '@/components/Dialog'
import { useCategoryApi } from '@/api/category/index'
import { AddCategoryType, CategoryData } from '../types'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'
import { useFormState } from '@/hooks'
import { useUserInfo } from '@/stores/userInfo'

const { addCategory } = useCategoryApi()

const emits = defineEmits(['updateList'])

const userInfoStore = useUserInfo()

const addCategoryDialogStatus = ref<boolean>(false)

const { form, formItems, setFormItems, handleInitForm } = useFormState<AddCategoryType>({
  categoryName: '',
  description: '',
})

setFormItems([
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
])

const addFormRef = ref<RefType>(null)
// 处理添加操作
const handleAdd = async () => {
  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewCategory()
  if (!addRes) return
  handleDialogClose()
  emits('updateList')
}

// 添加分类
const addNewCategory = async (): Promise<boolean> => {
  try {
    const params = {
      ...form.value,
      userId: userInfoStore.userInfos.id,
    }
    const { data: res } = await addCategory<CategoryData>(params)
    const { code, message, success } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg('成功', message)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const handleDialogClose = () => {
  handleInitForm()

  addFormRef.value.getRef().resetFields()
  addCategoryDialogStatus.value = false
}

defineExpose({ addCategoryDialogStatus })
</script>
