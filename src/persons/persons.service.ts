import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person, PersonType } from './entities/person.entity';

@Injectable()
export class PersonsService {
  constructor (
    @InjectRepository(Person)
    private readonly persons: Repository<Person>
  ) {}

  // create(createPersonDto: CreatePersonDto) {
  //   return 'This action adds a new person';
  // }

  // findAll() {
  //   return `This action returns all persons`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} person`;
  // }

  public async findOneByPhone (type: PersonType, phone: string): Promise<Person | undefined> {
    return await this.persons.findOneBy({
      phone,
      type
    })
  }

  // update(id: number, updatePersonDto: UpdatePersonDto) {
  //   return `This action updates a #${id} person`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} person`;
  // }

  public async assignUser (id: number, userId: number) {
    await this.persons.update({ id }, { userId })
  }
}
