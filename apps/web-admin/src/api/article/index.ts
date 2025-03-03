import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'

export function useArticleApi() {
  return {
    /**
     * 获取文章列表
     * @author Peng
     * @date 2023-04-29
     * @param {any} params:object
     * @returns {any}
     */
    getArticles<T>(params: object): TransformedResponse<T> {
      return request({
        url: '/article',
        method: Method.GET,
        params,
      })
    },
    /**
     * 通过文章id获取详情信息
     */
    getArticleDetailById<T>(uid: number, articleId: number): TransformedResponse<T> {
      return request({
        url: `/article/${uid}/${articleId}`,
        method: Method.GET,
      })
    },
    /**
     * 添加文章
     * @author Peng
     * @date 2023-04-29
     * @param {any} data:object
     * @returns {any}
     */
    addArticle<T>(data: object): TransformedResponse<T> {
      return request({
        url: '/article',
        method: Method.POST,
        data: JSON.stringify(data),
      })
    },
    /**
     * 通过文章ID更新文章
     * @author Peng
     * @date 2023-04-29
     * @param {any} authorId:number
     * @param {any} articleId:number
     * @param {any} data:object
     * @returns {any}
     */
    updateArticle<T>(authorId: number, articleId: number, data: object): TransformedResponse<T> {
      return request({
        url: `/article/${authorId}/${articleId}`,
        method: Method.PATCH,
        data: JSON.stringify(data),
        headers: {
          fullscreenLoading: true,
        },
      })
    },
    /**
     * 通过ID删除文章
     * @author Peng
     * @date 2023-04-29
     * @param {any} authorId:number
     * @param {any} articleId:number
     * @returns {any}
     */
    delArticle<T>(authorId: number, articleId: number): TransformedResponse<T> {
      return request({
        url: `/article/${authorId}/${articleId}`,
        method: Method.DELETE,
      })
    },
    getUserArticles<T>(uid, params): TransformedResponse<T> {
      return request({
        url: `/article/${uid}`,
        method: Method.GET,
        params,
      })
    },
  }
}
