<template>
  <el-select-v2
    ref="selectV2Ref"
    :size="props.size"
    :options="options"
    :clearable="clearable"
    :filterable="filterable"
    :placeholder="placeholder"
    :multiple="multiple"
    :style="`width: ${props.width}`"
    v-bind="$attrs"
    v-model="value"
    v-if="props.virtual"
    @change="handleSelectChange"
  />

  <el-select
    ref="selectRef"
    :size="props.size"
    :clearable="clearable"
    :filterable="filterable"
    :placeholder="placeholder"
    :multiple="multiple"
    v-model="value"
    v-bind="$attrs"
    v-else
    :style="`width: ${props.width}`"
    @change="handleSelectChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SelectAttribute } from '.'
import { ElSelect, ElSelectV2 } from 'element-plus'
import { useComponentRef } from '@/composables/useComponentRef'

// 双向数据绑定值
// const value = defineModel()
const emits = defineEmits(['selectChange', 'change'])

const props = withDefaults(defineProps<SelectAttribute>(), {
  width: '100px',
  size: 'default',
  filterable: true,
  virtual: false,
  placeholder: '请选择',
  multiple: false,
})

const selectRef = useComponentRef(ElSelect)
const selectV2Ref = useComponentRef(ElSelectV2)

const model = defineModel()

const value = computed({
  get: () => model.value,
  set: newVal => (model.value = newVal),
})

const handleSelectChange = (val: any) => {
  emits('selectChange', val)
  emits('change', val)
}

const getRef = () => {
  if (props.virtual) return selectV2Ref.value
  else return selectRef.value
}

defineExpose({ getRef })
</script>

<style scoped lang="scss"></style>
