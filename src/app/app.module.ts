import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthMiddleware } from '../auth/auth.middleware'
import { AuthModule } from '../auth/auth.module'
import { ClientsModule } from '../clients/clients.module'
import { FilesModule } from '../files/files.module'
import { PersonsModule } from '../persons/persons.module'
import { PhoneVerifyModule } from '../phone-verify/phone-verify.module'
import { ServicesModule } from '../services/services.module'
import { SessionsModule } from '../sessions/sessions.module'
import { TokensModule } from '../tokens/tokens.module'
import { UsersModule } from '../users/users.module'
import { DBConnService } from './dbconn/dbconn.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DBConnService
    }),
    PersonsModule,
    UsersModule,
    PhoneVerifyModule,
    AuthModule,
    SessionsModule,
    ClientsModule,
    TokensModule,
    FilesModule,
    ServicesModule
  ]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
