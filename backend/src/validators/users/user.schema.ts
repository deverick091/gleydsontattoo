import { z } from 'zod';
import { emailSchema } from './common.schema.js';

export const createUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d).*$/, 'A senha deve conter ao menos uma letra maiúscula e um número'),
  name: z.string().min(3),
  role: z.enum(['ADMIN', 'ATTENDANT'])
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d).*$/).optional()
});
