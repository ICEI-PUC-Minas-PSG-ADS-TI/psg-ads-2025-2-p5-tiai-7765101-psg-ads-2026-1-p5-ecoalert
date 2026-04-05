import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/types/error'

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
      status: error.status,
      code: error.code,
      fields: error.fields ?? null
    })
  }

  return res.status(500).json({
    message: 'Internal server error',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    fields: null
  })
}