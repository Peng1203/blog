import { HmacSHA256 } from 'crypto-js'

/**
 * 密码加密
 * @param pwd 初始密码
 */
export function passwordEncryption(pwd: string): string {
  return HmacSHA256(pwd, import.meta.env.VITE_SECRET_KEY).toString()
}
