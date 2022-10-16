import { IsAscii, IsString, Length } from "class-validator"

export class CreateSessionDto {
  @IsString()
  @Length(5, 30)
  @IsAscii()
  public readonly login: string

  @IsString()
  @Length(10, 30)
  @IsAscii()
  public readonly password: string
}
