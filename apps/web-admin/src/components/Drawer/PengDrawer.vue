<template>
  <div class="peng-drawer">
    <el-drawer
      :title="props.title"
      :modal="props.modal"
      :size="props.size || (deviceClientType === 'pc' ? '400px' : '50%')"
      :direction="props.direction || (deviceClientType === 'pc' ? 'rtl' : 'btt')"
      :before-close="handleClose"
      :with-header="props.showHeader"
      :modal-class="props.mdClass"
      :close-on-click-modal="props.modalClose"
      :close-on-press-escape="props.escClose"
      v-model="drawerStatus"
    >
      <!-- 自定义header -->
      <template #header>
        <slot name="header" />
      </template>

      <slot />

      <!-- 自定义底部 -->
      <template #footer>
        <slot name="footer">
          <div class="mb10 mr10 flex-e-c">
            <PengButton @click="handleCancelBtn">取消</PengButton>
            <PengButton
              type="primary"
              @click="handleConfirmBtn"
            >
              保存
            </PengButton>
          </div>
        </slot>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject } from 'vue'
import { DrawerAttribute } from './types'

const deviceClientType = inject('deviceClientType')

const props = withDefaults(defineProps<DrawerAttribute>(), {
  title: '是否忘记传递标题了?😋',
  modal: true,
  showHeader: true,
  mdClass: '',
  escClose: true,
  modalClose: true,
})

const emits = defineEmits(['update:modelValue', 'close', 'clickCancel', 'clickConfirm'])

const drawerStatus = ref<boolean>(props.modelValue)
watch(
  () => props.modelValue,
  val => (drawerStatus.value = val),
  {
    immediate: true,
    deep: true,
  }
)
/** 关闭窗口 */
const handleClose = () => {
  drawerStatus.value = false
  emits('update:modelValue', drawerStatus.value)
  emits('close', drawerStatus.value)
}

/** 取消按钮 */
const handleCancelBtn = () => {
  emits('clickCancel')
  handleClose()
}

/** 确认按钮 */
const handleConfirmBtn = () => {
  emits('clickConfirm')
}
</script>

<style lang="scss" scoped>
.peng-drawer {
  :deep(.el-drawer__body) {
    padding: 10px 20px;
  }
}
</style>
