import request from '@/utils/request'
import { TransformedResponse, RequestNoPageListParams } from 'Api'
import { EditMenuParams, MenuParams } from './params'
import { Method } from '../types'

export function useMenuApi() {
  return {
    /**
     * 获取菜单列表
     * @author Peng
     * @date 2023-04-18
     * @param {any} params:RequestNoPageListParams
     * @returns {any}
     */
    getMenus<T = any>(params: RequestNoPageListParams): TransformedResponse<T> {
      return request({
        url: '/menu',
        method: Method.GET,
        params,
      })
    },
    /**
     * 添加菜单
     * @author Peng
     * @date 2023-04-18
     * @param {any} data:MenuParams
     * @returns {any}
     */
    addMenu<T = any>(data: MenuParams): TransformedResponse<T> {
      return request({
        url: '/menu',
        method: Method.POST,
        data: JSON.stringify(data),
      })
    },
    /**
     * 删除菜单
     * @author Peng
     * @date 2023-04-18
     * @param {any} id:number
     * @returns {any}
     */
    deleteMenu<T = string>(id: number): TransformedResponse<T> {
      return request({
        url: `/menu/${id}`,
        method: Method.DELETE,
      })
    },
    /**
     * 更新菜单信息
     * @author Peng
     * @date 2023-04-18
     * @param {any} id:number
     * @param {any} params:EditMenuParams
     * @returns {any}
     */
    updataMenu<T = string>(id: number, params: EditMenuParams): TransformedResponse<T> {
      return request({
        url: `/menu/${id}`,
        method: Method.PUT,
        data: JSON.stringify(params),
      })
    },
    /**
     * 初始化菜单
     * @author Peng
     * @date 2023-06-12
     * @param {any} data:object
     * @returns {any}
     */
    initMenus<T>(data: object): TransformedResponse<T> {
      return request({
        url: '/menu/init',
        method: Method.POST,
        data: JSON.stringify(data),
        headers: {
          fullscreenLoading: true,
        },
      })
    },
  }
}
