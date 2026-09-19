import { z } from 'zod';
import { uuidSchema } from './common.schema.js';

export const createPortfolioSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  categoryId: uuidSchema,
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0)
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

export const reorderSchema = z.object({
  items: z.array(z.object({
    id: uuidSchema,
    order: z.number().int()
  }))
});
