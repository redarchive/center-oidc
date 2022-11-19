import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Person, PersonType } from './entities/person.entity'

@Injectable()
export class PersonsService {
  constructor (
    @InjectRepository(Person)
    private readonly persons: Repository<Person>
  ) {}

  public async findOneByPhone (
    type: PersonType,
    phone: string
  ): Promise<Person | null> {
    return await this.persons.findOne({
      relations: {
        user: true
      },
      where: {
        phone,
        type
      }
    })
  }

  public async assignUser (id: number, userId: number): Promise<void> {
    await this.persons.update({ id }, { userId })
  }

  public async getAllUser (): Promise<Person[]> {
    return await this.persons.find()
  }
}
