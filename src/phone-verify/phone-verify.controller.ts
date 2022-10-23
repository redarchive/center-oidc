import { Controller, Post, Body, Put } from '@nestjs/common';
import { PhoneVerifyService } from './phone-verify.service';
import { CreatePhoneVerifyDto } from './dto/create-phone-verify.dto';
import { SignPhoneVerifyDto } from './dto/sign-phone-verify.dto';

@Controller('phone-verify')
export class PhoneVerifyController {
  constructor(
    private readonly phoneVerifyService: PhoneVerifyService
  ) {}

  @Post()
  async create(@Body() createPhoneVerifyDto: CreatePhoneVerifyDto) {
    const login = await this.phoneVerifyService.create(createPhoneVerifyDto);

    return {
      success: true,
      data: {
        login
      }
    }
  }

  @Put()
  async sign(@Body() verifyPhoneVerifyDto: SignPhoneVerifyDto) {
    const signedKey = await this.phoneVerifyService.sign(verifyPhoneVerifyDto)

    return {
      success: true,
      data: {
        signedKey
      }
    }
  }
}
