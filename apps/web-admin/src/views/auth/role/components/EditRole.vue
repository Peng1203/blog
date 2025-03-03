<template>
  <Drawer
    :title="'修改角色信息'"
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
      <!-- 菜单 -->
      <template #menuSlot>
        <MenuTree
          v-if="editDrawerStatus"
          :height="150"
          v-model:checked-menu="editFormState.data.menus"
        />
      </template>

      <!-- 权限标识 -->
      <template #permissionSlot>
        <PermissionTree
          v-if="editDrawerStatus"
          filter
          :height="150"
          v-model:checked-permission="editFormState.data.permissions"
        />
      </template>
    </Form>
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRoleApi } from '@/api/role/index'
import { EditRoleType, RoleEntityData } from '../types'
import Drawer from '@/components/Drawer'
import Form, { FormItem } from '@/components/Form'
import { MenuTree } from '@/views/auth/menu'
import { PermissionTree } from '@/views/auth/authPermission'
import { usePermissionInfo } from '@/stores/permissionList'
import { CodeEnum } from '@/constants'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { useFormWatcher } from '@/hooks/useFormWatcher'

const { updateRole } = useRoleApi()

interface EditRowProps {
  editRow: RoleEntityData
}

const props = withDefaults(defineProps<EditRowProps>(), {
  editRow: () => ({} as RoleEntityData),
})
const emits = defineEmits(['updateList'])

const permissionStore = usePermissionInfo()

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<EditRoleType>({
    id: 0,
    roleName: '',
    menus: [],
    permissions: [],
    description: '',
  }),
  formItemList: ref<FormItem<EditRoleType>[]>([
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
  const editRes = await saveEditRole()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditRole = async (): Promise<boolean> => {
  try {
    const { id, permissions: pIds, ...args } = editFormState.data
    const permissions = pIds?.filter(id => !permissionStore.permissionList.find(p => p.id === id))
    const params = {
      ...args,
      permissions,
    }
    const { data: res } = await updateRole<string>(id!, params)
    const { code, data, success } = res
    if (code !== CodeEnum.UPDATE_SUCCESS || !success) return false
    useNotificationMsg(data, '')
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// watch(
//   () => props.editRow,
//   val => {
//     if (!val) return
//     for (const key in editFormState.data) {
//       editFormState.data[key] = val[key]
//     }

//     editFormState.data.permissions = val.permissions.map(({ id }) => id)
//     editFormState.data.menus = val.menus.map(({ id }) => id)
//   },
//   { deep: true }
// )
useFormWatcher(
  () => props.editRow,
  editFormState.data,
  val => {
    editFormState.data.permissions = val.permissions.map(({ id }) => id)
    editFormState.data.menus = val.menus.map(({ id }) => id)
  }
)

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
