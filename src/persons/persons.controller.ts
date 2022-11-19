import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { GuardedRequest } from '../auth/dto/Locals.dto'
import { UsersService } from '../users/users.service'
import { PersonType } from './entities/person.entity'
import { PersonsService } from './persons.service'

@Controller('persons')
export class PersonsController {
  constructor (
    private readonly personsService: PersonsService,
    private readonly usersService: UsersService
  ) {}

  @Get('data.csv')
  @UseGuards(AuthGuard)
  public async getPersonsCSV (@Req() req: GuardedRequest, @Res({ passthrough: true }) res: Response): Promise<string> {
    const user = await this.usersService.findOne(req.userId, true)

    if (user?.person?.type !== PersonType.TEACHER) {
      throw new UnauthorizedException('ONLY_TEACHER_CAN_GET_FULL_DATA')
    }

    res.set('Content-Type', 'text/csv')

    return await this.personsService.exportAllUser()
  }
}
