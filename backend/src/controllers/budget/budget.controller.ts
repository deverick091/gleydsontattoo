import { Request, Response } from 'express';
import { BudgetService } from '../../services/budget/budget.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../helpers/response';

const service = new BudgetService();

export class BudgetController {
  async list(req: Request, res: Response) {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const result = await service.getAll(page, limit);
      return sendPaginated(res, result.data, page, limit, result.total);
    } catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao obter orçamentos' } }); }
  }
  async getById(req: Request, res: Response) {
    try { return sendSuccess(res, await service.getById(req.params.id)); }
    catch (error: unknown) { return res.status(404).json({ success: false, error: { message: error instanceof Error ? error.message : 'Orçamento não encontrado' } }); }
  }
  async create(req: Request, res: Response) {
    try { return sendCreated(res, await service.create(req.body)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao criar orçamento' } }); }
  }
  async respond(req: Request, res: Response) {
    try { return sendSuccess(res, await service.respond(req.params.id, req.body.response)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao responder orçamento' } }); }
  }
  async updateStatus(req: Request, res: Response) {
    try { return sendSuccess(res, await service.updateStatus(req.params.id, req.body.status)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao atualizar orçamento' } }); }
  }
  async convert(req: Request, res: Response) {
    try {
      const result = await service.convert(req.params.id, { ...req.body, date: new Date(`${req.body.date}T00:00:00.000Z`) });
      return sendSuccess(res, result);
    } catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao converter orçamento' } }); }
  }
}
