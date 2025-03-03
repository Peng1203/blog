import { TimestampedEntity } from './'
import { Menu, User, Permission } from './'

import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'role' })
@Unique(['roleName'])
export class Role extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_role_name')
  @Column({ name: 'role_name', type: 'varchar' })
  roleName: string

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string

  @ManyToMany(() => User, user => user.roles)
  users: User[]

  @ManyToMany(() => Permission, Permission => Permission.roles)
  @JoinTable({ name: 'role_permission_relation' })
  permissions: Permission[]

  @ManyToMany(() => Menu, Menu => Menu.roles)
  @JoinTable({ name: 'role_menu_relation' })
  menus: Menu[]
}
