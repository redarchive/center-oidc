import { Controller, Post, Body, Put } from '@nestjs/common'
import { PhoneVerifyService } from './phone-verify.service'
import { CreatePhoneVerifyDto } from './dto/create-phone-verify.dto'
import { SignPhoneVerifyDto } from './dto/sign-phone-verify.dto'
import { PResBody } from '../common/ResponseBody'

@Controller('phone-verify')
export class PhoneVerifyController {
  constructor (private readonly phoneVerifyService: PhoneVerifyService) {}

  @Post()
  public async create (@Body() createPhoneVerifyDto: CreatePhoneVerifyDto): PResBody<{ id: number, login: string }> {
    const { id, login } = await this.phoneVerifyService.create(createPhoneVerifyDto)

    return {
      success: true,
      data: {
        id,
        login
      }
    }
  }

  @Put()
  public async sign (@Body() verifyPhoneVerifyDto: SignPhoneVerifyDto): PResBody<{ signedKey: string }> {
    const signedKey = await this.phoneVerifyService.sign(verifyPhoneVerifyDto)

    return {
      success: true,
      data: {
        signedKey
      }
    }
  }
}
