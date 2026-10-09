import { BudgetRepository } from '../../repositories/budget/budget.repository';
import { Prisma, BudgetStatus } from '@prisma/client';
import prisma from '../../config/database';

const budgetRepo = new BudgetRepository();

export class BudgetService {
  async list(status?: BudgetStatus) {
    return budgetRepo.findAll(status);
  }

  async findById(id: string) {
    return budgetRepo.findById(id);
  }

  async create(data: { clientName: string; clientPhone: string; description?: string }) {
    return prisma.$transaction(async (tx) => {
      let client = await tx.client.findFirst({ where: { phone: data.clientPhone } });
      if (!client) {
        client = await tx.client.create({
          data: { name: data.clientName, phone: data.clientPhone }
        });
      }

      return tx.budget.create({
        data: {
          clientName: data.clientName,
          clientId: client.id,
          description: data.description,
        }
      });
    });
  }

  async respond(id: string, body: Record<string, any>) {
    return budgetRepo.update(id, { ...body, status: 'RESPONDED' as BudgetStatus });
  }

  async updateStatus(id: string, status: BudgetStatus) {
    return budgetRepo.update(id, { status });
  }

  async convert(id: string) {
    return budgetRepo.update(id, { status: 'CONVERTED' as BudgetStatus });
  }
}
