import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonsService {
  constructor (
    @InjectRepository(Person)
    private readonly persons: Repository<Person>
  ) {}

  create(createPersonDto: CreatePersonDto) {
    return 'This action adds a new person';
  }

  findAll() {
    return `This action returns all persons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  public async checkExistByPhone (phone: string): Promise<boolean> {
    return await this.persons.countBy({ phone }) > 0
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
