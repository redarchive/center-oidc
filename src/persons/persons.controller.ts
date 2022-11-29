import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { GuardedRequest } from '../auth/dto/Locals.dto'
import { PResBody } from '../common/ResponseBody'
import { UsersService } from '../users/users.service'
import { ApplyDiffDto } from './dto/apply-diff.dto'
import { CalcDiffDto } from './dto/calc-diff.dto'
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
    const user = await this.usersService.findOne(req.userId, { person: true })

    if (user?.person?.type !== PersonType.TEACHER) {
      throw new UnauthorizedException('ONLY_TEACHER_CAN_GET_FULL_DATA')
    }

    res.set('Content-Type', 'text/csv')

    return await this.personsService.exportAll()
  }

  @Post('@diff')
  @UseGuards(AuthGuard)
  public async calcDiffPersonsCSV (@Req() req: GuardedRequest, @Body() body: CalcDiffDto): PResBody<{ diff: any }> {
    const user = await this.usersService.findOne(req.userId, { person: true })

    if (user?.person?.type !== PersonType.TEACHER) {
      throw new UnauthorizedException('ONLY_TEACHER_CAN_GET_FULL_DATA')
    }

    const diff = await this.personsService.calcImportData(body.data)

    return {
      success: true,
      data: {
        diff
      }
    }
  }

  @Post('@apply')
  @UseGuards(AuthGuard)
  public async applyDiffChanges (@Req() req: GuardedRequest, @Body() body: ApplyDiffDto): PResBody {
    const user = await this.usersService.findOne(req.userId, { person: true })

    if (user?.person?.type !== PersonType.TEACHER) {
      throw new UnauthorizedException('ONLY_TEACHER_CAN_MODIFY_FULL_DATA')
    }

    await this.personsService.applyDiffData(body)

    return {
      success: true
    }
  }
}
