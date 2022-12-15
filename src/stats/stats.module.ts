import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Stat } from './entities/stat.entity'
import { StatsService } from './stats.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Stat])
  ],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}
