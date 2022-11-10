import { IsIn, IsString, IsUUID } from 'class-validator'
import { ScopeTypes } from '../../clients/entities/scope.entity'

export class CreateTokenDto {
  @IsIn([
    'OPENID',
    'REAL_NAME',
    'EMAIL',
    'PHONE_NUMBER',
    'GENDER',
    'CLASS_INFO',
    'DORMITORY'
  ], { each: true })
  @IsString({ each: true })
  public readonly scopes: Array<keyof typeof ScopeTypes>

  @IsString()
  public readonly nonce: string

  @IsString()
  @IsUUID()
  public readonly clientId: string
}
