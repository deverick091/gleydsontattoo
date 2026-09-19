import { Request, Response } from 'express';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { sendSuccess } from '../../helpers/response';

const service = new ScheduleService();

export class ScheduleController {
  async getAvailableSlots(req: Request, res: Response) {
    try {
      const result = await service.getAvailableSlots(
        req.query.professionalId as string,
        req.query.date as string
      );
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter horários disponíveis';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
