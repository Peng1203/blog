import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import session from 'express-session'
import { AppModule } from './app.module'
import { DtoValidatePipe } from './common/pipe'
import { Logger } from '@nestjs/common'
import userAgent from 'express-useragent'
import requestIp from 'request-ip'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true })
  const configService = app.get(ConfigService)
  const APP_HOST = configService.get<string>('APP_HOST')
  const APP_PORT = configService.get<string>('APP_PORT')
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET')
  const SWAGGER_PREFIX = configService.get<string>('SWAGGER_PREFIX')
  const SWAGGER_VERSION = configService.get<string>('SWAGGER_VERSION')
  const SWAGGER_TITLE = configService.get<string>('SWAGGER_TITLE')
  const API_PREFIX = configService.get<string>('API_PREFIX')

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  )
  app.use(userAgent.express())
  app.use(requestIp.mw())

  // app.enableCors();
  app.enableCors({ credentials: true })
  app.setGlobalPrefix(API_PREFIX)

  app.useGlobalPipes(new DtoValidatePipe())
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new DataAccessFilter());

  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    // .setDescription('博客接口示例')
    .setVersion(SWAGGER_VERSION)
    // .addTag('cats')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(SWAGGER_PREFIX, app, document)

  await app.listen(APP_PORT, () =>
    Logger.debug(`server is running: http://${APP_HOST}:${APP_PORT}  --${process.env.NODE_ENV}`)
  )
}
bootstrap()
