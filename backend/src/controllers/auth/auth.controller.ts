import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { sendSuccess } from '../../helpers/response';

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const data = await service.login(req.body.email, req.body.password);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(401).json({ success: false, error: { message: e.message } });
    }
  }

  async me(req: any, res: Response) {
    try {
      const user = await service.me(req.user.id);
      return sendSuccess(res, user);
    } catch (e: any) {
      res.status(401).json({ success: false, error: { message: e.message } });
    }
  }
}
