import { Injectable } from '@nestjs/common'
import { AuthOptionsFactory, IAuthModuleOptions } from '@nestjs/passport'
import { PassPortStrategyEnum } from '@/helper/enums'

@Injectable()
export class PassportConfigService implements AuthOptionsFactory {
  constructor() {}

  createAuthOptions(): IAuthModuleOptions {
    return {
      defaultStrategy: PassPortStrategyEnum.JWT,
    }
  }
}
