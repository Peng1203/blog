import { ApiResponseCodeEnum } from '@/helper/enums'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from '@nestjs/class-validator'
import { BadRequestException } from '@nestjs/common'

@ValidatorConstraint({ name: 'custom', async: false })
export class IsArrayNumber implements ValidatorConstraintInterface {
  validate(value: number[], validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    return value.every(item => typeof item === 'number')
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new BadRequestException({
      msg: '数字类型的数组有误',
      code: ApiResponseCodeEnum.BADREQUEST,
    })
  }
}
