import { IsArray } from 'class-validator'

export class ApplyDiffDto {
  @IsArray()
  @IsArray({ each: true })
  public readonly newStudent: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly newGraduated: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly newTeacher: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly studentToGraduated: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly studentToTeacher: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly graduatedToStudent: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly graduatedToTeacher: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly teacherToStudent: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly teacherToGraduated: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly willModifyStudent: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly willModifyGraduated: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly willModifyTeacher: string[][]

  @IsArray()
  @IsArray({ each: true })
  public readonly willDelete: string[][]
}
