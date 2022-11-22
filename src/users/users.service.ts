import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'
import SHA3 from 'sha3'
import { PersonType } from '../persons/entities/person.entity'
import { PersonsService } from '../persons/persons.service'
import { PhoneVerifyService } from '../phone-verify/phone-verify.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly personsService: PersonsService,
    private readonly phoneVerifyService: PhoneVerifyService
  ) {}

  public async create (createUserDto: CreateUserDto): Promise<void> {
    const person = await this.personsService.findOneByPhone(
      PersonType[createUserDto.type],
      createUserDto.phone
    )

    const user = await this.users.findOneBy({ login: createUserDto.login })
    if (person === null) {
      throw new BadRequestException('USER_NOT_FOUND')
    }

    const verifed = this.phoneVerifyService.verify(
      createUserDto.phoneVerify,
      createUserDto.phone
    )

    if (!verifed) {
      throw new BadRequestException('VERIFY_INVALID')
    }

    if (user !== null) {
      throw new BadRequestException('USER_ALREADY_EXIST')
    }

    if (typeof person.userId === 'number') {
      throw new BadRequestException('USER_ALREADY_ASSOCIATED')
    }

    const salt = randomBytes(3).toString()
    const password = new SHA3(512)
      .update(createUserDto.password)
      .update(salt)
      .digest('hex')

    const { generatedMaps } = await this.users.insert({
      ...createUserDto,
      password,
      salt,
      person
    })

    await this.personsService.assignUser(person.id, generatedMaps[0].id)
  }

  // findAll() {
  //   return `This action returns all users`
  // }

  public async findOne (id: number, person = true): Promise<User | null> {
    return await this.users.findOne({
      where: { id },
      relations: { person }
    })
  }

  public async findOneByLogin (type: PersonType, login: string, hideSecure = true): Promise<User | null> {
    return await this.users.findOne({
      where: {
        login,
        person: {
          type
        }
      },
      select: !hideSecure
        ? {
            id: true,
            salt: true,
            password: true
          }
        : undefined
    })
  }

  public async updateUnknown (updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.users.findOne({
      where: {
        id: updateUserDto.id
      },
      relations: {
        person: true
      }
    })

    if (user === null) {
      throw new BadRequestException('USER_NOT_FOUND')
    }

    if (updateUserDto.phoneVerify === undefined) {
      throw new BadRequestException('PHONE_VERIFICATION_REQUIRED')
    }

    if (updateUserDto.newPassword === undefined) {
      throw new BadRequestException('NO_NEW_PASSWORD_SPECIFIED')
    }

    if (user.person === undefined) {
      throw new InternalServerErrorException('NOT_RELATIONATED')
    }

    const verifed = this.phoneVerifyService.verify(
      updateUserDto.phoneVerify,
      user.person.phone
    )

    if (!verifed) {
      throw new BadRequestException('VERIFY_INVALID')
    }

    const salt = randomBytes(3).toString()
    const password = new SHA3(512)
      .update(updateUserDto.newPassword)
      .update(salt)
      .digest('hex')

    await this.users.update(
      {
        id: updateUserDto.id
      },
      {
        password,
        salt
      }
    )
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`
  // }
}
