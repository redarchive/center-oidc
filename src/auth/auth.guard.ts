import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PersonType } from 'src/persons/entities/person.entity';
import { UsersService } from 'src/users/users.service';
import { TypedRequest } from './dto/Locals.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly usersService: UsersService,
    private readonly reflector: Reflector
  ) {}

  public async canActivate (context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const req = http.getRequest() as TypedRequest

    if (req.userId === undefined) {
      return false
    }

    const require = this.reflector.get<PersonType>('required_type', context.getHandler())
    if (!require) {
      return true   
    }

    const user = await this.usersService.findOne(req.userId, true)

    return user.person.type === require
  }
}
