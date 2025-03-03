import { ExecutionContext, Injectable } from '@nestjs/common'
import { PassPortStrategyEnum } from '@/helper/enums'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class LocalAuthGuard extends AuthGuard(PassPortStrategyEnum.LOCAL) {
  constructor() {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return this.activate(context)
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>
  }
}
