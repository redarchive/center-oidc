import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, CACHE_MANAGER } from '@nestjs/common';
import { PhoneVerifyService } from './phone-verify.service';
import { CreatePhoneVerifyDto } from './dto/create-phone-verify.dto';
import { Cache } from 'cache-manager';

@Controller('phone-verify')
export class PhoneVerifyController {
  constructor(
    private readonly phoneVerifyService: PhoneVerifyService
  ) {}

  @Post()
  create(@Body() createPhoneVerifyDto: CreatePhoneVerifyDto) {
    return this.phoneVerifyService.create(createPhoneVerifyDto);
  }

  @Get()
  findAll() {
    return this.phoneVerifyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phoneVerifyService.findOne(+id);
  }
}
