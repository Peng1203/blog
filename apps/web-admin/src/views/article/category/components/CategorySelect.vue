<template>
  <PengSelect
    width="100%"
    ref="selectRef"
    filterable
    allow-create
    default-first-option
    placeholder="文章分类"
    :options="options"
    v-model="category"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { useArticleInfo } from '@/stores/articleInfo'
import { onMounted, ref, computed } from 'vue'
import PengSelect from '@/components/Select'
import { useComponentRef } from '@/composables/useComponentRef'
import { useCategoryApi } from '@/api'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { storeToRefs } from 'pinia'
import { CategoryData } from '../types'
import { CodeEnum } from '@/constants'
import { useUserInfo } from '@/stores/userInfo'

const { addCategory } = useCategoryApi()

const store = useArticleInfo()
const userInfoStore = useUserInfo()

const articleStoreState = storeToRefs(store)

const model = defineModel<number | ''>({ required: true })

// const category = ref<number>();
const category = computed<number | ''>({
  get: () => model.value,
  set: newVal => (model.value = newVal),
})

const options = ref<OptionItem[]>([])

const getCategoryOptions = async (update: boolean = false) => {
  try {
    await store.getCategoryData(update)
    options.value = articleStoreState.userCategoryOption.value
  } catch (e) {
    console.log('e', e)
  }
}

const selectRef = useComponentRef(PengSelect)

const handleChange = async val => {
  const findRes = options.value.find(({ value }) => value === val)
  if (findRes) return
  else {
    const addStatus = await addNewCategory(val)
    if (!addStatus) return
    // useNotificationMsg('失败', '分类创建失败', 'error');
    await getCategoryOptions(true)
    // 设置选中新增的分类id
    model.value = newCategory.value.id
  }
}

const newCategory = ref<CategoryData>()
// 添加分类
const addNewCategory = async (categoryName: string): Promise<boolean> => {
  try {
    const params = {
      categoryName,
      description: '',
      userId: userInfoStore.userInfos.id,
    }
    const { data: res } = await addCategory<CategoryData>(params)
    const { code, message, success, data } = res
    if (code !== CodeEnum.POST_SUCCESS || !success) return false
    useNotificationMsg('成功', message)
    newCategory.value = data
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

onMounted(() => {
  getCategoryOptions()
})
</script>
