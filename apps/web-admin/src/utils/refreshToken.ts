import { useAuthApi } from '@/api'
import { Local, Session } from './storage'
import { CodeEnum } from '@/constants'

const { refreshToken } = useAuthApi()

// 定义一个 promise 变量
let promise: null | Promise<any> = null

/**
 * @author Peng
 * @description 刷新 access_token
 * @returns {any}
 */
export async function handleRefreshACToken(): Promise<boolean> {
  if (promise) return promise
  // eslint-disable-next-line no-async-promise-executor
  promise = new Promise(async resolve => {
    try {
      const { data: res } = await refreshToken()
      const { code, success, data } = res
      if (code !== CodeEnum.GET_SUCCESS || !success) return resolve(false)
      Local.setRFToken(data.refresh_token)
      Session.setACToken(data.access_token)
      resolve(true)
    } catch (error) {
      resolve(false)
      console.log(error)
    }
  })
  // 完成一次刷新token时重置这个promise 防止短时间内重复刷新
  promise.finally(() => (promise = null))
  return promise
}
