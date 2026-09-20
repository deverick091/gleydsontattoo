# Gleydsontattoo

Sistema full-stack para gestão de estúdio de tatuagem, com site institucional, portfólio, agendamento online e painel administrativo.

## Tecnologias

- **Frontend:** Next.js, React, TypeScript e Tailwind CSS
- **Backend:** Node.js, Express, TypeScript e Prisma
- **Base de dados e autenticação:** Supabase/PostgreSQL
- **Deploy:** Vercel

## Estrutura

```text
.
├── frontend/          # Aplicação Next.js
├── backend/           # API Express e schema Prisma
│   ├── api/           # Entrada serverless da Vercel
│   ├── prisma/
│   └── src/
├── docs/              # Documentação técnica e arquivo histórico
└── .github/workflows/ # Integração contínua
```

## Desenvolvimento local

### Backend

```bash
cd backend
cp .env.example .env
npm ci
npx prisma generate
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

O frontend estará disponível em `http://localhost:3000` e a API em `http://localhost:3001`.

## Variáveis de ambiente

Configure os ficheiros locais, que não devem ser enviados ao Git:

- `backend/.env`
- `frontend/.env.local`

Consulte [backend/.env.example](backend/.env.example) e [frontend/.env.example](frontend/.env.example). Em produção, configure essas variáveis diretamente nos respetivos projetos da Vercel.

Nunca exponha `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD` ou `SUPABASE_SERVICE_ROLE_KEY` no frontend ou no repositório.

## Deploy na Vercel

Crie dois projetos Vercel a partir deste repositório:

| Projeto | Root Directory | Framework Preset |
| --- | --- | --- |
| Frontend | `frontend` | Next.js |
| Backend | `backend` | Other |

O backend é publicado como uma função serverless por [backend/api/index.ts](backend/api/index.ts). No frontend, defina `NEXT_PUBLIC_API_URL` com o domínio do projeto backend.

## Documentação

- [API](docs/api.md)
- [Arquitetura](docs/architecture.md)
- [Base de dados](docs/database.md)
- [Deploy](docs/deployment.md)
- [Segurança](docs/security.md)
- [Supabase](docs/supabase-setup.md)
- [WhatsApp](docs/whatsapp.md)

Documentação histórica e scripts descontinuados estão em [docs/archive](docs/archive/).

## Licença

Este projeto está sob a licença MIT. Consulte [LICENSE](LICENSE).
