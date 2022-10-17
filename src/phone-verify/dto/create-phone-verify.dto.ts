import { IsIn, IsPhoneNumber, IsString, Length } from "class-validator";
import { PersonType } from "src/persons/entities/person.entity";

export class CreatePhoneVerifyDto {
  @IsString()
  @Length(11, 11)
  @IsPhoneNumber('KR')
  public readonly phone: string

  @IsString()
  @IsIn([
    'CURRENT_STUDENT',
    'GRADUATED_STUDENT',
    'TEACHER'
  ])
  public readonly type: keyof typeof PersonType
}
