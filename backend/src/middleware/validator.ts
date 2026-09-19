import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../helpers/errors';

export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Dados inválidos', error.errors));
      } else {
        next(error);
      }
    }
  };
};
