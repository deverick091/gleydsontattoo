# Gleydsontattoo — WhatsApp Integration

## Overview

The system uses an abstract provider pattern for WhatsApp integration, allowing easy switching between implementations.

## Architecture

```
NotificationService
       │
       ▼
WhatsAppService
       │
       ▼
WhatsAppProvider (interface)
       │
       ├── EvolutionProvider (Evolution API)
       ├── BaileysProvider (Baileys library)
       └── MockProvider (development/testing)
```

## Configuration

```env
WHATSAPP_ENABLED=true
WHATSAPP_PROVIDER=evolution     # evolution | baileys | mock
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=your-api-key
WHATSAPP_INSTANCE=gleydsontattoo
WHATSAPP_DEFAULT_NUMBER=5591999999999
```

## Message Templates

### Confirmação de Agendamento
```
Olá, {NOME}! ✅

Seu agendamento no *Gleydsontattoo* foi registrado com sucesso!

📋 *Serviço:* {SERVICO}
📅 *Data:* {DATA}
⏰ *Horário:* {HORARIO}
📍 *Local:* R. Domingos Silva, 84 — Barcarena, PA

*Instruções:*
• Evite bebidas alcoólicas 24h antes
• Alimente-se bem antes do horário
• Use roupas confortáveis
• Traga documento com foto

Em caso de dúvidas ou cancelamento, entre em contato.

_Gleydsontattoo — Marcando histórias na pele_ 🎨
```

### Lembrete (24h antes)
```
Olá, {NOME}! ⏰

Passando para lembrar que seu horário no *Gleydsontattoo* está marcado para *amanhã às {HORARIO}*.

📋 *Serviço:* {SERVICO}
📍 *Local:* R. Domingos Silva, 84 — Barcarena, PA

Nos vemos amanhã! 🎨
```

### Cancelamento
```
Olá, {NOME}.

Seu agendamento no *Gleydsontattoo* para {DATA} às {HORARIO} foi *cancelado*.

Motivo: {MOTIVO}

Caso deseje reagendar, acesse: {LINK_AGENDAMENTO}

_Gleydsontattoo_ 🎨
```

### Reagendamento
```
Olá, {NOME}! 📅

Seu agendamento no *Gleydsontattoo* foi *reagendado*.

*Novo horário:*
📅 {DATA}
⏰ {HORARIO}

📍 R. Domingos Silva, 84 — Barcarena, PA

_Gleydsontattoo_ 🎨
```

### Pós-atendimento
```
Olá, {NOME}! 🎨

Obrigado por confiar no *Gleydsontattoo*!

Esperamos que tenha curtido o resultado. Lembre-se dos cuidados pós-{SERVICO}:

• Mantenha o filme por {HORAS}h
• Lave com sabonete neutro
• Hidrate conforme orientado
• Evite sol direto por 15 dias
• Não coce a região

Dúvidas? Estamos aqui! 💬

Se curtiu, compartilhe nas redes e marque @gleydsontattoo! 📸

_Gleydsontattoo — Marcando histórias na pele_ 🎨
```

## Reminder Cron Job

A cron job runs every hour checking for appointments starting in the next 24 hours that haven't received a reminder yet:

```
Schedule: 0 * * * * (every hour)
Action: Find appointments where:
  - date = tomorrow
  - status = CONFIRMED
  - no BOOKING_REMINDER notification sent
Then: Create and send reminder notification
```

## Evolution API Setup

1. Install Evolution API: https://doc.evolution-api.com/
2. Create instance named "gleydsontattoo"
3. Connect WhatsApp via QR code
4. Set API key in .env
5. Set WHATSAPP_ENABLED=true

## Testing

In development, use `WHATSAPP_PROVIDER=mock` to log messages to console instead of sending them.

