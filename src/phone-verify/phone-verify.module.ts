import { Module } from '@nestjs/common';
import { PhoneVerifyService } from './phone-verify.service';
import { PhoneVerifyController } from './phone-verify.controller';
import { RedisModule } from 'src/redis/redis.module';
import { PersonsModule } from 'src/persons/persons.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'
import { readFileSync } from 'fs';

@Module({
  imports: [
    RedisModule,
    PersonsModule,
    ConfigModule,
    JwtModule.register({
      privateKey: readFileSync('./keys/private.pem'),
      publicKey: readFileSync('./keys/public.pem'),
      signOptions: {
        algorithm: 'ES256',
        expiresIn: '1m',
        notBefore: '1s',
        subject: 'phonevk'
      },
      verifyOptions: {
        algorithms: ['ES256'],
        subject: 'phonevk'
      }
    })
  ],
  controllers: [PhoneVerifyController],
  providers: [PhoneVerifyService],
  exports: [PhoneVerifyService]
})
export class PhoneVerifyModule {}
