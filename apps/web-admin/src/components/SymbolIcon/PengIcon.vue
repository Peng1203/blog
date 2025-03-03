<template>
  <span :title="title">
    <!-- element 图标 -->
    <span v-if="iconClass.indexOf('ele') !== -1">
      <component
        :is="iconClass"
        :style="{ color: props.color }"
      />
    </span>
    <!-- svg 带彩色 阿里图标 -->
    <svg
      v-else-if="type === 'svg'"
      aria-hidden="true"
    >
      <use :xlink:href="`#${iconClass}`"></use>
    </svg>
    <!-- 无颜色 类名图标 -->
    <i
      v-else
      :class="['iconfont', iconClass]"
    />
    <!-- <span>{{ iconClass }}</span> -->
  </span>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'
const props = defineProps({
  type: {
    type: String as PropType<string>,
    default: 'svg', // svg | class
  },
  name: {
    type: String as PropType<string>,
    required: true,
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 16, // 图标大小
  },
  color: {
    // 当类型为 class 时传入图标颜色
    type: String as PropType<string>,
    default: '',
  },
  title: {
    type: String as PropType<string>,
    default: '',
  },
})

const iconClass = computed<string>(() => {
  if (props.name.includes('iconfont')) return props.name.split(' ')[1]
  return props.name
})

// 计算出像素变量
const sizePx = computed<string>(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  if (typeof props.size === 'string') {
    if (props.size.includes('px')) return `${props.size}`
    else return `${props.size}px`
  }
  return ''
})
/** 
      <Peng-Icon name="" />

      <Peng-Icon name="" size="" />

      <Peng-Icon
          size="20"
          name=""
          type="class | svg"
          color=""
        />
 * 
 */
</script>

<style lang="scss" scoped>
svg {
  // width: 16px;
  // height: 16px;
  width: v-bind(sizePx);
  height: v-bind(sizePx);
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
i {
  color: v-bind(color);
  // background-color: v-bind(color);
  font-size: v-bind(sizePx);
  // color: rgb(93, 201, 93);
}
</style>
