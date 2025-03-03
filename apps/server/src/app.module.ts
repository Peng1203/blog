import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from './config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/guards'
import { JwtStrategy } from './modules/auth/strategys'
import { TransformInterceptor, AuditInterceptor } from './common/interceptor'
import { RoleGuard, PermissionGuard } from './common/guards'
import { LoggerMiddleware, ResponseHeadersMiddleware } from './common/middleware'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { RoleModule } from './modules/role/role.module'
import { PermissionModule } from './modules/permission/permission.module'
import { MenuModule } from './modules/menu/menu.module'
import { ResourceModule } from './modules/resource/resource.module'
import { ArticleModule } from './modules/article/article.module'
import { CategoryModule } from './modules/category/category.module'
import { TagModule } from './modules/tag/tag.module'
import { SystemModule } from './modules/system/system.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MutexModule } from './shared/mutex/mutex.module'
import { OpenAiModule } from './modules/open-ai/open-ai.module'
import { AuditModule } from './modules/log/audit/audit.module'
import { LoginAuditModule } from './modules/log/login-audit/login-audit.module'
import { CommonModule } from './modules/common/common.module'
import { DataAccessFilter, HttpExceptionFilter, UploadTooLargeFilter } from './common/exceptions'
import { MomentModule } from './modules/moment/moment.module'
import { PersonalModule } from './modules/personal/personal.module'
import { CommentModule } from './modules/comment/comment.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'],
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    EventEmitterModule.forRoot(),
    SharedModule,
    MutexModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    ResourceModule,
    ArticleModule,
    CategoryModule,
    TagModule,
    SystemModule,
    OpenAiModule,
    AuditModule,
    LoginAuditModule,
    CommonModule,
    MomentModule,
    PersonalModule,
    CommentModule,
  ],
  providers: [
    JwtStrategy,
    // 全局JWT守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局角色守卫
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    // 全局权限守卫
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    // 全局响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 审计拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    // 全局HTTP异常过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 数据库操作异常过滤器
    {
      provide: APP_FILTER,
      useClass: DataAccessFilter,
    },
    // 上传文件异常过滤器
    {
      provide: APP_FILTER,
      useClass: UploadTooLargeFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseHeadersMiddleware, LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
