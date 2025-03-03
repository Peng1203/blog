import { Controller, Get } from '@nestjs/common'
import { SystemService } from './system.service'
import { Public } from '@/common/decorators'
import { MutexService } from '@/shared/mutex/mutex.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('System')
@ApiBearerAuth()
@Controller('system')
export class SystemController {
  // 更新计数器
  constructor(private readonly systemService: SystemService, private readonly mutexService: MutexService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '测试锁服务' })
  async testMutexLock(): Promise<string> {
    console.count('请求来了 ------')
    // 使用互斥锁保护的代码块
    const result = await this.mutexService.runLocked<string>(async () => {
      // 在这里执行需要互斥保护的操作
      console.log('开始执行锁中任务...')

      // 模拟耗时的操作
      await new Promise(resolve => setTimeout(resolve, 10000))

      console.log('锁中任务执行完成!')

      return 'Hello world!'
    })

    return result
  }
}
