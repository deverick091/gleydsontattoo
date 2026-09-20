# 📚 GLEYDSONTATTOO — Guia Completo de Setup

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- Git

### 1️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install
npx prisma generate

# Frontend
cd ../frontend
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Edite .env com seus valores
```

### 3️⃣ Banco de Dados (Local)

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4️⃣ Executar em Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## 🐳 Com Docker

```bash
docker compose up -d
```

---

## 📋 Variáveis de Ambiente Obrigatórias

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | 64+ char random string |
| `ADMIN_EMAIL` | Email do admin inicial |
| `ADMIN_PASSWORD` | Senha forte do admin |
| `NEXT_PUBLIC_API_URL` | URL da API (frontend) |

---

## 🚀 Deploy em Produção

### Frontend → Vercel
- [Supabase Setup](./docs/supabase-setup.md)
- [Deployment Guide](./docs/deployment.md)

### Backend → Vercel / Railway / Render
- Veja [Deployment Guide](./docs/deployment.md)

### Database → Supabase
- [Supabase Setup](./docs/supabase-setup.md)

---

## 🧪 Testes

```bash
cd backend
npm test
```

---

## 📖 Documentação

- [Arquitetura](./docs/architecture.md)
- [API](./docs/api.md)
- [Banco de Dados](./docs/database.md)
- [Segurança](./docs/security.md)
- [Deployment](./docs/deployment.md)
- [WhatsApp Integration](./docs/whatsapp.md)
- [Supabase Setup](./docs/supabase-setup.md)

---

## 🔗 Links Úteis

- **Next.js**: https://nextjs.org
- **Express**: https://expressjs.com
- **Prisma**: https://prisma.io
- **Tailwind**: https://tailwindcss.com
- **Vercel**: https://vercel.com
- **Supabase**: https://supabase.com

---

## ❓ FAQ

**P: Como reseto o banco de dados?**
```bash
npx prisma migrate reset
```

**P: Onde está minha URL do Supabase?**
Veja [Supabase Setup](./docs/supabase-setup.md)

**P: Como faço deploy?**
Veja [Deployment Guide](./docs/deployment.md)

---

## 📝 Licença

MIT — Veja [LICENSE](./LICENSE)

---

Pronto! Seu setup está completo. Happy coding! 🎨
