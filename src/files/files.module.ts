import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    ConfigModule,
    UsersModule
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
