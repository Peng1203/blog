<template>
  <div
    class="upgrade-dialog"
    id="upgrade-dialog"
  >
    <el-dialog
      v-model="state.isUpgrade"
      width="300px"
      destroy-on-close
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upgrade-title">
        <div class="upgrade-title-warp">
          <span class="upgrade-title-warp-txt">
            {{ `新版本升级` }}
          </span>
          <!-- <span class="upgrade-title-warp-version">v{{ state.version }}</span> -->
        </div>
      </div>
      <div class="upgrade-content">
        新版本来啦，马上更新尝鲜吧！不用担心，更新很快的哦！
        <div class="mt5"></div>
      </div>
      <div class="upgrade-btn">
        <PengButton
          round
          size="default"
          type="info"
          text
          @click="onCancel"
        >
          残忍拒绝
        </PengButton>
        <PengButton
          type="primary"
          round
          size="default"
          :loading="state.isLoading"
          @click="onUpgrade"
        >
          {{ state.btnTxt }}
        </PengButton>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="layoutUpgrade">
import { reactive } from 'vue'
import mittBus from '@/utils/mitt'

const state = reactive({
  isUpgrade: false,
  // @ts-ignore
  version: __NEXT_VERSION__,
  isLoading: false,
  btnTxt: '',
})

// 残忍拒绝
const onCancel = () => {
  state.isUpgrade = false
}
// 马上更新
const onUpgrade = () => {
  state.isLoading = true
  state.btnTxt = `更新中...`
  location.reload()
}
// 延迟显示，防止刷新时界面显示太快
const delayShow = () => {
  setTimeout(() => {
    state.isUpgrade = true
  }, 2000)
}

mittBus.on('onUpgradeOpen', () => {
  delayShow()
  state.btnTxt = `马上更新`
})

defineExpose({
  state,
})
</script>

<style scoped lang="scss">
#upgrade-dialog {
  :deep(.el-dialog__body) {
    padding: 0 !important;
  }
}
.upgrade-dialog {
  :deep(.el-dialog) {
    padding: 0 !important;
    .el-dialog__body {
      padding: 0 !important;
    }
    .el-dialog__header {
      display: none !important;
    }
    .upgrade-title {
      text-align: center;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        background-color: var(--el-color-primary-light-1);
        width: 130%;
        height: 130px;
        border-bottom-left-radius: 100%;
        border-bottom-right-radius: 100%;
      }
      .upgrade-title-warp {
        z-index: 1;
        position: relative;
        .upgrade-title-warp-txt {
          color: var(--next-color-white);
          font-size: 22px;
          letter-spacing: 3px;
        }
        .upgrade-title-warp-version {
          color: var(--next-color-white);
          background-color: var(--el-color-primary-light-4);
          font-size: 12px;
          position: absolute;
          display: flex;
          top: -2px;
          right: -50px;
          padding: 2px 4px;
          border-radius: 2px;
        }
      }
    }
    .upgrade-content {
      padding: 20px;
      line-height: 22px;
      .upgrade-content-desc {
        color: var(--el-color-info-light-5);
        font-size: 12px;
      }
    }
    .upgrade-btn {
      border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
      display: flex;
      justify-content: space-around;
      padding: 15px 20px;
      .PengButton {
        width: 100%;
      }
    }
  }
}
</style>
