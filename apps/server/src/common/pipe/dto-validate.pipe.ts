import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ValidatorOptions, validate } from '@nestjs/class-validator'
import { plainToClass } from '@nestjs/class-transformer'
import { ApiResponseCodeEnum } from '@/helper/enums'

// 转换参数列表
const convertProps: string[] = [
  'page',
  'pageSize',
  'roleId',
  'authorId',
  'userId',
  'categoryId',
  'tagId',
  'type',
  'status',
  'userId',
]

const options: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
}
// ValidationPipe 为内置校验管道
@Injectable()
export class DtoValidatePipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // 转换部分query参数
    const { type, metatype } = metadata

    // 当触发 params 或者 custom 校验直接跳过 或 没有传递Dto校验数据直接返回
    // 当使用自定义的参数装饰器 或者 @Session 的装饰器 都会返回custom类型
    if (type === 'param' || type === 'custom' || !metatype) return value
    else if (type === 'query') {
      // 当为query查询时 转换部分字段的 数据类型
      for (const key in value) {
        if (convertProps.indexOf(key) >= 0) value[key] = Number(value[key])
      }
    }

    const errors = await validate(plainToClass(metatype, value), options)
    if (errors.length > 0) {
      const errorMessage = this.flattenErrors(errors)
      throw new BadRequestException({
        code: ApiResponseCodeEnum.BADREQUEST,
        msg: errorMessage,
      })
    }

    return value
  }

  private flattenErrors(errors: any[]): string {
    return errors
      .map(error => {
        for (const property in error.constraints) {
          if (error.constraints.hasOwnProperty(property)) {
            return error.constraints[property]
          }
        }
      })
      .join(', ')
  }
}
