import { Test, TestingModule } from '@nestjs/testing'
import { LoginAuditController } from './login-audit.controller'
import { LoginAuditService } from './login-audit.service'

describe('LoginAuditController', () => {
  let controller: LoginAuditController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginAuditController],
      providers: [LoginAuditService],
    }).compile()

    controller = module.get<LoginAuditController>(LoginAuditController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
