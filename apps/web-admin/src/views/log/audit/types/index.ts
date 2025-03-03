import { ListApiBaseResponse } from 'Api'
export interface AuditLogData {
  id: number
  method: RequestMethodEnum
  router: string
  ip: string
  userAgent: string
  statusCode: number
  responseTime: string
  requestQueryParams: string
  requestBodyParams: string
  operationStatus: 0 | 1
  errMessage?: any
  description: string
  createTime: string
  userId: number | null
  userName: string | null

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

export type AuditLogListData = ListApiBaseResponse<AuditLogData>
