import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import tunnel from 'tunnel'

@Injectable()
export class ProxyHttpService {
  readonly proxyHttp: AxiosInstance

  readonly openAiHttp: AxiosInstance

  readonly httpsAgent: any

  constructor(private readonly configService: ConfigService) {
    const PROXY_HOST = this.configService.get<string>('PROXY_HOST')
    const PROXY_PORT = this.configService.get<string>('PROXY_PORT')
    const PROXY_USER = this.configService.get<string>('PROXY_USER')
    const PROXY_PWD = this.configService.get<string>('PROXY_PASSWORD')
    const HTTP_TIMEOUT = this.configService.get('HTTP_TIMEOUT')
    const HTTP_MAX_REDIRECTS = this.configService.get('HTTP_MAX_REDIRECTS')
    const OPENAI_API_KEY = this.configService.get('OPENAI_API_KEY')

    this.httpsAgent = tunnel.httpsOverHttp({
      proxy: {
        host: PROXY_HOST,
        port: PROXY_PORT,
        proxyAuth: `${PROXY_USER}:${PROXY_PWD}`,
      },
    })

    this.proxyHttp = axios.create({
      httpsAgent: this.httpsAgent,
      timeout: HTTP_TIMEOUT,
      maxRedirects: HTTP_MAX_REDIRECTS,
    })

    this.openAiHttp = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      httpsAgent: this.httpsAgent,
      timeout: HTTP_TIMEOUT,
      maxRedirects: HTTP_MAX_REDIRECTS,
    })
  }

  request() {
    return this.proxyHttp
  }
}
