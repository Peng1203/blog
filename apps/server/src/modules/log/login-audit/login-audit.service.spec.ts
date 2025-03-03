import { Test, TestingModule } from '@nestjs/testing'
import { LoginAuditService } from './login-audit.service'

describe('LoginAuditService', () => {
  let service: LoginAuditService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginAuditService],
    }).compile()

    service = module.get<LoginAuditService>(LoginAuditService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
