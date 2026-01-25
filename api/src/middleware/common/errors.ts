import type { NextFunction, Request, Response } from 'express'
import type { ErrorRequestHandler } from 'express-zod-safe'

import { AppError } from '../../common'

export const globalErrorHandler = (err: AppError, req: Request, res: Response) => {
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
  res.status(400).json({
    message: 'validation failed',
    error: {
      errors,
    },
  })
}
