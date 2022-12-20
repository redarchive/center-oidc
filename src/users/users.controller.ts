import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
  NotFoundException,
  Param
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
    const me = await this.usersService.findOne(req.userId, { person: true })
    if (me === null) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return {
      success: true,
      data: { me }
    }
  }

  @Get(':id')
  public async findById (@Param('id') id: number, @Req() req: GuardedRequest): PResBody<{ user: User, me: boolean }> {
    const user = await this.usersService.findOne(id, { person: true })
    if (user === null) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return {
      success: true,
      data: {
        user,
        me: req.userId === user.id
      }
    }
  }

  @Patch('@me')
  @UseGuards(AuthGuard)
  public async updateMe (@Req() req: GuardedRequest, @Body() updateUserDto: UpdateUserDto): PResBody {
    await this.usersService.update(req.userId, updateUserDto)

    return {
      success: true
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
