import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from '../../services/auth/auth.service';
import { sendSuccess } from '../../helpers/response';
import { UnauthorizedError } from '../../helpers/errors';

const service = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await service.login(req.body.email, req.body.password);
      return sendSuccess(res, data);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ success: false, error: { message: error.message } });
      }
      return next(error);
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      const user = await service.me(req.user?.id || '');
      return sendSuccess(res, user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter utilizador';
      res.status(401).json({ success: false, error: { message } });
    }
  }
}
