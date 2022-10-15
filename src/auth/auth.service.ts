import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService
  ) {}

  public sign (userId: number) {
    const token = this.jwtService.sign({}, {
      audience: userId.toString()
    })

    return token
  }

  public verify (token: string, userId?: number) {
    try {
      const payload = this.jwtService.verify(token, {
        ...(userId ? { audience: userId.toString() } : {})
      }) as { aud: string }

      return parseInt(payload.aud)
    } catch {
      return false
    }
  }
}
