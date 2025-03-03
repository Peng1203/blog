import { defineStore } from 'pinia'
import { Local, Session } from '@/utils/storage'
import { useAuthApi } from '@/api/auth'
import { MenuData } from '@/views/auth/menu'
import { UserData } from '@/views/user/user'
import { CodeEnum } from '@/constants'
import { useNotificationMsg } from '@/hooks'

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */

const { logout, getUserMenu, getUserPermission, getUserInfo } = useAuthApi()

export const useUserInfo = defineStore('userInfo', {
  state: () => ({
    userInfos: <UserData>{},
    menus: <MenuData[]>[],
    permissions: <string[]>[],
  }),
  actions: {
    // 根据 ac token 获取用户信息
    async getUserInfos() {
      try {
        const { data: res } = await getUserInfo<UserData>()
        const { code, success, data } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return
        this.userInfos = data
      } catch (e) {
        console.log('e', e)
      }
    },
    // 更新用户信息
    updataUserInfo() {},
    /** 设置用户信息 */
    async setUserInfos(data: any) {
      // 存储用户信息到浏览器缓存
      this.userInfos = data
    },
    /** 获取用户菜单 */
    async getMenus() {
      try {
        const uId = this.userInfos.id || Local.getUserInfo().id
        const { data: res } = await getUserMenu<MenuData[]>(uId)
        const { code, success, data } = res
        if (code !== CodeEnum.GET_SUCCESS || !success) return
        this.menus = data
      } catch (error) {
        console.log('error ------', error)
      }
    },
    /** 获取用户权限标识 */
    async getPermissions() {
      const uId = this.userInfos.id || Local.getUserInfo().id
      const { data: res } = await getUserPermission<string[]>(uId)
      const { code, success, data } = res
      if (code !== CodeEnum.GET_SUCCESS || !success) return
      this.permissions = data
    },
    /** 用户退出登录 */
    async userLogout() {
      try {
        const params = {
          id: this.userInfos.id,
          userName: this.userInfos.userName,
          // token: this.userInfos.token
        }
        const { data: res } = await logout<string>(params)
        const { code, message, success } = res
        if (code !== CodeEnum.GET_SUCCESS && !success) return
        useNotificationMsg('', message, 'success', 2)
        setTimeout(() => {
          Session.clear()
          window.location.reload()
        }, 500)
      } catch (e) {
        console.log('e ------', e)
      }
    },
  },
  persist: {
    key: 'userInfo',
    storage: window.sessionStorage,
  },
})
