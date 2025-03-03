<template>
  <el-form
    size="large"
    class="login-content-form"
  >
    <el-form-item class="login-animation1">
      <el-input
        text
        placeholder="请输入手机号"
        v-model="state.ruleForm.userName"
        clearable
        autocomplete="off"
      >
        <template #prefix>
          <i class="iconfont icon-dianhua el-input__icon"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <el-col :span="15">
        <el-input
          text
          maxlength="4"
          placeholder="请输入验证码"
          v-model="state.ruleForm.code"
          clearable
          autocomplete="off"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Position /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <!-- v-waves -->
        <PengButton class="login-content-code">获取验证码</PengButton>
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation3">
      <PengButton
        round
        type="primary"
        v-waves
        class="login-content-submit"
      >
        <span>登 录</span>
      </PengButton>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { reactive } from 'vue'

// 定义变量内容
const state = reactive({
  ruleForm: {
    userName: '',
    code: '',
  },
})
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }
  .login-content-code {
    width: 100%;
    padding: 0;
  }
  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
  .login-msg {
    color: var(--el-text-color-placeholder);
  }
}
</style>
