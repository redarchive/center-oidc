import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
  NotFoundException
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { GuardedRequest } from '../auth/dto/Locals.dto'
import { AuthGuard } from '../auth/auth.guard'
import { PResBody } from '../common/ResponseBody'
import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  async create (@Body() createUserDto: CreateUserDto): PResBody {
    await this.usersService.create(createUserDto)

    return {
      success: true
    }
  }

  @Get('@me')
  @UseGuards(AuthGuard)
  public async findMe (@Req() req: GuardedRequest): PResBody<{ me: User }> {
    const me = await this.usersService.findOne(req.userId, true)
    if (me === null) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return {
      success: true,
      data: { me }
    }
  }

  @Patch('@unknown')
  public async updateUnknown (@Body() updateUserDto: UpdateUserDto): PResBody {
    await this.usersService.updateUnknown(updateUserDto)

    return {
      success: true
    }
  }
}
