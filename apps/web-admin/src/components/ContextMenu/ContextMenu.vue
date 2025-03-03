<template>
  <transition name="el-zoom-in-center">
    <div
      class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
      v-show="visible"
      :style="{
        left: props.left + 'px',
        top: props.top + 'px',
      }"
      @click.stop="handleClickMenuContainer"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts" name="">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface RightMenuAttr {
  modelValue: boolean
  left: number
  top: number
}

const emits = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<RightMenuAttr>(), {})

const visible = ref<boolean>(false)

const closeContextmenu = () => {
  visible.value = false
  emits('update:modelValue', visible.value)
}

// 阻止点击当前菜单触发关闭事件
const handleClickMenuContainer = () => {}

watch(
  () => props.modelValue,
  value => (visible.value = value),
  { immediate: true }
)

onMounted(() => {
  document.body.addEventListener('click', closeContextmenu)
})

onUnmounted(() => {
  document.body.removeEventListener('click', closeContextmenu)
})
</script>

<style scoped lang="scss">
.custom-contextmenu {
  transform-origin: center top;
  z-index: 2190;
  position: fixed;
}
</style>
