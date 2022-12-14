import { Controller, Get } from '@nestjs/common'
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
  public async getIndex (): PResBody<{ banners: Service[] }> {
    const banners = await this.viewsService.getBanners()

    return {
      success: true,
      data: {
        banners
      }
    }
  }
}
