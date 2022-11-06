import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query
} from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { GuardedRequest, TypedRequest } from '../auth/dto/Locals.dto'
import { PResBody } from '../common/ResponseBody'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { Client } from './entities/client.entity'

@Controller('clients')
export class ClientsController {
  constructor (private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async create (
    @Req() req: GuardedRequest,
      @Body() createClientDto: CreateClientDto
  ): PResBody {
    await this.clientsService.create(req.userId, createClientDto)
    return {
      success: true
    }
  }

  @Get('@me')
  @UseGuards(AuthGuard)
  public async findAllMine (@Req() req: GuardedRequest): PResBody<{ clients: Client[] }> {
    const clients = await this.clientsService.findAllMine(req.userId)

    return {
      success: true,
      data: {
        clients
      }
    }
  }

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

  @Patch(':id')
  @UseGuards(AuthGuard)
  public async update (
    @Req() req: GuardedRequest,
      @Param('id') id: string,
      @Body() updateClientDto: UpdateClientDto
  ): PResBody {
    await this.clientsService.update(id, req.userId, updateClientDto)

    return {
      success: true
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async remove (@Req() req: GuardedRequest, @Param('id') id: string): PResBody {
    await this.clientsService.remove(id, req.userId)

    return {
      success: true
    }
  }
}
