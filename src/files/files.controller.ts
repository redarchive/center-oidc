import { FilesService } from './files.service'
import { AuthGuard } from '../auth/auth.guard'
import { PResBody } from '../common/ResponseBody'
import { CreateFileDto } from './dto/create-file.dto'
import { GuardedRequest } from '../auth/dto/Locals.dto'
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'

@Controller('files')
export class FilesController {
  constructor (private readonly filesService: FilesService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async create (@Req() req: GuardedRequest, @Body() createFileDto: CreateFileDto): PResBody<{ url: string }> {
    const url = await this.filesService.create(req.userId, createFileDto)

    return {
      success: true,
      data: {
        url
      }
    }
  }
}
