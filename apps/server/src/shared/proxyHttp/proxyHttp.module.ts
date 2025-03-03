import { Module } from '@nestjs/common'
import { ProxyHttpService } from './proxyHttp.service'

@Module({
  providers: [ProxyHttpService],
  exports: [ProxyHttpService],
})
export class ProxyHttpModule {}
