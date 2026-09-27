import { Request, Response } from 'express';
import { ClientService } from '../../services/clients/client.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../helpers/response';

const service = new ClientService();

export class ClientController {
  async list(req: Request, res: Response) {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const result = req.query.query
        ? await service.search(String(req.query.query), page, limit)
        : await service.list(page, limit);
      return sendPaginated(res, result.data, page, limit, result.total);
    } catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao obter clientes' } }); }
  }
  async create(req: Request, res: Response) {
    try { return sendCreated(res, await service.create(req.body)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao criar cliente' } }); }
  }
  async getById(req: Request, res: Response) {
    try { return sendSuccess(res, await service.getById(req.params.id)); }
    catch (error: unknown) { return res.status(404).json({ success: false, error: { message: error instanceof Error ? error.message : 'Cliente não encontrado' } }); }
  }
  async update(req: Request, res: Response) {
    try { return sendSuccess(res, await service.update(req.params.id, req.body)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao atualizar cliente' } }); }
  }
}
