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
    const updated = await budgetRepo.update(id, { status });
    return mapBudget(updated);
  }

  async convert(id: string) {
    const updated = await budgetRepo.update(id, { status: 'CONVERTED' as BudgetStatus });
    return mapBudget(updated);
  }
}

