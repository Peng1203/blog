import { Injectable } from '@nestjs/common'
import { ProxyHttpService } from '@/shared/proxyHttp/proxyHttp.service'
import OpenAI from 'openai'
import { ConfigService } from '@nestjs/config'
import { ChatDto } from './dto'

@Injectable()
export class OpenAiService {
  readonly openai: OpenAI
  private readonly MAX_TOKENS: 1024
  private readonly TEMPERATURE: 0.8

  constructor(private readonly proxyHttpService: ProxyHttpService, private readonly configService: ConfigService) {
    const OPENAI_API_KEY = this.configService.get('OPENAI_API_KEY')

    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      httpAgent: this.proxyHttpService.httpsAgent,
    })
  }

  getStreamResponse({ messages }: ChatDto) {
    try {
      return this.openai.beta.chat.completions.stream({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: messages as any,
        max_tokens: this.MAX_TOKENS,
        temperature: this.TEMPERATURE,
      })
    } catch (e) {
      console.log('e', e)
    }
  }
}
