import { IsAscii, IsEmail, IsIn, IsOptional, IsPhoneNumber, IsString, Length, MaxLength } from 'class-validator'
import { PersonType } from 'src/persons/entities/person.entity'

export class CreateUserDto {
  @IsString()
  @Length(5, 30)
  @IsAscii()
  public readonly login: string

  @IsString()
  @Length(2, 30)
  @IsOptional()
  public readonly nickname?: string

  @IsString()
  @MaxLength(30)
  @IsEmail()
  @IsOptional()
  public readonly email?: string

  @IsString()
  @IsPhoneNumber('KR')
  @Length(11, 11)
  public readonly phone: string

  @IsString()
  @IsAscii()
  public readonly phoneVerify: string

  @IsString()
  @Length(8, 30)
  @IsAscii()
  public readonly password: string

  @IsString()
  @IsIn([
    'CURRENT_STUDENT',
    'GRADUATED_STUDENT',
    'TEACHER'
  ])
  public readonly type: keyof typeof PersonType
}
