import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as morgan from 'morgan'
import * as cookieParser from 'cookie-parser'
import * as compression from 'compression'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')

  app.use(morgan('combined'))
  app.use(cookieParser())
  app.use(compression())

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      always: true,
      whitelist: true
    })
  )

  await app.listen(3000)
}

void bootstrap()
