<template>
  <el-input
    clearable
    :size="props.size"
    :disabled="props.loading"
    :placeholder="props.placeholder"
    class="transition-effect"
    :style="{ width: `${inputWidth}px` }"
    v-model.trim="queryString"
    @keyup.enter="handleSearch"
    @focus="handleInputFocus"
    @blur="handleInputBlur"
    @input="handleUpdateValue"
  >
    <template #append>
      <PengButton
        type="primary"
        :icon="Search"
        :size="props.size"
        :loading="props.loading"
        @click="handleSearch"
      />
    </template>
  </el-input>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    // required: true,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入搜索关键字',
  },
  size: {
    type: String as PropType<'' | 'large' | 'default' | 'small'>,
    default: 'default', // large default small
  },
  loading: {
    type: Boolean,
    default: false,
  },
  focusStyle: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 200,
  },
})

// const emits = defineEmits({
// 	'update:modelValue': (value: string) => true,
// })
const emits = defineEmits(['update:modelValue', 'search'])

// 搜索关键字
const queryString = ref<string>(props.modelValue)

// 同步父组件传递过来的值
watch(
  () => props.modelValue,
  val => (queryString.value = val),
  {
    immediate: true,
  }
)
// 更新 父组件中的 queryStr
const handleUpdateValue = (val: string) => {
  emits('update:modelValue', val)
}

// 触发搜索
const handleSearch = () => {
  emits('search', queryString.value)
}

// 输入框最大宽度
const inputWidth = ref<number>(props.width)
// 输入框聚焦时
const handleInputFocus = () => {
  if (!props.focusStyle) return
  inputWidth.value = inputWidth.value * 1.5
}
// 输入框失去焦点时
const handleInputBlur = () => {
  if (!props.focusStyle) return
  inputWidth.value = props.width
}
</script>

<style lang="scss" scoped>
.transition-effect {
  transition: width 0.3s ease-in-out;
}
</style>
