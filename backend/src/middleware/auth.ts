import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { supabase } from '../config/supabase';
import { UserRepository } from '../repositories/users/user.repository';
import { UnauthorizedError } from '../helpers/errors';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const userRepository = new UserRepository();

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token não fornecido'));
  }

  const token = authHeader.split(' ')[1];
  try {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role: string };
      req.user = decoded;
      return next();
    } catch {
      // Tokens issued by Supabase are used for new logins.
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) throw new UnauthorizedError('Token inválido ou expirado');

    const profile = await userRepository.findByEmail(user.email.trim().toLowerCase());
    if (!profile || !profile.isActive) throw new UnauthorizedError('Usuário sem perfil ativo no sistema');

    req.user = { id: profile.id, email: profile.email, role: profile.role };
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError('Token inválido ou expirado'));
  }
};
