import { BadRequestException, Injectable } from '@nestjs/common'
import SHA3 from 'sha3'
import { AuthService } from '../auth/auth.service'
import { PersonType } from '../persons/entities/person.entity'
import { UsersService } from '../users/users.service'
import { CreateSessionDto } from './dto/create-session.dto'

@Injectable()
export class SessionsService {
  constructor (
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  public async create (createSessionDto: CreateSessionDto): Promise<string> {
    const user = await this.usersService.findOneByLogin(
      PersonType[createSessionDto.type],
      createSessionDto.login,
      false
    )

    if (user === null) {
      throw new BadRequestException('ID_OR_PASSWORD_INVALID')
    }

    const password = new SHA3(512)
      .update(createSessionDto.password)
      .update(user.salt)
      .digest('hex')

    if (password !== user.password) {
      throw new BadRequestException('ID_OR_PASSWORD_INVALID')
    }

    return this.authService.sign(user.id)
  }
}
