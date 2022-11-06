import {
  IsArray,
  IsIn,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator'
import { ScopeTypes } from '../entities/scope.entity'
import { Type } from 'class-transformer'

export class CreateClientDto {
  @IsString()
  @Length(2, 30)
  public readonly name: string

  @IsString({ each: true })
  @MaxLength(100, { each: true })
  public readonly redirectUrls: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScopeDto)
  public readonly scopes: CreateScopeDto[]
}

export class CreateScopeDto {
  @IsIn([
    'IDENTITY',
    'REAL_NAME',
    'EMAIL',
    'PHONE_NUMBER',
    'GENDER',
    'CLASS_INFO',
    'DORMITORY'
  ])
  @IsString()
  public readonly type: keyof typeof ScopeTypes

  @IsString()
  @MinLength(10)
  @MaxLength(100)
  public readonly reason: string
}
