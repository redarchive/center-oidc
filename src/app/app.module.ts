import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsModule } from 'src/persons/persons.module';
import { PhoneVerifyModule } from 'src/phone-verify/phone-verify.module';
import { UsersModule } from 'src/users/users.module';
import { DBConnService } from './dbconn/dbconn.service';

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
    PhoneVerifyModule
  ]
})
export class AppModule {}
