import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { DateTimeTransformer } from './common/timestamped.entity'
import { StatusEnum, RequestMethodEnum } from '../../helper/enums'

@Entity({ name: 'audit' })
export class Audit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: RequestMethodEnum })
  method: RequestMethodEnum

  @Column({ type: 'varchar' })
  router: string

  @Column({ type: 'varchar', length: 15 })
  ip: string

  @Column({ name: 'user_agent', type: 'text' })
  userAgent: string

  @Column({ name: 'status_code', type: 'int' })
  statusCode: number

  @Column({
    name: 'response_time',
    type: 'bigint',
    comment: '处理请求耗费时间',
  })
  responseTime: number

  @Column({ name: 'request_query_params', type: 'text', nullable: true })
  requestQueryParams: string

  @Column({ name: 'request_body_params', type: 'text', nullable: true })
  requestBodyParams: string

  @Column({ name: 'operation_status', type: 'enum', enum: StatusEnum })
  operationStatus: StatusEnum

  @Column({ name: 'err_message', type: 'varchar', nullable: true })
  errMessage: string

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string

  /**
   * 'CASCADE'：当关联的用户被删除时，相关联的审计记录也会被删除。
   * 'SET NULL'：当关联的用户被删除时，相关联的审计记录的user字段将被设置为NULL。
   */
  @ManyToOne(() => User, User => User.audits, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: User

  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    transformer: new DateTimeTransformer(),
  })
  createTime: Date | string
}
