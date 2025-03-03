import { Module } from '@nestjs/common'
import { OpenAiService } from './open-ai.service'
import { OpenAiController } from './open-ai.controller'
import { SharedModule } from '@/shared/shared.module'

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  imports: [SharedModule],
})
export class OpenAiModule {}
