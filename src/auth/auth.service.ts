import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor (private readonly jwtService: JwtService) {}

  public sign (userId: number): string {
    const token = this.jwtService.sign(
      {},
      {
        audience: userId.toString()
      }
    )

    return token
  }

  public verify (token: string, userId?: number): number | null {
    try {
      const payload = this.jwtService.verify(token, {
        ...(userId !== undefined ? { audience: userId.toString() } : {})
      })

      return parseInt(payload.aud)
    } catch {
      return null
    }
  }
}
