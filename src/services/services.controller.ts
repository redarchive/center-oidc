import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, Query } from '@nestjs/common'
import { ServicesService } from './services.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { PResBody } from '../common/ResponseBody'
import { AuthGuard } from '../auth/auth.guard'
import { GuardedRequest } from '../auth/dto/Locals.dto'
import { Service } from './entities/service.entity'
import { Tag } from './entities/tag.entity'

@Controller('services')
export class ServicesController {
  constructor (private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async create (@Req() req: GuardedRequest, @Body() createServiceDto: CreateServiceDto): PResBody {
    await this.servicesService.create(req.userId, createServiceDto)

    return {
      success: true
    }
  }

  @Get()
  public async findAll (): PResBody<{ services: Service[] }> {
    const services = await this.servicesService.findAll()

    return {
      success: true,
      data: {
        services
      }
    }
  }

  @Get('@tags')
  public async findAllTag (): PResBody<{ tags: Tag[] }> {
    const tags = await this.servicesService.getTags()

    return {
      success: true,
      data: {
        tags
      }
    }
  }

  @Get('@by-userId')
  public async findOneByUserId (@Query('id') id): PResBody<{ services: Service[] }> {
    const services = await this.servicesService.getByUserId(+id)

    return {
      success: true,
      data: {
        services
      }
    }
  }

  @Get(':id')
  public async findOne (@Param('id') id: string): PResBody<{ service: Service }> {
    const service = await this.servicesService.findOne(+id)
    if (service === null) {
      throw new NotFoundException('SERVICE_NOT_FOUND')
    }

    return {
      success: true,
      data: {
        service
      }
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  public async update (@Req() req: GuardedRequest, @Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto): PResBody {
    await this.servicesService.update(+id, req.userId, updateServiceDto)

    return {
      success: true
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async remove (@Req() req: GuardedRequest, @Param('id') id: string): PResBody {
    await this.servicesService.remove(+id, req.userId)

    return {
      success: true
    }
  }
}
