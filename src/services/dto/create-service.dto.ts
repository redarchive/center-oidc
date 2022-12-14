import { IsArray, IsIn, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { CreateClientDto } from '../../clients/dto/create-client.dto'
import { ServiceTypes } from '../entities/service.entity'

export class CreateServiceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  public readonly name: string

  @IsString()
  @MinLength(30)
  @MaxLength(65535)
  public readonly description: string

  @IsArray()
  public readonly clients: CreateClientDto[]

  @IsString()
  @IsUrl()
  public readonly logoUrl: string

  @IsString()
  @IsUrl()
  public readonly promotionImageUrl: string

  @IsString()
  @IsUrl()
  @IsOptional()
  public readonly serviceUrl?: string

  @IsString()
  @IsUrl()
  @IsOptional()
  public readonly sourceUrl?: string

  @IsArray()
  @IsString({ each: true })
  public readonly screenshots: string[]

  @IsArray()
  @IsString({ each: true })
  public readonly tags: string[]

  @IsIn([
    'WEBSITE',
    'DESKTOP',
    'MOBILE',
    'GAME',
    'PHYSICAL'
  ])
  @IsString()
  public readonly type: keyof typeof ServiceTypes
}
