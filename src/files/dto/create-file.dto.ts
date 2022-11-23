import { IsIn, IsString } from 'class-validator'

export enum FileType {
  USER_PROFILE_IMAGE = 0,
  SERVICE_SCREENSHOT,
  SERVICE_LOGO,
  SERVICE_PROMOTION_IMAGE,
  SERVICE_DISTRO_FILE
}

export class CreateFileDto {
  @IsString()
  public readonly name: string

  @IsString()
  @IsIn([
    'USER_PROFILE_IMAGE',
    'SERVICE_SCREENSHOT',
    'SERVICE_LOGO',
    'SERVICE_PROMOTION_IMAGE',
    'SERVICE_DISTRO_FILE'
  ])
  public readonly type: keyof typeof FileType
}
