import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { Service, ServiceTypes } from '../services/entities/service.entity'

@Injectable()
export class ViewsService {
  constructor (
    @InjectRepository(Service)
    private readonly services: Repository<Service>
  ) {}

  public async getServiceCount (): Promise<number> {
    return await this.services.count()
  }

  public async getTop10 (category?: string): Promise<Service[]> {
    return await this.services.find({
      order: {
        logins: 'DESC'
      },
      take: 10,
      relations: {
        user: true
      },
      ...(category !== undefined
        ? {
            where: {
              type: ServiceTypes[category]
            }
          }
        : {})
    })
  }

  public async getBanners (): Promise<Service[]> {
    return await this.services
      .createQueryBuilder('services')
      .select()
      .orderBy('RAND()')
      .take(5)
      .getMany()
  }

  public async getCapstone (category?: string): Promise<Service[]> {
    return await this.services.find({
      relations: {
        tags: true,
        user: true
      },
      where: {
        tags: [{
          label: '캡스톤프로젝트'
        }],
        ...(category !== undefined
          ? {
              type: ServiceTypes[category]
            }
          : {})
      },
      take: 12,
      order: {
        createdAt: 'DESC'
      }
    })
  }

  public async getRecents (page: number, category?: string): Promise<Service[]> {
    return await this.services.find({
      relations: {
        user: true
      },
      take: 10,
      skip: 10 * page,
      order: {
        createdAt: 'DESC'
      },
      ...(category !== undefined
        ? {
            where: {
              type: ServiceTypes[category]
            }
          }
        : {})
    })
  }

  public async getSearchResult (page: number, query: string): Promise<Service[]> {
    return await this.services.find({
      relations: {
        user: true
      },
      take: 10,
      skip: 10 * page,
      order: {
        createdAt: 'DESC'
      },
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
        { tags: [{ label: Like(`%${query}%`) }] }
      ]
    })
  }
}
