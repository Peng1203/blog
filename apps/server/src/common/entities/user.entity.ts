import { Article, Audit, Tag,Category, TimestampedEntity } from './'
import { UserEnabledEnum } from '../../helper/enums'
import { Role, Moment } from './'
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'user' })
@Unique(['userName'])
@Unique(['email'])
export class User extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_user_name')
  @Column({ name: 'user_name', type: 'varchar', length: 15 })
  userName: string

  @Column({ type: 'varchar', length: 255, select: false })
  password?: string

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({ name: 'user_role_relation' })
  roles: Role[]

  @Index('index_email')
  @Column({ type: 'varchar', nullable: true })
  email: string

  @Column({ name: 'nick_name', type: 'varchar', nullable: true })
  nickName: string

  @Column({ name: 'phone_number', type: 'char', nullable: true })
  phoneNumber: string

  @Column({
    name: 'user_enabled',
    type: 'enum',
    enum: UserEnabledEnum,
    default: UserEnabledEnum.Enabled,
    comment: '0 禁用 1 启用',
  })
  userEnabled: UserEnabledEnum

  @Column({ name: 'user_avatar', type: 'varchar', nullable: true })
  userAvatar: string

  @OneToMany(() => Article, Article => Article.author)
  articles: Article[]

  @OneToMany(() => Audit, Audit => Audit.user)
  audits: Audit[]

  @OneToMany(() => Moment, Moment => Moment.user)
  moments: Moment[]

  @OneToMany(() => Tag, Tag => Tag.user)
  tags: Tag[]

  @OneToMany(() => Category, Category => Category.user)
  categorys: Category[]
}
