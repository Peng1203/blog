import { TimestampedEntity } from './'
import { StatusEnum } from '../../helper/enums'
import { Role } from './'
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'menu' })
// @Unique(['menuName', 'menuPath', 'menuUri'])
@Unique(['menuName'])
@Unique(['menuPath'])
@Unique(['menuUri'])
export class Menu extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_menu_name')
  @Column({ name: 'menu_name', type: 'varchar', length: 20 })
  menuName: string

  @Index('index_menu_path')
  @Column({ name: 'menu_path', type: 'varchar', length: 60 })
  menuPath: string

  @Index('index_menu_uri')
  @Column({ name: 'menu_uri', type: 'varchar', length: 20, nullable: true })
  menuUri: string

  @Column({ name: 'menu_icon', type: 'varchar', length: 60, nullable: true, default: '' })
  menuIcon: string

  @Column({ name: 'order_num', type: 'int', nullable: true })
  orderNum: number

  @Column({ name: 'parent_id', type: 'int', nullable: true, default: null })
  parentId: number | null

  @Column({
    name: 'is_hidden',
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.FALSE,
  })
  isHidden: StatusEnum

  @Column({
    name: 'is_keepAlive',
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.FALSE,
  })
  isKeepalive: StatusEnum

  @ManyToMany(() => Role, Role => Role.menus)
  roles: Role[]
}
