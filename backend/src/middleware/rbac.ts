import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { ForbiddenError, UnauthorizedError } from '../helpers/errors.js';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuário não autenticado'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Acesso negado para este perfil'));
    }
    next();
  };
};
