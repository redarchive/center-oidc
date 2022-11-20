import { IsString } from 'class-validator'

export class CalcDiffDto {
  @IsString()
  public readonly data: string
}
