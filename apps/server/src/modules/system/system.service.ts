import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SystemService {
  // @OnEvent(EventsEnum.UPDATE_SYSTEM_MSG)
  /**
    this.eventEmitter.emit(EventsEnum.UPDATE_SYSTEM_MSG, {})
   */
  constructor(private readonly eventEmitter: EventEmitter2, private readonly configService: ConfigService) {}
}
