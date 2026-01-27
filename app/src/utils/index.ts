export class BadResponseError extends Error {
  public error: boolean

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)

    this.error = true
  }
}
