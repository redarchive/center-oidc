import {
  Controller,
  Get,
  Param,
  Req,
  Query
} from '@nestjs/common'
import { TypedRequest } from '../auth/dto/Locals.dto'
import { PResBody } from '../common/ResponseBody'
import { ClientsService } from './clients.service'
import { Client } from './entities/client.entity'

@Controller('clients')
export class ClientsController {
  constructor (private readonly clientsService: ClientsService) {}

  @Get(':id')
  public async findOne (
    @Req() req: TypedRequest,
      @Param('id') id: string,
      @Query('hideSecure') hideSecure = 'true'
  ): PResBody<{ client: Client }> {
    const client = await this.clientsService.findOne(
      id,
      hideSecure === 'true',
      req.userId
    )

    return {
      success: true,
      data: { client }
    }
  }
}
