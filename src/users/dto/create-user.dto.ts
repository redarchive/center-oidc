import { IsAscii, IsEmail, IsPhoneNumber, IsString, Length, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @Length(5, 30)
  @IsAscii()
  public readonly login: string

  @IsString()
  @Length(1, 30)
  public readonly nickname: string

  @IsString()
  @MaxLength(30)
  @IsEmail()
  public readonly email: string

  @IsString()
  @IsPhoneNumber('KR')
  @Length(11, 11)
  public readonly phone: string

  @IsString()
  @IsAscii()
  public readonly phoneVerify: string

  @IsString()
  @Length(10, 30)
  @IsAscii()
  public readonly password: string
}
