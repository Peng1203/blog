import { ref } from 'vue'

export function useListState<T>() {
  const loading = ref<boolean>()
  const page = ref<number>(1)
  const pageSize = ref<number>(5)
  const dataList = ref<T[]>([])
  const total = ref<number>(0)

  return {
    loading,
    page,
    pageSize,
    dataList,
    total
  }
}
