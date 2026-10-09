import { Request, Response } from 'express';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new PortfolioService();

export class PortfolioController {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const data = await service.list(page, limit);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await service.findById(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, error: { message: 'Item não encontrado' } });
      }
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await service.create(req.body);
      return sendCreated(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await service.update(req.params.id, req.body);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      return sendSuccess(res, { message: 'Item removido com sucesso' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }
}
