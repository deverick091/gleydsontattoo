import { z } from 'zod';

export const uuidSchema = z.string().uuid('ID inválido');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(data => data.endDate >= data.startDate, { message: 'Data final deve ser posterior à inicial' });

export const phoneSchema = z.string().regex(/^\d{10,13}$/, 'Telefone inválido');
export const emailSchema = z.string().email('E-mail inválido');
