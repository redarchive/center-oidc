import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import { PersonsService } from '../persons/persons.service'
import { CreatePhoneVerifyDto } from './dto/create-phone-verify.dto'
import { Client as AligoService } from 'aligo-smartsms'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'crypto'
import { SignPhoneVerifyDto } from './dto/sign-phone-verify.dto'
import { JwtService } from '@nestjs/jwt'
import { PersonType } from '../persons/entities/person.entity'

@Injectable()
export class PhoneVerifyService {
  private readonly aligoService: AligoService

  constructor (
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly personsService: PersonsService,
    private readonly jwtService: JwtService,
    configService: ConfigService
  ) {
    this.aligoService = new AligoService({
      key: configService.get<string>('ALIGO_KEY', ''),
      user_id: configService.get<string>('ALIGO_USER_ID', ''),
      sender: configService.get<string>('ALIGO_SENDER', '')
    })
  }

  public async create (createPhoneVerifyDto: CreatePhoneVerifyDto): Promise<{ id: number, login: string }> {
    const person = await this.personsService.findOneByPhone(
      PersonType[createPhoneVerifyDto.type],
      createPhoneVerifyDto.phone
    )

    if (person === null || person.user === undefined) {
      throw new BadRequestException('USER_NOT_FOUND')
    }

    const verifyKey = randomBytes(3).toString('hex').toUpperCase()

    await this.cacheService.set(`sign/${verifyKey}`, createPhoneVerifyDto.phone, 10 * 60)
    // await this.aligoService.sendMessages({
    //   msg: `[통합로그인]\n회원가입을 위한 휴대폰 인증 번호는 아래와 같습니다.\n\n"${verifyKey}" (5분 안에 입력)`,
    //   receiver: createPhoneVerifyDto.phone
    // })
    console.log('phone vk: %s=%s', createPhoneVerifyDto.phone, verifyKey)

    return {
      id: person.user?.id,
      login: person.user.login
    }
  }

  public async sign (signPhoneVerifyDto: SignPhoneVerifyDto): Promise<string> {
    const cache = await this.cacheService.get<string>(
      `sign/${signPhoneVerifyDto.code}`
    )
    if (cache === undefined) {
      throw new BadRequestException('CODE_INVALID')
    }

    if (cache !== signPhoneVerifyDto.phone) {
      throw new BadRequestException('PHONE_NUMBER_NOT_MATCH')
    }

    await this.cacheService.del(`sign/${signPhoneVerifyDto.code}`)

    const verifiedKey = this.jwtService.sign({
      phone: signPhoneVerifyDto.phone
    })

    return verifiedKey
  }

  public verify (verifiedKey: string, phone: string): boolean {
    try {
      const payload = this.jwtService.verify(verifiedKey)
      return phone === payload.phone
    } catch {
      return false
    }
  }
}
