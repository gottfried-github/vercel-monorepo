import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from '../../generated/prisma/internal/prismaNamespace'

export class AppError extends Error {
  public status?: number
  public data?: unknown

  constructor(status?: number, message?: string, data?: unknown, options?: ErrorOptions) {
    super(message, options)

    if (status) this.status = status
    if (data) this.data = data
  }
}

// https://www.prisma.io/docs/orm/reference/error-reference
// there's no common superclass
export const isPrismaError = (e: unknown) => {
  return (
    e instanceof PrismaClientKnownRequestError ||
    e instanceof PrismaClientUnknownRequestError ||
    e instanceof PrismaClientRustPanicError ||
    e instanceof PrismaClientInitializationError ||
    e instanceof PrismaClientValidationError
  )
}
