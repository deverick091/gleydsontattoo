import { Request, Response } from 'express';
import { UserService } from '../../services/users/user.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new UserService();

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter utilizadores';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
