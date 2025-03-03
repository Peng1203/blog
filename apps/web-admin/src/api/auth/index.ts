import request from '@/utils/request'
import { RawResponse, TransformedResponse } from 'Api'
import { LoginParams } from './params'
import { Local } from '@/utils/storage'
import { Method } from '../types'

export function useAuthApi() {
  return {
    /**
     * @method 获取验证码
     */
    getCaptcha<T>(): RawResponse<T> {
      return request({
        url: '/login/v2/captcha',
        method: Method.GET,
      })
    },
    /**
     * @method 登录
     */
    login<T>(data: LoginParams): TransformedResponse<T> {
      return request({
        url: '/login',
        method: Method.POST,
        data: JSON.parse(JSON.stringify(data)),
      })
    },
    /**
     * @method 退出登录
     */
    logout<T = string>(data: object): TransformedResponse<T> {
      return request({
        url: '/logout',
        method: Method.POST,
        data: JSON.parse(JSON.stringify(data)),
      })
    },
    /**
     * @method 刷新token
     */
    refreshToken(): TransformedResponse<{
      access_token: string
      refresh_token: string
    }> {
      return request({
        url: '/auth/refreshAccessToekn',
        method: Method.PATCH,
        data: JSON.stringify({
          refresh_token: Local.getRFToken(),
        }),
      })
    },
    /**
     * @method 获取用户菜单
     */
    getUserMenu<T>(id: number): TransformedResponse<T> {
      return request({
        url: `/auth/menus/${id}`,
        method: Method.GET,
      })
    },
    /**
     * @method 获取用户权限标识
     */
    getUserPermission<T>(id: number): TransformedResponse<T> {
      return request({
        url: `/auth/permissions/${id}`,
        method: Method.GET,
      })
    },
    /** 获取用户信息 */
    getUserInfo<T>(): TransformedResponse<T> {
      return request({
        url: 'auth/userInfo',
        method: Method.GET,
      })
    },
  }
}
