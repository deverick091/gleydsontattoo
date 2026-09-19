import { Request, Response } from 'express';
import { ServiceService } from '../../services/services/service.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new ServiceService();

export class ServiceController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter serviços';
      res.status(400).json({ success: false, error: { message } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar serviço';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
