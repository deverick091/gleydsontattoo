import { Request, Response } from 'express';
import { AppointmentService } from '../../services/appointments/appointment.service.js';
import { sendSuccess, sendCreated } from '../../helpers/response.js';

const service = new AppointmentService();

export class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      return sendCreated(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const result = await service.updateStatus(req.params.id, req.body.status, req.body);
      return sendSuccess(res, result);
    } catch (e: any) { res.status(400).json({ success: false, error: { message: e.message } }); }
  }
}
