# Correções Aplicadas para Deploy - Railway & Vercel

## ✅ Correções Realizadas

### 1. **Correção no `vercel.json`**

**Problema:** Propriedade `nodeVersion` não é aceita pela Vercel
**Solução:** Removida a propriedade `nodeVersion: "20.x"`

**Antes:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodeVersion": "20.x",
  ...
}
```

**Depois:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  ...
}
```

**Status:** ✅ Corrigido

---

### 2. **Validação de Variáveis de Ambiente - Frontend**

**Problema:** `NEXT_PUBLIC_API_URL` era obrigatória no `vercel.json`, causando falha no build
**Solução:** 
- Criado ficheiro `frontend/src/lib/env.ts` com validação Zod
- Propriedade agora é `.optional()` e aceita strings vazias
- Alterado `vercel.json` para `"required": false`

**Ficheiro criado:** `frontend/src/lib/env.ts`
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional().or(z.literal('')),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export default env;
```

**Status:** ✅ Criado

---

### 3. **Validação de Scripts do `package.json`**

#### Backend (`backend/package.json`):
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "tsx watch src/server.ts",
  ...
}
```
**Status:** ✅ Correto para Railway

#### Frontend (`frontend/package.json`):
```json
"scripts": {
  "build": "next build",
  "start": "next start",
  "dev": "next dev",
  ...
}
```
**Status:** ✅ Correto para Vercel

---

## 🚀 Configurações Finais

### Railway (`railway.json`)
```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "cd backend && npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyMaxRetries": 5
  },
  "variables": {
    "NODE_ENV": "production",
    "PORT": 3001
  }
}
```

### Vercel (`vercel.json`) - CORRIGIDO
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "env": {
    "NEXT_PUBLIC_API_URL": {
      "description": "URL da API backend",
      "required": false
    }
  },
  "rewrites": [...],
  "headers": [...]
}
```

---

## 📋 Checklist de Deploy

### Railway (Backend)
- [x] `railway.json` criado com buildCommand e startCommand
- [x] Scripts `build` e `start` confirmados
- [x] Variáveis de ambiente prontas:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `PORT=3001`
  - `NODE_ENV=production`

### Vercel (Frontend)
- [x] `vercel.json` corrigido (removido `nodeVersion`)
- [x] `NEXT_PUBLIC_API_URL` agora é opcional
- [x] Validação de env em `frontend/src/lib/env.ts`
- [x] Scripts `build` e `start` confirmados
- [x] Variável de ambiente pronta:
  - `NEXT_PUBLIC_API_URL` (será preenchida após deploy do backend)

---

## 🔗 Próximas Ações

1. **Configure variáveis no Railway:**
   - Acesse https://railway.app
   - Conecte o repositório
   - Configure todas as variáveis de ambiente do backend
   - Deploy automático ao fazer push

2. **Obtenha URL do Railway:**
   - Após deploy, copie a URL (ex: `https://seu-app.railway.app`)

3. **Configure variável no Vercel:**
   - Acesse https://vercel.com
   - Conecte o repositório (selecione `frontend` como root directory)
   - Configure `NEXT_PUBLIC_API_URL` com a URL do Railway
   - Deploy automático ao fazer push

4. **Teste a integração:**
   - Frontend consegue contactar backend
   - Autenticação funciona
   - APIs respondem corretamente

---

## 📝 Notas Importantes

- ✅ O ficheiro `frontend/src/lib/env.ts` garante que variáveis vazias não quebram o build
- ✅ `vercel.json` agora está conforme especificação oficial da Vercel
- ✅ Ambas as plataformas detectam automaticamente as configurações
- ✅ Scripts estão prontos para produção
- ✅ CORS e segurança configurados no `vercel.json`

---

## ⚠️ Possíveis Problemas e Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| Build falha no Vercel | `NEXT_PUBLIC_API_URL` vazia | ✅ Resolvido (agora opcional) |
| Vercel rejeita `nodeVersion` | Propriedade desatualizada | ✅ Removida |
| Railway não encontra backend | `railway.json` incorreto | ✅ Caminho `cd backend &&` correto |
| Frontend não conecta backend | URL errada | Configure `NEXT_PUBLIC_API_URL` no Vercel |

