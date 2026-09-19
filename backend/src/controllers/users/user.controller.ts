import { Request, Response } from 'express';
import { UserService } from '../services/users/user.service.js';
import { sendSuccess, sendCreated } from '../helpers/response.js';

const service = new UserService();

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
