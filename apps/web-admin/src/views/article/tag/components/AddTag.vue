<template>
  <Dialog
    title="添加标签"
    v-model="addTagDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <Form
      ref="addFormRef"
      :labelW="'120px'"
      v-model="addTagState.data"
      :formItems="addTagState.formItemList"
    >
      <template #tagIcon>
        <IconSelector
          :prepend="preIcon"
          v-model="addTagState.data.icon"
          @get="icon => (addTagState.data.icon = icon)"
        />
      </template>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, defineAsyncComponent } from 'vue'
import { useTagApi } from '@/api/tag/index'
import Dialog from '@/components/Dialog'
import Form, { FormItem } from '@/components/Form'
import { AddTagType, TagData } from '../types'
import { CodeEnum } from '@/constants'
import { useNotificationMsg } from '@/hooks'
import { useUserInfo } from '@/stores/userInfo'

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'))

const { addTag } = useTagApi()

const emits = defineEmits(['updateList'])

const userInfoStore = useUserInfo()
const addTagDialogStatus = ref<boolean>(false)
const addTagState = reactive({
  data: ref<AddTagType>({
    tagName: '',
    icon: '',
  }),
  formItemList: ref<FormItem<AddTagType>[]>([
    {
      type: 'input',
      label: '标签名',
      prop: 'tagName',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      type: 'slot',
      label: '标签图标',
      prop: 'icon',
      slotName: 'tagIcon',
    },
  ]),
})

const addFormRef = ref<RefType>(null)
// 处理添加操作
const handleAdd = async () => {
  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewTag()
  if (!addRes) return
  handleDialogClose()
  emits('updateList')
}

// 添加权限标识
const addNewTag = async (): Promise<boolean> => {
  try {
    const params = {
      ...addTagState.data,
      userId: userInfoStore.userInfos.id,
    }
    const { data: res } = await addTag<TagData>(params)
    const { code, message, success } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg('', message)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (addTagState.data.icon) return addTagState.data.icon
  else return 'ele-Pointer'
})

const resetAddForm = () => {
  addTagState.data.tagName = ''
  addTagState.data.icon = ''
}

const handleDialogClose = () => {
  resetAddForm()
  addFormRef.value.getRef().resetFields()
  addTagDialogStatus.value = false
}

defineExpose({ addTagDialogStatus })
</script>
