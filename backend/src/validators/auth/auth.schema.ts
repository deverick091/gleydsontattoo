import { z } from 'zod';
import { emailSchema, phoneSchema } from './common.schema.js';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

export const magicLinkSchema = z.object({
  email: emailSchema.optional(),
  phone: phoneSchema.optional()
}).refine(data => data.email || data.phone, { message: 'Informe email ou telefone' });
