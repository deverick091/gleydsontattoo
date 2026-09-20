# 🚀 Instruções para GitHub, Vercel e Supabase

## 📋 Pré-requisitos

- [Git](https://git-scm.com/download/win) instalado
- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)

---

## 🔷 Etapa 1: GitHub

### 1.1 - Inicializar Git Local

**Windows (Prompt):**
```bash
setup-git.bat
```

**Mac/Linux:**
```bash
bash setup-git.sh
```

**Ou manualmente:**
```bash
git init
git config user.email "seu-email@seu-usuario.com"
git config user.name "Seu Nome"
git add .
git commit -m "Initial commit: Gleydsontattoo"
```

### 1.2 - Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name**: `gleydsontattoo`
   - **Description**: "Sistema digital para estúdio de tatuagem"
   - **Visibility**: Escolha entre Public ou Private
3. Clique em "Create repository"
4. Copie a URL (HTTPS ou SSH)

### 1.3 - Conectar ao GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/gleydsontattoo.git
git branch -M main
git push -u origin main
```

✅ Seu código está no GitHub!

---

## 🔷 Etapa 2: Supabase (Database)

### 2.1 - Criar Projeto

1. Acesse https://supabase.com/dashboard
2. Clique em "New project"
3. Preencha:
   - **Name**: `gleydsontattoo`
   - **Database Password**: Senha forte (salve-a!)
   - **Region**: South America - São Paulo
4. Aguarde criação (2-3 min)

### 2.2 - Obter Connection String

1. Na dashboard, vá em **Settings > Database**
2. Copie a URI em "Connection string"
3. Guarde para o próximo passo

### 2.3 - Configurar Banco Local

No seu `.env`:
```env
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?schema=public
```

Depois execute:
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

✅ Seu banco está no Supabase!

---

## 🔷 Etapa 3: Vercel (Frontend)

### 3.1 - Deploy Frontend

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Busque `gleydsontattoo`
4. Clique em "Import"

### 3.2 - Configurar Variáveis

1. Em "Environment Variables", adicione:
   ```
   NEXT_PUBLIC_API_URL = https://seu-backend.vercel.app
   ```
2. (Backend URL você configura depois)

### 3.3 - Deploy

Clique em "Deploy" - Vercel faz o resto!

✅ Seu frontend está em produção!
Acesse a URL que Vercel fornece.

---

## 🔷 Etapa 4: Backend (Vercel, Railway ou Render)

### Opção A: Vercel (Para começar)

1. Novo projeto em Vercel
2. Selecione `gleydsontattoo`
3. **Framework Preset**: `Other`
4. **Root Directory**: `backend`
5. **Build Command**: `npm run build`
6. **Start Command**: `node dist/server.js`

### Opção B: Railway (Recomendado)

1. Acesse https://railway.app
2. "New Project"
3. "Deploy from GitHub"
4. Selecione `gleydsontattoo`
5. Configure:
   - **Root Directory**: `backend`
   - **Environment Variables**: Copie do `.env.example`
   - **Database**: Railway cria automaticamente

**Importante:** Altere `DATABASE_URL` para apontar para Supabase!

### Opção C: Render.com

Similar ao Railway - mais barato para hobby projects.

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Frontend deployado no Vercel
- [ ] Backend deployado (Vercel/Railway/Render)
- [ ] Database no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio customizado (opcional)
- [ ] SSL/HTTPS ativo
- [ ] Testes passando
- [ ] Build sem erros

---

## 🆘 Troubleshooting

### "Git not found"
Instale Git: https://git-scm.com/download/win

### "Database connection failed"
- Verifique `DATABASE_URL` está correto
- Whitelist seu IP no Supabase
- Tente conectar com pgAdmin para testar

### "CORS error em produção"
Atualize `CORS_ORIGIN` em `.env`:
```env
CORS_ORIGIN=https://seu-frontend.vercel.app
```

### "Vercel build falha"
- Verifique `npm run build` funciona localmente
- Verifique variáveis de ambiente em Vercel
- Veja logs do Vercel para mais detalhes

---

## 📞 Suporte

- GitHub Issues: https://github.com/SEU_USUARIO/gleydsontattoo/issues
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://docs.railway.app

---

**Pronto! Seu sistema Gleydsontattoo está online!** 🚀

Próximos passos:
- Configurar domínio customizado
- Ativar WhatsApp Integration
- Configurar email
- Fazer backup automático
