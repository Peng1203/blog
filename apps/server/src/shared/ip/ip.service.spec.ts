import { Test, TestingModule } from '@nestjs/testing'
import { IpService } from './ip.service'

describe('IpService', () => {
  let service: IpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpService],
    }).compile()

    service = module.get<IpService>(IpService)

    const paseResult1 = service.resolveIp('183.236.7.254')
    console.log('paseResult1 ------', paseResult1)
    const paseResult = service.resolveIp_v2('183.236.7.254')
    console.log('paseResult ------', paseResult)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
