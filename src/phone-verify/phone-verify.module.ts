import { Module } from '@nestjs/common';
import { PhoneVerifyService } from './phone-verify.service';
import { PhoneVerifyController } from './phone-verify.controller';
import { RedisModule } from 'src/redis/redis.module';
import { PersonsModule } from 'src/persons/persons.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RedisModule,
    PersonsModule,
    ConfigModule
  ],
  controllers: [PhoneVerifyController],
  providers: [PhoneVerifyService]
})
export class PhoneVerifyModule {}
