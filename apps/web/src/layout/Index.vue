<template>
  <NavBar />

  <router-view v-slot="{ Component }">
    <KeepAlive :include="KeepComponents">
      <component :is="Component" />
    </KeepAlive>
  </router-view>

  <Footer />
</template>

<script setup lang="ts">
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'

const KeepComponents = ['Home', 'Category', 'Tag', 'Moment']
</script>
