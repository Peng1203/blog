import type { BolEnum, CommentType } from '@/constant'
export interface Tag {
  id: number
  tagName: string
  icon: string
  articles?: number
  createTime: string
  updateTime: string
}

export interface User {
  createTime: string
  updateTime: string
  id: number
  userName: string
  email?: any
  nickName?: any
  phoneNumber?: any
  userEnabled: number
  userAvatar: string
}

export interface Category {
  id: number
  categoryName: string
  description: string
  articles?: number
  createTime: string
  updateTime: string
}

export interface Article {
  createTime: string
  updateTime: string
  id: number
  title: string
  summary: string
  content: string
  contentModel: number
  cover: string
  likes: number
  views: number
  type: number
  status: number
  isTop: number
  tags: Tag[]
  author: User
  category: Category
}

export interface Moment {
  id: number
  content: string
  userId: number
  mediaUrls: string[]
  isTop: 0 | 1
  status: 1 | 2
  likes: number
  createTime: string
  updateTime: string
}

export interface Personal {
  userName: string
  nickName: string
  userAvatar: string
  articleCount: number
  categoryCount: number
  tagCount: number
  userId: number
  sign: string
  icp: string
  uv: number
  pv: number
  upTime: string
  email?: string | null
  notice?: string | null
}

export interface Comment {
  createTime: string
  updateTime: string
  id: number
  content: string
  name: string
  userId: number
  email: string
  avatar: string
  type: CommentType
  targetId: number
  ip: string
  location: Location
  userAgent: string
  device: any
  parentId: number | null
  replyId: number | null
  likes: number
  dislikes: number
  isDeleted: boolean
  isTop: BolEnum
  blogUrl: string | null
}

export interface Location {
  country: string
  province: string
  city: string
  isp: string
}
