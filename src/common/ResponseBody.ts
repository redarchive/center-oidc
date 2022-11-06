export interface ResponseSuccessBody<T> {
  success: true
  data?: T
}

export interface ResponseFailedBody {
  success: false
  message: string
}

export type ResposeBody<T extends object = {}>
  = ResponseSuccessBody<T> | ResponseFailedBody

export type ResBody<T extends object = {}>
  = ResposeBody<T>

export type PResBody<T extends object = {}>
  = Promise<ResposeBody<T>>
