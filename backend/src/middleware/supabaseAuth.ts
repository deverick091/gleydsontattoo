import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
import { UnauthorizedError } from '../helpers/errors.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    aud: string;
    role?: string;
  };
}

export const verifySupabaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('Token não fornecido');
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError('Token inválido ou expirado');
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      aud: user.aud,
      role: user.user_metadata?.role,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(401).json({ error: 'Falha na autenticação' });
  }
};
