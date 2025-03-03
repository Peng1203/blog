import { Article, TimestampedEntity, User } from './'
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tag' })
export class Tag extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tag_name', type: 'varchar' })
  tagName: string

  @Column({ type: 'varchar', nullable: true })
  icon: string

  @ManyToMany(() => Article, Article => Article.tags)
  articles: Article[]

  @ManyToOne(() => User, User => User.tags, { nullable: true })
  user: User
}
