<template>
  <Dialog
    title="查看角色"
    :operationRow="false"
    v-model="viewRoleDialogStatus"
  >
    <Form
      readonly
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="viewRoleState.formItemList"
      v-model="viewRoleState.data"
    >
      <!-- 菜单 -->
      <template #menuSlot>
        <MenuTree
          :height="200"
          v-if="viewRoleDialogStatus"
          v-model:checked-menu="viewRoleState.data.menus"
        />
      </template>

      <!-- 权限标识 -->
      <template #permissionSlot>
        <PermissionTree
          :height="200"
          v-if="viewRoleDialogStatus"
          v-model:checked-permission="viewRoleState.data.permissions"
        />
      </template>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, PropType } from 'vue'
import Dialog from '@/components/Dialog'
import Form, { FormItem } from '@/components/Form'
import { RoleData, RoleEntityData } from '../'
import { MenuTree } from '@/views/auth/menu'
import { PermissionTree } from '@/views/auth/authPermission'

const props = defineProps({
  viewRow: {
    type: Object as PropType<RoleEntityData>,
  },
})

const viewRoleDialogStatus = ref<boolean>(false)

const viewRoleState = reactive({
  data: ref<RoleData>({
    id: 0,
    roleName: '',
    description: '',
    menus: [],
    permissions: [],
    createTime: '',
    updateTime: '',
  }),
  formItemList: ref<FormItem<RoleData>[]>([
    {
      span: 20,
      type: 'input',
      label: '角色名称',
      prop: 'roleName',
      placeholder: '请输入角色名称',
    },
    {
      span: 10,
      type: 'slot',
      slotName: 'menuSlot',
      label: '菜单',
      prop: 'menus',
    },
    {
      span: 12,
      type: 'slot',
      slotName: 'permissionSlot',
      label: '权限',
      prop: 'permissions',
    },
    {
      type: 'textarea',
      label: '角色描述',
      prop: 'description',
    },
  ]),
})

watchEffect(() => {
  if (!props.viewRow) return
  viewRoleState.data = JSON.parse(JSON.stringify(props.viewRow))
  viewRoleState.data.menus = props.viewRow?.menus.map(({ id }) => id)!
  viewRoleState.data.permissions = props.viewRow?.permissions.map(({ id }) => id)!
})

defineExpose({ viewRoleDialogStatus })
</script>

<style scoped lang="scss"></style>
