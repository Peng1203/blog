import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '@/common/entities'
import { PermissionModule } from '@/modules/permission/permission.module'
import { MenuModule } from '@/modules/menu/menu.module'
@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule, MenuModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
