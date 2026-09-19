import { Request, Response } from 'express';
import { ClientService } from '../../services/clients/client.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new ClientService();

export class ClientController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar cliente';
      res.status(400).json({ success: false, error: { message } });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const result = await service.getById(req.params.id);
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter cliente';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
