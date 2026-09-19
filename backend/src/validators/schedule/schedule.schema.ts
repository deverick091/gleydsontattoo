import { z } from 'zod';
import { uuidSchema } from './common.schema.js';

export const createBlockSchema = z.object({
  professionalId: uuidSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida').optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida').optional(),
  allDay: z.boolean().default(true),
  reason: z.enum(['VACATION', 'HOLIDAY', 'MAINTENANCE', 'PERSONAL', 'OTHER']),
  description: z.string().optional()
}).refine(data => data.endDate >= data.startDate, { message: 'Data final deve ser posterior à inicial' });

export const updateBlockSchema = createBlockSchema.partial();
