import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from '@nestjs/class-validator'
import { DATE_TIME_REGEX } from '@/helper/regex'

@ValidatorConstraint({ name: 'isDateTimeString', async: false })
export class IsDateTimeString implements ValidatorConstraintInterface {
  validate(value: string, args?: ValidationArguments): boolean | Promise<boolean> {
    if (value === '') return true
    return DATE_TIME_REGEX.test(value)
  }
  defaultMessage?(args?: ValidationArguments): string {
    return '日期格式有误'
  }
}
