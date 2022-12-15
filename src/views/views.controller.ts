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
  public async getIndex (@Query('page') page = 0): PResBody<{ top10: Service[], banners: Service[], capstones: Service[], recents: Service[] }> {
    const top10 = await this.viewsService.getTop10()
    const banners = await this.viewsService.getBanners()
    const capstones = await this.viewsService.getCapstone()
    const recents = await this.viewsService.getRecents(page)

    return {
      success: true,
      data: {
        top10,
        banners,
        capstones,
        recents
      }
    }
  }

  @Get('@category')
  public async getCategory (@Query('page') page = 0, @Query('type') category: string): PResBody<{ top10: Service[], capstones: Service[], recents: Service[] }> {
    const top10 = await this.viewsService.getTop10(category)
    const capstones = await this.viewsService.getCapstone(category)
    const recents = await this.viewsService.getRecents(page, category)

    return {
      success: true,
      data: {
        top10,
        capstones,
        recents
      }
    }
  }
}
