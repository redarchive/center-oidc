import { Request } from "express"

export class LocalsDto {
  userId?: number
}

export type TypedRequest = Request & LocalsDto
