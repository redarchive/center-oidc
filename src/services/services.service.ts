import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientsService } from '../clients/clients.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { Screenshot } from './entities/screenshots.entity'
import { Service, ServiceTypes } from './entities/service.entity'
import { Tag } from './entities/tag.entity'

@Injectable()
export class ServicesService {
  constructor (
    @InjectRepository(Service)
    private readonly services: Repository<Service>,
    @InjectRepository(Screenshot)
    private readonly screenshots: Repository<Screenshot>,
    @InjectRepository(Tag)
    private readonly tags: Repository<Tag>,
    private readonly clientService: ClientsService
  ) {}

  public async create (userId: number, createServiceDto: CreateServiceDto): Promise<void> {
    const { generatedMaps } = await this.services.insert({
      ...createServiceDto,
      userId,
      tags: undefined,
      clients: undefined,
      screenshots: undefined,
      type: ServiceTypes[createServiceDto.type]
    })

    const serviceId = generatedMaps[0].id

    for (const tag of createServiceDto.tags) {
      await this.tags.insert({
        label: tag,
        serviceId
      })
    }

    for (const screenshot of createServiceDto.screenshots) {
      await this.screenshots.insert({
        serviceId,
        url: screenshot
      })
    }

    for (const client of createServiceDto.clients) {
      await this.clientService.create(userId, client, serviceId)
    }
  }

  public async findAll (): Promise<Service[]> {
    const services = await this.services.find({
      relations: {
        clients: true,
        screenshots: true,
        tags: true
      }
    })

    return services
  }

  public async findOne (id: number): Promise<Service | null> {
    const service = await this.services.findOne({
      where: { id },
      relations: {
        clients: true,
        screenshots: true,
        tags: true
      }
    })

    return service
  }

  public async update (id: number, userId: number, updateServiceDto: UpdateServiceDto): Promise<void> {
    const service = await this.services.findOneBy({ id })

    if (service === null) {
      throw new NotFoundException('SERVICE_NOT_FOUND')
    }

    if (service.userId !== userId) {
      throw new ForbiddenException('NOT_YOUR_SERVICE')
    }

    const updateTempDto = Object.assign({}, updateServiceDto)
    delete (updateTempDto as any).clients

    await this.tags.delete({ serviceId: id })
    await this.screenshots.delete({ serviceId: id })
    await this.services.update({ id }, {
      ...updateTempDto as any
    })

    if (updateServiceDto.tags !== undefined) {
      for (const tag of updateServiceDto.tags) {
        await this.tags.insert({
          label: tag,
          serviceId: id
        })
      }
    }

    if (updateServiceDto.screenshots !== undefined) {
      for (const screenshot of updateServiceDto.screenshots) {
        await this.screenshots.insert({
          serviceId: id,
          url: screenshot
        })
      }
    }
  }

  public async remove (id: number, userId: number): Promise<void> {
    const service = await this.services.findOneBy({ id })

    if (service === null) {
      throw new NotFoundException('SERVICE_NOT_FOUND')
    }

    if (service.userId !== userId) {
      throw new ForbiddenException('NOT_YOUR_SERVICE')
    }

    await this.services.delete({ id })
  }
}