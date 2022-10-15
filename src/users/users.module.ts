import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { PersonsModule } from 'src/persons/persons.module'
import { PhoneVerifyModule } from 'src/phone-verify/phone-verify.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PersonsModule,
    PhoneVerifyModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
