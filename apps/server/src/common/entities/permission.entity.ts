import { TimestampedEntity } from './'
// import { ActionTypeEnum } from '@/helper/enums';
import { Role } from './'
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { PermissionEnum, RequestMethodEnum } from '../../helper/enums'

@Entity({ name: 'permission' })
@Unique(['permissionName'])
@Unique(['permissionCode'])
export class Permission extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('index_permission_name')
  @Column({ name: 'permission_name', type: 'varchar', length: 15 })
  permissionName: string

  @Index('index_permission_code')
  @Column({
    name: 'permission_code',
    type: 'enum',
    enum: PermissionEnum,
    nullable: true,
  })
  permissionCode: PermissionEnum | null

  // @Column({ type: 'enum', enum: ActionTypeEnum })
  //  action_type: ActionTypeEnum;

  @Column({
    name: 'resource_method',
    type: 'enum',
    enum: RequestMethodEnum,
    // default: RequestMethodEnum.GET,
    nullable: true,
  })
  resourceMethod: RequestMethodEnum | null

  @Column({ name: 'resource_url', type: 'varchar', nullable: true })
  resourceUrl: string | null

  @Column({ name: 'parent_id', type: 'int', default: 0 })
  parentId: number

  @Column({ type: 'varchar', length: 60, nullable: true })
  description: string

  @ManyToMany(() => Role, Role => Role.permissions)
  roles: Role[]
}
