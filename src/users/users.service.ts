import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'
import SHA3 from 'sha3'
import { AuthService } from 'src/auth/auth.service'
import { PersonsService } from 'src/persons/persons.service'
import { PhoneVerifyService } from 'src/phone-verify/phone-verify.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly authService: AuthService,
    private readonly personsService: PersonsService,
    private readonly phoneVerifyService: PhoneVerifyService
  ){}

  public async create(createUserDto: CreateUserDto) {
    const person = await this.personsService.findOneByPhone(createUserDto.phone)
    if (!person) {
      throw new BadRequestException('USER_NOT_FOUND')
    }

    const verifed = this.phoneVerifyService.verify(createUserDto.phoneVerify, createUserDto.phone)
    if (!verifed) {
      throw new BadRequestException('VERIFY_INVALID')
    }

    if (typeof person.userId === 'number') {
      throw new BadRequestException('USER_ALREADY_EXIST')
    }

    const salt = randomBytes(3).toString()
    const password =
      new SHA3(512)
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

  public async login (loginUserDto: LoginUserDto) {
    const user = await this.users.findOneBy({ login: loginUserDto.login })
    if (!user) {
      throw new BadRequestException('ID_OR_PASSWORD_INVALID')
    }

    const password =
      new SHA3(512)
        .update(loginUserDto.password)
        .update(user.salt)
        .digest('hex')

    if (password !== user.password) {
      throw new BadRequestException('ID_OR_PASSWORD_INVALID')
    }

    return this.authService.sign(user.id)
  }

  // findAll() {
  //   return `This action returns all users`
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`
  // }
}
