import { Article, User, TimestampedEntity } from './'
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'category' })
export class Category extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'category_name', type: 'varchar' })
  categoryName: string

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true, default: '' })
  description: string

  @OneToMany(() => Article, Article => Article.category)
  articles: Article[]

  @ManyToOne(() => User, User => User.categorys, { nullable: true })
  user: User
}
