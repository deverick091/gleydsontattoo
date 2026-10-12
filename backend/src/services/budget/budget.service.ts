import { BudgetRepository } from '../../repositories/budget/budget.repository';
import { Prisma, BudgetStatus } from '@prisma/client';
import prisma from '../../config/database';

const budgetRepo = new BudgetRepository();

export function mapBudget(b: any) {
  const phone = b.client?.phone || '';
  const match = b.description?.match(/\[Resposta Admin\]:\s*(.*)/s);
  const adminResponse = match ? match[1].trim() : null;

  return {
    id: b.id,
    name: b.clientName || b.client?.name || 'Cliente',
    clientName: b.clientName || b.client?.name || 'Cliente',
    whatsapp: phone,
    phone,
    email: b.client?.email || null,
    description: b.description || 'Sem descrição.',
    adminResponse,
    status: b.status,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    client: b.client ? {
      id: b.client.id,
      name: b.client.name,
      phone: b.client.phone,
      whatsapp: b.client.phone,
      email: b.client.email,
    } : null,
  };
}

export class BudgetService {
  async list(status?: BudgetStatus) {
    const list = await budgetRepo.findAll(status);
    return list.map(mapBudget);
  }

  async findById(id: string) {
    const item = await budgetRepo.findById(id);
    return item ? mapBudget(item) : null;
  }

  async create(data: Record<string, any>) {
    const name = data.clientName || data.name || data.client?.name || 'Cliente';
    const phone = (data.clientPhone || data.phone || data.whatsapp || data.client?.phone || data.client?.whatsapp || '').replace(/\D/g, '');
    const email = data.clientEmail || data.email || data.client?.email || null;
    const description = data.description || data.notes || '';

    return prisma.$transaction(async (tx: any) => {
      let client = null;
      if (phone) {
        client = await tx.client.findFirst({ where: { phone } });
        if (!client) {
          client = await tx.client.create({
            data: { name, phone, email: email || '' }
          });
        }
      }

      const budget = await tx.budget.create({
        data: {
          clientName: name,
          clientId: client?.id || null,
          description: description || null,
        },
        include: { client: true }
      });

      return mapBudget(budget);
    });
  }

  async respond(id: string, responseText: string) {
    const existing = await budgetRepo.findById(id);
    if (!existing) throw new Error('Orçamento não encontrado');

    const prevDesc = existing.description || '';
    const cleanDesc = prevDesc.replace(/\n\n\[Resposta Admin\]:[\s\S]*/, '').trim();
    const newDesc = cleanDesc
      ? `${cleanDesc}\n\n[Resposta Admin]: ${responseText}`
      : `[Resposta Admin]: ${responseText}`;

    const updated = await budgetRepo.update(id, {
      description: newDesc,
      status: 'RESPONDED' as BudgetStatus
    });

    return mapBudget(updated);
  }

  async updateStatus(id: string, status: BudgetStatus) {
    if (status === 'CONVERTED') {
      return this.convert(id);
    }
    const updated = await budgetRepo.update(id, { status });
    return mapBudget(updated);
  }

  async convert(id: string, options?: { serviceId?: string; date?: string; startTime?: string; time?: string; notes?: string }) {
    const existing = await budgetRepo.findById(id);
    if (!existing) throw new Error('Orçamento não encontrado');

    return prisma.$transaction(async (tx: any) => {
      // 1. Atualiza status do orçamento para CONVERTED
      const updatedBudget = await tx.budget.update({
        where: { id },
        data: { status: 'CONVERTED' as BudgetStatus },
        include: { client: true }
      });

      // 2. Extrai detalhes da descrição caso não tenham sido passados
      const desc = existing.description || '';

      let dateStr = options?.date;
      if (!dateStr) {
        const dateMatch = desc.match(/Data pretendida:\s*(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          dateStr = dateMatch[1];
        } else {
          const brDateMatch = desc.match(/Data pretendida:\s*(\d{2})\/(\d{2})\/(\d{4})/);
          if (brDateMatch) dateStr = `${brDateMatch[3]}-${brDateMatch[2]}-${brDateMatch[1]}`;
        }
      }

      let timeStr = options?.startTime || options?.time;
      if (!timeStr) {
        const timeMatch = desc.match(/às\s*(\d{2}:\d{2})/);
        timeStr = timeMatch ? timeMatch[1] : '14:00';
      }

      // Serviço
      let serviceId = options?.serviceId;
      if (!serviceId) {
        const sMatch = desc.match(/Serviço:\s*(.*?)(?:\s*\(Sob Orçamento\)|\n|$)/);
        const serviceName = sMatch ? sMatch[1].trim() : '';
        if (serviceName) {
          const svc = await tx.service.findFirst({
            where: { name: { contains: serviceName, mode: 'insensitive' } }
          });
          if (svc) serviceId = svc.id;
        }
      }

      if (!serviceId) {
        const defaultSvc = await tx.service.findFirst({ where: { active: true } });
        if (defaultSvc) serviceId = defaultSvc.id;
      }
      if (!serviceId) {
        const anySvc = await tx.service.findFirst();
        if (anySvc) serviceId = anySvc.id;
      }

      // Cliente
      let clientId = existing.clientId;
      let clientPhone = existing.client?.phone || '';
      if (!clientId && clientPhone) {
        let client = await tx.client.findFirst({ where: { phone: clientPhone } });
        if (!client) {
          client = await tx.client.create({
            data: { name: existing.clientName, phone: clientPhone, email: '' }
          });
        }
        clientId = client.id;
      }

      // Observações
      const notesMatch = desc.match(/Observações:\s*(.*)/);
      const notesText = options?.notes || (notesMatch ? notesMatch[1].trim() : undefined);

      // Data formatada para @db.Date
      const appointmentDate = dateStr
        ? new Date(`${dateStr}T00:00:00.000Z`)
        : new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');

      // Verifica se já existe agendamento criado para este cliente nesta data e hora
      let appointment = await tx.appointment.findFirst({
        where: {
          clientName: existing.clientName,
          date: appointmentDate,
          time: timeStr,
          status: { not: 'CANCELLED' }
        },
        include: { client: true, service: true }
      });

      if (!appointment && serviceId) {
        if (clientId && notesText) {
          await tx.client.update({
            where: { id: clientId },
            data: { notes: notesText }
          }).catch(() => {});
        }

        appointment = await tx.appointment.create({
          data: {
            clientName: existing.clientName,
            clientPhone: clientPhone || '–',
            clientId: clientId || null,
            serviceId: serviceId,
            date: appointmentDate,
            time: timeStr,
            status: 'CONFIRMED'
          },
          include: { client: true, service: true }
        });
      }

      return {
        ...mapBudget(updatedBudget),
        appointment: appointment ? {
          id: appointment.id,
          date: (appointment.date instanceof Date ? appointment.date : new Date(appointment.date)).toISOString().slice(0, 10),
          time: appointment.time,
          status: appointment.status,
          service: appointment.service,
        } : null
      };
    });
  }
}

