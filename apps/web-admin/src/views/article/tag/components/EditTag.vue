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
    >
      <template #iconSlot>
        <IconSelector
          :prepend="preIcon"
          v-model="editFormState.data.icon"
        />
      </template>
    </Form>
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, defineAsyncComponent, computed } from 'vue'
import { useTagApi } from '@/api/tag/index'
import Form, { FormItem } from '@/components/Form'
import Drawer from '@/components/Drawer'
import { TagData, EditProps } from '../'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'))
const { updataTag } = useTagApi()

const props = withDefaults(defineProps<EditProps>(), {
  editRow: () => ({} as TagData),
})

const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<TagData>({
    id: 0,
    tagName: '',
    icon: '',
    createTime: '',
    updateTime: '',
  }),
  formItemList: ref<FormItem<TagData>[]>([
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
      slotName: 'iconSlot',
    },
  ]),
})

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (editFormState.data.icon) return editFormState.data.icon
  else return 'ele-Pointer'
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!valdateRes) return
  const editRes = await saveEditTag()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditTag = async (): Promise<boolean> => {
  try {
    const { id, tagName, icon } = editFormState.data
    const { data: res } = await updataTag<string>(id, { tagName, icon })
    const { code, data, success } = res
    if (code !== CodeEnum.UPDATE_SUCCESS || !success) return false
    useNotificationMsg(data, '')
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// // 获取当前点击的 icon 图标
// const handleGetIcon = (icon: string) => (editFormState.data.icon = icon)

watch(
  () => props.editRow,
  (val: TagData) => (editFormState.data = JSON.parse(JSON.stringify(val)))
)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, async val => {
  if (val) return

  editFormRef.value.getRef().resetFields()
  editFormState.data.icon = ''
})

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
