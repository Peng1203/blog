<template>
  <PengForm
    ref="infoFormRef"
    labelW="200"
    v-model="articleForm"
    :formItems="formItemList"
    @radioChange="handleRadioChange"
  >
    <template #categorySlot="{ prop }">
      <CategorySelect v-model="articleForm[prop]" />
    </template>

    <template #tagSlot="{ prop }">
      <TagSelect v-model="articleForm[prop]" />
    </template>
  </PengForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormItem } from '@/components/Form'
import { AddArticleType } from '@/views/article/article'
import { ARTICLE } from '@/constants'
import { CategorySelect } from '@/views/article/category'
import { TagSelect } from '@/views/article/tag'

const articleForm = defineModel<AddArticleType>({ required: true })

const formItemList = ref<FormItem<AddArticleType>[]>([
  {
    span: 13,
    type: 'input',
    label: '标题',
    prop: 'title',
    placeholder: '请输入文章标题',
    // disabled: true,
    rules: [{ required: true, trigger: 'blur', message: '文章标题不能为空' }],
  },
  {
    span: 13,
    type: 'slot',
    label: '分类',
    prop: 'category',
    slotName: 'categorySlot',
    rules: [{ required: true, trigger: 'change', message: '文章分类不能为空' }],
  },
  {
    span: 16,
    type: 'slot',
    label: '标签',
    prop: 'tags',
    slotName: 'tagSlot',
    rules: [{ required: true, trigger: 'change', message: '文章标签不能为空' }],
  },
  // {
  //   span: 16,
  //   type: 'select',
  //   label: '标签',
  //   prop: 'tags',
  //   multiple: true,
  //   multipleLimit: 3,
  //   placeholder: '标签',
  //   options: [],
  //   rules: [{ required: true, trigger: 'change', message: '文章标签不能为空' }],
  // },
  {
    type: 'switch',
    label: '置顶',
    prop: 'isTop',
    tText: '是',
    fText: '否',
    tValue: 1,
    fValue: 0,
  },
  {
    type: 'radio',
    label: '类型',
    prop: 'type',
    options: ARTICLE.radioTypeOptions,
  },
  {
    type: 'radio',
    label: '状态',
    prop: 'status',
    options: ARTICLE.radioStatusOptions,
  },
  {
    span: 13,
    type: 'pwd',
    label: '访问密码',
    prop: 'accessPassword',
    isShow: articleForm.value.status === 2,
    rules: [{ required: true, trigger: 'blur', message: '私密文章 访问不能为空' }],
  },
  {
    type: 'upload',
    label: '封面',
    prop: 'cover',
  },
  {
    type: 'textarea',
    label: '摘要',
    prop: 'summary',
    width: 250,
    height: 150,
    placeholder: '默认取文章内容的前300个字符',
  },
])

const infoFormRef = ref<RefType>()

// 校验表单
const validateForm = async (): Promise<boolean> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { status, accessPassword, ...args } = articleForm.value
  // 当为私密文章时 调用整个表单校验 否则调用 局部校验
  const [validateMethod, validateProps] = status === 2 ? ['validate', undefined] : ['validateField', Object.keys(args)]

  // prettier-ignore
  const validateStatus = await infoFormRef.value
    .getRef()[validateMethod](validateProps)
    .catch(() => false);
  return validateStatus
}

// 重置表单校验规则
const resetFormFields = () => infoFormRef.value.resetFields()

const handleRadioChange = () => {
  const accessPwdItem = formItemList.value.find(item => item.prop === 'accessPassword')
  if (articleForm.value.status !== 2) accessPwdItem.isShow = false
  else accessPwdItem.isShow = true
}

defineExpose({ validateForm, resetFormFields })
</script>
