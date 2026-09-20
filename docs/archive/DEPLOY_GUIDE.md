# Guia de Deploy - Gleydsontattoo

## ✅ Configuração Completa

### Backend - Railway

**Ficheiro:** `railway.json` (na raiz)

Configuração otimizada para Railway:
- Builder: Nixpacks (deteta automaticamente Node.js)
- Build: `cd backend && npm ci && npm run build`
- Start: `cd backend && npm start`
- Port: 3001
- Environment: production

**Steps para deploy no Railway:**
1. Faça push do código
2. Conecte o repositório no Railway (https://railway.app)
3. Selecione o branch `main`
4. Railway detectará automaticamente o `railway.json`
5. Configure as variáveis de ambiente (ver abaixo)

**Variáveis de Ambiente (Backend):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3001
NODE_ENV=production
```

---

### Frontend - Vercel

**Ficheiro:** `vercel.json` (na raiz)

Configuração otimizada para Vercel:
- Build: `npm run build` (a partir da raiz)
- Output: `.next` (diretório de output do Next.js)
- Framework: Next.js 14
- Node: 20.x
- Install: `npm ci`

**Steps para deploy no Vercel:**
1. Conecte o repositório no Vercel (https://vercel.com)
2. Selecione o root directory: `/frontend`
3. Vercel detectará Next.js automaticamente
4. Configure as variáveis de ambiente (ver abaixo)
5. Deploy!

**Variáveis de Ambiente (Frontend):**
```
NEXT_PUBLIC_API_URL=https://backend-railway-url.railway.app
```

---

## 📋 Verificação de Scripts

### Backend (`backend/package.json`)
- ✅ `npm run build` → compila TypeScript
- ✅ `npm start` → inicia o servidor

### Frontend (`frontend/package.json`)
- ✅ `npm run build` → build Next.js
- ✅ `npm start` → inicia o servidor Next.js

---

## 🔗 Integrações Recomendadas

1. **Railway → Vercel**
   - Após deploy do backend no Railway, copie a URL
   - Configure `NEXT_PUBLIC_API_URL` no Vercel com essa URL

2. **Supabase**
   - Backend: configure credenciais Supabase em variáveis de ambiente
   - Frontend: use `NEXT_PUBLIC_API_URL` para chamar o backend

3. **CI/CD Automático**
   - Railway: auto-deploy on push
   - Vercel: auto-deploy on push (com preview builds)

---

## 🚀 Checklist Final

- [ ] Variáveis de ambiente configuradas no Railway
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] URL do Railway adicionada como `NEXT_PUBLIC_API_URL` no Vercel
- [ ] Testes locais com `npm run build` (backend e frontend)
- [ ] CORS configurado corretamente no backend
- [ ] Base de dados Supabase conectada
- [ ] Secrets seguros não commitados (use `.env`)

---

## 📝 Notas

- O ficheiro `railway.json` é específico para o Railway
- O ficheiro `vercel.json` é específico para o Vercel
- Ambos os serviços detectam e usam automaticamente estes ficheiros
- Os `package.json` já estão com os scripts corretos
