# 🎨 Gleydsontattoo — Sistema Digital para Estúdio de Tatuagem

<div align="center">

**GLEYDSON**TATTOO

*Marcando histórias na pele*

Sistema web completo, moderno e profissional para o Estúdio Gleydsontattoo — Barcarena, PA.

[Site](http://localhost:3000) · [API](http://localhost:3001) · [Documentação](./docs/)

</div>

---

## 📋 Sobre o Projeto

Sistema digital full-stack que integra **site institucional**, **portfólio**, **agendamento online**, **CRM**, **painel administrativo**, **WhatsApp** e **notificações** — tudo com arquitetura MVC, segurança robusta e experiência visual premium.

### Funcionalidades Principais

- 🌐 **Site Institucional** — Home, portfólio, serviços, contato, SEO completo
- 📅 **Agendamento Online** — Fluxo intuitivo em 7 etapas com proteção contra conflitos
- 👤 **CRM de Clientes** — Histórico, dados, notas, último/próximo atendimento
- 📸 **Portfólio Premium** — Galeria filtrada, modal, zoom, otimização de imagens
- 💰 **Orçamentos** — Formulário de orçamento com conversão em agendamento
- 📱 **WhatsApp** — Confirmação, lembretes, cancelamento, pós-atendimento
- 🔧 **Painel Admin** — Dashboard, calendário, gráficos, configurações, usuários
- 🔐 **Segurança** — JWT, RBAC, rate limiting, LGPD, audit logs
- 🎨 **Design Premium** — Dark luxury, animações cinematográficas, responsivo

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript, Arquitetura MVC |
| Banco | PostgreSQL 16, Prisma ORM |
| Validação | Zod |
| Autenticação | JWT + bcrypt |
| Upload | Multer + Sharp (WebP) |
| WhatsApp | Evolution API (abstrato) |
| Testes | Vitest + Supertest |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## 📁 Estrutura do Projeto

```
gleydsontattoo/
├── frontend/           # Next.js 14 (App Router)
│   ├── src/
│   │   ├── app/        # Páginas e rotas
│   │   ├── components/ # Componentes React
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilitários
│   │   ├── services/   # API client
│   │   └── types/      # TypeScript types
│   └── public/         # Assets estáticos
│
├── backend/            # Express.js (MVC)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── helpers/
│   │   └── types/
│   └── prisma/         # Schema + Migrations + Seeds
│
├── tests/              # Testes automatizados
├── docs/               # Documentação técnica
├── .github/workflows/  # CI/CD
└── docker-compose.yml
```

---

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [PostgreSQL](https://www.postgresql.org/) 16+ (ou Docker)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/your-user/gleydsontattoo.git
cd gleydsontattoo

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com seus valores

# 3. Instale e configure o Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# 4. Instale e inicie o Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

### Com Docker

```bash
docker compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

---

## ⚙️ Variáveis de Ambiente

Consulte o arquivo [`.env.example`](./.env.example) para a lista completa. Principais:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `JWT_SECRET` | Segredo para tokens de acesso |
| `JWT_REFRESH_SECRET` | Segredo para refresh tokens |
| `ADMIN_EMAIL` | E-mail do admin inicial |
| `ADMIN_PASSWORD` | Senha do admin inicial |
| `WHATSAPP_ENABLED` | Ativar integração WhatsApp |
| `CORS_ORIGIN` | URL do frontend |

---

## 🧪 Testes

```bash
cd backend
npm test                    # Todos os testes
npm run test:concurrency    # Teste de concorrência de agendamentos
```

### Testes incluídos:
- ✅ Autenticação (login, JWT, permissões)
- ✅ Agendamento (criação, conflitos, status)
- ✅ **Concorrência** (dois clientes no mesmo horário)
- ✅ Validações (Zod schemas)
- ✅ API (endpoints, responses)

---

## 📱 Fluxo de Agendamento

```
Selecionar Serviço → Profissional → Data → Horário → Dados → Resumo → Confirmação → WhatsApp
```

---

## 🔐 Segurança

- JWT com refresh tokens (HttpOnly cookies)
- RBAC (Admin, Atendente)
- Rate limiting por IP
- Helmet (security headers)
- Zod validation (input sanitization)
- Prisma (SQL injection prevention)
- MIME type validation (uploads)
- Audit logging
- LGPD compliance

---

## 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](./docs/architecture.md) | Padrões, fluxos, decisões |
| [Banco de Dados](./docs/database.md) | Schema, ER diagram, backup |
| [Segurança](./docs/security.md) | Autenticação, RBAC, LGPD |
| [API](./docs/api.md) | Endpoints, formatos, exemplos |
| [Deploy](./docs/deployment.md) | Ambientes, Docker, CI/CD |
| [WhatsApp](./docs/whatsapp.md) | Integração, templates, setup |

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

<div align="center">

**Gleydsontattoo** — *Marcando histórias na pele* 🎨

R. Domingos Silva, 84 — Barcarena, PA — 68445-000

</div>

