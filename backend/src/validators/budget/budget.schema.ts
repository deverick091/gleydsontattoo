import { z } from 'zod';
import { phoneSchema, emailSchema, uuidSchema } from './common.schema.js';

export const createBudgetSchema = z.object({
  name: z.string().min(3),
  whatsapp: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  style: z.string(),
  size: z.string(),
  bodyRegion: z.string(),
  description: z.string(),
  approximateBudget: z.string().optional(),
  availability: z.string().optional()
});

export const respondBudgetSchema = z.object({
  adminResponse: z.string().min(1)
});

export const convertBudgetSchema = z.object({
  professionalId: uuidSchema,
  serviceId: uuidSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (HH:mm)')
});
