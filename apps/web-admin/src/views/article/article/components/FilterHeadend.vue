<template>
  <!-- 顶部过滤 -->
  <!-- {{ filterParams }} -->
  <el-card shadow="hover">
    <el-skeleton
      :rows="3"
      animated
      v-if="filterState.loading"
    />
    <div
      claas="header-filter-container"
      v-else
    >
      <Icon name="ArrowRightBold" />
      <div class="row category-row">
        <span class="row-label">分类：</span>

        <div
          class="x-scroll-container"
          v-XScroll
        >
          <el-check-tag
            size="small"
            class="ml15 pseudo-link"
            :key="value"
            :checked="value === filterParams.categoryId"
            v-for="{ label, value } in filterState.categoryList"
            @click="handleFilterByCatagory(value)"
          >
            {{ label }}
          </el-check-tag>
        </div>
      </div>

      <el-divider />

      <div class="row category-row">
        <span class="row-label">标签：</span>

        <div
          v-XScroll
          class="x-scroll-container"
        >
          <el-tag
            v-for="{ label, value } in filterState.tagList"
            :key="value"
            :effect="value === filterParams.tagId ? 'dark' : 'plain'"
            size="small"
            class="ml15 pseudo-link"
            @click="handleFilterByTag(value)"
          >
            {{ label }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <div class="row auther-filter-row">
        <span class="row-label">作者：</span>
        <!-- :multiple-limit="5" -->
        <!-- collapse-tags -->
        <!-- <div> -->
        <!-- multiple -->

        <UserSelect v-model="filterParams.authorId" />

        <el-link
          type="primary"
          fz11
          class="ml10"
          @click="filterParams.authorId = userInfoStore.userInfos.id"
        >
          只看我自己
        </el-link>
        <el-link
          type="info"
          fz11
          class="ml10"
          @click="filterParams.authorId = 0"
        >
          重置
        </el-link>
        <!-- </div> -->
      </div>

      <el-divider />

      <div class="row other-row">
        <!-- 归档过滤 -->
        <div class="flex-sb-c">
          <span class="row-label">归档：</span>
          <!-- 归档查询 -->
          <div class="flex-c-c">
            <!-- <span
                class="mr5"
                style="font-size: 10px"
              >
                归档：
              </span> -->
            <!-- :key="filterParams.timeVal" -->
            <DatePicker
              :type="2"
              width="200px"
              format="YYYY-MM-DD"
              range-separator="到"
              v-model="filterParams.timeVal"
              @change="handleDateRangeChange"
            />
          </div>
        </div>

        <div flex-sb-c>
          <span>文章类型：</span>
          <Select
            size="small"
            v-model="filterParams.type"
            :options="filterState.typeOptions"
            @selectChange="handleSearch"
          />
        </div>

        <div flex-sb-c>
          <span>文章状态：</span>
          <Select
            size="small"
            v-model="filterParams.status"
            :options="filterState.statusOptions"
            @selectChange="handleSearch"
          />
        </div>

        <!-- 搜索框 -->
        <Peng-Search
          size="small"
          placeholder="文章标题/内容简介"
          v-model="filterParams.queryStr"
          @search="handleSearch"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="">
import { ref, reactive, nextTick, onMounted, computed, watch } from 'vue'
import { FilterHeadendProps } from '../types'
import { useUserInfo } from '@/stores/userInfo'
import { useArticleInfo } from '@/stores/articleInfo'
import Icon from '@/components/svgIcon/index.vue'
import Select from '@/components/Select'
import { ARTICLE } from '@/constants'
import { UserSelect } from '@/views/user/user'
import DatePicker from '@/components/Date'

const props = defineProps<FilterHeadendProps>()
const emits = defineEmits(['update:modelValue', 'resetFilterGetDataList', 'search'])

const userInfoStore = useUserInfo()
const articleInfoStore = useArticleInfo()

let filterParams = computed({
  get: () => props.modelValue,
  set: (val: any) => emits('update:modelValue', val),
})

const filterState = reactive({
  loading: ref<boolean>(false),
  // 分类筛选数据
  categoryList: ref<OptionItem[]>([{ label: '全部', value: 0 }]),
  // 标签筛选数据
  tagList: ref<OptionItem[]>([{ label: '全部', value: 0 }]),
  // 作者筛选数据
  // authorOptions: ref<OptionItem[]>([{ label: '全部', value: 0 }]),
  // 文章类型筛选数据
  typeOptions: ARTICLE.typeOptions,
  // 文章状态筛选数据
  statusOptions: ARTICLE.statusOptions,
})

const handleSearch = () => {
  emits('search')
  // emits('resetFilterGetDataList');
}

// 归档日期查询
const handleDateRangeChange = () => {
  handleSearch()
}

// 分类筛选
const handleFilterByCatagory = (val: number) => {
  if (filterParams.value.categoryId === val) return
  filterParams.value.categoryId = val
  handleSearch()
}

// 标签筛选
const handleFilterByTag = (val: number) => {
  if (filterParams.value.tagId === val) return
  filterParams.value.tagId = val
  handleSearch()
}

// 作者过滤
watch(
  () => filterParams.value.authorId,
  () => handleSearch(),
  { deep: true }
)

const optionsInit = async () => {
  filterState.loading = true
  await Promise.all([articleInfoStore.getCategoryData(), articleInfoStore.getTagData()]).catch(
    () => (filterState.loading = false)
  )

  nextTick(() => {
    filterState.categoryList = [...filterState.categoryList, ...articleInfoStore.categoryOption]
    filterState.tagList = [...filterState.tagList, ...articleInfoStore.tagOption]
    filterState.loading = false
  })
}

onMounted(() => {
  optionsInit()
})
</script>

<style scoped lang="scss">
.row {
  display: flex;
  align-items: center;
  .row-label {
    display: flex;
    min-width: 50px;
  }
}
.other-row {
  justify-content: space-between;
}
.el-divider {
  margin: 13px 0;
}
</style>
