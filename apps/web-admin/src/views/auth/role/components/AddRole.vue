<template>
  <PengDialog
    title="添加角色"
    v-model="addRoleDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <PengForm
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="formItems"
      v-model="form"
    >
      <!-- 菜单 -->
      <template #menuSlot>
        <MenuTree
          :height="150"
          v-if="addRoleDialogStatus"
          v-model:checked-menu="form.menus"
        />
      </template>

      <!-- 权限标识 -->
      <template #permissionSlot>
        <PermissionTree
          filter
          :height="150"
          v-if="addRoleDialogStatus"
          v-model:checked-permission="form.permissions"
        />
      </template>
    </PengForm>
  </PengDialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoleApi } from '@/api/role/index'
import { AddRoleType, RoleData } from '../types'
import { MenuTree, MenuData } from '@/views/auth/menu'
import { usePermissionInfo } from '@/stores/permissionList'
import { PermissionTree, PermissionData } from '@/views/auth/authPermission'
import { CodeEnum } from '@/constants'
import { useFormState, useNotificationMsg } from '@/hooks'

const emits = defineEmits(['updateList'])

const { addRole } = useRoleApi()

const permissionStore = usePermissionInfo()

const addRoleDialogStatus = ref<boolean>(false)

const { form, formItems, setFormItems, handleInitForm } = useFormState<AddRoleType>({
  roleName: '',
  description: '',
  menus: [],
  permissions: [],
})

setFormItems([
  {
    type: 'input',
    label: '角色名称',
    prop: 'roleName',
    placeholder: '请输入角色名称',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    type: 'slot',
    slotName: 'menuSlot',
    label: '菜单',
    prop: 'menus',
    required: true,
  },
  {
    type: 'slot',
    slotName: 'permissionSlot',
    label: '权限',
    prop: 'permissions',
  },
  {
    type: 'textarea',
    label: '角色描述',
    prop: 'description',
    placeholder: '请输入角色描述',
  },
])

const addFormRef = ref<RefType>(null)
// 处理添加操作
const handleAdd = async () => {
  if (form.value.menus && !form.value.menus.length) return

  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewRole()
  if (!addRes) return
  handleDialogClose()
  emits('updateList')
}

// 添加角色
const addNewRole = async (): Promise<boolean> => {
  try {
    const { permissions: pIds, ...args } = form.value
    const permissions = pIds?.filter(id => !permissionStore.permissionList.find(p => p.id === id))
    const params = {
      ...args,
      permissions,
    }

    const { data: res } = await addRole<RoleData<MenuData, PermissionData>>(params)
    const { code, message, success } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg(message)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const handleDialogClose = () => {
  addRoleDialogStatus.value = false
  handleInitForm()
  addFormRef.value.getRef().resetFields()
}

defineExpose({ addRoleDialogStatus })
</script>
