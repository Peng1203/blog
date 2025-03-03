import { Test, TestingModule } from '@nestjs/testing'
import { PasswordService } from './password.service'
import { ConfigService } from '@nestjs/config'

describe('PasswordService', () => {
  let service: PasswordService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService, ConfigService],
    }).compile()

    service = module.get<PasswordService>(PasswordService)

    const initPwd = await service.reset()
    console.log('initPwd ------', initPwd)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
