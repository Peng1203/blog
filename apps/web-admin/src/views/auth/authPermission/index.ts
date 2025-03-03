import { OperationItem } from '@/components/Form'

export { default as default } from './Permission.vue'

// 请求方式下拉数据
export const resourceMethodOptions: OperationItem[] = [
  { label: 'GET', value: 1, color: '#5bacfa' },
  { label: 'POST', value: 2, color: '#07cd93' },
  { label: 'PUT', value: 3, color: '#ffa443' },
  { label: 'DELETE', value: 4, color: '#ff4244' },
  { label: 'PATCH', value: 5, color: '#0ae3c3' },
]

export * from './types'

export { default as PermissionTree } from './components/PermissionTree.vue'
