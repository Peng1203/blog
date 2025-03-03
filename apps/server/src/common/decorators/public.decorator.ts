import { SetMetadata } from '@nestjs/common'
/**
 * 用于跳过jwt校验的装饰器
 */
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
