import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '@/common/entities'
import { UserModule } from '@/modules/user/user.module'
import { TagModule } from '@/modules/tag/tag.module'
import { CategoryModule } from '@/modules/category/category.module'

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UserModule, TagModule, CategoryModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
