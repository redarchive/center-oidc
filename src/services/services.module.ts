import { Module } from '@nestjs/common'
import { ServicesService } from './services.service'
import { ServicesController } from './services.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'
import { Screenshot } from './entities/screenshots.entity'
import { Tag } from './entities/tag.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Screenshot, Tag])
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
