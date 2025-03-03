import { Body, Controller, Post, Res } from '@nestjs/common'
import { OpenAiService } from './open-ai.service'
import { ChatDto } from './dto'
import { ProxyHttpService } from '@/shared/proxyHttp/proxyHttp.service'
import { Response } from 'express'

@Controller('openai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService, private readonly proxyHttpService: ProxyHttpService) {}

  @Post('chat')
  async chartGpt(@Body() data: ChatDto, @Res() res: Response) {
    const textDecoder = new TextDecoder()
    const stream = await this.openAiService.getStreamResponse(data)
    for await (const chunk of (stream as any).toReadableStream()) {
      const data = textDecoder.decode(chunk)
      res.write(data)
    }
    res.end()
  }

  @Post('v2/chat')
  async chartGpt_v2(@Body() { messages }: ChatDto, @Res() res: Response) {
    const { data: response } = await this.proxyHttpService.openAiHttp({
      method: 'POST',
      url: '/chat/completions',
      data: {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1024,
        temperature: 0.6,
        stream: true,
      },
      responseType: 'stream',
    })

    response.pipe(res)
  }
}
