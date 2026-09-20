# Arquitetura Supabase — Gleydsontattoo

## Diagrama da Integração

Frontend (React/Next.js)
      |
      | HTTP/HTTPS
      |
Backend Express (Node.js)
  - src/config/supabase.ts
  - src/middleware/supabaseAuth.ts
      |
      | PostgreSQL Driver
      |
Supabase Cloud
  - PostgreSQL Database
  - Auth Module
  - Storage Buckets
  - Realtime Subscriptions

---

## Fluxo de Autenticacao

1. FRONTEND: Usuario faz login
2. BACKEND: supabase.auth.signInWithPassword()
3. SUPABASE: Gera JWT token
4. BACKEND: Retorna token ao frontend
5. FRONTEND: Armazena token localmente
6. BACKEND (verifySupabaseToken): Valida token
7. BACKEND: Retorna dados protegidos

---

## Componentes da Integracao

### 1. Cliente Supabase (config/supabase.ts)

export const supabase         // Service Role (backend apenas)
export const supabasePublic   // Publishable Key (seguro expor)

### 2. Middleware de Autenticacao (middleware/supabaseAuth.ts)

export const verifySupabaseToken
- Extrai token do header Authorization
- Valida com Supabase
- Injeta dados em req.user

### 3. Configuracao de Ambiente (config/env.ts)

Valida variaveis Supabase:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_URL

---

## Variaveis de Ambiente

| Variavel | Tipo | Visibilidade | Descricao |
|----------|------|--------------|-----------|
| DATABASE_URL | Secreto | Backend | Conexao PostgreSQL |
| SUPABASE_SERVICE_ROLE_KEY | Secreto | Backend | Acesso administrativo |
| NEXT_PUBLIC_SUPABASE_URL | Publico | Ambos | URL do projeto |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Publico | Ambos | Chave browser-safe |

---

## Checklist de Seguranca

- [ ] .env nao esta no git
- [ ] SUPABASE_SERVICE_ROLE_KEY nunca exposto no frontend
- [ ] RLS policies configuradas
- [ ] Tokens JWT tem expiracao apropriada
- [ ] Middleware protege rotas sensveis
- [ ] CORS configurado
- [ ] Rate limiting ativo
- [ ] Logs de auditoria mantidos

---

## Roadmap Tecnico

Fase 1: Integracao Basica (COMPLETO)
  - Instalacao de pacotes
  - Configuracao de credenciais
  - Cliente Supabase criado
  - Middleware implementado

Fase 2: Autenticacao Completa (PROXIMO)
  - Migrar auth.controller para Supabase Auth
  - Implementar Sign Up / Sign In
  - Adicionar password reset

Fase 3: Storage
  - Configurar buckets
  - Upload de imagens
  - Integrar em portfolio

Fase 4: Realtime
  - Configurar canais
  - Notificacoes em tempo real
  - Integrar com WebSocket

Fase 5: Avancado
  - Edge Functions
  - Vector Search
  - RLS policies customizadas

---

Versao: 1.0.0
Data: 2026-09-19
Status: Pronto para uso
