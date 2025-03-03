import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TimestampedEntity } from './'
import { BolEnum, CommentType } from '../../helper/enums'

@Entity({ name: 'comment' })
export class Comment extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ name: 'user_id', type: 'int', nullable: true, default: null })
  userId: number

  @Column({ type: 'varchar', nullable: true })
  email: string

  @Column({ type: 'varchar', nullable: true })
  avatar: string

  @Column({ type: 'enum', enum: CommentType })
  type: CommentType

  @Column({ name: 'target_id', type: 'int', comment: '关联的文章ID或动态ID' })
  targetId: number

  @Column({ type: 'varchar', length: 15 })
  ip: string

  @Column({ type: 'json' })
  location: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string | null

  @Column({ type: 'json' })
  device: string

  @Column({
    name: 'parent_id',
    type: 'int',
    nullable: true,
    default: null,
    comment: '父评论的 ID 用于表示评论的层级结构',
  })
  parentId: number | null

  @Column({
    name: 'replay_id',
    type: 'int',
    nullable: true,
    default: null,
    comment: '直接回复的评论 ID 用于引用特定评论',
  })
  replyId: number | null

  @Column({ name: 'blog_url', type: 'varchar', nullable: true })
  blogUrl: string | null

  @Column({ type: 'int', default: 0 })
  likes: number

  @Column({ type: 'int', default: 0 })
  dislikes: number

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean

  @Column({
    name: 'is_top',
    type: 'enum',
    enum: BolEnum,
    default: BolEnum.FALSE,
  })
  isTop: BolEnum
}
