import { Request, Response } from 'express';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { sendSuccess } from '../../helpers/response';

const service = new PortfolioService();

export class PortfolioController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter portfólio';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
