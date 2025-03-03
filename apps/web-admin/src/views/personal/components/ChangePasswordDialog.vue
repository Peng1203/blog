<template>
  <PengDialog
    operationRow
    title="修改密码"
    width="40%"
    v-model="dialogState"
    @dialogClose="handleDialogClose"
    @clickCancel="dialogState = false"
    @clickConfirm="handleChangePwd"
  >
    <PengForm
      labelW="150px"
      ref="changePwdFormRef"
      v-model="changePwdState.dataForm"
      :formItems="changePwdState.formItems"
    />
  </PengDialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserInfo } from '@/stores/userInfo'
import { FormItem } from '@/components/Form'
import { useComponentRef } from '@/composables/useComponentRef'
import { debounce } from 'lodash'
import Form from '@/components/Form'
import { passwordEncryption } from '@/utils/encryption'
import { useUserApi } from '@/api'
import { passwordStrengthLevelDetection } from '@/utils/pwd'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'

const { changePassword } = useUserApi()
const { userInfos, userLogout } = useUserInfo()

const validatePass = (rule: any, value: any, callback: any) => {
  // 检测密码强度
  const findFormItem = changePwdState.formItems.find(item => item.prop === rule.fullField)
  let level = passwordStrengthLevelDetection(value)
  if (level === -1) callback(new Error('密码不能包括出现特殊字符'))
  if (findFormItem) findFormItem.strengthLevel = level as any

  // 检测2次新密码是否一致
  if (changePwdState.dataForm.newPassword !== changePwdState.dataForm.confirmNewPassword)
    return callback(new Error('两次输入密码不一致!'))
  callback()
  changePwdFormRef.value.getRef().clearValidate(['newPassword', 'confirmNewPassword'])
}

const dialogState = ref<boolean>(false)

const changePwdState = reactive({
  dataForm: {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  },
  formItems: ref<FormItem[]>([
    {
      span: 20,
      type: 'pwd',
      label: '旧密码',
      prop: 'oldPassword',
      placeholder: '旧密码',
      rules: [{ required: true, trigger: 'blur', min: 6, max: 15 }],
    },
    {
      span: 20,
      type: 'pwd',
      label: '新密码',
      prop: 'newPassword',
      strengthLevel: 0,
      placeholder: '输入新密码',
      rules: [
        { required: true, trigger: 'blur', min: 6, max: 15 },
        { trigger: 'blur', validator: validatePass },
        { trigger: 'change', validator: debounce(validatePass, 300) },
      ],
    },
    {
      span: 20,
      type: 'pwd',
      label: '确认密码',
      prop: 'confirmNewPassword',
      strengthLevel: 0,
      placeholder: '再一次输入新密码',
      rules: [
        { required: true, trigger: 'blur', min: 6, max: 15 },
        { trigger: 'blur', validator: validatePass },
        { trigger: 'change', validator: debounce(validatePass, 300) },
      ],
    },
    {
      span: 20,
      type: 'slot',
      label: '',
      prop: '',
      slotName: 'updataPwd',
    },
  ]),
})

const changePwdFormRef = useComponentRef(Form)

// 处理修改密码
const handleChangePwd = async () => {
  const validRes = await changePwdFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const changeRes = await changePwd()
  if (!changeRes) return
  dialogState.value = false

  setTimeout(() => {
    userLogout()
  }, 2000)
}
const changePwd = async () => {
  try {
    const { newPassword, oldPassword } = changePwdState.dataForm
    const params = {
      newPassword: passwordEncryption(newPassword),
      oldPassword: passwordEncryption(oldPassword),
    }
    const { data: res } = await changePassword(userInfos.id, params)
    const { code, data, message, success } = res
    if (code !== 20000 || !success) return false
    useNotificationMsg(message, data)
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}

const handleDialogClose = () => {
  changePwdFormRef.value.getRef().resetFields()
  changePwdState.dataForm = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }
  changePwdState.formItems[1].strengthLevel = 0
  changePwdState.formItems[2].strengthLevel = 0
}

defineExpose({ dialogState })
</script>

<style scoped lang="scss"></style>
