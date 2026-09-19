import { Request, Response } from 'express';
import { NotificationService } from '../services/notification/notification.service.js';
import { sendSuccess } from '../helpers/response.js';

const service = new NotificationService();

export class NotificationController {
  async getPending(req: Request, res: Response) {
    try {
      const result = await service.getPending();
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
