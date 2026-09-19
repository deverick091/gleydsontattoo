import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AuthService } from '../../services/auth/auth.service';
import { sendSuccess } from '../../helpers/response';

const service = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response) {
    try {
      const data = await service.login(req.body.email, req.body.password);
      return sendSuccess(res, data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      res.status(401).json({ success: false, error: { message } });
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
