import { Injectable, OnModuleInit } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import Mint from 'mint-filter'

@Injectable()
export class SensitiveWordsService implements OnModuleInit {
  private mint: Mint

  constructor() {
    this.mint = new Mint([])
  }

  onModuleInit() {
    const filePath = path.resolve(process.cwd(), 'resources', 'sensitive_words_lines.txt')
    const words = fs
      .readFileSync(filePath)
      .toString()
      .split('\n')
      .map(str => str.replaceAll('\r', ''))
    this.mint = new Mint(words || [])
  }

  getMint() {
    return this.mint
  }

  /** 替换敏感字符 */
  replace(str: string) {
    const { text } = this.mint.filter(str, { replace: true })
    str = text
  }
}
