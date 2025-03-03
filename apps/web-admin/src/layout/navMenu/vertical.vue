<!-- 父级菜单 -->
<template>
  <el-menu
    router
    background-color="transparent"
    :collapse="state.isCollapse"
    :collapse-transition="false"
    :default-active="state.defaultActive"
    :unique-opened="getThemeConfig.isUniqueOpened"
  >
    <template v-for="val in menuLists">
      <el-sub-menu
        :index="val.path"
        :key="val.path"
        @click="handleClickMenuItem"
        v-if="val.children && val.children.length > 0"
      >
        <template #title>
          <div>
            <SvgIcon
              :name="val.meta.icon"
              :size="16"
            />
          </div>
          <span>{{ val.meta.title }}</span>
        </template>
        <SubItem :chil="val.children" />
      </el-sub-menu>
      <template v-else>
        <el-menu-item
          :index="val.path"
          :key="val.path"
        >
          <div>
            <SvgIcon
              :name="val.meta.icon"
              :size="16"
            />
          </div>
          <template
            #title
            v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)"
          >
            <span>{{ val.meta.title }}</span>
          </template>
          <template
            #title
            v-else
          >
            <a
              class="w100"
              @click.prevent="onALinkClick(val)"
            >
              {{ val.meta.title }}
            </a>
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script setup lang="ts" name="navMenuVertical">
import { defineAsyncComponent, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/stores/themeConfig'
import other from '@/utils/other'

// 引入组件
const SubItem = defineAsyncComponent(() => import('@/layout/navMenu/subItem.vue'))

// 定义父组件传过来的值
const props = defineProps({
  // 菜单列表
  menuList: {
    type: Array<RouteRecordRaw>,
    default: () => [],
  },
})

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const route = useRoute()
const state = reactive({
  // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
  defaultActive: (route.meta.isDynamic ? route.meta.isDynamicPath : route.path) as string,
  isCollapse: false,
})

// 获取父级菜单数据
const menuLists = computed(() => <RouteItems>props.menuList)
// 获取布局配置信息
const getThemeConfig = computed(() => themeConfig.value)
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteToFrom) => {
  const { path, meta } = currentRoute
  const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/')
  if (pathSplit.length >= 4 && meta?.isHide) return pathSplit.splice(0, 3).join('/')
  else return path
}

const handleClickMenuItem = () => {}

// 打开外部链接
const onALinkClick = (val: RouteItem) => {
  other.handleOpenLink(val)
}
// 页面加载时
onMounted(() => {
  state.defaultActive = setParentHighlight(route)
})
// 路由更新时
onBeforeRouteUpdate(to => {
  // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
  state.defaultActive = setParentHighlight(to)
  const clientWidth = document.body.clientWidth
  if (clientWidth < 1000) themeConfig.value.isCollapse = false
})
// 设置菜单的收起/展开
watch(
  themeConfig.value,
  () => {
    document.body.clientWidth <= 1000 ? (state.isCollapse = false) : (state.isCollapse = themeConfig.value.isCollapse)
  },
  {
    immediate: true,
  }
)
</script>
