<template>
  <!-- 绑定key 用于通知视图更新 -->
  <Peng-Select
    width="120px"
    :key="userId"
    :options="userOptions"
    v-model="userId"
    @change="$event => emit('change', $event)"
  />
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref } from 'vue'
import { useUsersInfo } from '@/stores/userList'
import { storeToRefs } from 'pinia'

const model = defineModel({ required: true, type: Number as PropType<number> })

type BindValue = 'id' | 'name'

const props = defineProps({
  otherOptions: {
    type: Array as PropType<OptionItem[]>,
    default: () => [],
  },
  bindValue: {
    type: String as PropType<BindValue>,
    default: 'id',
  },
})

const emit = defineEmits(['change'])

const userId = computed({
  get: () => model.value,
  set: newVal => (model.value = newVal),
})

const store = useUsersInfo()

const { userOption, userList } = storeToRefs(store)

const userOptions = ref<OptionItem[]>([{ label: '全部', value: 0 }])
const getUserOptions = async () => {
  try {
    await store.getUserData()
    if (props.bindValue === 'id') {
      userOptions.value = [...userOptions.value, ...userOption.value]
    } else {
      userOptions.value = [
        ...userOptions.value,
        ...userList.value.map(user => ({
          label: user.userName,
          value: user.userName,
        })),
      ]
    }
  } catch (e) {
    console.log('e', e)
  }
}

onMounted(() => {
  userOptions.value = [...userOptions.value, ...props.otherOptions]
  getUserOptions()
})
</script>
