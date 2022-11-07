import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PersonType } from '../persons/entities/person.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly usersService: UsersService,
    private readonly reflector: Reflector
  ) {}

  public async canActivate (context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const req = http.getRequest()

    if (req.userId === undefined) {
      return false
    }

    const require = this.reflector.get<PersonType>(
      'required_type',
      context.getHandler()
    )

    if (require === undefined) {
      return true
    }

    const user = await this.usersService.findOne(req.userId, true)
    if (user === null) {
      return false
    }

    if (user.person === undefined) {
      return false
    }

    return user.person.type === require
  }
}
