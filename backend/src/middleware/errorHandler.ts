import { Request, Response, NextFunction } from 'express';
import { AppError } from '../helpers/errors';
import { sendError } from '../helpers/response';
import { env } from '../config/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  if (env.NODE_ENV === 'development') {
    console.error('Unhandled Error:', err);
  }

  return sendError(res, 500, 'INTERNAL_ERROR', 'Erro interno no servidor');
};
