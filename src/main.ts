import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as morgan from 'morgan'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.use(morgan('combined'))
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    always: true,
    whitelist: true
  }))

  await app.listen(3000)
}

bootstrap()
