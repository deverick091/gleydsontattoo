import { Request, Response } from 'express';
import { BudgetService } from '../../services/budget/budget.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new BudgetService();

export class BudgetController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar orçamento';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
