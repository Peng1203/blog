import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { DateTimeTransformer } from './common/timestamped.entity'
import { LoginMethodEnum } from '../../helper/enums'

@Entity({ name: 'login_audit' })
export class LoginAudit {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_user_name')
  @Column({ name: 'user_name', type: 'varchar', length: 15, default: null })
  userName: string

  @Column({ name: 'user_id', type: 'int', nullable: true, default: null })
  userId: number

  @Column({ type: 'varchar', length: 15 })
  ip: string

  @Column({ type: 'varchar' })
  device: string

  @Column({ type: 'varchar', nullable: true, default: null })
  location: string

  @Column({ name: 'login_status', type: 'int', default: null })
  loginStatus: number

  @Column({
    name: 'failure_reason',
    type: 'varchar',
    comment: '失败原因',
    nullable: true,
    default: null,
  })
  failureReason: string

  @Column({ name: 'user_agent', type: 'text' })
  userAgent: string

  @Column({
    name: 'login_duration',
    type: 'bigint',
    comment: '登录耗时',
  })
  loginDuration: number

  @Column({
    name: 'login_method',
    type: 'enum',
    comment: '登录方式',
    enum: LoginMethodEnum,
  })
  loginMethod: LoginMethodEnum

  @Column({ name: 'browser', type: 'varchar' })
  browser: string

  @Column({ name: 'os', type: 'varchar' })
  os: string

  @CreateDateColumn({
    name: 'login_time',
    type: 'datetime',
    transformer: new DateTimeTransformer(),
  })
  loginTime: Date | string

  @Column({
    name: 'logout_time',
    type: 'datetime',
    transformer: new DateTimeTransformer(),
    nullable: true,
    default: null,
  })
  logoutTime: Date | string
}
