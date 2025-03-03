import { UserData } from '@/views/user/user'
import Cookies from 'js-cookie'

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
  // 查看 v2.4.3版本更新日志
  setKey(key: string) {
    // @ts-ignore
    return `${key}`
  },
  /**
   * 设置永久缓存
   */
  set<T>(key: string, val: T) {
    window.localStorage.setItem(Local.setKey(key), JSON.stringify(val))
  },
  /**
   * 获取永久缓存
   */
  get(key: string) {
    let json = <string>window.localStorage.getItem(Local.setKey(key))
    return JSON.parse(json)
  },
  /**
   * 移除永久缓存
   */
  remove(key: string) {
    window.localStorage.removeItem(Local.setKey(key))
  },
  /**
   * 移除全部永久缓存
   */
  clear() {
    window.localStorage.clear()
  },
  /**
   * 获取 refresh_token
   */
  getRFToken(): string {
    return Local.get('refresh_token')
  },
  /**
   * 设置 refresh_token
   */
  setRFToken(rf_token: string): void {
    Local.set('refresh_token', rf_token)
  },
  /** 清除刷新token */
  clearRFToken() {
    Local.remove('refresh_token')
  },
  /**
   * 获取 用户信息
   */
  getUserInfo(): UserData {
    return Local.get('userInfo')
  },
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
  /**
   * 设置临时缓存
   */
  set<T>(key: string, val: T) {
    window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val))
  },
  /**
   * 获取临时缓存
   */
  get(key: string) {
    let json = <string>window.sessionStorage.getItem(Local.setKey(key))
    if (!json || json == 'undefined') return false
    return JSON.parse(json)
  },
  /**
   * 移除临时缓存
   */
  remove(key: string) {
    window.sessionStorage.removeItem(Local.setKey(key))
  },
  /**
   * 移除全部临时缓存
   */
  clear() {
    window.sessionStorage.clear()
  },
  /**
   * 获取 access_token
   */
  getACToken(): string {
    return Session.get('access_token')
  },
  /**
   * 设置 access_token
   */
  setACToken(ac_token: string): void {
    Session.set('access_token', ac_token)
  },
  clearACToken(): void {
    Session.remove('access_token')
  },
}

export const Cookie = {
  // 设置带过期时间的cookie
  setExpires<T>(key: string, val: T, expiresDay: number) {
    Cookies.set(key, val, { expires: expiresDay })
  },
}
