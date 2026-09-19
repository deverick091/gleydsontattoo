import { Request, Response } from 'express';
import { BudgetService } from '../../services/budget/budget.service.js';
import { sendSuccess, sendCreated } from '../../helpers/response.js';

const service = new BudgetService();

export class BudgetController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
