import { Request, Response } from 'express';
import { ClientService } from '../../services/clients/client.service.js';
import { sendSuccess, sendCreated } from '../../helpers/response.js';

const service = new ClientService();

export class ClientController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }

  async getById(req: Request, res: Response) {
    try {
      const result = await service.getById(req.params.id);
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
