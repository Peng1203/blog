import { ListApiBaseResponse } from 'Api'
export interface LoginAuditLogData {
  id: number
  userName: string
  userId?: any
  device: string
  location: string
  loginStatus: number
  failureReason: string
  userAgent: string
  loginDuration: string
  loginMethod: string
  browser: string
  os: string
  loginTime: string
  logoutTime: string
  ip: string

  // 自定义扩展属性
  ipInfo?: string
}

export enum RequestMethodEnum {
  GET = 1,
  POST = 2,
  PUT = 3,
  DELETE = 4,
  PATCH = 5,
}

export type LoginAuditLogListData = ListApiBaseResponse<LoginAuditLogData>
