import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ApiResponseCodeEnum } from '@/helper/enums'

/**
 * 转换并校验 param  参数是否是 字符串整数
 */
@Injectable()
export class ParseIntParamPipe implements PipeTransform<string, number> {
  constructor(private readonly errMsg: string = 'param 传参有误') {}

  transform(value: string, metadata: ArgumentMetadata): number {
    const parsedValue = Number(value)
    if (isNaN(parsedValue))
      throw new BadRequestException({
        code: ApiResponseCodeEnum.BADREQUEST,
        msg: this.errMsg,
      })

    if (!Number.isInteger(parsedValue))
      throw new BadRequestException({
        code: ApiResponseCodeEnum.BADREQUEST,
        msg: this.errMsg,
      })

    return parsedValue
  }
}
