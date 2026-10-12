import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../helpers/response';

// Dias padrão: Segunda a Sábado aberto (1 a 6), Domingo fechado (0)
const DEFAULT_BUSINESS_HOURS = {
  openDays: [1, 2, 3, 4, 5, 6], // 0: Dom, 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex, 6: Sáb
  closedDates: [] as string[], // Ex: ["2026-12-25", "2027-01-01"]
  workStartHour: 9,
  workEndHour: 19,
  slotDurationMinutes: 60,
};

export class SettingsController {
  async getBusinessHours(req: Request, res: Response) {
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: 'business_hours' },
      });

      if (!setting) {
        return sendSuccess(res, DEFAULT_BUSINESS_HOURS);
      }

      const parsed = JSON.parse(setting.value);
      return sendSuccess(res, { ...DEFAULT_BUSINESS_HOURS, ...parsed });
    } catch (error: unknown) {
      console.error('Erro ao buscar business_hours:', error);
      return sendSuccess(res, DEFAULT_BUSINESS_HOURS);
    }
  }

  async updateBusinessHours(req: Request, res: Response) {
    try {
      const { openDays, closedDates, workStartHour, workEndHour, slotDurationMinutes } = req.body;

      const payload = {
        openDays: Array.isArray(openDays) ? openDays : DEFAULT_BUSINESS_HOURS.openDays,
        closedDates: Array.isArray(closedDates) ? closedDates : [],
        workStartHour: Number(workStartHour) || DEFAULT_BUSINESS_HOURS.workStartHour,
        workEndHour: Number(workEndHour) || DEFAULT_BUSINESS_HOURS.workEndHour,
        slotDurationMinutes: Number(slotDurationMinutes) || DEFAULT_BUSINESS_HOURS.slotDurationMinutes,
      };

      const setting = await prisma.setting.upsert({
        where: { key: 'business_hours' },
        create: {
          key: 'business_hours',
          value: JSON.stringify(payload),
        },
        update: {
          value: JSON.stringify(payload),
        },
      });

      return sendSuccess(res, JSON.parse(setting.value));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar horários e dias de funcionamento';
      return res.status(400).json({ success: false, error: { message } });
    }
  }

  async getStudioInfo(req: Request, res: Response) {
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: 'studio_info' },
      });

      const defaultInfo = {
        name: 'Gleydson Tattoo',
        phone: '(91) 99999-9999',
        address: 'R. Domingos Silva, 84 - Barcarena, PA',
        cancellationPolicy: 'Cancelamentos devem ser feitos com 48h de antecedência.',
      };

      if (!setting) {
        return sendSuccess(res, defaultInfo);
      }

      return sendSuccess(res, { ...defaultInfo, ...JSON.parse(setting.value) });
    } catch {
      return sendSuccess(res, {
        name: 'Gleydson Tattoo',
        phone: '(91) 99999-9999',
        address: 'R. Domingos Silva, 84 - Barcarena, PA',
        cancellationPolicy: 'Cancelamentos devem ser feitos com 48h de antecedência.',
      });
    }
  }

  async updateStudioInfo(req: Request, res: Response) {
    try {
      const { name, phone, address, cancellationPolicy } = req.body;
      const payload = {
        name: name || 'Gleydson Tattoo',
        phone: phone || '',
        address: address || '',
        cancellationPolicy: cancellationPolicy || '',
      };

      const setting = await prisma.setting.upsert({
        where: { key: 'studio_info' },
        create: {
          key: 'studio_info',
          value: JSON.stringify(payload),
        },
        update: {
          value: JSON.stringify(payload),
        },
      });

      return sendSuccess(res, JSON.parse(setting.value));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar dados do estúdio';
      return res.status(400).json({ success: false, error: { message } });
    }
  }
}

