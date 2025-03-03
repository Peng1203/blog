import { SetMetadata } from '@nestjs/common'

/**
 * 保持原有响应结构 跳过全局响应拦截器
 */
export const IS_KEEP_KEY = 'isKeep'
export const Keep = () => SetMetadata(IS_KEEP_KEY, true)
