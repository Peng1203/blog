/*
 Navicat Premium Data Transfer

 Source Server         : 华为云
 Source Server Type    : MySQL
 Source Server Version : 80024 (8.0.24)
 Source Host           : 116.204.120.144:3306
 Source Schema         : peng_blog_db

 Target Server Type    : MySQL
 Target Server Version : 80024 (8.0.24)
 File Encoding         : 65001

 Date: 12/12/2023 21:58:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文章标题',
  `brief` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '文章简介',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文章内容',
  `author_id` int NOT NULL COMMENT '文章作者id',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文章封面',
  `c_id` int NOT NULL COMMENT '文章分类',
  `tags` json NULL COMMENT '文章标签',
  `comment_count` int NULL DEFAULT 0 COMMENT '评论数',
  `like_count` int NULL DEFAULT 0 COMMENT '点赞数',
  `dislike_count` int NULL DEFAULT 0 COMMENT '点踩数',
  `view_count` int NULL DEFAULT 0 COMMENT '阅读量',
  `state` int NULL DEFAULT 0 COMMENT '状态(保留字段)',
  `created_time` datetime NOT NULL COMMENT '文章创建时间',
  `update_time` datetime NOT NULL COMMENT '文章更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `文章标题`(`title` ASC) USING BTREE,
  INDEX `文章归属分类`(`c_id` ASC) USING BTREE,
  INDEX `文章作者ID`(`author_id` ASC) USING BTREE,
  CONSTRAINT `文章作者ID` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `文章归属分类` FOREIGN KEY (`c_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES (1, 'test', '测试测试', '测试测试测试测试测试测试\n\n```vue\n// 预览组件\nconst PreviewArticleDialog = defineAsyncComponent(() => import(\'./components/PreviewArticle.vue\'))\n\nconst previewDialogRef = ref<any>(null)\n// 处理预览操作\nconst handlePreViewArticle = async (aid: number) => {\n  await previewDialogRef.value.getArticleDetailById(aid)\n  setTimeout(() => {\n    previewDialogRef.value.previewDialogStatus = true\n  }, 500)\n}\n```\n', 1, 'http://116.204.120.144:3000/resource/cover/download.webp', 4, '[3]', 0, 0, 0, 0, 0, '2023-06-05 10:25:40', '2023-06-05 10:25:40');
INSERT INTO `article` VALUES (2, '关于梯子影响到后端服务的神奇现象', '开着梯子登录进项目之后,然后神奇的事情出现了....', '开着梯子登录进项目之后,再关掉梯子,切换界面请求其他接口,直接401给我退出登录了\n可是我的token认证签名,设置的有效期明明是好几个小时啊🤔🤔🤔', 2, '', 7, '[6]', 0, 0, 0, 0, 0, '2023-06-10 14:42:20', '2023-06-10 14:42:20');
INSERT INTO `article` VALUES (3, 'esno对比ts-node', '对比esno 和 ts-node 在nodejs环境下哪个执行ts文件的效率更高', '# 前言\n### esno是什么?\n> esno 是基于 esbuild 的 TS/ESNext node 运行时\n\n### ts-node是什么?\n> ts-node 是一个执行环境,把 ts 编译为 js ,然后在node上运行\n\n# 测试方式\n开2个命令行窗口 依次执行2个不同的启动命令 让后通过 `nodemon` 热更新 修改文件对比 哪个先抢到端口启动服务成功 哪个执行效率就更高\n\n# 启动命令\n```package.json\n\"dev\": \"cross-env NODE_ENV=development nodemon ./src/index.ts\",\n\"dev:esno\": \"cross-env NODE_ENV=development nodemon --exec esno ./src/index.ts\",\n```\n# 对比\n<video style=\"width:1000px\" autoplay loop>\n  <source src=\"http://116.204.120.144:3000/staticResource/video/esno%E5%AF%B9%E6%AF%94ts-node.mp4\">\n</video>\n\n# 小插曲\n另外提一嘴, 在markdown编辑器中使用视频是这样的 (直接上源代码可还行)🤣🤣🤣\n![](http://116.204.120.144:3000/resource/content/Snipaste_2023-06-10_15-11-47.png)\n原本想着使用gif来录制 让后可以直接在markdown中上传图片,但是录制完成之后对比 同样效果的录制mp4录制30帧 gif录制15帧 mp4**不到1MB** gif **高达50MB多** \n我很好奇! 大概查了一下是编码的问题 这个就留着日后再去了解吧! \n\n# 结果\nesno比ts-node快\n\n', 2, '', 2, '[6]', 0, 0, 0, 0, 0, '2023-06-10 15:25:49', '2023-06-10 15:25:49');
INSERT INTO `article` VALUES (4, 'Vue3 + TS中 给路由规则的meta属性添加类型', '', '[官方地址](https://router.vuejs.org/zh/api/interfaces/RouteMeta.html#%E6%8E%A5%E5%8F%A3-routemeta)\n```typescript\n// 扩展 RouteMeta 接口\ndeclare module \'vue-router\' {\n  interface RouteMeta {\n    title?: string\n    isLink?: string\n    isHide?: boolean\n    isKeepAlive?: boolean\n    isAffix?: boolean\n    isIframe?: boolean\n    icon?: string\n    parentMenuName?: string\n    menuType?: \'1\' | \'2\' | \'3\' | \'4\'\n  }\n}\n```\n使用时不需要引入 给路由规则加上 `RouteRecordRaw` 注解\n如下 \n```typescript\nimport { RouteRecordRaw } from \'vue-router\'\nconst router: RouteRecordRaw[] = []\n```\n\n', 2, '', 2, '[]', 0, 0, 0, 0, 0, '2023-06-15 15:11:53', '2023-06-15 15:11:53');
INSERT INTO `article` VALUES (5, '如何防止资源接口被偷流量?', '', '关于 `Express` 静态资源接口 做请求限制', 2, '', 2, '[6]', 0, 0, 0, 0, 0, '2023-06-16 09:36:56', '2023-06-16 09:36:56');
INSERT INTO `article` VALUES (6, '如何给NS搭建一个代理服务器?', '如何才能让NS访问 走电脑VPN代理', '未实现', 2, '', 8, '[9]', 0, 0, 0, 0, 0, '2023-06-16 09:53:09', '2023-06-16 09:53:09');
INSERT INTO `article` VALUES (7, 'Nest.js学习', '', '# Nest.js中的几个核心概念\n- Controllers 控制器\n- Providers 提供者\n- Modules 模块\n- Middleware 中间件\n- Exception filters 异常过滤器\n- Pipes 管道\n- Guards 守卫\n- Interceptors 拦截器\n- Custom route decorators 自定义装饰器\n\n- 生命周期钩子\n\n##  Controllers 控制器\n> 控制器负责处理传入的请求和向客户端返回响应\n\n![](http://116.204.120.144:3000/staticResource/content/bJt2A_Gp7ftC7wv.png)\n\nNest.js通过 **装饰器** 定义 **控制器** 和 **路由**以及**请求方式**\n使用 `@Controller()` 装饰器 来定义一个控制器\n```typescript\n@Controller()  \nexport class AppController {\n  @Get() // 访问 http://127.0.0.1:3000\n  getHello() {\n    return this.appService.getHello();\n  }\n}\n\n// 当给 @Controller() 传入路径时 则表示该控制器的路由根路径 \n@Controller(\'user\')\nexport class CatsController {\n  @Get() // http://127.0.0.1:3000/user \n  getAll() {\n    return \'查询全部用户\'\n  }\n}\n\n```\n\n**常见的请求装饰器:** \n- `@Get()`\n- `@Post()`\n- `@Put()`\n- `@Delete()`\n- `@Patch()`\n- `@Options()`\n- `@Head()`\n- `@All()`\ntips: All 请求装饰器 会匹配任何请求 如果将All定义在最上方 则请求只会匹配到该控制器 \n\n这些装饰器也可以通过 传入url 来指定访问路径 例如:\n```typescript\n@Controller(\'user\')\nexport class CatsController {\n  @Post(\'create\') // post http://127.0.0.1:3000/user/create\n  createUser() {\n    return \'创建用户成功\'\n  }\n}\n```\n**常见的参数装饰器**\n![](http://116.204.120.144:3000/staticResource/content/dGPMViZvqb6WbiC.png)\n\n```typescript\nimport {\n  Controller,\n  Get,\n  Req,\n  Res,\n  Next,\n  Session,\n  Param,\n  Body,\n  Query,\n  Headers,\n  Ip,\n  HostParam,\n} from \'@nestjs/common\';\nimport { AppService } from \'./app.service\';\nimport type { NextFunction, Request, Response } from \'express\';\n\n@Controller()\nexport class AppController {\n  constructor(private readonly appService: AppService) {}\n\n  @Get()\n  getHello(\n    @Req() req: Request, // 请求对象 包括 params query body 请求头\n    @Res() res: Response, // 响应对象 可以设置 响应头 以及响应数据\n    @Next() next: NextFunction, // 放行函数\n    @Param() params, // params 参数\n    @Query() query, // query 参数\n    @Body() body, // 请求体 参数\n    @Headers() headers, // 请求头\n    @Session() session,\n    @Ip() ip, // 客户端 ip\n    @HostParam() host,\n  ) {\n    return this.appService.getHello();\n  }\n}\n```\ntip: 在使用 `@Res()` 和 `@Next()` 这2个装饰器时 函数直接return 不会作为响应的结果 必须使用 `res.send()` 方法响应 `@Res()` 也可以通过单独设置 `passthrough: true` 来解决该问题 \n`@Res({ passthrough: true })` \n\n\n\n## Providers 提供者\n> Providers 是 Nest 的一个基本概念。许多基本的 Nest 类都可能被视为 provider - service, repository, factory, helper 等等。 他们都可以通过 constructor 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest运行时系统。 Provider 只是一个用 @Injectable() 装饰器注释的类\n\n![](http://116.204.120.144:3000/staticResource/content/qO1_uVieDIQzrz3.png)\n\n**Provider 只是一个用 `@Injectable()` 装饰器注释的类**\n\n### 依赖注入(Dependency Injection 简称 DI)\n> DI 系统中存在两个主要角色：依赖使用者和依赖提供者\n```typescript\n// user.controller.ts\nimport { UserService } from \'./user.service\';\n\nexport class UserController {\n  // 手动创建实例方式\n  userService: UserService;\n  constructor() {\n    this.userService = new UserService()\n  }\n  \n\n  // 依赖注入方式创建\n  constructor(private readonly userService: UserService) {}\n\n}\n```\n```typescript\n// user.module.ts\nimport { Module } from \'@nestjs/common\';\nimport { UserService } from \'./user.service\';\nimport { UserController } from \'./user.controller\';\n\n@Module({\n  controllers: [UserController],\n  providers: [UserService],\n})\nexport class UserModule {}\n```\n```typescript\n// user.service.ts\nimport { Injectable } from \'@nestjs/common\';\nimport { CreateUserDto } from \'./dto/create-user.dto\';\nimport { UpdateUserDto } from \'./dto/update-user.dto\';\n\n@Injectable()\nexport class UserService {\n  create(createUserDto: CreateUserDto) {\n    return \'This action adds a new user\';\n  }\n\n  findAll() {\n    return `This action returns all user`;\n  }\n\n  findOne(id: number) {\n    return `This action returns a #${id} user`;\n  }\n\n  update(id: number, updateUserDto: UpdateUserDto) {\n    return `This action updates a #${id} user`;\n  }\n\n  remove(id: number) {\n    return `This action removes a #${id} user`;\n  }\n}\n\n```\n\n上面的三块代码 可以\n将`UserService` 看作 **依赖提供者**  \n将`UserController`看作 **依赖使用者** \n而`UserModule` 则作处理两者关系的**调度中心** 由 Module 注册 `Service` 实例 提供给 `Controller`\n\n查看 `user.controller.ts` 中 两种创建实例方式 虽然在功能效果上没有什么区别 但是当存在多个控制器都需要使用 `UserService` 时 第一种方法就会存在多次创建同一实例的问题 而通过依赖注入 依赖关系的创建和传递被转移到了框架或容器来处理由框架来负责创建 `UserController` 的实例 并自动将 `UserService` 的实例注入到 `UserController` 中 当调用的服务已经存在时 则会将之前创建好的服务实例返回 这样做既避免了多次创建同一服务实例 也遵循了**单例模式**\n\n### 自定义提供者\n> Nest 有一个内置的控制反转（\"IoC\"）容器，可以解决 providers 之间的关系。 此功能是上述依赖注入功能的基础，但要比上面描述的要强大得多。@Injectable() 装饰器只是冰山一角, 并不是定义 providers 的唯一方法。相反，您可以使用普通值、类、异步或同步工厂\n- @Optional()\n- @Inject()\n\n```typescript\n// user.modules.ts\nimport {\n  Controller,\n  Get,\n  Inject,\n  Optional,\n} from \'@nestjs/common\';\nimport { UserService } from \'./user.service\';\nimport { CreateUserDto } from \'./dto/create-user.dto\';\nimport { UpdateUserDto } from \'./dto/update-user.dto\';\n\n@Controller(\'user\')\nexport class UserController {\n  constructor(\n    private readonly userService: UserService,\n    @Optional() @Inject(\'test\') private readonly testVal: string,\n  ) {}\n\n  @Get()\n  findAll() {\n    console.log(\'this.testVal -----\', this.testVal);\n    return \'查询全部用户\';\n  }\n  \n}\n\n```\n`@Inject()` 装饰器表示注入一个自定义依赖 是用 `private ` 修饰词 将构造函数中的参数声明为私有成员变量 私有成员变量只能在类的内部访问\n`@Optional()` 表示该注入属性为可选属性 当提供时不会报错 而是会使用 **undefined** 作为默认值\n![](http://116.204.120.144:3000/staticResource/content/BxH-OkSQRxRMVwa.png)\n\n未使用 `@Optional()` 装饰的属性 在调用时未提供对应的变量 会影响程序执行\n![](http://116.204.120.144:3000/staticResource/content/q9iyRaAwrhqdAz1.png)\n\n\n> 上面的方式为**基于构造函数的注入** 即通过构造函数方法注入 providers 在某些非常特殊的情况下 **基于属性的注入**可能会有用\n\n```typescript\nclass User {\n  name: string;\n  age: number;\n}\n\nclass ResponseType<T = any> {\n  total: number;\n  data: T[];\n}\n\n  // 基于属性注入\n  @Inject(\'testData\')\n  private readonly testData: ResponseType<User>;\n\n  @Get()\n  findAll() {\n    console.log(\'this.testData -----\', this.testData);\n    return \'查询全部用户\';\n  }\n```\n\n![](http://116.204.120.144:3000/staticResource/content/Po99ZIRIqiGEtwS.png)\n\n\n> 如果您的类没有扩展其他提供者，你应该总是使用基于构造函数的注入。\n\n### 依赖提供者\n```typescript\n// user.module.ts\nimport { Module } from \'@nestjs/common\';\nimport { UserService } from \'./user.service\';\nimport { UserController } from \'./user.controller\';\n\n@Module({\n  controllers: [UserController],\n  providers: [\n    UserService,\n    {\n      // 提供注入名\n      provide: \'testData\',\n      /**\n       * 注入的值 可以是 类 基本数据类型 和 引用数据类型 以及工厂函数\n       * 注入 类时使用 useClass\n       * 注入 数据使用 useValue\n       * 注入 工厂函数 useFactory\n       */\n      useValue: {\n        total: 3,\n        data: [\n          { name: \'zs1\', age: 18 },\n          { name: \'zs2\', age: 13 },\n          { name: \'zs3\', age: 14 },\n        ],\n      },\n    },\n  ],\n})\nexport class UserModule {}\n```\n\n## Modules 模块\n> 模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。\n\n![](http://116.204.120.144:3000/staticResource/content/Ft-Eyc2KB3ic7Ke.png)\n\n`@module()` 装饰器接受一个描述模块属性的对象：\n![](http://116.204.120.144:3000/staticResource/content/JMTJbI0DEOZKeVc.png)\n\n\n## Middleware 中间件\n> 中间件是在路由处理程序 之前 调用的函数。 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 next() 中间件函数。 next() 中间件函数通常由名为 next 的变量表示。\n\n```typescript\n// logger.middleware.ts\nimport { Injectable, NestMiddleware } from \'@nestjs/common\';\nimport { Request, Response, NextFunction } from \'express\';\n\n@Injectable()\nexport class LoggerMiddleware implements NestMiddleware {\n  use(req: Request, res: Response, next: NextFunction) {\n    console.log(\'Request...\');\n    next();\n  }\n}\n\n```\n```typescript\n// app.module.ts\nimport {\n  MiddlewareConsumer,\n  Module,\n  NestModule,\n  RequestMethod,\n} from \'@nestjs/common\';\nimport { AppController } from \'./app.controller\';\nimport { AppService } from \'./app.service\';\nimport { UserModule } from \'./user/user.module\';\nimport { CatsService } from \'./cats/cats.service\';\nimport { CatsController } from \'./cats/cats.controller\';\nimport { LoggerMiddleware } from \'./middleware/logger.middleware\';\nimport { TestMiddleware } from \'./middleware/test.middleware\';\n\nimport { ArticleModule } from \'./modules/article/article.module\';\nimport { ValidateTokenMiddleware } from \'./middleware/validateToken.middleware\';\n\n@Module({\n  imports: [UserModule, ArticleModule],\n  controllers: [AppController, CatsController],\n  providers: [AppService, CatsService],\n})\nexport class AppModule implements NestModule {\n  configure(consumer: MiddlewareConsumer) {\n    // 注册全局触发的 Logger 中间件\n    consumer.apply(LoggerMiddleware).forRoutes(\'*\');\n\n    // 注册指定路由触发的中间件\n    consumer.apply(TestMiddleware).forRoutes(\'user\');\n\n    // 排除指定路由不走该中间件\n    consumer\n      .apply(ValidateTokenMiddleware)\n      .exclude(\n        { path: \'/static-resources\', method: RequestMethod.GET },\n        \'/static-resources/(.*)\',\n      )\n      .forRoutes(\'*\');\n\n    // 函数中间件\n    consumer\n      .apply((req, res, next) => {\n        console.log(\'函数中间件触发\');\n        next();\n      })\n      .forRoutes(\'*\');\n  }\n}\n\n```\n\n## Exception filters 异常过滤器\n> 内置的异常层负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。\n\n![](http://116.204.120.144:3000/staticResource/content/r5tcYcHryiGsTUv.png)\n\n内置的异常过滤器\n- BadRequestException\n- UnauthorizedException\n- NotFoundException\n- ForbiddenException\n- NotAcceptableException\n- RequestTimeoutException\n- ConflictException\n- GoneException\n- PayloadTooLargeException\n- UnsupportedMediaTypeException\n- UnprocessableException\n- InternalServerErrorException\n- NotImplementedException\n- BadGatewayException\n- ServiceUnavailableException\n- GatewayTimeoutException\n\n![](http://116.204.120.144:3000/staticResource/content/Kk6NBBVrAhyQ3x5.png)\n\n\n如果想要自定义异常过滤器需要 使用`@Catch()` 装饰器来装饰类 并且实现 `ExceptionFilter` 接口 \n\n```typescript\nimport { formatDate } from \'@/utils/date.util\';\nimport {\n  ExceptionFilter,\n  Catch,\n  ArgumentsHost,\n  HttpException,\n  InternalServerErrorException,\n} from \'@nestjs/common\';\nimport { Request, Response } from \'express\';\n\n@Catch(HttpException)\nexport class HttpExceptionFilter implements ExceptionFilter {\n  catch(exception: HttpException, host: ArgumentsHost) {\n    const ctx = host.switchToHttp();\n    const response = ctx.getResponse<Response>();\n    const request = ctx.getRequest<Request>();\n    const status = exception.getStatus();\n\n    console.log(\' ----->\', exception.stack);\n\n    response.status(status).json({\n      code: status,\n      path: request.url,\n      methods: request.method,\n      message: exception.message,\n      timestamp: formatDate(),\n    });\n  }\n}\n\n```\n`@Catch()` 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest这个特定的过滤器正在寻找 HttpException 而不是其他的。在实践中，`@Catch()` 可以传递多个参数，所以可以通过逗号分隔来为多个类型的异常设置过滤器\n当传入`HttpException` 异常类型时 该异常过滤器会捕获全局所有的异常 不管是内置的异常过滤器 还是`new Error(\'\')` 都会被该过滤器捕获\n```typescript\n// 捕获 全局所有异常\n@Catch(HttpException)\n\n// 只捕获 抛出的 InternalServerErrorException 异常\n@Catch(InternalServerErrorException)\n  \n// 只捕获 抛出的 BadRequestException 和 UnauthorizedException 的异常\n@Catch(BadRequestException, UnauthorizedException)\n```\n\n注意!!! 注册全局异常过滤器时请注意 注册的先后顺序 会影响 过滤器的执行时机 比如同时 同时单独指定了处理错误请求的异常的过滤器`@Catch(BadRequestException)` 和 全局通用的异常过滤器`@Catch(HttpException)` 后注册的 会覆盖先注册的 也就是说 如果全局通用的异常过滤器 后注册 在抛出参数错误请求时 则会触发 全局通用的异常过滤器(`@Catch(HttpException)`) 所以如果想要 单独触发参数错误的异常过滤器 应该 在全局通用的异常过滤器之后注册\n```typescript\n// ❌ 错误写法\napp.useGlobalFilters(new BadRequestExceptionFilter());\napp.useGlobalFilters(new HttpExceptionFilter());\n\n// ✔️ 正确写法\napp.useGlobalFilters(new HttpExceptionFilter());\napp.useGlobalFilters(new BadRequestExceptionFilter());\n```\n\n\n## 管道\n\n## 守卫\n守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。\n\n\n## 生命周期钩子\nOnModuleInit：在模块初始化时调用，用于执行一些初始化操作。\n接口：OnModuleInit，方法：onModuleInit()\n\nOnModuleDestroy：在应用程序关闭时调用，用于执行一些清理和关闭操作。\n接口：OnModuleDestroy，方法：onModuleDestroy()\n\nOnApplicationBootstrap：在应用程序完成启动时调用，用于执行一些额外的启动操作。\n接口：OnApplicationBootstrap，方法：onApplicationBootstrap()\n\nOnApplicationShutdown：在应用程序即将关闭时调用，用于执行一些关闭前的操作。\n接口：OnApplicationShutdown，方法：onApplicationShutdown()\n\nOnModuleInit：在模块初始化时调用，用于执行一些初始化操作。\n接口：OnModuleInit，方法：onModuleInit()\n\nOnModuleDestroy：在模块销毁时调用，用于执行一些清理和关闭操作。\n接口：OnModuleDestroy，方法：onModuleDestroy()\n\nOnRequest：在每个 HTTP 请求处理前调用，用于执行一些请求前的操作。\n接口：OnRequest，方法：onRequest()\n\nOnResponse：在每个 HTTP 响应处理后调用，用于执行一些响应后的操作。\n接口：OnResponse，方法：onResponse()\n\n\ntips: 直接使用 `ctrl + c` 停止进程时 不会触发`OnModuleDestroy`钩子 可以使用 process 监听 `SIGINT` 事件 通过调用 `app.close()` 方法触发 `OnModuleDestroy`钩子\n```typescript\n  process.on(\'SIGINT\', async () => {\n    await app.close();\n  });\n```\n', 2, '', 2, '[8]', 0, 0, 0, 0, 0, '2023-06-30 14:01:47', '2023-06-30 14:01:47');
INSERT INTO `article` VALUES (8, '如何拦截浏览器自动发起的资源请求', '如何拦截浏览器自动发起的资源请求', '拦截浏览器自动去请求的资源 并加上自定义的参数', 2, '', 2, '[2]', 0, 0, 0, 0, 0, '2023-07-10 11:34:56', '2023-07-10 11:34:56');
INSERT INTO `article` VALUES (9, 'Git常用命令', '', '`[]`表示内容可自定义 **加粗** 表示常用命令\n## remote 相关命令\n- **`git remote add origin [远程仓库地址]` 关联远程仓库**\n- `git remote add [origin-name] [远程仓库地址]` 关联远程仓库并自定义 远程仓库名称\n- `git remote add [origin-name-1] [远程仓库地址1]` 关联多个远程仓库 并指定仓库地址1\n- `git remote add [origin-name-2] [远程仓库地址2]` 关联多个远程仓库 并指定仓库地址2\n- **`git remote -v` 查看关联远程仓库**\n- `git remote remove [origin-name]` 移除远程关联仓库\n- `git remote rename [old-origin-name] [new-origin-name]` 重命名远程仓库名称\n- `git remote show [origin-name]` 查看指定远程仓库的详细信息\n应用场景\n\n## status 相关命令\n- **`git status` 查看文件状态**\n- `git status -s` 简介明了的方式查看文件状态\n- `git status --ignored` 显示被 Git 忽略的文件的状态。\n\n![](http://116.204.120.144:3000/staticResource/content/cnuY63sI9I54AsU.png)\n![](http://116.204.120.144:3000/staticResource/content/YgRH3hrYFqJiFKL.png)\n\n\n\n## add 相关命令\n- `git add [文件地址]` 暂存指定文件\n- **`git add .` 暂存所有修改的文件**\n\n## commit 相关命令\n- **`git commit -m \"[提交备注]\"` 提交并添加备注 请注意Git提交规范**\n\n### commit 提交规范\n- feat 新功能 feature\n- fix 修补 bug\n- docs 文档 documentation\n- style 格式 不影响代码运行的变动\n- refactor 重构 (既不是新增功能，也不是修改bug的代码变动 代码优化)\n- test 增加测试\n- chore 构建过程和辅助工具的变动注释\n- perf 性能优化\n- ci 自动化流程配置修改\n\n\n## barnch 相关命令\n- **`git branch` 查看本地分支**\n- **`git branch [分支名]` 创建指定分支**\n- `git branch -m [旧的分支名称] [新分支名名称]` 重命名指定分支的名称 `git branch -m master main`\n- `git branch -r` 查看远程分支\n\n## checkout 相关命令\n- **`git checkout [分支名称]` 切换到指定分支**\n- **`git checkout -b [分支名称]` 新建分支**\n- **`git checkout .` 取消当前目录下所有文件的更改 恢复到最近的提交状态**\n- `git checkout [已修改的文件]` 取消指定已修改的文件\n\n## tag 相关命令\n\n\n## merge 相关命令\n\n\n## reset 相关命令\n\n\n## pull 相关命令\n- **`git pull` 拉取默认关联的远程仓库代码**\n- `git pull [origin-name] [远程分支名]:[本地分支名]` 拉取远程仓库的分支\n- `git pull [远程分支] [远程分支名称]:[本地分支名称]` 拉取指定远程仓库的选中分支代码\n\n \n## push 相关命令\n- **`git push` 推送代码到默认关联的远程仓库**\n- **`git push -u [origin-name] [分支名]` 远程仓库创建指定分支并推送代码**\n- `git push [origin-name]` 推送到指定关联的远程仓库 \n- `git push -u [origin-name] [分支名]` 推送到指定关联的远程仓库创建指定分支并推送代码\n\n\n## fetch 相关命令\n- `git fetch [origin-name] [远程分支名]:[本地分支名]` 拉取远程仓库的分支\n\n## rebase 相关命令\n\n\n## reset 相关命令\n- `git reset HEAD .` 全部文件移除暂存区 (放弃全部 `git add`的文件)\n- `git reset [文件地址]` 指定文件移除暂存区\n\n## stash 相关命令\n', 2, '', 9, '[6]', 0, 0, 0, 0, 0, '2023-07-14 11:00:19', '2023-07-14 11:00:19');
INSERT INTO `article` VALUES (10, 'TS中的修饰符', '', 'TypeScript 中的修饰符的列表及其作用：\n\n1. `public`：公共修饰符，表示类成员对类的实例、类的外部以及派生类都可见和可访问。这是默认的修饰符，如果没有指定修饰符，默认为公共修饰符。\n\n2. `private`：私有修饰符，表示类成员只能在类的内部访问，对类的实例、类的外部以及派生类是不可访问的。\n\n3. `protected`：受保护修饰符，表示类成员可以在类的内部和派生类中访问，但对于类的实例或类的外部来说是不可访问的。\n\n4. `readonly`：只读修饰符，用于声明只读属性，表示该属性只能在声明时或构造函数内进行赋值，之后不可修改。\n\n5. `static`：静态修饰符，用于声明静态属性或静态方法，表示它们属于类本身而不是类的实例。静态成员可以通过类名直接访问，而无需实例化类。\n\n6. `abstract`：抽象修饰符，用于声明抽象类和抽象方法。抽象类不能被实例化，只能被继承，并且抽象方法必须在派生类中进行实现。\n\n这些修饰符可以与类的属性、方法和构造函数一起使用，以控制它们的可见性、可访问性、可修改性以及类的实例化和继承行为。\n\n示例：\n```typescript\nclass Example {\n  public publicProperty: string;\n  private privateProperty: number;\n  protected protectedProperty: boolean;\n  readonly readonlyProperty: string;\n  static staticProperty: string;\n\n  constructor() {\n    this.publicProperty = \"Public\";\n    this.privateProperty = 10;\n    this.protectedProperty = true;\n    this.readonlyProperty = \"Readonly\";\n  }\n\n  public publicMethod(): void {\n    console.log(\"This is a public method.\");\n  }\n\n  private privateMethod(): void {\n    console.log(\"This is a private method.\");\n  }\n\n  protected protectedMethod(): void {\n    console.log(\"This is a protected method.\");\n  }\n\n  static staticMethod(): void {\n    console.log(\"This is a static method.\");\n  }\n}\n```\n\n上述示例展示了使用不同修饰符声明的类成员的例子，可以根据需要选择适当的修饰符来控制类成员的行为和可见性。', 2, '', 9, '[3]', 0, 0, 0, 0, 0, '2023-07-14 13:39:38', '2023-07-14 13:39:38');
INSERT INTO `article` VALUES (11, 'Nestjs 映射类型', '', '> 当你在编写如增删改查（新增/删除/修改/查询）的新功能的时候，你会经常基于一个实体类型来构造一个变种。 Nest 提供了一些可以进行类型转换的功能函数来让这种任务更加方便\n> 当构造输入验证类型（也称为 DTO ）时，你往往会在同一个类型上构造 创建 和 更新 变种。举个例子， 创建 变种可能要求全部的字段都被填写，但是 更新 变种可能会把全部的字段变成可选的\n\n- `PartialType()` 函数返回一个类 包含被设置成可选的所有输入类型的属性', 2, '', 9, '[8]', 0, 0, 0, 0, 0, '2023-07-19 17:22:58', '2023-07-19 17:22:58');
INSERT INTO `article` VALUES (12, '使用GitHub Page部署静态网站', '使用GitHub Page部署静态网站', '使用GitHub Page部署静态网站\n\n> 前提: 无法直接访问 [GitHub](https://github.com/) 请科学上网\n\n## 一 进入Github官网 \n链接 [GitHub](https://github.com/)\n![](http://116.204.120.144:3000/staticResource/content/-HI1mF6eY8_XZhd.png)\n\n\n## 二 创建一个远程仓库\n\n### 2.1 点击 New 按钮\n![](http://116.204.120.144:3000/staticResource/content/EDoFm8Was-viAJQ.png)\n\n### 2.2 输入仓库信息\n![](http://116.204.120.144:3000/staticResource/content/yDUx0zWnBcK0Xhz.png)\n\n### 2.3 仓库信息输入完成 点击创建\n![](http://116.204.120.144:3000/staticResource/content/qBYnxJfmxVwLEkn.png)\n\n创建完成之后会看到类似下面的界面 说明仓库创建成功 **(页面先不要关闭 后面有用)**\n![](http://116.204.120.144:3000/staticResource/content/pdWvduqDPWW8kLx.png)\n\n## 三 创建本地Git仓库 并关联远程仓库\n\n### 3.1 本地创建一个 Git 管理的仓库\n\n#### 3.1.1 任意一个本地目录 创建一个 英文名的文件夹 \n![](http://116.204.120.144:3000/staticResource/content/a68yhC2hDPpiOSY.png)\n\n#### 3.1.2 通过 vscode 或者其它编辑器进入该目录\n鼠标右键**新建文件**\n![](http://116.204.120.144:3000/staticResource/content/U3DkAHiJ4AuDXzJ.png)\n\n创建一个 `index.html` 文件\n![](http://116.204.120.144:3000/staticResource/content/7Cd0wC7RxCZm576.png)\n\n\n将下面就是简单的一个html文件\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Document</title>\n</head>\n\n<body>\n  想输入什么内容随意\n</body>\n\n</html>\n```\n\nhtml完成 右键打开页面预览\n![](http://116.204.120.144:3000/staticResource/content/WtVG-rCiZJdJUVk.png)\n\n![](http://116.204.120.144:3000/staticResource/content/gI2fxbzVBTM57rW.png)\n\n#### 3.1.3 初始化 Git 仓库\n命令行进入该项目目录 `vscode`中 可使用快捷键 `ctrl` + `~` (`~` 在 `tab`键上方) 快速打开 \n输入 `git init` 命令 初始化为 git 仓库\n![](http://116.204.120.144:3000/staticResource/content/38s70Z1J-KzKaVK.png)\n打开资源管理器确认 Git 仓库是否创建成功\n![](http://116.204.120.144:3000/staticResource/content/iBydHt_oAKHelcX.png)\n\n需要勾选 `隐藏的目录` 查看有`.git` 的文件夹说明仓库创建成功\n\n### 3.2 关联远程仓库\n\n#### 3.2.1 打开之前创建好的远程仓库页面\n![](http://116.204.120.144:3000/staticResource/content/T7vIE8aA4elUKPL.png)\n复制 `git remote add origin xxx` 这行命令 在项目目录 的命令行中输入回车\n![](http://116.204.120.144:3000/staticResource/content/w9PwRzqUyu_pdXf.png)\n\n#### 3.2.2 确认仓库是否关联成功\n输入 `git remote -v` 查看打印信息\n![](http://116.204.120.144:3000/staticResource/content/Ihzb_namb83tSm-.png)\n\n当输出的内容 与我们远程仓库的地址 一样时说明 关联成功\n![](http://116.204.120.144:3000/staticResource/content/wHogg88N3DtBT8t.png)\n\n## 四 将本地仓库代码推送到远程仓库\n\n### 4.1 重命名默认分支名称\n输入 `git branch -M main` 将分支名重命名为 `main`\n![](http://116.204.120.144:3000/staticResource/content/BhQbTNwnvq0Pc8A.png)\n\n### 4.2 查看文件状态\n输入 `git status` 查看文件状态\n![](http://116.204.120.144:3000/staticResource/content/VaExqnK0xdBFiUS.png)\n绿框中显示当前所在分支\n\n### 4.3 提交代码到本地仓库\n输入 `git add .` 暂存所有文件\n![](http://116.204.120.144:3000/staticResource/content/too2gebybegq2Sf.png)\n再次输入 `git status` 查看文件状态\n![](http://116.204.120.144:3000/staticResource/content/yhswDN7a5iGl9yK.png)\n\n绿色状态说明文件暂存成功\n\n输入 `git commit -m \"chore: project init\"` 将下面提交值本地仓库 并添加备注信息 `\"\"` 中可输入 自定义提交的备注\n![](http://116.204.120.144:3000/staticResource/content/eheQyzfCxmoZZgT.png)\n\n再次输入 `git status` 查看文件状态\n![](http://116.204.120.144:3000/staticResource/content/AxwYWlGK6YS2cpa.png)\n当出现下面内容说明 代码提交成功 这时候只是推送到了本地的 git仓库中 还并未将代码推送到远程的 github 仓库中\n\n### 4.4 将代码推送到远程仓库\n输入 `git push -u origin main` 命令  在远程仓库创建main 分支 并推送代码\n**注意!!!  如果你的电脑是第一次提交到指定账户的远程仓库 会弹出身份校验窗口 需要输入你的github 账号和密码 或者是打开一个网页连接进行授权认证 只有通过认证才能往远程仓库推送代码** \n![](http://116.204.120.144:3000/staticResource/content/Rn2z9VPbAMxWslD.png)\n\n刷新创建的远程仓库界面 \n![](http://116.204.120.144:3000/staticResource/content/XAqmJ1USmtF2JmM.png)\n\n当看到下面的界面说明代码推送成功\n![](http://116.204.120.144:3000/staticResource/content/RCilBmTQnRwxUHn.png)\n\n## 五 使用 GitHub Page 部署提交的页面\n\n### 5.1 点击 `Setting` 按钮\n![](http://116.204.120.144:3000/staticResource/content/_DdFaKL6s-s6E9f.png)\n\n### 5.2 选中 `Pages` 菜单\n![](http://116.204.120.144:3000/staticResource/content/bFu0deOK4-FT4eN.png)\n\n#### 5.2.1 选择 代码分支 \n![](http://116.204.120.144:3000/staticResource/content/NG6NoOPrs2qn6Ue.png)\n\n#### 5.2.2 默认目录选择 root \n![](http://116.204.120.144:3000/staticResource/content/tBvm9gvIT3iusLW.png)\n\n#### 5.2.3 点击 Save 保存\n![](http://116.204.120.144:3000/staticResource/content/CON8OF4SA9ZAATH.png)\n\n#### 5.2.4 等待片刻 页面就部署成功了\n![](http://116.204.120.144:3000/staticResource/content/CEfP9n7B_LbtWIm.png)\n\n### 5.3 效果图如下\n这里没有显示图片 是因为使用了 http 协议 访问的图片路径 所以报错 必须要使用 https 协议才能访问\n![](http://116.204.120.144:3000/staticResource/content/Ep8XoESJmBqaE1i.png)\n\n#### 5.3.1 每次有新的提交 Actions 中都可以看到重新构建的记录\n![](http://116.204.120.144:3000/staticResource/content/DA6SeLDjRHIiJJo.png)\n\n重新构建完成 **强制刷新** 就能看到最新的效果了\n![](http://116.204.120.144:3000/staticResource/content/3I_JN0tDwaU_B0T.png)\n', 2, '', 9, '[6]', 0, 0, 0, 0, 0, '2023-08-08 09:57:12', '2023-08-08 09:57:12');
INSERT INTO `article` VALUES (13, 'CURL命令', '', 'CURL命令', 2, '', 9, '[6]', 0, 0, 0, 0, 0, '2023-08-10 10:49:32', '2023-08-10 10:49:32');
INSERT INTO `article` VALUES (14, 'Jwt双token刷新 前端Axios', '', 'Jwt双token刷新 前端Axios', 2, '', 9, '[2, 3]', 0, 0, 0, 0, 0, '2023-09-08 15:44:45', '2023-09-08 15:44:45');
INSERT INTO `article` VALUES (15, '谷歌浏览器快捷键', '', '## 1.标签和窗口类快捷键\n\n- Ctrl + n：打开新窗口\n- Ctrl + t：打开并跳转到新的标签页\n- Ctrl + Shift + t：重新打开并跳转到最后关闭的标签页\n- Ctrl + Tab：跳转到下一个打开的标签页\n- Ctrl + Shift + Tab：跳转到上一个打开的标签页\n\n\n## 2.功能类快捷键\n\n- Ctrl + h：在新标签页中打开\"历史记录\"\n- Ctrl + j：在新标签页中打开\"下载内容\"\n\n\n## 3.网页操作类快捷键\n\n- Ctrl + d：将当前网页保存为书签\n- Ctrl + Shift + d：将所有打开的标签页以书签的形式保存在新文件夹中\n- Ctrl和+：放大网页上的所有内容\n- Ctrl和-：缩小网页上的所有内容\n- Ctrl + 0：将网页上的所有内容恢复到默认大小\n\n\n## 4.刷新快捷键\n\n参考链接: [https://www.llqzj.net/chrome/11817.html](https://www.llqzj.net/chrome/11817.html)', 2, '', 2, '[6]', 0, 0, 0, 0, 0, '2023-09-12 10:21:18', '2023-09-12 10:21:18');
INSERT INTO `article` VALUES (17, '谷歌浏览器 输入框自动填充问题', '', '![](http://116.204.120.144:3000/staticResource/content/Q1Cw5Dtb82rpbJB.png)\n', 2, '', 1, '[6]', 0, 0, 0, 0, 0, '2023-09-27 00:12:35', '2023-09-27 00:12:35');

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '权限标识ID',
  `permission_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限标识名称',
  `permission_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限标识代码',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '权限标识描述',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图标类名',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `权限标识名称`(`permission_name` ASC) USING BTREE,
  UNIQUE INDEX `权限标识Code`(`permission_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES (1, '查询', 'VIEW', '查询数据', NULL, '2023-03-18 16:46:34', '2023-04-17 20:46:29');
INSERT INTO `auth_permission` VALUES (2, '添加', 'ADD', '添加操作', NULL, '2023-03-18 16:20:16', '2023-04-17 20:47:07');
INSERT INTO `auth_permission` VALUES (3, '编辑', 'EDIT', '修改数据', NULL, '2023-03-18 16:21:26', '2023-03-18 16:21:30');
INSERT INTO `auth_permission` VALUES (4, '删除', 'DELETE', '删除数据', NULL, '2023-03-18 16:20:30', '2023-04-17 22:03:11');
INSERT INTO `auth_permission` VALUES (8, '上传', 'UPLOAD', '上传文件', NULL, '2023-04-17 23:50:32', '2023-04-17 23:50:32');
INSERT INTO `auth_permission` VALUES (9, '下载', 'DOWNLOAD', '下载资源', NULL, '2023-04-20 00:28:57', '2023-04-20 00:28:57');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `category_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类描述',
  `private` int NULL DEFAULT 0 COMMENT '是否仅自己看见的分类\r\n(0 false)\r\n(1 true)',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `分类名`(`category_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '踩坑', '记录日常开发踩坑', 0, '2023-04-26 13:48:37', '2023-04-26 13:57:49');
INSERT INTO `category` VALUES (2, '分享', '分享', 0, '2023-04-26 13:49:05', '2023-06-10 15:37:37');
INSERT INTO `category` VALUES (3, '生活', '记录生活', 0, '2023-04-26 13:49:26', '2023-04-26 13:57:53');
INSERT INTO `category` VALUES (4, '吐槽', '日常吐槽', 0, '2023-04-26 13:50:01', '2023-04-26 13:57:55');
INSERT INTO `category` VALUES (7, '世界未解之谜🤔', '', 0, '2023-06-10 14:25:37', '2023-06-10 14:26:59');
INSERT INTO `category` VALUES (8, '尝试', '', 0, '2023-06-16 09:49:16', '2023-06-16 09:49:16');
INSERT INTO `category` VALUES (9, '学习', '', 0, '2023-07-02 11:59:25', '2023-07-02 11:59:25');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '菜单id',
  `menu_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '菜单名称',
  `menu_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '菜单访问路径',
  `menu_uri` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '菜单唯一标识',
  `menu_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '菜单 图表类名',
  `menu_type` enum('1','2','3','4') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1' COMMENT '菜单类型 1一级目录 2目录 3一级菜单 4菜单',
  `parent_id` int NULL DEFAULT 0 COMMENT '菜单的父级ID 0 表示该菜单为最外层的一级菜单',
  `menu_redirect` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '目录菜单重定向地址 只有为目录菜单类型时才生效',
  `roles` json NULL COMMENT '拥有该菜单的角色',
  `created_time` datetime NOT NULL COMMENT '菜单创建时间',
  `update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '菜单更新时间',
  `other_config` json NULL COMMENT '菜单其他配置信息',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `菜单名称`(`menu_name` ASC) USING BTREE,
  UNIQUE INDEX `菜单路径`(`menu_path` ASC) USING BTREE,
  UNIQUE INDEX `菜单唯一标识`(`menu_uri` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, '首页', '/home', 'Home', 'ele-HomeFilled', '3', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-16 11:31:13', '{\"isHide\": false, \"isKeepAlive\": true, \"parentMenuName\": \"\"}');
INSERT INTO `menu` VALUES (2, '权限管理', '/auth', 'Auth', 'iconfont icon-auth', '1', 0, 'SystemRole', NULL, '2023-06-14 18:44:03', '2023-06-14 18:44:03', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"\"}');
INSERT INTO `menu` VALUES (3, '角色列表', '/auth/role', 'SystemRole', 'iconfont icon-jiaoseguanli1', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-09-11 14:39:15', '{\"isHide\": false, \"isKeepAlive\": true, \"parentMenuName\": \"Auth\"}');
INSERT INTO `menu` VALUES (4, '菜单列表', '/auth/menu', 'SystemMenu', 'ele-Menu', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-15 11:41:06', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"Auth\"}');
INSERT INTO `menu` VALUES (5, '权限标识', '/auth/authPermission', 'SystemAuthPermission', 'ele-Key', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-14 18:44:03', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"Auth\"}');
INSERT INTO `menu` VALUES (6, '用户管理', '/user', 'User', 'iconfont icon-jiaoseguanli', '1', 0, 'SystemUser', NULL, '2023-06-14 18:44:03', '2023-06-14 18:44:03', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"\"}');
INSERT INTO `menu` VALUES (7, '用户列表', '/user/list', 'SystemUser', 'iconfont icon-yonghuguanli', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-14 18:44:03', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"User\"}');
INSERT INTO `menu` VALUES (8, '文章管理', '/article', 'Article', 'iconfont icon-wenzhangfenlei2', '1', 0, 'ArticleList', NULL, '2023-06-14 18:44:03', '2023-06-15 13:31:42', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"\"}');
INSERT INTO `menu` VALUES (9, '写文章', '/article/writeArticle/:aid', 'WriteArticle', 'iconfont icon-weibiaoti--', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-15 14:29:43', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"Article\"}');
INSERT INTO `menu` VALUES (10, '文章列表', '/article/list', 'ArticleList', 'iconfont icon-wenzhangguanli', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-07-04 19:21:06', '{\"isHide\": false, \"isKeepAlive\": true, \"parentMenuName\": \"Article\"}');
INSERT INTO `menu` VALUES (11, '标签管理', '/article/tag', 'ArticleTag', 'iconfont icon-tags', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-14 18:44:03', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"Article\"}');
INSERT INTO `menu` VALUES (12, '分类管理', '/article/category', 'ArticleCategory', 'iconfont icon-fenlei', '4', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-14 18:44:03', '{\"isHide\": false, \"isKeepAlive\": false, \"parentMenuName\": \"Article\"}');
INSERT INTO `menu` VALUES (13, '个人中心', '/personal', 'Personal', 'ele-UserFilled', '3', 0, '', NULL, '2023-06-14 18:44:03', '2023-06-15 11:39:21', '{\"isHide\": false, \"isKeepAlive\": true, \"parentMenuName\": \"\"}');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名',
  `role_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `menus` json NULL COMMENT '菜单标识',
  `auth_permissions` json NULL COMMENT '操作权限标识',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `角色名称`(`role_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'administrator', '超级管理员', '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]', '[1, 2, 3, 4, 8, 9]', '2023-03-18 16:03:37', '2023-11-22 09:58:10');
INSERT INTO `role` VALUES (2, 'test', '测试角色', '[6, 7, 15, 16, 8, 17, 18, 19, 20, 21]', '[1, 3]', '2023-03-18 17:09:13', '2023-05-07 14:43:48');
INSERT INTO `role` VALUES (5, 'common', 'common', '[2]', '[]', '2000-04-05 18:18:12', '2023-06-01 13:26:37');
INSERT INTO `role` VALUES (8, 'test1', '测试角色1', '[]', '[]', '2023-04-22 22:32:47', '2023-04-22 22:32:47');

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `tag_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名称',
  `tag_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签图标类名',
  `tag_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签描述',
  `created_time` datetime NOT NULL COMMENT '标签创建',
  `update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '标签修改时间',
  PRIMARY KEY (`id`, `tag_name`) USING BTREE,
  UNIQUE INDEX `name`(`tag_name` ASC) USING BTREE COMMENT '标签名称唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES (1, 'Vue2', 'iconfont icon-Vue', 'vue2框架', '2023-04-26 13:59:48', '2023-04-30 17:42:00');
INSERT INTO `tag` VALUES (2, 'Vue3', 'iconfont icon-Vue', NULL, '2023-04-26 14:00:12', '2023-04-29 02:52:20');
INSERT INTO `tag` VALUES (3, 'TS', 'iconfont icon-typescript', 'TypeScript 是JavaScript的超集', '2023-04-26 14:00:41', '2023-05-01 18:50:47');
INSERT INTO `tag` VALUES (4, 'React', 'iconfont icon-React', NULL, '2023-04-26 19:15:17', '2023-05-01 18:49:42');
INSERT INTO `tag` VALUES (5, 'Svelte', 'iconfont icon-svelte', '', '2023-04-29 02:39:44', '2023-04-29 02:39:44');
INSERT INTO `tag` VALUES (6, '其他', 'ele-Promotion', '', '2023-06-10 14:28:38', '2023-06-10 14:28:38');
INSERT INTO `tag` VALUES (7, 'Express', '', 'Express 是一个Node.js 框架', '2023-06-16 09:37:49', '2023-06-16 09:37:49');
INSERT INTO `tag` VALUES (8, 'Node.js', 'iconfont icon-Nodejs1', '', '2023-06-16 09:38:07', '2023-09-15 01:36:26');
INSERT INTO `tag` VALUES (9, '一些想法', '', '', '2023-06-16 09:49:26', '2023-06-16 09:49:34');
INSERT INTO `tag` VALUES (10, 'Java', '', '', '2023-07-02 11:58:55', '2023-07-02 11:58:55');
INSERT INTO `tag` VALUES (11, 'Spring', '', '', '2023-07-02 11:59:07', '2023-07-02 11:59:07');

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `age` int NOT NULL,
  `data` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `createdTime` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of test
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `role_id` int NOT NULL COMMENT '用户所属角色ID',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '电子邮箱',
  `state` int NOT NULL DEFAULT 1 COMMENT '用户状态 \r\n0禁用\r\n1正常',
  `created_time` datetime NOT NULL COMMENT '注册时间',
  `update_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `unseal_time` datetime NULL DEFAULT NULL COMMENT '解封日期',
  `avatar` mediumblob NULL COMMENT '用户头像',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户头像地址',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `用户名称`(`user_name` ASC) USING BTREE,
  INDEX `角色ID`(`role_id` ASC) USING BTREE,
  CONSTRAINT `角色ID` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '123456', 1, NULL, 1, '2023-06-01 11:41:19', '2023-07-04 19:12:31', NULL, NULL, 'http://116.204.120.144:3000/staticResource/user-cover/MIYCgcmeh07s9dF.gif');
INSERT INTO `user` VALUES (2, 'Peng', '123mzp', 1, '', 1, '2023-06-10 14:23:59', '2023-07-04 17:52:24', NULL, NULL, 'http://116.204.120.144:3000/staticResource/user-cover/67Vh9NnvAUIEYmo.jpg');

SET FOREIGN_KEY_CHECKS = 1;
