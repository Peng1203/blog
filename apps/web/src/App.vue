<template>
  <DefaultLayout />
</template>

<script setup>
import { onMounted } from 'vue'
import { getPersonalInfo, addUV } from './apis'
import DefaultLayout from '@/layout/Index.vue'
import { useStore } from '@/stores'
const store = useStore()

const getUserPersonal = async () => {
  try {
    const { data: res } = await getPersonalInfo()
    const { code, success, data } = res
    if (code !== 20000 || !success) return
    store.userInfo = data
  } catch (e) {
    console.log('e', e)
  }
}

onMounted(() => {
  addUV()
  getUserPersonal()
})
</script>
