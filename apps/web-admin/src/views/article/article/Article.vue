<template>
  <div class="article layout-padding">
    <!-- 顶部过滤组件 -->
    <FilterHeadend
      v-model="filterParams"
      @search="resetFilterGetDataList"
    />

    <!-- {{ filterParams }} -->
    <!-- 文章列表容器 -->
    <el-card
      shadow="hover"
      class="layout-padding-auto article-list mt15"
      v-loading="articleListState.loading"
    >
      <el-scrollbar>
        <div
          v-infinite-scroll="load"
          infinite-scroll-immediate
          :infinite-scroll-disabled="articleListState.articleList.length === articleListState.total"
        >
          <!-- 文章删除过渡效果 -->
          <!-- <TransitionGroup name="list"> -->
          <template
            :key="item.id"
            v-for="(item, i) in articleListState.articleList"
          >
            <!-- :article="item" -->
            <ArticleItem
              v-model="articleListState.articleList[i]"
              v-slide-in="100"
              @click-delete-dtn="handleDelete"
              @click-edit-btn="handleEditArticle"
              @click-view-btn="handlePreviewArticle"
            />
          </template>
          <!-- </TransitionGroup> -->
        </div>

        <!-- 加载完毕 -->
        <p
          flex-c-c
          pd20_0
          v-if="!articleListState.loading && articleListState.articleList.length === articleListState.total"
        >
          加载完毕
        </p>
      </el-scrollbar>
    </el-card>

    <!-- 预览 -->
    <PreviewArticleDialog
      v-model="previewDialogStatus"
      v-model:row="previewRow"
      ref="previewDialogRef"
    />
  </div>
</template>

<script lang="ts" setup name="ArticleList">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleApi } from '@/api/article/index'
import { ArticleListData, ArticleData, FilterParamsInfo } from './'
import FilterHeadend from './components/FilterHeadend.vue'
import ArticleItem from './components/ArticleItem.vue'
import { ElNotification } from 'element-plus'
import { CodeEnum } from '@/constants'

const router = useRouter()
const { getArticles, delArticle } = useArticleApi()

let filterParams = reactive<FilterParamsInfo>({
  queryStr: '',
  type: 0,
  status: 0,
  authorId: 0,
  categoryId: 0,
  tagId: 0,
  // 归档日期
  timeVal: ['', ''],
})

// 文章列表参数
let articleListState = reactive({
  loading: false,
  page: 1,
  pageSize: 10,
  column: 'createTime',
  order: 'DESC',
  // 文章列表数据
  articleList: ref<ArticleData[]>([]),
  total: 0,
})

// 获取文章列表
const getArticleDataList = async () => {
  articleListState.loading = true
  try {
    const { page, pageSize, order, column } = articleListState
    const { timeVal, ...args } = filterParams
    const [startTime, endTime] = timeVal || ['', '']
    const params = {
      page,
      pageSize,
      column,
      order,
      startTime,
      endTime,
      ...args,
    }
    const { data: res } = await getArticles<ArticleListData>(params)
    const { data, code, success } = res
    if (code !== CodeEnum.GET_SUCCESS || !success) return (articleListState.loading = false)

    articleListState.articleList = [...articleListState.articleList, ...data.list]
    articleListState.total = data.total
  } catch (e) {
    console.log(e)
    articleListState.loading = false
  } finally {
    articleListState.loading = false
  }
}

// 带有过滤条件的查询 page 和 list 需要重置
const resetFilterGetDataList = () => {
  articleListState.articleList = []
  articleListState.page = 1
  getArticleDataList()
}

// 文章列表触底
const load = () => {
  if (articleListState.articleList.length >= articleListState.total) return
  articleListState.page++
  getArticleDataList()
}

// 处理删除文章
const handleDelete = async (row: ArticleData) => {
  const delRes = await deleteArticle(row.author.id, row.id)
  if (!delRes) return
  // 从文章列表数据中找到对应数据 删除 而不是从新调用列表接口
  removeArticleFromList(row.id)
}

// 删除文章
const deleteArticle = async (uid: number, aid: number): Promise<boolean> => {
  try {
    const { data: res } = await delArticle<string>(uid, aid)
    const { code, data, message, success } = res
    if (code !== CodeEnum.DELETE_SUCCESS || !success) return false
    ElNotification({
      title: message,
      message: data,
      type: 'success',
    })

    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const removeArticleFromList = (aid: number) => {
  const findItemIndex = articleListState.articleList.findIndex(({ id }) => id === aid)
  if (findItemIndex === -1) return
  articleListState.articleList.splice(findItemIndex, 1)
}

// 编辑文章
const handleEditArticle = (row: ArticleData) => {
  router.push({
    name: 'EditArticle',
    params: { aid: row.id },
  })
}

// 预览组件
const previewDialogStatus = ref<boolean>(false)
const previewRow = ref<ArticleData>()
const PreviewArticleDialog = defineAsyncComponent(() => import('./components/PreviewArticle.vue'))
// 处理预览操作
const handlePreviewArticle = async (row: ArticleData) => {
  previewRow.value = row
  previewDialogStatus.value = true
}

onMounted(() => {
  getArticleDataList()
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  .row-label {
    display: flex;
    min-width: 50px;
  }
}
.article {
  :deep(.el-date-editor) {
    max-width: 200px;
  }
  .article-list {
    :deep(.el-card__body) {
      height: 100%;
      padding: 0 !important;
      // overflow-y: auto;
    }
  }
}
.article-item {
  p {
    max-width: 720px;
    max-height: 100px;
    line-height: 22px;
    font-size: 12px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    overflow-y: auto;
  }
}
.article-statistics {
  color: rgba(0, 0, 0, 0.45);
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

:deep(.is-horizontal) {
  height: 0px;
  left: 0px;
  display: none;
}
</style>
