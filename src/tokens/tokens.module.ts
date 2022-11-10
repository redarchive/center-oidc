import { Module } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { TokensController } from './tokens.controller'
import { JwtModule } from '@nestjs/jwt'
import { readFileSync } from 'fs'
import { UsersModule } from '../users/users.module'
import { ClientsModule } from '../clients/clients.module'

@Module({
  imports: [
    ClientsModule,
    UsersModule,
    JwtModule.register({
      privateKey: readFileSync('./keys/private.pem'),
      publicKey: readFileSync('./keys/public.pem'),
      signOptions: {
        algorithm: 'ES256',
        expiresIn: '1m'
      },
      verifyOptions: {
        algorithms: ['ES256']
      }
    })
  ],
  controllers: [TokensController],
  providers: [TokensService]
})
export class TokensModule {}
