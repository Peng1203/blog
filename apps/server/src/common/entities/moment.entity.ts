import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User, TimestampedEntity } from '.'
import { BolEnum, MomentStatusEnum } from '../../helper/enums'

@Entity({ name: 'moment' })
export class Moment extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'json', nullable: true })
  mediaUrls: string[]

  @Column({
    name: 'is_top',
    type: 'enum',
    enum: BolEnum,
    default: BolEnum.FALSE,
  })
  isTop: BolEnum

  @Column({ type: 'int', default: 0 })
  likes: number

  @Column({
    type: 'enum',
    enum: MomentStatusEnum,
    default: MomentStatusEnum.PUBLIC,
    comment: '1公开 2私密',
  })
  status: MomentStatusEnum

  @ManyToOne(() => User, User => User.moments)
  user: User
}
