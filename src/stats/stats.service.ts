import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, Repository } from 'typeorm'
import { Stat, StatTypes } from './entities/stat.entity'
import * as moment from 'moment'
import { Service } from '../services/entities/service.entity'

@Injectable()
export class StatsService {
  constructor (
    @InjectRepository(Stat)
    private readonly stats: Repository<Stat>,
    @InjectRepository(Service)
    private readonly services: Repository<Service>
  ) {}

  public async increse (serviceId: number, type: StatTypes): Promise<void> {
    const stat = await this.stats.findOneBy({
      serviceId,
      type,
      date: moment().format('YYYY-MM-DD')
    })

    let id = stat?.id
    if (id === undefined) {
      const { generatedMaps } = await this.stats.insert({
        serviceId,
        type
      })

      id = generatedMaps[0].id as number
    }

    if (type === StatTypes.LOGIN) {
      void this.services.increment({ id: serviceId }, 'logins', 1)
    }

    void this.stats.increment({ id }, 'counter', 1)
  }

  @Cron('0 0 * * *')
  public async clean (): Promise<void> {
    const cleanDate = new Date()
    cleanDate.setDate(cleanDate.getDate() - 7)

    await this.stats.delete({
      date: LessThan(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    })
  }
}
