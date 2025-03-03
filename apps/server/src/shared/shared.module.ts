import { HttpConfigService } from '@/config'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { RedisModule } from './redis/redis.module'
import { CosService } from './COS/cos.service'
import { ProxyHttpModule } from './proxyHttp/proxyHttp.module'
import { IpService } from './ip/ip.service'
import { IpModule } from './ip/ip.module'

@Module({
  imports: [HttpModule.registerAsync({ useClass: HttpConfigService }), ProxyHttpModule, RedisModule, IpModule],
  providers: [CosService, IpService],
  exports: [HttpModule, RedisModule, CosService, ProxyHttpModule, IpModule],
})
export class SharedModule {}
