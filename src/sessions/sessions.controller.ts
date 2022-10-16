import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Response } from 'express';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  public async create(@Body() createSessionDto: CreateSessionDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.sessionsService.create(createSessionDto)

    res.cookie('SESSION_TOKEN', token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
      secure: true
    })

    return {
      success: true
    }
  }

  @Delete('@this')
  public remove (@Res({ passthrough: true }) res: Response) {
    res.clearCookie('SESSION_TOKEN')

    return {
      success: true
    }
  }
}
