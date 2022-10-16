import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LocalsDto } from './dto/Locals.dto'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (
    private readonly authService: AuthService
  ) {}

  public use (req: Request & LocalsDto, _: any, next: () => void) {
    const { SESSION_TOKEN } = req.cookies

    if (SESSION_TOKEN) {
      const session = this.authService.verify(SESSION_TOKEN)

      if (!!session) {
        req.userId = session
      }
    }

    next()
  }
}
