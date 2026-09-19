import { Request, Response } from 'express';
import { AuditService } from '../../services/audit/audit.service';
import { sendSuccess } from '../../helpers/response';

const service = new AuditService();

export class AuditController {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await service.getAll(req.query as Record<string, any>, page, limit);
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter logs de auditoria';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
