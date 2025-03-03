import { Keep, Public } from '@/common/decorators'
import { Header, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiProduces } from '@nestjs/swagger'

/**
 * 登录验证码装饰器聚合
 */
export function CaptchaAggregation() {
  return applyDecorators(
    Keep(),
    Public(),
    Header('Content-Type', 'image/svg+xml'),
    ApiOperation({ summary: '获取验证码' }),
    ApiProduces('image/svg+xml') // 指定响应类型为SVG图像);
  )
}
