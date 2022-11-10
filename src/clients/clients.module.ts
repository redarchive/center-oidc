import { Module } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from './entities/client.entity'
import { RedirectURI } from './entities/redirect-uri.entity'
import { Scope } from './entities/scope.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, RedirectURI, Scope]),
    UsersModule
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule {}
