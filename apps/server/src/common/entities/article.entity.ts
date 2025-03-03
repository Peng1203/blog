import { Category, Tag, TimestampedEntity, User } from './'
import { ArticleTypeEnum, ArticleStatusEnum, BolEnum, ContentModelEnum } from '../../helper/enums'
import { Column, Entity, Index, ManyToOne, ManyToMany, PrimaryGeneratedColumn, Unique, JoinTable } from 'typeorm'

@Entity({ name: 'article' })
@Unique(['title'])
export class Article extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_title')
  @Column({ type: 'varchar', length: 60 })
  title: string

  @Column({
    type: 'text',
    nullable: true,
    comment: '文章摘要',
  })
  summary: string

  @Column({ type: 'longtext' })
  content: string

  @Column({
    type: 'enum',
    enum: ContentModelEnum,
    default: ContentModelEnum.MARKDOWN,
    comment: '文章内容模式',
  })
  contentModel: ContentModelEnum

  @Column({ type: 'varchar', nullable: true, length: 60, comment: '文章封面' })
  cover: string

  @Column({ type: 'int', default: 0 })
  likes: number

  @Column({ type: 'int', default: 0 })
  views: number

  @Column({
    type: 'enum',
    enum: ArticleTypeEnum,
    default: ArticleTypeEnum.ORIGINAL,
    comment: '文章类型: 1原创 2转载 3翻译',
  })
  type: ArticleTypeEnum

  @Column({
    type: 'enum',
    enum: ArticleStatusEnum,
    default: ArticleStatusEnum.DRAFT,
    comment: '文章状态: 1已发布 2私密 3草稿箱 4已删除 5待审核 6已拒绝',
  })
  status: ArticleStatusEnum

  @Column({
    name: 'is_top',
    type: 'enum',
    enum: BolEnum,
    default: BolEnum.FALSE,
  })
  isTop: BolEnum

  @Column({
    name: 'access_password',
    type: 'varchar',
    length: 255,
    default: '',
    nullable: true,
    select: false,
    comment: '文章状态为 私密时 他人访问需要使用该密码',
  })
  accessPassword: string

  @ManyToOne(() => User, User => User.articles)
  author: User

  @ManyToOne(() => Category, Category => Category.articles, { nullable: true })
  category: Category | null

  @ManyToMany(() => Tag, Tag => Tag.articles)
  @JoinTable({ name: 'article_tag_relation' })
  tags: Tag[]
}
