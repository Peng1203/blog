<template>
  <div
    ref="chartRef"
    :style="{ width: props.width, height: props.height }"
  />
</template>

<script setup lang="tsx">
import * as echarts from 'echarts'
// import { ECharts } from 'echarts';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChartAttribute } from './types'

const emits = defineEmits(['click'])

const props = withDefaults(defineProps<ChartAttribute>(), {
  width: '100%',
  height: '300px',
  loading: false,
})

const chartRef = ref<RefType>(null)

const myChart = ref<echarts.ECharts | null>()

// 初始化图表
const initChart = () => {
  myChart.value = echarts.init(chartRef.value)

  myChart.value.on('click', params => emits('click', params))
}

// 图表设置 配置项
const setOptions = () => myChart.value?.setOption(props.options)

// 重绘图表
const chartResize = () => myChart.value?.resize()

// 清除图表
const clearChart = () => myChart.value?.clear() && (myChart.value = null)

watch(
  () => props.options,
  val => {
    console.log(val)
    nextTick(() => setOptions())
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  initChart()

  window.addEventListener('resize', chartResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', chartResize)
  clearChart()
})
</script>

<style scoped lang="scss"></style>
