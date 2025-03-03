import { PermissionEnum } from '@/helper/enums'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DataInitializerService {
  async initialize() {
    // 在这里执行数据库初始化逻辑
    // 例如，运行数据库迁移、插入初始数据等
    console.log('初始化数据执行 ------', PermissionEnum)
    for (const iterator in PermissionEnum) {
      console.log('iterator ------', iterator, PermissionEnum[iterator])
      console.log(' ------')
    }
  }
}
