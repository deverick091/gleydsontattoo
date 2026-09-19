# 🚀 Deploy no Supabase

Este guia explica como conectar o Gleydsontattoo ao Supabase PostgreSQL.

## Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New project"
3. Preencha:
   - **Name**: `gleydsontattoo`
   - **Database Password**: Use uma senha forte (guarde bem!)
   - **Region**: Escolha a mais próxima (ex: `South America - São Paulo`)
4. Clique em "Create new project"

## Passo 2: Obter Connection String

1. Na dashboard do projeto, vá em **Settings > Database**
2. Copie a "Connection string" → escolha "URI"
3. A URL terá este formato:
   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
   ```

## Passo 3: Configurar Variável de Ambiente

No seu arquivo `.env`:

```env
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?schema=public
```

## Passo 4: Executar Migrations

```bash
# No diretório backend/
npx prisma migrate deploy
npx prisma db seed
```

## Passo 5: Configurar no Vercel

1. No Vercel, vá em **Settings > Environment Variables**
2. Adicione a `DATABASE_URL` com o valor do Supabase
3. Redeploy a aplicação

## ⚠️ Segurança

- **Nunca** commite o arquivo `.env` com suas credenciais reais
- Use variáveis de ambiente seguras no Vercel
- Ative Row Level Security (RLS) no Supabase para produção
- Faça backup regular dos dados

## 🔄 Migrations no Supabase

Para criar/atualizar o schema:

```bash
npx prisma migrate dev --name seu_nome_aqui
```

Isso cria uma nova migration e a aplica automaticamente.

## 📊 Acessar Banco de Dados

1. Na dashboard Supabase, vá em **SQL Editor**
2. Ou use tools como DBeaver/pgAdmin conectando-se com a connection string

## 💡 Dicas

- Supabase oferece 500MB de storage gratuito
- Backups automáticos diários
- Dashboard completa com tabelas, stats e logs
- Auth integrado (opcional)

---

Pronto! Seu backend agora está usando PostgreSQL do Supabase.
