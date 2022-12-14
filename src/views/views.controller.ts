import { Controller, Get, Query } from '@nestjs/common'
import { PResBody } from '../common/ResponseBody'
import { Service } from '../services/entities/service.entity'
import { ViewsService } from './views.service'

@Controller('views')
export class ViewsController {
  constructor (private readonly viewsService: ViewsService) {}

  @Get('@status')
  public async getStatus (): PResBody<{ count: number }> {
    const count = await this.viewsService.getServiceCount()

    return {
      success: true,
      data: {
        count
      }
    }
  }

  @Get('@index')
  public async getIndex (@Query('page') page = 0): PResBody<{ banners: Service[], capstones: Service[], recents: Service[] }> {
    const banners = await this.viewsService.getBanners()
    const capstones = await this.viewsService.getCapstone()
    const recents = await this.viewsService.getRecents(page)

    return {
      success: true,
      data: {
        banners,
        capstones,
        recents
      }
    }
  }
}
