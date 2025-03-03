<template>
  <div class="article-item">
    <!-- 文章封面 -->
    <!-- fit="fit" -->
    <el-image
      w350px
      h200px
      :src="article.cover || 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
    >
      <template #error>
        <div
          class="err-cover"
          w350px
          h200px
        >
          <el-icon><icon-picture /></el-icon>
        </div>
      </template>
    </el-image>

    <div class="info-con">
      <!-- 操作行 -->
      <div
        flex-e-c
        relative
      >
        <el-icon
          mr10
          pseudo-c-p
          :size="20"
          title="预览"
          color="#CCCCCC"
          @click="handleClickActionBnt('clickViewBtn')"
        >
          <View />
        </el-icon>

        <el-icon
          mr10
          pseudo-c-p
          :size="20"
          title="编辑"
          color="#6495ED"
          v-if="userInfoStore.userInfos.id === article.author.id"
          @click="handleClickActionBnt('clickEditBtn')"
        >
          <!-- style="margin: 0 5px" -->
          <Edit />
        </el-icon>

        <el-popconfirm
          mr10
          width="auto"
          icon="DeleteFilled"
          icon-color="#f56c6c"
          :title="`是否删除当前文章 ?`"
          v-if="userInfoStore.userInfos.id === article.author.id"
          @confirm="handleClickActionBnt('clickDeleteDtn')"
        >
          <template #reference>
            <el-icon
              :size="20"
              pseudo-c-p
              title="删除"
              color="#FF0000"
            >
              <Delete />
            </el-icon>
          </template>
        </el-popconfirm>

        <i
          absolute
          style="right: -30px"
          v-if="article.isTop"
          class="iconfont icon-zhiding1"
        />
      </div>

      <!-- 标题 -->
      <div flex-sb-c>
        <h3 class="title">{{ article.title }}</h3>

        <span
          fz11
          style="color: rgba(128, 128, 128, 0.466)"
        >
          {{ typeMapping[article.type] }}
        </span>
      </div>
      <!-- 分类 -->
      <div class="category">
        <el-check-tag
          checked
          size="small"
          v-if="article.category"
        >
          {{ article.category.categoryName }}
        </el-check-tag>
        <span v-else>暂无分类</span>
        <!-- 文章状态 & 类型 -->
      </div>
      <!-- 文章内容 -->
      <div class="content-con">
        <p>
          {{ article.summary || article.content }}
        </p>
      </div>

      <!-- 相关信息 -->
      <div
        class="about-info-con"
        flex-sb-c
      >
        <div class="user-con">
          <!-- 头像 -->
          <el-avatar
            :size="30"
            :src="article.author?.userAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
          />
          <!-- 用户名/昵称 -->
          <span>{{ article.author?.nickName || article.author.userName }}</span>
          <!-- 发布信息 -->
          <span fz12>
            发布于：
            <span class="time">
              {{ article.createTime }}
            </span>
          </span>

          <span fz12>
            最近修改：
            <span class="time">
              {{ article.updateTime }}
            </span>
          </span>
        </div>

        <div>
          <!-- <span :style="{ color: statusMapping[article.status][1] }">
            {{ statusMapping[article.status][0] }}
          </span> -->

          <el-dropdown
            trigger="click"
            @command="handleChangeStatus"
          >
            <span class="pseudo-c-p flex-c-c">
              <span :style="{ color: statusMapping[article.status][1] }">
                {{ statusMapping[article.status][0] }}
              </span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :key="status"
                  :style="{ color: value[1] }"
                  :command="Number(status)"
                  :disabled="Number(status) === article.status"
                  v-for="(value, status) in statusMapping"
                >
                  {{ value[0] }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 文章其他信息 -->
      <div class="other-con flex-sb-c">
        <!-- 文章 相关数据 -->
        <InfoIcons />
        <!-- :size="14" -->
        <!-- 状态：{{ article.status }}
      {{  }} -->

        <div class="tag-con">
          <el-tag
            v-for="{ tagName, id } in article.tags"
            :key="id"
            :effect="'dark'"
            size="small"
            class="ml15 pseudo-link"
          >
            {{ tagName }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- {{ article }} -->
  </div>
</template>

<script setup lang="tsx">
import { useArticleApi } from '@/api'
import { ArticleData, IconHashMappingItem } from '../'
import { useUserInfo } from '@/stores/userInfo'

import { Picture as IconPicture, View, Delete, Edit } from '@element-plus/icons-vue'
import { CodeEnum } from '@/constants'
import { useNotificationMsg } from '@/hooks'

const { updateArticle } = useArticleApi()

const userInfoStore = useUserInfo()

const emits = defineEmits(['clickViewBtn', 'clickEditBtn', 'clickDeleteDtn'])

const article = defineModel<ArticleData>()

// 文章状态映射
const statusMapping = {
  1: ['已发布', '#00FF00'],
  2: ['私密', '#0000FF'],
  3: ['草稿箱', ' #FFA500'],
  4: ['已删除', '#FF0000'],
  5: ['待审核', '#808080'],
  6: ['已拒绝', '#800080'],
}

// 文章类型映射
const typeMapping = {
  1: '原创',
  2: '转载',
  3: '翻译',
}

// 图标信息映射
const iconHashMapping: IconHashMappingItem[] = [
  { name: 'icon-like-fill', title: '点赞数', prop: 'likes' },
  { name: 'icon-view', title: '浏览量', prop: 'views' },
  { name: 'icon-pinglun1', title: '评论数', prop: 'comment' },
]

// 点击顶部操作行按钮
const handleClickActionBnt = event => emits(event, article.value)

// 文章uv 数据组件
const InfoIcons = () => {
  return (
    <div class="icon-con">
      {iconHashMapping.map(info => (
        <span class="item">
          <Peng-Icon
            type="class"
            size={18}
            key={info.prop}
            name={info.name}
          />
          <span class="value">{article.value[info.prop] || 0}</span>
        </span>
      ))}
    </div>
  )
}

const handleChangeStatus = async (newStatus: number) => {
  try {
    const params = {
      status: newStatus,
    }

    const { data: res } = await updateArticle<ArticleData>(article.value.author.id, article.value.id, params)
    const { code, message, success } = res
    if (code !== CodeEnum.UPDATE_SUCCESS && success) return
    useNotificationMsg('更新成功', message)
    article.value.status = newStatus
  } catch (e) {
    console.log('e ------', e)
  }
}
</script>

<style scoped lang="scss">
.article-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  margin: 0 20px;
  border-block-end: 1px solid rgba(5, 5, 5, 0.06);

  .info-con {
    flex: 1;
  }
  .title {
    margin-block-end: 12px;
    color: rgba(0, 0, 0, 0.88);
    font-size: 16px;
    line-height: 1.5;
  }

  .category {
    margin-block-end: 16px;
  }

  .content-con {
    // width: 70%;
    max-width: 820px;
    max-height: 100px;
    overflow: hidden;
    line-height: 20px;
    p {
      white-space: pre-wrap;
      // overflow: hidden; /* 隐藏溢出的文本 */
      text-overflow: ellipsis;
    }
  }
  .about-info-con {
    margin-top: 16px;
    .user-con {
      display: flex;
      align-items: center;

      gap: 10px;

      .time {
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }

  .other-con {
    margin-block-start: 16px;
  }

  .icon-con {
    display: flex;
    gap: 10px;
    :deep(.item) {
      display: flex;
      align-items: center;

      // align-items: baseline;
      // justify-content: center;
      .value {
        margin-left: 5px;
      }
    }
  }
}

.err-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>
