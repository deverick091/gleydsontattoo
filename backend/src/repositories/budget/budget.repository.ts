import prisma from '../../config/database';
import { BudgetStatus, Prisma } from '@prisma/client';

export class BudgetRepository {
  async findAll(skip: number, take: number) {
    const [data, total] = await Promise.all([
      prisma.budget.findMany({ skip, take, include: { client: true }, orderBy: { createdAt: 'desc' } }),
      prisma.budget.count()
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.budget.findUnique({ where: { id }, include: { client: true } });
  }

  async findPending() {
    return prisma.budget.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' } });
  }

  async create(data: Prisma.BudgetUncheckedCreateInput) {
    return prisma.budget.create({ data });
  }

  async respond(id: string, adminResponse: string) {
    return prisma.budget.update({
      where: { id },
      data: { adminResponse, status: 'RESPONDED' }
    });
  }

  async updateStatus(id: string, status: BudgetStatus, convertedAppointmentId?: string) {
    return prisma.budget.update({
      where: { id },
      data: { status, convertedAppointmentId }
    });
  }
}
