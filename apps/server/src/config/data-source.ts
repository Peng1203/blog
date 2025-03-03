/**
 * typeORM 迁移文件
 *  执行迁移操作 需要安装以下依赖
 *  pnpm install @nestjs/cli typeorm ts-node -g
 */
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { join } from 'path'

const envFile = join(process.cwd(), '.env')
const prodEnvFile = join(process.cwd(), '.env.prod')

dotenv.config({ path: [envFile, prodEnvFile] })

const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env

const AppDataSource = new DataSource({
  type: 'mysql',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT) || 3306,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  /** 加载项目中的 entities */
  entities: ['./src/common/entities/*.entity.{j,t}s'],
  /** 用于执行生成的迁移文件 */
  migrations: [`./src/migration/*.{j,t}s`],
  synchronize: false,
})

export default AppDataSource
