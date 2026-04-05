export interface ErrorFields {
  [key: string]: string
}

export class AppError extends Error {

  public status: number
  public code: string
  public fields?: ErrorFields

  constructor(
    message: string,
    status: number,
    code: string,
    fields?: ErrorFields
  ) {
    super(message)

    this.status = status
    this.code = code
    this.fields = fields
  }

}