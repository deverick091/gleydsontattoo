# Gleydsontattoo — Architecture

## Overview

The Gleydsontattoo system follows a **monorepo** structure with two independent applications (frontend and backend) that communicate via a RESTful API.

## Architecture Pattern: MVC + Service Layer

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│        Next.js 14 (SSR/SSG/CSR)                 │
│   React + Tailwind CSS + Framer Motion          │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS (REST API)
                   ▼
┌─────────────────────────────────────────────────┐
│                   SERVER                         │
│              Express.js + TypeScript             │
│                                                  │
│  Routes ──→ Middleware ──→ Controllers            │
│                              │                   │
│                         Services                 │
│                              │                   │
│                        Repositories              │
│                              │                   │
│                     Prisma ORM (Models)          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                 DATABASE                         │
│              PostgreSQL 16                       │
└─────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Routes
- Define HTTP endpoints
- Apply middleware (auth, validation, rate limiting)
- Map to controller methods
- No business logic

### Middleware
- Authentication (JWT verification)
- Authorization (RBAC)
- Input validation (Zod schemas)
- Rate limiting
- Security headers (Helmet)
- File upload handling (Multer)
- Audit logging
- Error handling

### Controllers
- Receive validated requests
- Extract parameters
- Call appropriate service methods
- Return standardized responses
- No direct database access
- No business logic

### Services
- Contain ALL business logic
- Orchestrate operations
- Handle transactions
- Call repositories for data access
- Call external services (WhatsApp, email)
- Throw typed errors

### Repositories
- Data access layer (CRUD)
- Prisma queries
- Complex queries with joins
- Pagination
- No business logic

### Models (Prisma)
- Database schema definition
- Relations
- Constraints
- Indexes
- Enums

## Authentication Flow

```
Client ──→ POST /api/auth/login (email + password)
                    │
                    ▼
              AuthService.login()
                    │
                    ├── bcrypt.compare(password, hash)
                    ├── Generate accessToken (JWT, 15min)
                    ├── Generate refreshToken (JWT, 7days)
                    └── Set refreshToken in HttpOnly cookie
                    │
                    ▼
              Return { accessToken, user }

Client ──→ GET /api/protected (Authorization: Bearer <token>)
                    │
                    ▼
              auth middleware ──→ verify JWT ──→ attach user to req
                    │
                    ▼
              Controller ──→ Service ──→ Response
```

## Appointment Booking Flow (Concurrency-Safe)

```
Client ──→ POST /api/appointments
                    │
                    ▼
              Prisma.$transaction (Serializable)
                    │
                    ├── SELECT ... FOR UPDATE (lock time slot)
                    ├── Check for existing appointments (conflicts)
                    ├── If conflict → throw ConflictError
                    ├── Create appointment
                    ├── Create/update client (getOrCreate)
                    └── Queue WhatsApp notification
                    │
                    ▼
              Return appointment
```

## WhatsApp Integration (Provider Pattern)

```
interface WhatsAppProvider {
  sendMessage(to: string, message: string): Promise<void>
  sendTemplate(to: string, template: string, vars: object): Promise<void>
}

class EvolutionProvider implements WhatsAppProvider { ... }
class BaileysProvider implements WhatsAppProvider { ... }
class MockProvider implements WhatsAppProvider { ... }
```

## Security Layers

1. **Transport**: HTTPS (enforced in production)
2. **Headers**: Helmet with CSP, HSTS, X-Frame-Options
3. **Authentication**: JWT with short expiry + refresh tokens
4. **Authorization**: RBAC middleware (ADMIN, ATTENDANT)
5. **Input**: Zod validation on all inputs
6. **Database**: Prisma (parameterized queries, no SQL injection)
7. **Files**: MIME validation, size limits, safe filenames
8. **Rate Limiting**: Per-IP, stricter on auth endpoints
9. **CSRF**: SameSite cookies + token verification
10. **Audit**: All admin actions logged

