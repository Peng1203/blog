<template>
  <Peng-Select
    width="100%"
    ref="selectRef"
    multiple
    filterable
    allow-create
    default-first-option
    placeholder="文章标签"
    :multipleLimit="3"
    :options="options"
    :reserve-keyword="false"
    v-model="tag"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { useTagApi } from '@/api'
import { useArticleInfo } from '@/stores/articleInfo'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { TagData } from '../types'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { CodeEnum } from '@/constants'
import { useUserInfo } from '@/stores/userInfo'

const { addTag } = useTagApi()

const userInfoStore = useUserInfo()
const store = useArticleInfo()
const articleStoreState = storeToRefs(store)

const model = defineModel<number[]>({ required: true })

const tag = computed<number[]>({
  get: () => model.value,
  set: newVal => (model.value = newVal),
})

const options = ref<OptionItem[]>([])

const getTagOptions = async (update: boolean = false) => {
  try {
    await store.getTagData(update)
    options.value = articleStoreState.userTagOption.value
  } catch (e) {
    console.log('e', e)
  }
}

const newTag = ref<TagData>()

// 添加权限标识
const addNewTag = async (tagName): Promise<boolean> => {
  try {
    const params = {
      icon: '',
      tagName,
      userId: userInfoStore.userInfos.id,
    }
    const { data: res } = await addTag<TagData>(params)
    const { code, message, success, data } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg('成功', message)
    newTag.value = data
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const handleChange = async (tagIds: (string | number)[]) => {
  const addTags = tagIds.filter(tId => !Number.isInteger(tId))
  if (!addTags.length) return
  else {
    const addStatus = await addNewTag(addTags[0])
    if (!addStatus) return
    await getTagOptions(true)
    const currentIndex = tagIds.findIndex(id => id === newTag.value.tagName)
    model.value[currentIndex] = newTag.value.id
  }
}

onMounted(() => {
  getTagOptions()
})
</script>
