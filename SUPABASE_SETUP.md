# 🔐 Integração Supabase — Gleydsontattoo

## ✅ Status de Integração

- [x] Pacotes instalados (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Variáveis de ambiente configuradas
- [x] Cliente Supabase criado
- [x] Middleware de autenticação implementado
- [x] Banco de dados já conectado via Prisma

## 📋 O que foi feito

### 1. **Instalação de Pacotes**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. **Configuração de Ambiente**
Adicionadas ao `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` — URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Chave pública
- `SUPABASE_SERVICE_ROLE_KEY` — Chave privada (servidor apenas)

### 3. **Arquivos Criados**

#### `src/config/supabase.ts`
Cliente Supabase pré-configurado com suas credenciais:
- `supabase` — Cliente com acesso total (servidor)
- `supabasePublic` — Cliente público (browser-safe)

#### `src/middleware/supabaseAuth.ts`
Middleware para verificar tokens JWT do Supabase:
- Extrai token do header `Authorization`
- Valida token com Supabase Auth
- Adiciona dados do usuário a `req.user`

### 4. **Schema de Validação**
Atualizado em `src/config/env.ts` para validar variáveis Supabase.

## 🚀 Próximos Passos

### Opção 1: Usar Supabase Auth (Recomendado)
Substituir autenticação JWT manual pela autenticação do Supabase:

```typescript
// Em auth.controller.ts
import { supabase } from '../config/supabase.js';

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
};
```

### Opção 2: Usar com JWT Existente
Manter JWT mas adicionar dados de usuário do Supabase:

```typescript
// Usar middleware verifySupabaseToken junto com JWT
app.use('/api/protected', verifySupabaseToken, jwtMiddleware);
```

### Opção 3: Storage Supabase
Para upload de imagens (portfolio, avatar, etc.):

```typescript
const { data, error } = await supabase.storage
  .from('images')
  .upload(`portfolio/${filename}`, file);
```

## 🗂️ Estrutura de Pastas Criadas

```
backend/src/
├── config/
│   ├── supabase.ts        ← Cliente Supabase
│   └── env.ts             ← Validação de variáveis (atualizado)
├── middleware/
│   └── supabaseAuth.ts    ← Middleware de autenticação
└── ...
```

## 🔒 Segurança

⚠️ **Importante:**
- `SUPABASE_SERVICE_ROLE_KEY` é secreto — **nunca** exponha no frontend
- `DATABASE_URL` contém senha — adicione ao `.gitignore`
- Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` apenas no frontend

Seu `.gitignore` deve incluir:
```
.env
.env.local
.env.*.local
```

## 📖 Documentação Útil

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

## ❓ Dúvidas?

1. Verifique se as credenciais em `.env` estão corretas
2. Teste a conexão: `npm run dev` e veja os logs
3. Consulte o dashboard Supabase: https://supabase.com/dashboard

---

**Integração realizada com sucesso!** 🎉
