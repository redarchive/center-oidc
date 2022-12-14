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

  public async getCapstone (): Promise<Service[]> {
    return await this.services.find({
      relations: {
        tags: true,
        screenshots: true,
        user: true
      },
      where: {
        tags: [{
          label: '캡스톤프로젝트'
        }]
      },
      take: 12,
      order: {
        createdAt: 'DESC'
      }
    })
  }

  public async getRecents (page: number): Promise<Service[]> {
    return await this.services.find({
      relations: {
        tags: true,
        screenshots: true,
        user: true
      },
      take: 10,
      skip: 10 * page,
      order: {
        createdAt: 'DESC'
      }
    })
  }
}
