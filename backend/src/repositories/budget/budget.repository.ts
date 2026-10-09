import prisma from '../../config/database';
import { Prisma, BudgetStatus } from '@prisma/client';

export class BudgetRepository {
  async findAll(status?: BudgetStatus) {
    return prisma.budget.findMany({
      where: status ? { status } : undefined,
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return prisma.budget.findUnique({ where: { id }, include: { client: true } });
  }

  async create(data: Prisma.BudgetUncheckedCreateInput) {
    return prisma.budget.create({ data });
  }

  async update(id: string, data: Prisma.BudgetUncheckedUpdateInput) {
    return prisma.budget.update({ where: { id }, data });
  }
}
