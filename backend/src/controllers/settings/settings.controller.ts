import { Request, Response } from 'express';
import { SettingsService } from '../../services/settings/settings.service';
import { sendSuccess } from '../../helpers/response';

const service = new SettingsService();

export class SettingsController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll();
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter configurações';
      res.status(400).json({ success: false, error: { message } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const result = await service.update(req.body.settings);
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar configurações';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
