import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { CreateTokenDto } from './dto/create-token.dto'
import { PResBody } from '../common/ResponseBody'
import { AuthGuard } from '../auth/auth.guard'
import { GuardedRequest } from '../auth/dto/Locals.dto'

@Controller('tokens')
export class TokensController {
  constructor (private readonly tokensService: TokensService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async create (@Req() req: GuardedRequest, @Body() createTokenDto: CreateTokenDto): PResBody<{ token: string }> {
    const iss = `https://${req.headers.host ?? ''}`
    const token = await this.tokensService.create(req.userId, createTokenDto, iss)

    return {
      success: true,
      data: { token }
    }
  }
}
