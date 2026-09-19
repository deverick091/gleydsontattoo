import { Request, Response } from 'express';
import { SettingsService } from '../services/settings/settings.service.js';
import { sendSuccess } from '../helpers/response.js';

const service = new SettingsService();

export class SettingsController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
  async update(req: Request, res: Response) {
    try {
      const result = await service.update(req.body.settings);
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
