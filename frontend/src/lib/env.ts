import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.union([
    z.string().url(),
    z.literal(''),
    z.undefined(),
  ]).optional(),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export default env;
