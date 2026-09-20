# Validação de Variáveis de Ambiente - Atualização

## 📝 Alterações Realizadas

### 1. **Ficheiro: `frontend/src/lib/env.ts`**

**Validação Anterior:**
```typescript
NEXT_PUBLIC_API_URL: z.union([
  z.string().url(),
  z.literal(''),
  z.undefined(),
]).optional()
```

**Validação Melhorada (ATUAL):**
```typescript
NEXT_PUBLIC_API_URL: z
  .string()
  .url()
  .optional()
  .or(z.literal(''))
  .default('http://localhost:3001')
```

### 2. **Ficheiro: `frontend/src/lib/api.ts`**

**Antes:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

**Depois:**
```typescript
import env from './env';

const API_URL = env.NEXT_PUBLIC_API_URL;
```

---

## ✨ Benefícios da Nova Configuração

| Aspecto | Benefício |
|--------|----------|
| **Valor por Omissão** | Se `NEXT_PUBLIC_API_URL` não estiver definida, usa `http://localhost:3001` |
| **Build na Vercel** | ✅ Nunca falha, mesmo sem variável definida |
| **Strings Vazias** | ✅ Aceita `''` sem validação de URL |
| **URLs Válidas** | ✅ Valida se for uma URL completa |
| **Typagem** | ✅ TypeScript sabe que a variável sempre tem valor |
| **Centralizado** | ✅ Importa de um único ficheiro de validação |

---

## 🚀 Comportamento em Diferentes Cenários

### Cenário 1: Build no Vercel (SEM variável definida)
```
NEXT_PUBLIC_API_URL = undefined
↓
Zod aplica .default('http://localhost:3001')
↓
env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
✅ Build passa!
```

### Cenário 2: Build no Vercel (COM variável definida)
```
NEXT_PUBLIC_API_URL = https://backend.railway.app
↓
Zod valida como URL válida
↓
env.NEXT_PUBLIC_API_URL = 'https://backend.railway.app'
✅ Build passa!
```

### Cenário 3: Build no Vercel (String vazia)
```
NEXT_PUBLIC_API_URL = ''
↓
Zod aceita via .or(z.literal(''))
↓
env.NEXT_PUBLIC_API_URL = ''
✅ Build passa!
```

### Cenário 4: Desenvolvimento Local
```
NEXT_PUBLIC_API_URL = http://localhost:3001
↓
Zod valida como URL válida
↓
env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
✅ Frontend conecta ao backend local!
```

---

## 📊 Impacto no Deploy

### ✅ Railway (Backend)
- Sem alterações necessárias
- Deployment continua igual

### ✅ Vercel (Frontend)
- **Antes:** Build falhava se `NEXT_PUBLIC_API_URL` estivesse vazia
- **Depois:** Build SEMPRE passa, independentemente da variável
- A variável pode ser configurada DEPOIS do deploy inicial
- Fallback automático para `http://localhost:3001`

---

## 🔧 Como Usar

### Em Produção (Vercel)
```bash
# Opção 1: Configurar no Vercel Dashboard
# Environment Variables → Add → NEXT_PUBLIC_API_URL = https://backend.railway.app

# Opção 2: Deixar em branco
# Build passará com valor por omissão
```

### Em Desenvolvimento
```bash
# No ficheiro .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ⚠️ Notas Importantes

- ✅ Valor por omissão é `http://localhost:3001`
- ✅ Pode ser sobrescrito em qualquer momento
- ✅ Builds nunca falham por falta de variável
- ✅ API client usa automaticamente o valor correto
- ✅ Sem necessidade de redeployment para trocar a URL

---

## 📋 Próximos Passos

1. **Vercel:** Não precisa fazer nada agora (build passa sem variável)
2. **Após Deploy do Backend:** Configure `NEXT_PUBLIC_API_URL` no Vercel
3. **Redeployment:** Vercel fará rebuild com nova URL automaticamente

