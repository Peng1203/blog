<template>
  <aside class="space-y-6 w-full lg:w-1/4">
    <!-- 个人信息卡 -->
    <div
      class="card bg-white shadow-md rounded-lg p-6 transition-all dark:bg-gray-800 dark:shadow-lg"
    >
      <div class="flex items-center mb-4">
        <img
          alt="头像"
          :src="userInfo.userAvatar"
          class="w-16 h-16 rounded-full shadow-md"
        />
        <div class="ml-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ userInfo.nickName || userInfo.userName }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">全沾开发者 & CV工程师</p>
        </div>
      </div>
      <p class="text-gray-700 dark:text-gray-300 mb-4">{{ userInfo.sign }}</p>
      <div class="flex space-x-4">
        <a
          href="https://github.com/Peng1203"
          class="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300"
        >
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.207 11.387.6.11.793-.26.793-.578v-2.2c-3.338.726-4.042-1.416-4.042-1.416-.546-1.385-1.333-1.755-1.333-1.755-1.09-.745.082-.73.082-.73 1.204.083 1.837 1.24 1.837 1.24 1.07 1.834 2.809 1.304 3.495.997.108-.775.419-1.304.762-1.604-2.665-.305-5.467-1.334-5.467-5.933 0-1.31.467-2.38 1.236-3.22-.124-.303-.536-1.526.118-3.18 0 0 1.008-.322 3.303 1.23.96-.267 1.986-.4 3.006-.405 1.02.005 2.047.138 3.006.405 2.296-1.552 3.303-1.23 3.303-1.23.656 1.654.244 2.877.12 3.18.77.84 1.235 1.91 1.235 3.22 0 4.61-2.806 5.624-5.48 5.92.43.37.815 1.096.815 2.207v3.277c0 .32.192.694.8.577C20.565 21.796 24 17.303 24 12 24 5.372 18.628 0 12 0z"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- 公告卡片 -->
    <div class="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:shadow-lg">
      <h3 class="text-xl font-bold text-gray-800 mb-4 dark:text-white">公告</h3>
      <ul class="list-disc list-inside text-gray-700 dark:text-gray-300">
        <li>网站正在建设中，敬请期待！</li>
        <li>新文章每周更新，记得关注！</li>
      </ul>
    </div>

    <!-- 网站信息卡片 -->
    <div class="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:shadow-lg">
      <h3 class="text-xl font-bold text-gray-800 mb-4 dark:text-white">网站信息</h3>
      <ul class="text-gray-700 dark:text-gray-300">
        <li>
          <strong class="text-gray-800 dark:text-white">文章数：</strong
          >{{ userInfo.articleCount }} 篇
        </li>
        <li>
          <strong class="text-gray-800 dark:text-white">分类数：</strong
          >{{ userInfo.categoryCount }} 个
        </li>
        <li>
          <strong class="text-gray-800 dark:text-white">标签数：</strong>{{ userInfo.tagCount }} 个
        </li>
        <li>
          <strong class="text-gray-800 dark:text-white">用户访问量：</strong>{{ userInfo.uv }} 次
        </li>
        <li>
          <strong class="text-gray-800 dark:text-white">页面访问量：</strong>{{ userInfo.pv }} 次
        </li>
        <li>
          <strong class="text-gray-800 dark:text-white">运行时长：</strong>{{ formatUpTime }} 天
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useStore } from '@/stores'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = useStore()
const storeRef = storeToRefs(store)
const userInfo = computed(() => storeRef.userInfo.value)

const formatUpTime = computed(() => dayjs().diff(userInfo.value.upTime, 'day'))
</script>
