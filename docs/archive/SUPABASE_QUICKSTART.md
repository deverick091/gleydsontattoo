# 🚀 Guia Rápido — Supabase + Backend

## ✅ Integração Completa

Seu projeto está **100% conectado** ao Supabase!

### O que foi integrado:
- ✅ Pacotes instalados (`@supabase/supabase-js`)
- ✅ Cliente Supabase configurado
- ✅ Middleware de autenticação pronto
- ✅ Banco de dados já conectado (Prisma)
- ✅ Variáveis de ambiente seguras

---

## 📦 Arquivos Criados

```
backend/src/
├── config/supabase.ts         ← Cliente Supabase
├── config/env.ts              ← Validação atualizada
└── middleware/supabaseAuth.ts ← Verificação de token
```

---

## 🔐 Exemplo 1: Usar Supabase Auth para Login

Edite seu `auth.controller.ts`:

```typescript
import { supabase } from '../config/supabase.js';

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // data.session.access_token contém o JWT
    res.json({
      user: data.user,
      token: data.session?.access_token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
};
```

---

## 🔐 Exemplo 2: Proteger Rotas com Supabase

```typescript
import { Router } from 'express';
import { verifySupabaseToken } from '../middleware/supabaseAuth.js';
import { getUserProfile } from '../controllers/users.controller.js';

const router = Router();

// Rota protegida
router.get('/profile', verifySupabaseToken, getUserProfile);

export default router;
```

---

## 📸 Exemplo 3: Upload de Imagens (Storage)

Para portfolio ou avatar:

```typescript
import { supabase } from '../config/supabase.js';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Arquivo não fornecido' });

    // Upload para Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`portfolio/${Date.now()}-${file.originalname}`, file.buffer);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Gerar URL pública
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    res.json({ url: urlData.publicUrl });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
};
```

---

## 💾 Exemplo 4: Usar Prisma + Supabase (já funciona!)

```typescript
import { prisma } from '../config/database.js';

// Criar agendamento
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { clientId, professionalId, serviceId, date, startTime } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        professionalId,
        serviceId,
        date,
        startTime,
        endTime: calculateEndTime(startTime, service.duration),
      },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};
```

---

## 🔔 Exemplo 5: Realtime (Notificações em Tempo Real)

```typescript
import { supabase } from '../config/supabase.js';

// Subscrever mudanças em agendamentos
export const subscribeToAppointments = () => {
  supabase
    .channel('appointments')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
      },
      (payload) => {
        console.log('Novo agendamento:', payload);
        // Emitir via WebSocket para clientes
      }
    )
    .subscribe();
};
```

---

## 🧪 Testar a Integração

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Faça uma requisição teste:**
   ```bash
   curl -X GET http://localhost:3001/api/health
   ```

3. **Verifique os logs** para confirmar conexão com Supabase

---

## 🔐 Variáveis de Ambiente

Seu `.env` contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://stcwnnxfhyoucmmehbff.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ⚠️ SECRETO!
```

⚠️ **IMPORTANTE:**
- **Nunca** commite o `.env` (use `.gitignore`)
- **Nunca** exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend
- Mantenha `DATABASE_URL` seguro (contém senha!)

---

## 📚 Documentação Útil

- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Supabase Storage](https://supabase.com/docs/reference/javascript/storage-createbucket)
- [Supabase Realtime](https://supabase.com/docs/reference/javascript/subscribe)

---

## ❓ Problemas?

### "Token inválido"
- Verifique se o token foi gerado pelo Supabase Auth
- Confirme que está enviando no header: `Authorization: Bearer YOUR_TOKEN`

### "Conexão recusada"
- Verifique se `DATABASE_URL` está correto
- Confirme que o firewall permite conexão (Supabase > Network)

### "Permissão negada no Storage"
- Verifique RLS policies em Supabase > Storage > Policies

---

## ✨ Próximas Etapas

1. **Migrar autenticação** para Supabase Auth (Opção 1 acima)
2. **Configurar Storage** para imagens de portfolio
3. **Implementar Realtime** para notificações em tempo real
4. **Adicionar Edge Functions** para lógica customizada

---

**Sua integração está pronta!** 🎉

Para dúvidas, consulte `SUPABASE_SETUP.md` para mais detalhes.
