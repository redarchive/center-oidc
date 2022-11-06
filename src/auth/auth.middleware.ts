import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request } from 'express'
import { AuthService } from './auth.service'
import { LocalsDto } from './dto/Locals.dto'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (private readonly authService: AuthService) {}

  public use (req: Request & LocalsDto, _: any, next: NextFunction): void {
    const { SESSION_TOKEN } = req.cookies

    if (SESSION_TOKEN !== undefined) {
      const session = this.authService.verify(SESSION_TOKEN)

      if (session !== null) {
        req.userId = session
      }
    }

    next()
  }
}
