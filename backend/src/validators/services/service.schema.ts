import { z } from 'zod';
import { uuidSchema } from '../common/common.schema';

export const createServiceSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  priceType: z.enum(['FIXED', 'STARTING_AT', 'CONSULTATION']),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  categoryId: uuidSchema,
  isActive: z.boolean().default(true),
  order: z.number().int().default(0)
});

export const updateServiceSchema = createServiceSchema.partial();
