import { Request, Response } from 'express';
import { AppointmentService } from '../../services/appointments/appointment.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../helpers/response';
import { AppointmentStatus } from '@prisma/client';

const service = new AppointmentService();

const parseDate    = (v?: unknown) => v && typeof v === 'string' ? new Date(`${v}T00:00:00.000Z`) : undefined;
const parseDateEnd = (v?: unknown) => v && typeof v === 'string' ? new Date(`${v}T23:59:59.999Z`) : undefined;

/**
 * Add minutes to a "HH:MM" string, returns "HH:MM".
 */
function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + (m || 0) + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * Normalize a raw Prisma appointment row into the shape the frontend expects:
 *   { date: "yyyy-MM-dd", startTime: "HH:MM", endTime: "HH:MM", client, service, ... }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAppointment(a: any) {
  const dateKey   = (a.date instanceof Date ? a.date : new Date(a.date)).toISOString().slice(0, 10);
  const startTime = a.time as string;
  const duration  = a.service?.duration ?? 60;
  const endTime   = addMinutes(startTime, duration);

  return {
    id:        a.id,
    date:      dateKey,
    startTime,
    endTime,
    status:    a.status,
    notes:     a.notes ?? null,
    clientName: a.clientName,
    clientPhone: a.clientPhone,
    client:    a.client ?? null,
    service:   a.service ?? null,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export class AppointmentController {
  async list(req: Request, res: Response) {
    try {
      const page  = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const filters = {
        status:         req.query.status as AppointmentStatus | undefined,
        date:           parseDate(req.query.date),
        dateFrom:       parseDate(req.query.startDate),
        dateTo:         parseDateEnd(req.query.endDate),
        professionalId: req.query.professionalId as string | undefined,
        query:          req.query.query as string | undefined,
      };
      const result = await service.list(filters, page, limit);
      return sendPaginated(res, result.data.map(mapAppointment), page, limit, result.total);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao obter agendamentos';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      return sendSuccess(res, mapAppointment(await service.getById(req.params.id)));
    } catch (error: unknown) {
      return res.status(404).json({ success: false, error: { message: error instanceof Error ? error.message : 'Agendamento não encontrado' } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = {
        ...req.body,
        time: req.body.time || req.body.startTime,
        date:   parseDate(req.body.date),
        client: { ...req.body.client, referenceImages: req.body.referenceImages },
      };
      return sendCreated(res, mapAppointment(await service.create(data)));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar agendamento';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      return sendSuccess(res, mapAppointment(await service.updateStatus(req.params.id, req.body.status)));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar agendamento';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async reschedule(req: Request, res: Response) {
    try {
      const result = await service.reschedule(req.params.id, parseDate(req.body.date)!, req.body.startTime ?? req.body.time);
      return sendSuccess(res, mapAppointment(result));
    } catch (error: unknown) {
      return res.status(400).json({ success: false, error: { message: error instanceof Error ? error.message : 'Erro ao reagendar' } });
    }
  }
}
