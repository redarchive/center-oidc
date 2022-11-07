import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'
import { Repository } from 'typeorm'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { Client } from './entities/client.entity'
import { RedirectURI } from './entities/redirect-uri.entity'
import { Scope } from './entities/scope.entity'

@Injectable()
export class ClientsService {
  constructor (
    @InjectRepository(Client)
    private readonly clients: Repository<Client>,
    @InjectRepository(Scope)
    private readonly scopes: Repository<Scope>,
    @InjectRepository(RedirectURI)
    private readonly redirectURIs: Repository<RedirectURI>
  ) {}

  public async create (userId: number, createClientDto: CreateClientDto): Promise<void> {
    const secret = randomBytes(15).toString('hex')

    const { generatedMaps } = await this.clients.insert({
      name: createClientDto.name,
      secret,
      userId
    })

    for (const { reason, type } of createClientDto.scopes) {
      await this.scopes.insert({
        clientId: generatedMaps[0].id,
        reason,
        type
      })
    }

    for (const uri of createClientDto.redirectUris) {
      await this.redirectURIs.insert({
        clientId: generatedMaps[0].id,
        uri
      })
    }
  }

  public async findAllMine (userId: number): Promise<Client[]> {
    return await this.clients.findBy({ userId })
  }

  public async findOne (id: string, hideSecure = true, userId?: number): Promise<Client> {
    console.log()
    const client = await this.clients.findOne({
      select: hideSecure
        ? undefined
        : {
            id: true,
            name: true,
            redirectUris: true,
            scopes: true,
            secret: true,
            userId: true
          },
      where: {
        id
      },
      relations: {
        redirectUris: true,
        scopes: true
      }
    })

    if (client == null) {
      throw new NotFoundException('CLIENT_NOT_FOUND')
    }

    if (!hideSecure && client.userId !== userId) {
      throw new ForbiddenException('FORBIDDEN_INFOMATION')
    }

    return client
  }

  public async update (
    id: string,
    userId: number,
    updateClientDto: UpdateClientDto
  ): Promise<void> {
    const client = await this.clients.findOneBy({ id })
    if (client === null) {
      throw new NotFoundException('CLIENT_NOT_FOUND')
    }

    if (client.userId !== userId) {
      throw new ForbiddenException('FORBIDDEN_INFOMATION')
    }

    await this.clients.update(
      { id },
      {
        name: updateClientDto.name
      }
    )

    await this.scopes.delete({ clientId: id })
    for (const { reason, type } of updateClientDto.scopes) {
      await this.scopes.insert({
        clientId: id,
        reason,
        type
      })
    }

    await this.redirectURIs.delete({ clientId: id })
    for (const uri of updateClientDto.redirectUris) {
      await this.redirectURIs.insert({
        clientId: id,
        uri
      })
    }
  }

  public async remove (id: string, userId: number): Promise<void> {
    const client = await this.clients.findOneBy({ id })

    if (client === null) {
      throw new NotFoundException('CLIENT_NOT_FOUND')
    }

    if (client.userId !== userId) {
      throw new ForbiddenException('USER_NOT_AUTHORIZED_TO_DELETE')
    }

    await this.clients.delete({ id })
  }
}
