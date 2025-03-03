import { ListApiBaseResponse } from 'Api'

export interface CategoryData {
  id: number
  categoryName: string
  description: string
  createTime: string
  updateTime: string
  articles?: number
  userId: number | null
  userName: string | null
}

export type CategoryListDate = ListApiBaseResponse<CategoryData>

// export type AddCategoryType = Omit<CategoryData, 'id' | 'createTime' | 'updateTime' | 'articles'>
export type AddCategoryType = Pick<CategoryData, 'categoryName' | 'description'>

export interface EditProps {
  editRow: CategoryData
}
