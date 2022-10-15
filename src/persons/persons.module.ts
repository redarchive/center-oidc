import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person])
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService]
})
export class PersonsModule {}
