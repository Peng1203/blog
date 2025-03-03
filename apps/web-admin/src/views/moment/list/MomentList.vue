<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <template #header>
        <div class="card-header flex-sb-c">
          <span>动态列表</span>
        </div>
      </template>
      {{ activeTab }}
      <el-tabs
        v-model="activeTab"
        class="demo-tabs"
        @tab-click="handleTabChange"
      >
        <el-tab-pane
          :name="1"
          label="公开"
        />

        <el-tab-pane
          :name="2"
          label="私密"
        />
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useTableState } from '@/hooks'
import { ref } from 'vue'
import { MomentData } from '../types'

const { tableState, setData } = useTableState<MomentData>()

// 1公开 2私密
const activeTab = ref(1)

const getMomentList = () => {
  try {
    const params = {}
  } catch (e) {
    console.log('e', e)
  }
}

const handleTabChange = () => {}
</script>
