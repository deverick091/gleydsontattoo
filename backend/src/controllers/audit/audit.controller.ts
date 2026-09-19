import { Request, Response } from 'express';
import { AuditService } from '../../services/audit/audit.service.js';
import { sendSuccess } from '../../helpers/response.js';

const service = new AuditService();

export class AuditController {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await service.getAll(req.query, page, limit);
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
