import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Person, PersonGender, PersonType } from './entities/person.entity'

@Injectable()
export class PersonsService {
  constructor (
    @InjectRepository(Person)
    private readonly persons: Repository<Person>
  ) {}

  public async findOneByPhone (
    type: PersonType,
    phone: string
  ): Promise<Person | null> {
    return await this.persons.findOne({
      relations: {
        user: true
      },
      where: {
        phone,
        type
      }
    })
  }

  public async assignUser (id: number, userId: number): Promise<void> {
    await this.persons.update({ id }, { userId })
  }

  public async getAllUser (): Promise<Person[]> {
    return await this.persons.find()
  }

  public async exportAllUser (): Promise<string> {
    const persons = await this.getAllUser()

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
