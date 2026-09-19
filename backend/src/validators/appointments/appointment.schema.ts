import { z } from 'zod';
import { uuidSchema, phoneSchema, emailSchema } from '../common/common.schema';

export const createAppointmentSchema = z.object({
  professionalId: uuidSchema,
  serviceId: uuidSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (HH:mm)'),
  client: z.object({
    name: z.string().min(3),
    phone: phoneSchema,
    whatsapp: phoneSchema,
    email: emailSchema.optional().or(z.literal('')),
    notes: z.string().optional(),
    bodyRegion: z.string().optional(),
    approximateSize: z.string().optional(),
    stylePreference: z.string().optional()
  }),
  referenceImages: z.array(z.string().url()).optional()
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
  cancelReason: z.string().optional()
}).refine(data => !(data.status === 'CANCELLED' && !data.cancelReason), {
  message: 'Motivo do cancelamento é obrigatório',
  path: ['cancelReason']
});

export const rescheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (HH:mm)')
});

export const availableSlotsSchema = z.object({
  professionalId: uuidSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)')
});
