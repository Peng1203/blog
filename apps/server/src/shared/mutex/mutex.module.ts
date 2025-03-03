import { Global, Module } from '@nestjs/common'
import { MutexService } from './mutex.service'

@Global()
@Module({
  providers: [MutexService],
  exports: [MutexService],
})
export class MutexModule {}
