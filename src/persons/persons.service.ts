import { BadRequestException, Injectable } from '@nestjs/common'
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

  public async getAllPerson (): Promise<Person[]> {
    return await this.persons.find()
  }

  public async exportAll (): Promise<string> {
    const persons = await this.getAllPerson()

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

  public async calcImportData (data: string): Promise<{ [key: string]: string[][] }> {
    const persons = await this.getAllPerson()
    const rowsWithoutHeader = data.split('\n').slice(4)

    const newStudent: string[][] = []
    const newGraduated: string[][] = []
    const newTeacher: string[][] = []

    const parsePhone = (v: string): string => v.replace(/-/g, '')

    for (const row of rowsWithoutHeader) {
      const columns = row.split(',')
      const studentColumns = columns.slice(0, 8)
      const graduateColumns = columns.slice(9, 12)
      const teacherColumns = columns.slice(13, 16)

      if (Number.isNaN(parseInt(studentColumns[0]))) {
        if (studentColumns[1] !== undefined && studentColumns[1].length > 0) {
          if (studentColumns[6] === undefined || parsePhone(studentColumns[6]).length !== 11) {
            throw new BadRequestException('PHONE_NUMBER_INVALID_ON_#' + studentColumns[1])
          }

          newStudent.push(studentColumns)
        }
      }

      if (Number.isNaN(parseInt(graduateColumns[0]))) {
        if (graduateColumns[1] !== undefined && graduateColumns[1].length > 0) {
          if (graduateColumns[6] === undefined || parsePhone(graduateColumns[6]).length !== 11) {
            throw new BadRequestException('PHONE_NUMBER_INVALID_ON_#' + graduateColumns[1])
          }

          newGraduated.push(graduateColumns)
        }
      }

      if (Number.isNaN(parseInt(teacherColumns[0]))) {
        if (teacherColumns[1] !== undefined && teacherColumns[1].length > 0) {
          if (teacherColumns[6] === undefined || parsePhone(teacherColumns[6]).length !== 11) {
            throw new BadRequestException('PHONE_NUMBER_INVALID_ON_#' + teacherColumns[1])
          }

          newTeacher.push(teacherColumns)
        }
      }
    }

    const studentToGraduated: string[][] = []
    const studentToTeacher: string[][] = []

    const graduatedToStudent: string[][] = []
    const graduatedToTeacher: string[][] = []

    const teacherToStudent: string[][] = []
    const teacherToGraduated: string[][] = []

    const willModifyStudent: string[][] = []
    const willModifyGraduated: string[][] = []
    const willModifyTeacher: string[][] = []

    const willDelete: string[][] = []

    for (const person of persons) {
      const findRows =
        rowsWithoutHeader
          .map((v) => v.split(','))
          .filter((v) =>
            parseInt(v[0]) === person.id ||
            parseInt(v[9]) === person.id ||
            parseInt(v[13]) === person.id)

      if (findRows.length < 1) {
        willDelete.push([person.id.toString()])
        continue
      }

      for (const findRow of findRows) {
        if (parseInt(findRow[0]) === person.id) {
          if (person.type === PersonType.CURRENT_STUDENT) {
            let studentGender = ''
            if (person.gender === PersonGender.FEMALE) {
              studentGender = '여'
            }

            if (person.gender === PersonGender.MALE) {
              studentGender = '남'
            }

            const isModified =
              parseInt(findRow[0]) !== person.id ||
              findRow[1] !== person.name ||
              !Object.is(parseInt(findRow[2]), person.grade ?? NaN) ||
              !Object.is(parseInt(findRow[3]), person.classroom ?? NaN) ||
              !Object.is(parseInt(findRow[4]), person.classNumber ?? NaN) ||
              findRow[5] !== (person.dormitoryRoomNumber ?? '') ||
              findRow[6].replace(/-/g, '') !== person.phone ||
              findRow[7] !== studentGender

            console.log(parseInt(findRow[2]), person.gender ?? NaN)

            if (isModified) {
              willModifyStudent.push(findRow.slice(0, 8))
            }
          }

          if (person.type === PersonType.GRADUATED_STUDENT) {
            graduatedToStudent.push(findRow.slice(0, 8))
          }

          if (person.type === PersonType.TEACHER) {
            teacherToStudent.push(findRow.slice(0, 8))
          }
        }

        if (parseInt(findRow[9]) === person.id) {
          if (person.type === PersonType.CURRENT_STUDENT) {
            studentToGraduated.push(findRow.slice(9, 12))
          }

          if (person.type === PersonType.GRADUATED_STUDENT) {
            const isModified =
              parseInt(findRow[9]) !== person.id ||
              findRow[10] !== person.name ||
              findRow[11].replace(/-/g, '') !== person.phone

            if (isModified) {
              willModifyGraduated.push(findRow.slice(9, 12))
            }
          }

          if (person.type === PersonType.TEACHER) {
            teacherToGraduated.push(findRow.slice(9, 12))
          }
        }

        if (parseInt(findRow[13]) === person.id) {
          if (person.type === PersonType.CURRENT_STUDENT) {
            studentToTeacher.push(findRow.slice(13, 16))
          }

          if (person.type === PersonType.GRADUATED_STUDENT) {
            graduatedToTeacher.push(findRow.slice(13, 16))
          }

          if (person.type === PersonType.TEACHER) {
            const isModified =
              parseInt(findRow[13]) !== person.id ||
              findRow[14] !== person.name ||
              findRow[15].replace(/-/g, '') !== person.phone

            if (isModified) {
              willModifyTeacher.push(findRow.slice(13, 16))
            }
          }
        }
      }
    }

    return {
      newStudent,
      newGraduated,
      newTeacher,
      studentToGraduated,
      studentToTeacher,
      graduatedToStudent,
      graduatedToTeacher,
      teacherToStudent,
      teacherToGraduated,
      willModifyStudent,
      willModifyGraduated,
      willModifyTeacher,
      willDelete
    }
  }
}
