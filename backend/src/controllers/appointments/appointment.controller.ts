import { Request, Response } from 'express';
import { AppointmentService } from '../../services/appointments/appointment.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../helpers/response';
import { AppointmentStatus } from '@prisma/client';

const service = new AppointmentService();

const parseDate = (value?: unknown) => value && typeof value === 'string' ? new Date(`${value}T00:00:00.000Z`) : undefined;

export class AppointmentController {
  async list(req: Request, res: Response) {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const filters = {
        status: req.query.status as AppointmentStatus | undefined,
        date: parseDate(req.query.date),
        dateFrom: parseDate(req.query.startDate),
        dateTo: parseDate(req.query.endDate),
        professionalId: req.query.professionalId as string | undefined,
        query: req.query.query as string | undefined
      };
      const result = await service.list(filters, page, limit);
      return sendPaginated(res, result.data, page, limit, result.total);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter agendamentos';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async getById(req: Request, res: Response) {
    try { return sendSuccess(res, await service.getById(req.params.id)); }
    catch (error: unknown) { return res.status(404).json({ success: false, error: { message: error instanceof Error ? error.message : 'Agendamento não encontrado' } }); }
  }

  async create(req: Request, res: Response) {
    try {
      const data = { ...req.body, date: parseDate(req.body.date), client: { ...req.body.client, referenceImages: req.body.referenceImages } };
      return sendCreated(res, await service.create(data));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar agendamento';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const result = await service.updateStatus(req.params.id, req.body.status, req.body);
      return sendSuccess(res, result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar agendamento';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async reschedule(req: Request, res: Response) {
    try {
      const result = await service.reschedule(req.params.id, parseDate(req.body.date)!, req.body.startTime);
      return sendSuccess(res, result);
    } catch (error: unknown) {
      return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao reagendar' } });
    }
  }
}
