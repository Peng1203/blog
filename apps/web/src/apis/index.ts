import type { ListResponse, TransformedResponse } from '@/types/api'
import type { Article, Category, Moment, Tag, Personal, Comment } from '@/types/data'
import { request } from '@/utils/request'
import type { AddCommentDto } from './dto'
import type { CommentType } from '@/constant'

export const getArticleData = (params: any): Promise<ListResponse<Article>> => {
  return request({
    params,
    method: 'GET',
    url: `/article/user/${import.meta.env.VITE_USER_ID}/articles`
  })
}

export const getArticleDetailData = (aid: number): Promise<TransformedResponse<Article>> => {
  return request({
    method: 'GET',
    url: `/article/user/${import.meta.env.VITE_USER_ID}/articles/${aid}`
  })
}

export const getCategoryData = (): Promise<ListResponse<Category>> => {
  return request({
    method: 'GET',
    url: `/category/user/${import.meta.env.VITE_USER_ID}/categorys`
  })
}

export const getTagData = (): Promise<ListResponse<Tag>> => {
  return request({
    method: 'GET',
    url: `/tag/user/${import.meta.env.VITE_USER_ID}/tags`
  })
}

export const getMomentData = (params: any): Promise<ListResponse<Moment>> => {
  return request({
    params,
    method: 'GET',
    url: `/moment/user/${import.meta.env.VITE_USER_ID}/moments`
  })
}

export const getPersonalInfo = (): Promise<TransformedResponse<Personal>> => {
  return request({
    method: 'GET',
    url: `/personal/${import.meta.env.VITE_USER_ID}`
  })
}

export const addUV = (): Promise<TransformedResponse<string>> => {
  return request({
    method: 'PATCH',
    url: `/personal/uv/${import.meta.env.VITE_USER_ID}`
  })
}

export const addPV = (): Promise<TransformedResponse<string>> => {
  return request({
    method: 'PATCH',
    url: `/personal/pv/${import.meta.env.VITE_USER_ID}`
  })
}

/**
 * 添加 文章/动态 评论
 */
export const addComment = (data: AddCommentDto): Promise<TransformedResponse<Comment>> => {
  return request({
    url: '/comment',
    method: 'POST',
    data: JSON.stringify(data)
  })
}

/**
 * 查询 文章/动态 评论
 */
export const getCommentData = (
  type: CommentType,
  targetId: number,
  params: any
): Promise<ListResponse<Comment>> => {
  return request({
    method: 'GET',
    params,
    url: `/comment/${type}/${targetId}/comments`
  })
}

/**
 * 评论点赞
 */
export const likeComment = (cid: number): Promise<TransformedResponse<string>> => {
  return request({
    url: `/comment/${cid}/like`,
    method: 'POST'
  })
}

/**
 * 评论取消点赞
 */
export const cancelLikeComment = (cid: number): Promise<TransformedResponse<string>> => {
  return request({
    url: `/comment/${cid}/like`,
    method: 'DELETE'
  })
}

/**
 * 获取评论回复
 */
export const getReplyData = (
  type: CommentType,
  targetId: number,
  commentId: number,
  params: any
): Promise<ListResponse<Comment>> => {
  return request({
    method: 'GET',
    params,
    url: `/comment/${type}/${targetId}/reply/${commentId}`
  })
}

/**
 * 动态点赞
 */
export const likeMoment = (cid: number): Promise<TransformedResponse<string>> => {
  return request({
    url: `/moment/${cid}/like`,
    method: 'POST'
  })
}

/**
 * 动态取消点赞
 */
export const cancelLikeMoment = (cid: number): Promise<TransformedResponse<string>> => {
  return request({
    url: `/moment/${cid}/like`,
    method: 'DELETE'
  })
}
