import { Request, Response } from 'express';
import { ServiceService } from '../../services/services/service.service.js';
import { sendSuccess, sendCreated } from '../../helpers/response.js';

const service = new ServiceService();

export class ServiceController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
