import { IsAscii, IsIn, IsString, Length } from 'class-validator'
import { PersonType } from '../../persons/entities/person.entity'

export class CreateSessionDto {
  @IsString()
  @Length(5, 30)
  @IsAscii()
  public readonly login: string

  @IsString()
  @Length(8, 30)
  @IsAscii()
  public readonly password: string

  @IsString()
  @IsIn(['CURRENT_STUDENT', 'GRADUATED_STUDENT', 'TEACHER'])
  public readonly type: keyof typeof PersonType
}
