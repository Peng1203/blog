import { ref } from 'vue'
import type { Comment } from '@/types/data'
import { ANONMOUS_USER_NAME_KEY } from '@/constant'

export interface CommentItem extends Comment {
  replyData: Comment[]
  replyCount: number
}

export const comments = ref<CommentItem[]>([])

// 匿名用户的名称
export const anonmousUserName = ref<string>(localStorage.getItem(ANONMOUS_USER_NAME_KEY) || '')
