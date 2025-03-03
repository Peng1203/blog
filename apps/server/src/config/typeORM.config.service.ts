import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const NODE_ENV = this.configService.get<string>('NODE_ENV')
    const DATABASE_HOST = this.configService.get<string>('DATABASE_HOST')
    const DATABASE_PORT = this.configService.get<string>('DATABASE_PORT')
    const DATABASE_NAME = this.configService.get<string>('DATABASE_NAME')
    const DATABASE_USER = this.configService.get<string>('DATABASE_USER')
    const DATABASE_PASSWORD = this.configService.get<string>('DATABASE_PASSWORD')

    const synchronize = NODE_ENV === 'development'

    return {
      logger: 'simple-console',
      // logging: NODE_ENV === 'development',
      type: 'mysql',
      host: DATABASE_HOST,
      port: Number(DATABASE_PORT),
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      // 设置时区
      timezone: '+08:00',
      retryAttempts: 10, // 最大重连次数
      retryDelay: 5000, // 重连间隔 ms
      // entities: [User],
      // entities: ['./dist/**/*.entity{.ts,.js}'],
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], // 指定实体文件
      autoLoadEntities: true, // 自动加载实体文件
      synchronize, // 自动同步 生产环境不建议使用
    }
  }
}
