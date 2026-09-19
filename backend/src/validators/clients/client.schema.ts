import { z } from 'zod';
import { phoneSchema, emailSchema, paginationSchema } from './common.schema.js';

export const createClientSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  phone: phoneSchema,
  whatsapp: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  notes: z.string().optional()
});

export const updateClientSchema = createClientSchema.partial();

export const searchClientSchema = z.object({
  query: z.string().min(1, 'Busca vazia'),
  ...paginationSchema.shape
});
