<template>
  <PengDialog
    title="添加用户"
    v-model="addUserDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <PengForm
      ref="addFormRef"
      :labelW="'120px'"
      v-model="formData"
      :formItems="addUserState.formItemList"
    />
  </PengDialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useUserApi } from '@/api/user'
import { UploadRawFile } from 'element-plus'
import { FormItem } from '@/components/Form'
import { passwordStrengthLevelDetection } from '@/utils/pwd'
import { UserData, AddProps, AddUserType } from '../types'
import { UploadRequestOptions } from 'element-plus'
import { passwordEncryption } from '@/utils/encryption'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'

const props = defineProps<AddProps>()

const emits = defineEmits(['updateList'])
const { addUser, uploadAvatar } = useUserApi()

// 校验密码强度
const passwordStrengthDetection = (rule: any, value: any, callback: any): any => {
  const findFormItem = addUserState.formItemList.find(item => item.prop === 'password')

  if (!value) return findFormItem && (findFormItem.strengthLevel = 0)

  let level = passwordStrengthLevelDetection(value)
  if (level === -1) callback(new Error('密码不能包括出现特殊字符'))
  if (findFormItem) findFormItem.strengthLevel = level as any
  callback()
}

// 对话框状态
const addUserDialogStatus = ref<boolean>(false)

// 表单数据
const formData = ref<AddUserType>({
  userName: '',
  nickName: '',
  password: '',
  roleIds: [1],
  email: '',
  userEnabled: 1,
  userAvatar: '',
})

const addUserState = reactive({
  formItemList: ref<FormItem<AddUserType>[]>([
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
      type: 'pwd',
      label: '密码',
      prop: 'password',
      span: 20,
      placeholder: '请输入密码',
      strengthLevel: 0,
      rules: [
        { required: true, trigger: 'blur' },
        { min: 6, max: 15, trigger: 'blur' },
        {
          validator: passwordStrengthDetection,
          trigger: 'change',
        },
      ],
    },
    {
      type: 'select',
      label: '角色',
      multiple: true,
      prop: 'roleIds',
      options: props.roles,
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
    {
      type: 'upload',
      label: '头像',
      prop: 'userAvatar',
      span: 20,
      multiple: false,
      fsShow: false,
      fileMaxSize: 2,
      // autoUpload: false,
      customUploadCb(options: UploadRequestOptions) {
        handleUploadAvatar(options.file)
      },
      accept: ['.gif', '.jpeg', '.jpg', '.png', '.webp'],
    },
  ]),
})

const addFormRef = ref<RefType>(null)
// 处理添加用户
const handleAdd = async () => {
  // 校验表单
  const validataRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validataRes) return
  const addRes = await addNewUser()
  if (!addRes) return
  handleDialogClose()
  emits('updateList')
}
// 添加用户
const addNewUser = async (): Promise<boolean> => {
  try {
    const { email, password, ...other } = formData.value
    const params = {
      ...other,
      ...(email ? { email } : {}),
      password: passwordEncryption(password!),
    }
    const { data: res } = await addUser<UserData>(params as any)
    const { code, message, success } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg('', message)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const handleUploadAvatar = async (file: UploadRawFile) => {
  try {
    const fileFormData = new FormData()

    fileFormData.append('file', file)

    const { data: res } = await uploadAvatar(fileFormData)
    formData.value.userAvatar = res.data
  } catch (e) {
    console.log('e', e)
  }
}

const resetAddForm = () => {
  formData.value.userName = ''
  formData.value.nickName = ''
  formData.value.password = ''
  formData.value.roleIds = []
  formData.value.email = ''
  formData.value.userEnabled = 1
  formData.value.userAvatar = ''
  const findFormItem = addUserState.formItemList.find(item => item.prop === 'password')
  if (findFormItem) findFormItem.strengthLevel = 0
}

const handleDialogClose = () => {
  resetAddForm()
  addFormRef.value.getRef().resetFields()
  addUserDialogStatus.value = false
}

defineExpose({ addUserDialogStatus })
</script>

<style lang="scss" scoped></style>
