import { Injectable, Logger } from '@nestjs/common'
import { Mutex } from 'async-mutex'

@Injectable()
export class MutexService {
  private mutex = new Mutex()

  async runLocked<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.mutex.acquire()
    try {
      return await callback()
    } catch (e) {
      Logger.error('互斥锁 err', e)
    } finally {
      release()
    }
  }
}
