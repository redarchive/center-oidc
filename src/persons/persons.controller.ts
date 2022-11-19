import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { GuardedRequest } from '../auth/dto/Locals.dto'
import { UsersService } from '../users/users.service'
import { PersonGender, PersonType } from './entities/person.entity'
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

    const persons = await this.personsService.getAllUser()

    const stuKey = '#,이름,학년,반,번호,기숙사명-번호,전화번호,성별'
    const etcKey = '#,이름,전화번호'

    const headers = '회원관리\n\n재학생,,,,,,,,,졸업생,,,,교사'
    const keys = `${stuKey},,${etcKey},,${etcKey}`

    const students = persons.filter((v) => v.type === PersonType.CURRENT_STUDENT)
    const graduates = persons.filter((v) => v.type === PersonType.GRADUATED_STUDENT)
    const teachers = persons.filter((v) => v.type === PersonType.TEACHER)

    const maxIndex = Math.max(students.length, graduates.length, teachers.length)
    const phoneFormat = (v: string): string =>
      v.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3')

    let values = ''
    for (let i = 0; i < maxIndex; i++) {
      const student = students[i]
      const graduate = graduates[i]
      const teacher = teachers[i]
      console.log(student, graduate, teacher, i, maxIndex)

      if (student !== undefined) {
        let studentGender = ''
        if (student.gender === PersonGender.FEMALE) {
          studentGender = '여'
        }

        if (student.gender === PersonGender.MALE) {
          studentGender = '남'
        }

        values += [
          student.id,
          student.name,
          student.grade,
          student.classroom,
          student.classNumber,
          student.dormitoryRoomNumber,
          phoneFormat(student.phone),
          studentGender
        ].join(',')
      } else values += ',,,,,,,'

      values += ',,'

      if (graduate !== undefined) {
        values += [
          graduate.id,
          graduate.name,
          phoneFormat(graduate.phone)
        ].join(',')
      } else values += ',,'

      values += ',,'

      if (teacher !== undefined) {
        values += [
          teacher.id,
          teacher.name,
          phoneFormat(teacher.phone)
        ].join(',')
      } else values += ',,'

      values += '\n'
    }

    return `${headers}\n${keys}\n${values}`
  }
}
