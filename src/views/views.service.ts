import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Service } from '../services/entities/service.entity'

@Injectable()
export class ViewsService {
  constructor (
    @InjectRepository(Service)
    private readonly services: Repository<Service>
  ) {}

  public async getServiceCount (): Promise<number> {
    return await this.services.count()
  }

  public async getBanners (): Promise<Service[]> {
    return await this.services
      .createQueryBuilder('services')
      .select()
      .orderBy('RAND()')
      .take(5)
      .getMany()
  }
}
