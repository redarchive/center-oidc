import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { readFileSync } from 'fs'

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      privateKey: readFileSync('./keys/private.pem'),
      publicKey: readFileSync('./keys/public.pem'),
      signOptions: {
        algorithm: 'ES256',
        expiresIn: '14d',
        notBefore: '1s',
        subject: 'uservk'
      },
      verifyOptions: {
        algorithms: ['ES256'],
        subject: 'uservk'
      }
    })
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
