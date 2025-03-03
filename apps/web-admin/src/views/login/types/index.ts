import { UserData } from '@/views/user/user'

export interface ClientInfo {
  os: string
  platform: string
  browser: string
  version: string
  deviceTypes: string[]
  authoritative: boolean
  userAgent: string
}
export interface LoginData {
  user: UserData
  ip: string
  location: string
  loginTime: string
  clientInfo: ClientInfo
  tokens: {
    access_token: string
    refresh_token: string
  }
}
