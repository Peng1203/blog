<template>
  <!-- 添加占位容器，保持页面布局 -->
  <div :style="{ marginBottom: navHeight + 'px' }" />
  <nav
    ref="navbarRef"
    class="bg-white border-b border-gray-200 shadow-md fixed w-full z-10 dark:bg-gray-900 dark:border-gray-700"
  >
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-gray-800 dark:text-white">Peng</div>

      <div class="flex justify-end items-center">
        <div class="hidden md:flex space-x-6">
          <RouterLink
            v-for="item in navMenus"
            :key="item.name"
            :to="item.path"
            :class="{
              'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-blue-400': isActive(item.name),
              'text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400':
                !isActive(item.name)
            }"
            class="px-3 py-2 rounded transition duration-300"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <div class="md:hidden h-6">
          <button
            @click="toggleMenu"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <transition name="fade">
          <div
            v-if="isMenuOpen"
            class="absolute top-20 left-0 w-full bg-white border-t border-gray-200 md:hidden dark:bg-gray-900 dark:border-gray-700"
          >
            <div class="flex flex-col p-4 space-y-2">
              <RouterLink
                v-for="item in navMenus"
                :key="item.name"
                :to="item.path"
                :class="{
                  'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-blue-400': isActive(
                    item.path
                  ),
                  'text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400':
                    !isActive(item.path)
                }"
                class="px-3 py-2 rounded transition duration-300"
                @click="toggleMenu"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
        </transition>

        <!-- 主题切换按钮 -->
        <ThemeSwitch />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

const isMenuOpen = ref(false)

const navMenus = [
  { name: 'Home', path: '/' },
  { name: 'Category', path: '/category' },
  { name: 'Tag', path: '/tag' },
  { name: 'Moment', path: '/moment' }
  // { name: 'About', path: '/about' }
]

const route = useRoute() // 获取当前路由
const isActive = (name: string) => {
  return route.name === name
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value // 切换菜单状态
}

const navHeight = ref(0)
const navbar = useTemplateRef('navbarRef')

onMounted(() => {
  if (navbar.value) {
    // 获取导航栏高度
    navHeight.value = navbar.value.offsetHeight
  }
})
</script>

<style scoped>
/* 过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active 在 Vue 2 中 */ {
  opacity: 0;
}

/* 其他样式可以在这里自定义 */
</style>
