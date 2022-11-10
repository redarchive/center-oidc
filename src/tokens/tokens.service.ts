import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientsService } from '../clients/clients.service'
import { UsersService } from '../users/users.service'
import { CreateTokenDto } from './dto/create-token.dto'
import { v4 as uuid } from 'uuid'

@Injectable()
export class TokensService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService
  ) {}

  public async create (userId: number, createTokenDto: CreateTokenDto, iss: string): Promise<string> {
    const user = await this.usersService.findOne(userId, true)
    const client = await this.clientsService.findOne(createTokenDto.clientId)

    if (user === null || user.person === undefined) {
      throw new UnauthorizedException('USER_NOT_FOUND')
    }

    if (client === null) {
      throw new NotFoundException('CLIENT_NOT_FOUND')
    }

    const data: any = {
      id: user.id,
      login: user.login,
      nickname: user.nickname,
      createdAt: user.createdAt
    }

    if (createTokenDto.scopes.includes('CLASS_INFO')) {
      data.classInfo = {
        grade: user.person.grade,
        class: user.person.classroom,
        number: user.person.classNumber
      }
    }

    if (createTokenDto.scopes.includes('DORMITORY')) {
      data.dormitory = {
        room: user.person.dormitoryRoomNumber
      }
    }

    if (createTokenDto.scopes.includes('EMAIL')) {
      data.email = user.email
    }

    if (createTokenDto.scopes.includes('GENDER')) {
      data.gender = user.person.gender
    }

    if (createTokenDto.scopes.includes('PHONE_NUMBER')) {
      data.phone = user.person.phone
    }

    if (createTokenDto.scopes.includes('REAL_NAME')) {
      data.fullname = user.person.name
    }

    return this.jwtService.sign({
      iss,
      sub: uuid(),
      aud: client.id,
      nonce: createTokenDto.nonce,
      data
    })
  }
}
