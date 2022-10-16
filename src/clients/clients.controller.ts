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
  Query,
} from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { TypedRequest } from 'src/auth/dto/Locals.dto'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Req() req: TypedRequest,
    @Body() createClientDto: CreateClientDto,
  ) {
    await this.clientsService.create(req.userId, createClientDto)
    return {
      success: true,
    }
  }

  @Get('@me')
  @UseGuards(AuthGuard)
  public async findAllMine(@Req() req: TypedRequest) {
    const clients = await this.clientsService.findAllMine(req.userId)

    return {
      success: true,
      data: {
        clients,
      },
    }
  }

  @Get(':id')
  public async findOne(
    @Req() req: TypedRequest,
    @Param('id') id: string,
    @Query('hideSecure') hideSecure = 'true',
  ) {
    const client = await this.clientsService.findOne(id, hideSecure === 'true', req.userId)

    return {
      success: true,
      data: { client },
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  public async update(
    @Req() req: TypedRequest,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    await this.clientsService.update(id, req.userId, updateClientDto)

    return {
      success: true
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public async remove(@Req() req: TypedRequest, @Param('id') id: string) {
    await this.clientsService.remove(id, req.userId)

    return {
      success: true
    }
  }
}
