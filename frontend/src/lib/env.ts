import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('URL da API inválida').default('http://localhost:3001'),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/, 'Número do WhatsApp inválido').optional(),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});

export default env;
