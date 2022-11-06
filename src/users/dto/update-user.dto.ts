import {
  IsAscii,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength
} from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @Length(5, 30)
  @IsAscii()
  public readonly login: string

  @IsString()
  @IsAscii()
  @IsOptional()
  public readonly phoneVerify?: string

  @IsString()
  @Length(1, 30)
  @IsOptional()
  public readonly nickname?: string

  @IsString()
  @MaxLength(30)
  @IsEmail()
  @IsOptional()
  public readonly email?: string

  @IsString()
  @Length(10, 30)
  @IsAscii()
  @IsOptional()
  public readonly oldPassword?: string

  @IsString()
  @Length(10, 30)
  @IsAscii()
  @IsOptional()
  public readonly newPassword?: string
}
