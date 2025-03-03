import { Entity, Column, OneToOne, CreateDateColumn, PrimaryColumn, JoinColumn } from 'typeorm'
import { DateTimeTransformer, TimestampedEntity, User } from './'

@Entity({ name: 'personal' })
export class Personal extends TimestampedEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @Column({ type: 'varchar', default: '', comment: '个性签名' })
  sign: string

  @Column({ type: 'varchar', default: '', comment: '备案ICP地址' })
  icp: string

  @Column({ type: 'int', default: 0, comment: '网站访问数' })
  uv: number // 独立访客，指某个时间段内访问网站的不同用户数量

  @Column({ type: 'int', default: 0, comment: '页面访问数' })
  pv: number // 页面浏览量，指网站的页面被访问的总次数

  @Column({ type: 'text', nullable: true, comment: '公告' })
  notice: string // 公告

  @CreateDateColumn({
    name: 'up_time',
    type: 'datetime',
    transformer: new DateTimeTransformer(),
    comment: '网站上线的时间 可计算运行时长',
  })
  upTime: Date | string // 网站上线的时间

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
