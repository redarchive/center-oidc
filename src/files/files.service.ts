import { Injectable } from '@nestjs/common'
import { CreateFileDto } from './dto/create-file.dto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FilesService {
  private readonly s3: S3Client
  private readonly BUCKET_NAME: string

  constructor (
    configService: ConfigService
  ) {
    this.s3 = new S3Client({})
    this.BUCKET_NAME = configService.get<string>('BUCKET_NAME', 'center-usercontents')
  }

  public async create (userId: number, createFileDto: CreateFileDto): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${createFileDto.type}/${userId}/${createFileDto.name.replace(/\//g, '')}`
    })

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 3600
    })

    return signedUrl
  }
}
