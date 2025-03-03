import Redis from 'ioredis'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ApiResponseCodeEnum } from '@/helper/enums'

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  /**
   * 获取Redis实例
   * @date 2023/8/31 - 17:53:10
   * @author Peng
   *
   * @returns {*}
   */
  getRedisRef() {
    return this.redisClient
  }

  /**
   * 设置缓存
   * @date 2023/8/31 - 17:59:33
   * @author Peng
   *
   * @async
   * @param {string} key
   * @param {*} value
   * @param {?number} [seconds]
   * @returns {Promise<boolean>}
   */
  async setCache(key: string, value: any, seconds?: number): Promise<boolean> {
    try {
      if (typeof value === 'object') value = JSON.stringify(value)
      const setResult =
        seconds === undefined
          ? await this.redisClient.set(key, value)
          : await this.redisClient.setex(key, seconds, value)
      if (setResult !== 'OK') return false
      return setResult === 'OK'
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
      })
    }
  }

  /**
   * 获取缓存
   * @date 2023/8/31 - 18:43:34
   * @author Peng
   *
   * @async
   * @param {string} key
   * @returns {unknown}
   */
  async getCache(key: string) {
    try {
      return await this.redisClient.get(key)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
      })
    }
  }

  /**
   * 获取指定Key的TTL
   * @date 2023/9/4 - 14:00:49
   * @author Peng
   *
   * @async
   * @param {string} key
   * @returns {unknown}
   */
  async getTTL(key: string) {
    try {
      return await this.redisClient.ttl(key)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
      })
    }
  }

  async clearCatch(key: string) {
    try {
      return await this.redisClient.del(key)
    } catch (e) {
      throw new InternalServerErrorException({
        e,
        code: ApiResponseCodeEnum.INTERNALSERVERERROR_REDIS,
      })
    }
  }
}
