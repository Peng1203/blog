<template>
  <footer class="bg-gray-800 text-white py-6 bottom-0 left-0 w-full">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-center md:text-left">
          <p class="text-sm">
            &copy;
            {{ currentYear }} Peng Blog. All rights reserved.
          </p>
        </div>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <a href="https://beian.miit.gov.cn" target="_blank" class="hover:text-blue-400">
            {{ userInfo.icp }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
const store = useStore()
const storeRef = storeToRefs(store)
const currentYear = ref(new Date().getFullYear())

const userInfo = computed(() => storeRef.userInfo.value)
</script>
