import { Module } from '@nestjs/common'
import { RedisConfigService } from '@/config'
import { RedisModule as LRedisModule } from '@liaoliaots/nestjs-redis'
import { RedisService } from './redis.service'

@Module({
  imports: [LRedisModule.forRootAsync({ useClass: RedisConfigService })],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
