import { Request, Response } from 'express';
import { AppointmentService } from '../../services/appointments/appointment.service';
import { sendSuccess, sendCreated } from '../../helpers/response';

const service = new AppointmentService();

export class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar agendamento';
      res.status(400).json({ success: false, error: { message } });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const result = await service.updateStatus(req.params.id, req.body.status, req.body);
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar agendamento';
      res.status(400).json({ success: false, error: { message } });
    }
  }
}
