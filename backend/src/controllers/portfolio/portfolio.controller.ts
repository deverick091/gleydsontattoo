import { Request, Response } from 'express';
import { PortfolioService } from '../../services/portfolio/portfolio.service.js';
import { sendSuccess } from '../../helpers/response.js';

const service = new PortfolioService();

export class PortfolioController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
