import { Module } from '@nestjs/common'
import { ServicesService } from './services.service'
import { ServicesController } from './services.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'
import { Screenshot } from './entities/screenshots.entity'
import { Tag } from './entities/tag.entity'
import { ClientsModule } from '../clients/clients.module'
import { UsersModule } from '../users/users.module'
import { Stat } from '../stats/entities/stat.entity'
import { StatsModule } from '../stats/stats.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Screenshot, Tag, Stat]),
    ClientsModule,
    UsersModule,
    StatsModule
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
