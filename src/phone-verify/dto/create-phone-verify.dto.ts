import { IsPhoneNumber, IsString, Length } from "class-validator";

export class CreatePhoneVerifyDto {
  @IsString()
  @Length(11, 11)
  @IsPhoneNumber('KR')
  public readonly phone: string
}
