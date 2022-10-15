import { IsHexadecimal, IsPhoneNumber, IsString, IsUppercase, Length } from "class-validator";

export class SignPhoneVerifyDto {
  @IsString()
  @IsPhoneNumber('KR')
  @Length(11, 11)
  public readonly phone: string

  @IsString()
  @IsHexadecimal()
  @Length(6, 6)
  @IsUppercase()
  public readonly code: string
}
