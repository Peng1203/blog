<template>
  <Drawer
    :title="'修改用户信息'"
    v-model="editDrawerStatus"
    @clickConfirm="handleSaveEdit"
  >
    <PengForm
      ref="editFormRef"
      label-p="top"
      :labelW="80"
      :formItems="editFormState.formItemList"
      v-model="formData"
    />
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useUserApi } from '@/api/user/index'
import Drawer from '@/components/Drawer'
import { EditProps, UserData, EditUserType } from '../types'
import { CodeEnum } from '@/constants'
import { useFormWatcher, useNotificationMsg } from '@/hooks'
import { FormItem } from '@/components/Form'

const { updateUser } = useUserApi()

const props = withDefaults(defineProps<EditProps>(), {
  editRow: () => ({} as UserData),
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const formData = ref<EditUserType>({
  id: 0,
  userName: '',
  nickName: '',
  roles: [],
  roleIds: [],
  email: '',
  userEnabled: 1,
  userAvatar: '',
})

// 编辑状态信息
const editFormState = reactive({
  formItemList: ref<FormItem<EditUserType>[]>([
    {
      type: 'input',
      label: '用户名',
      prop: 'userName',
      span: 20,
      placeholder: '请输入用户名',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 8, trigger: 'blur' },
      ],
    },
    {
      type: 'input',
      label: '昵称',
      prop: 'nickName',
      span: 20,
      placeholder: '请输入昵称',
      rules: [{ min: 2, max: 16, trigger: 'blur' }],
    },
    {
      type: 'checkbox',
      label: '角色',
      multiple: true,
      prop: 'roleIds',
      options: [],
      span: 20,
      placeholder: '请输入选择角色',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      type: 'input',
      label: '邮箱',
      prop: 'email',
      span: 20,
      placeholder: '请输入邮箱',
    },
    {
      type: 'switch',
      label: '状态',
      prop: 'userEnabled',
      tValue: 1,
      fValue: 0,
      tText: '启用',
      fText: '锁定',
      isInline: true,
      span: 20,
    },
  ]),
})

// 保存编辑信息
const saveEditUserInfo = async (): Promise<boolean> => {
  try {
    const { id, userName, nickName, userAvatar, userEnabled, roleIds, email } = formData.value
    const params = {
      userName,
      nickName,
      userAvatar,
      userEnabled,
      roleIds,
      email: email === '' ? null : email,
    }
    const { data: res } = await updateUser<UserData>(id, params)
    const { code, message, success } = res
    if (code !== CodeEnum.UPDATE_SUCCESS || !success) return false

    useNotificationMsg(message, '')
    return true
  } catch (e) {
    // ElMessage.error('更新失败')
    console.log(e)
    return false
  }
}

// 处理保存修改信息
const handleSaveEdit = async () => {
  const updateRes = await saveEditUserInfo()
  if (!updateRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

const editFormRef = ref<RefType>(null)

useFormWatcher(
  () => props.editRow,
  formData,
  () => {
    formData.value.roleIds = formData.value.roles?.map(role => role.id)
  }
)

watch(editDrawerStatus, async val => {
  editFormState.formItemList.find(item => item.prop === 'roleIds')!.options = props.roles
  if (!val) editFormRef.value.getRef().resetFields()
})

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
