import { Request, Response } from 'express';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new PortfolioService();

export class PortfolioController {
  async getAll(req: Request, res: Response) {
    try { return sendSuccess(res, await service.getAll(req.query.categoryId as string | undefined)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao obter portfólio' } }); }
  }
  async getById(req: Request, res: Response) {
    try { return sendSuccess(res, await service.getById(req.params.id)); }
    catch (error: unknown) { return res.status(404).json({ success: false, error: { message: error instanceof Error ? error.message : 'Item não encontrado' } }); }
  }
  async create(req: Request, res: Response) {
    try { return sendCreated(res, await service.create(req.body)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao criar item' } }); }
  }
  async update(req: Request, res: Response) {
    try { return sendSuccess(res, await service.update(req.params.id, req.body)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao atualizar item' } }); }
  }
  async delete(req: Request, res: Response) {
    try { return sendSuccess(res, await service.delete(req.params.id)); }
    catch (error: unknown) { return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao excluir item' } }); }
  }
}
