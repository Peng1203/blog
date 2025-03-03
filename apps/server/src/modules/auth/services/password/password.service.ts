import crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}
  private readonly KEY_LENGTH = 64
  private readonly INITIAL_PASSWORD = '20240820WK'
  private readonly HASH_ALGORITHM = 'sha256'
  // 前端加密盐
  private readonly VITE_SECRET_KEY = this.configService.get<string>('VITE_SECRET_KEY') || '114514qwer'

  /** 生成密码hash */
  hash(password: string): Promise<string> {
    return new Promise(resolve => {
      // 生成随机盐
      const salt = crypto.randomBytes(16).toString('hex')
      const hash = crypto.createHmac(this.HASH_ALGORITHM, salt)

      hash.update(password)
      const value = hash.digest('hex')

      resolve(`${salt}:${value}`)
    })
  }

  /** 验证密码 */
  verify(password: string, hash: string): Promise<boolean> {
    return new Promise(resolve => {
      const [salt, storedHash] = hash.split(':')
      const hashToVerify = crypto.createHmac(this.HASH_ALGORITHM, salt)

      hashToVerify.update(password)

      const value = hashToVerify.digest('hex')
      resolve(storedHash === value)
    })
  }

  /** 重置密码 */
  reset(): Promise<string> {
    return new Promise(async resolve => {
      const salt = crypto.randomBytes(16).toString('hex')
      const hash = crypto.createHmac(this.HASH_ALGORITHM, salt)
      const initPwdHash = await this.initPwdToHash()
      hash.update(initPwdHash)
      const value = hash.digest('hex')
      resolve(`${salt}:${value}`)
    })
  }

  private initPwdToHash(): Promise<string> {
    return new Promise(resolve => {
      const hash = crypto.createHmac(this.HASH_ALGORITHM, this.VITE_SECRET_KEY)
      hash.update(this.INITIAL_PASSWORD)
      resolve(hash.digest('hex'))
    })
  }

  /** 生成密码hash */
  hash_v0(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // 生成随机盐
      const salt = crypto.randomBytes(16).toString('hex')
      crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err)
        const hashKey = derivedKey.toString('hex')
        resolve(`${salt}:${hashKey}`)
      })
    })
  }

  /**
   * 验证密码
   *  存在问题 过段时间同样的 hash 和 salt 验证会失败
   */
  verify_v0(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, hashKey] = hash.split(':')
      const hashKeyBuff = Buffer.from(hashKey, 'hex')
      crypto.scrypt(password, salt, this.KEY_LENGTH, (err, derivedKey) => {
        if (err) reject(err)
        const verifyStatus = crypto.timingSafeEqual(hashKeyBuff, derivedKey)
        resolve(verifyStatus)
      })
    })
  }
}
