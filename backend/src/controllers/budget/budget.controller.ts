import { Request, Response } from 'express';
import { BudgetService } from '../../services/budget/budget.service';
import { sendSuccess, sendCreated } from '../../helpers/response';
import { BudgetStatus } from '@prisma/client';

const service = new BudgetService();

export class BudgetController {
  async list(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const data = await service.list(status as BudgetStatus);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await service.findById(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, error: { message: 'Orçamento não encontrado' } });
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

  async respond(req: Request, res: Response) {
    try {
      const data = await service.respond(req.params.id, req.body);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const data = await service.updateStatus(req.params.id, req.body.status as BudgetStatus);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }

  async convert(req: Request, res: Response) {
    try {
      const data = await service.convert(req.params.id);
      return sendSuccess(res, data);
    } catch (e: any) {
      res.status(500).json({ success: false, error: { message: e.message } });
    }
  }
}
