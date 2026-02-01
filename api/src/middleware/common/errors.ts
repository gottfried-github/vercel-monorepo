import type { NextFunction, Request, Response } from 'express'
import type { ErrorRequestHandler } from 'express-zod-safe'

import { AppError } from '../../common'

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.log('An error occured - err:', err)

  const { status, data, ...rest } = err

  res.status(status && status >= 500 ? status : 500).json({
    message: err.message || null,
    error: {
      data,
      ...rest,
    },
  })
}

export const zodDefaultErrorHandler: ErrorRequestHandler = (errors, req, res) => {
  console.log('zod error occured - errors', errors)

  res.status(400).json({
    message: 'validation failed',
    error: {
      errors,
    },
  })
}
