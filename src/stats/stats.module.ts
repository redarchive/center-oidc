import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from '../services/entities/service.entity'
import { Stat } from './entities/stat.entity'
import { StatsService } from './stats.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Stat, Service])
  ],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}
