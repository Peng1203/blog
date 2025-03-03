<template>
  <div class="peng-dialog">
    <el-dialog
      :width="width"
      :title="title"
      :modal="modal"
      :before-close="handleClose"
      :close-on-click-modal="modelClose"
      :close-on-press-escape="escClose"
      :draggable="draggable"
      :align-center="aCenter"
      v-bind="$attrs"
      v-model="dialogStatus"
      @open="() => $emit('open')"
    >
      <template #header>
        <slot name="header" />
      </template>

      <slot />

      <template
        #footer
        v-if="operationRow"
      >
        <slot name="footer">
          <div>
            <PengButton @click="handleClickCancel">
              {{ cancleBtnText }}
            </PengButton>
            <PengButton
              type="primary"
              @click="handleClickConfirm"
            >
              {{ confirmBtnText }}
            </PengButton>
          </div>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { DialogAttribute } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<DialogAttribute>(), {
  fullscreen: false,
  modal: true,
  width: '770px',
  height: '70vh',
  modelClose: false,
  escClose: true,
  draggable: true,
  aCenter: false,
  operationRow: true,
  cancleBtnText: '取消',
  confirmBtnText: '确认',
})

const emits = defineEmits(['update:modelValue', 'dialogClose', 'clickCancel', 'clickConfirm', 'open'])

const dialogStatus = ref<boolean>(true)

watch(
  () => props.modelValue,
  val => (dialogStatus.value = val),
  {
    deep: true,
    immediate: true,
  }
)
const handleClose = () => {
  dialogStatus.value = false
  emits('update:modelValue', dialogStatus.value)
  emits('dialogClose', dialogStatus.value)
}

const handleClickCancel = () => {
  emits('clickCancel')
  handleClose()
}
/** 计算滚动区域内的最大高度 */
const bodyMaxHeight = computed(() => {
  return `${props.height} - ${props.operationRow ? '111px' : '0px'}`
})

const handleClickConfirm = () => emits('clickConfirm')
</script>

<style lang="scss" scoped>
.peng-dialog {
  :deep(.el-dialog) {
    max-height: v-bind('$props.height');
    border-radius: 8px;
  }
  :deep(.el-dialog__header) {
    padding: 10px 20px;
    margin: -16px;
    border-bottom: 1px solid rgb(180, 169, 169);
  }
  :deep(.el-dialog__body) {
    max-height: calc(v-bind('bodyMaxHeight')) !important;
  }
  :deep(.el-dialog__headerbtn) {
    top: 0px;
  }
}
</style>
