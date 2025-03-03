<template>
  <el-dropdown
    trigger="click"
    :show-timeout="70"
    :hide-timeout="50"
    @command="handleSwitchTheme"
  >
    <div class="layout-navbars-breadcrumb-user-icon">
      <Peng-Icon
        name="icon-zhutiqiehuan1"
        title="主题切换"
      />
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :key="item.value"
          :command="item.value"
          :disabled="themeConfig.themeMode === item.value"
          v-for="item in themeOptions"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useThemeConfig } from '@/stores/themeConfig'
import { Local } from '@/utils/storage'
import { storeToRefs } from 'pinia'
import { onUnmounted, ref } from 'vue'

const themeOptions = [
  {
    label: '跟随系统',
    value: 'os',
  },
  {
    label: '默认',
    value: 'light',
  },
  {
    label: '黑暗',
    value: 'dark',
  },
]

const store = useThemeConfig()
const { themeConfig } = storeToRefs(store)

const THEME_MODE_KEY = 'current_theme'

const handleSwitchTheme = (newTheme, _?, event?: PointerEvent) => {
  // if (themeConfig.value.themeMode === newTheme) return;
  themeConfig.value.themeMode = newTheme
  Local.set(THEME_MODE_KEY, newTheme)
  setTheme(event)
}

const matchTheme = ref<MediaQueryList>()

const handleOSThemeChange = (e: MediaQueryListEvent) => {
  const newColorScheme = e.matches ? 'dark' : 'light'
  setHTMLThemeAttr(newColorScheme)
}

const setHTMLThemeAttr = (val: string, pointerEvent?: PointerEvent) => {
  const HTML = document.documentElement as HTMLElement

  /**
   * ViewTransition API 只有 Chrome 和 Edge 以及部分浏览器才支持 并不是 标注的API
   */

  // @ts-ignore
  if (document?.startViewTransition && pointerEvent) {
    const x = pointerEvent.clientX
    const y = pointerEvent.clientY

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    // @ts-ignore
    const transition = document.startViewTransition(() => HTML.setAttribute('data-theme', val))

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: themeConfig.value.themeMode === 'dark' ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement:
            themeConfig.value.themeMode === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
        }
      )
    })
  } else {
    HTML.setAttribute('data-theme', val)
  }
}

const setTheme = (event?: PointerEvent) => {
  // 每次切换主题都清除之前绑定的 change 事件
  if (matchTheme.value) {
    matchTheme.value.removeEventListener('change', handleOSThemeChange)
  }
  let newVal = ''
  switch (themeConfig.value.themeMode) {
    case 'os':
      matchTheme.value = matchMedia('(prefers-color-scheme:dark)')
      setHTMLThemeAttr(matchTheme.value.matches ? 'dark' : '', event)
      matchTheme.value.addEventListener('change', handleOSThemeChange)
      return
    case 'light':
      newVal = 'light'
      break
    case 'dark':
      newVal = 'dark'
      break
    default:
      newVal = ''
      break
  }
  setHTMLThemeAttr(newVal, event)
}

handleSwitchTheme(Local.get(THEME_MODE_KEY) || 'light')

onUnmounted(() => {
  matchTheme.value?.removeEventListener('change', handleOSThemeChange)
})
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-icon {
  padding: 0 10px;
  cursor: pointer;
  color: var(--next-bg-topBarColor);
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  &:hover {
    background: var(--next-color-user-hover);
    i {
      display: inline-block;
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 进入dark模式和退出dark模式时，两个图像的位置顺序正好相反 */
[data-theme='dark']::view-transition-old(root) {
  z-index: 10000;
}

[data-theme='dark']::view-transition-new(root) {
  z-index: 99999;
}

::view-transition-old(root) {
  z-index: 99999;
}

::view-transition-new(root) {
  z-index: 10000;
}
</style>
