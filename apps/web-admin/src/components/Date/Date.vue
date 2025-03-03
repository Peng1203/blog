<template>
  <div>
    <el-date-picker
      type="date"
      :size="size"
      :format="format || FORMAT"
      :value-format="valueFormat || FORMAT"
      :placeholder="placeholder"
      :default-time="defaultTime1"
      :style="{ 'max-width': width || '170px' }"
      v-bind="$attrs"
      v-model="dateValue"
      v-if="type === 1"
      @change="$event => emit('change', $event)"
    />

    <el-date-picker
      type="daterange"
      :size="size"
      :format="format || 'YYYY-MM-DD'"
      :value-format="valueFormat || FORMAT"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :default-time="defaultTime2"
      :style="{ 'max-width': width || '220px' }"
      v-bind="$attrs"
      v-model="dateValue"
      v-else-if="type === 2"
      @change="$event => emit('change', $event)"
    />

    <el-date-picker
      type="datetimerange"
      :size="size"
      :format="format || FORMAT"
      :value-format="valueFormat || FORMAT"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :default-time="defaultTime2"
      :style="{ 'max-width': width || '310px' }"
      v-bind="$attrs"
      v-model="dateValue"
      v-else-if="type === 3"
      @change="$event => emit('change', $event)"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends DatePickerType">
import { computed } from 'vue'
import { DateAttrs, DatePickerType } from './types'
// DatePickerInstance
import { ElDatePicker } from 'element-plus'

const FORMAT = 'YYYY-MM-DD HH:mm:ss'

// const model = defineModel<T extends 1 ? string : string[]>({
const model = defineModel<T extends 1 ? string : any>({
  required: true,
})

const props = withDefaults(defineProps<DateAttrs<T>>(), {
  size: 'default',
  placeholder: '选择日期',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  format: '',
  valueFormat: '',
})

const emit = defineEmits(['change'])

const dateValue = computed({
  get: () => model.value as any,
  set: newVal => {
    if (newVal) model.value = newVal
    else model.value = (props.type === 1 ? '' : ['', '']) as any
  },
})

const defaultTime1 = new Date(2000, 1, 1, 0, 0, 0)
const defaultTime2: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]
</script>
