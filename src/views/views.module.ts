import { Module } from '@nestjs/common'
import { ViewsService } from './views.service'
import { ViewsController } from './views.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from '../services/entities/service.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Service])
  ],
  controllers: [ViewsController],
  providers: [ViewsService]
})
export class ViewsModule {}
